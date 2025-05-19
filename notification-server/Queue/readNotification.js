const amqp = require("amqplib");
const Notification = require("../models/Notification");
const emailService = require("../services/emailService");
const smsService = require("../services/smsService");
const inAppService = require("../services/inAppService");
const MAX_RETRIES = 3;

async function readQueue() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue("notifications");

  console.log("Waiting for messages in 'notifications' queue...");

  ch.consume("notifications", async (msg) => {
    if (!msg) return; // sometimes msg can be null on shutdown

    const data = JSON.parse(msg.content.toString());
    console.log(data);

    try {
      if (data.type === "email") {
        if (!data.emailId) throw new Error("Missing emailId in message");
        await emailService.send(data);
        console.log(`Email sent to ${data.emailId}`);
      } else if (data.type === "sms") {
        if (!data.phone) throw new Error("Missing phone in message");
        await smsService.send(data);
        console.log(`SMS sent to ${data.phone}`);
      } else {
        await inAppService.send(data);
        console.log(`In-app notification sent to userId: ${data.userId}`);
      }

      await Notification.updateOne({ _id: data._id }, { status: "delivered" });
      console.log("Notification status updated to delivered");

      ch.ack(msg);

    } catch (err) {
      console.error("Error sending notification:", err);

      if ((data.retries || 0) < MAX_RETRIES) {
        data.retries = (data.retries || 0) + 1;
        console.log(`Retrying message, attempt ${data.retries}`);

        ch.nack(msg, false, false); // reject message without requeue (discard old)
        ch.sendToQueue("notifications", Buffer.from(JSON.stringify(data))); // requeue updated msg

      } else {
        await Notification.updateOne({ _id: data._id }, { status: "failed", retries: data.retries });
        console.log("Notification status updated to failed after max retries");
        ch.ack(msg); // discard message
      }
    }
  });
}

module.exports = readQueue;
