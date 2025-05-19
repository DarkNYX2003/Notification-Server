const mongoose = require("mongoose");

const notificationStructure = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ['email', 'sms', 'in_app'], required: true },
  title: String,
  message: String,
  emailId: { type: String }, 
  phone: { type: String }, 
  status: { type: String, enum: ['pending', 'delivered', 'failed'], default: 'pending' },
  retries: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationStructure);
