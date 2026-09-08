const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["announcement", "alert", "update", "maintenance"],
      default: "announcement",
    },
    targetAudience: {
      type: String,
      enum: ["All", "Creators", "Users"],
      default: "All",
    },
    priority: {
      type: String,
      enum: ["Normal", "High", "Urgent"],
      default: "Normal",
    },
    status: {
      type: String,
      enum: ["Sent", "Scheduled", "Draft"],
      default: "Sent",
    },
    sentBy: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
