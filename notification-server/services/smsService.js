const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const snsClient = new SNSClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.send = async ({ title, message, userId, phone }) => {
  try {
    const command = new PublishCommand({
      Message: message,
      PhoneNumber: phone,
    });

    const result = await snsClient.send(command);
    console.log("SMS sent! MessageID:", result.MessageId);
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    throw error;
  }
};
