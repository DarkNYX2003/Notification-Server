const amqp = require("amqplib");

async function addToQueue(data) {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue("notifications");

  if (!data.retries) {
    data.retries = 0; 
  }

  ch.sendToQueue("notifications", Buffer.from(JSON.stringify(data)));
  await ch.close();
  await conn.close(); 
}

module.exports = addToQueue;
