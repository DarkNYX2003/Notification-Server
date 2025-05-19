const Notification = require("../models/Notification");

exports.send = async (data) => {
  await Notification.updateOne(
    { _id: data._id },
    { status: "delivered" }
  );
};
