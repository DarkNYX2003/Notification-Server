const Notification = require("../models/Notification");
const publishToQueue = require("../Queue/addNotification");

exports.sendNoti = async (req, res) => {
  const { userId, type, title, message, emailId, phone } = req.body;

  
  if (!userId || !type || !title || !message) {
    return res.status(400).json({ error: "userId, type, title, and message are required." });
  }

  
  if (type === "email" && !emailId) {
    return res.status(400).json({ error: "Email is required for email notifications." });
  }

  if (type === "sms" && !phone) {
    return res.status(400).json({ error: "Phone number is required for SMS notifications." });
  }

  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      emailId: emailId || null,
      phone: phone || null,
    });

    await publishToQueue({ ...notification.toObject() });

    res.status(202).json({ message: "Notification queued" });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getUserNoti = async (req,res)=>{
    const notifications = await Notification.find({
      userId: req.params.id,
      type: "in_app", 
    }).sort({ createdAt: -1 });
    res.json(notifications);
};