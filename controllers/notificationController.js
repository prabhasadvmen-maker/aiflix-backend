const Notification = require("../models/notificationModel");

const defaultNotifications = [
  {
    title: "Platform Maintenance Notice",
    message: "Scheduled infrastructure maintenance will take place this Sunday at 02:00 AM UTC.",
    type: "maintenance",
    targetAudience: "All",
    priority: "Normal",
    status: "Sent",
    sentBy: "System Admin"
  },
  {
    title: "New AI Upscaling Features Live!",
    message: "Creators can now utilize Sora 4K AI Upscaler directly from their studio dashboard.",
    type: "announcement",
    targetAudience: "Creators",
    priority: "High",
    status: "Sent",
    sentBy: "Admin"
  },
  {
    title: "Subscription Billing Update",
    message: "All international payment gateways have been upgraded for lower failure rates.",
    type: "update",
    targetAudience: "Users",
    priority: "Normal",
    status: "Sent",
    sentBy: "Admin"
  }
];

// @desc    Get all notifications (with auto-seed)
// @route   GET /api/admin/notifications
// @access  Private (Admin)
exports.getNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find().sort({ createdAt: -1 });

    if (notifications.length === 0) {
      await Notification.insertMany(defaultNotifications);
      notifications = await Notification.find().sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new broadcast notification
// @route   POST /api/admin/notifications
// @access  Private (Admin)
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, targetAudience, priority } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: "Title and message are required." });
    }

    const notification = await Notification.create({
      title,
      message,
      type: type || "announcement",
      targetAudience: targetAudience || "All",
      priority: priority || "Normal",
      status: "Sent",
      sentBy: req.user?.email || "Admin"
    });

    res.status(201).json({
      success: true,
      message: "Notification broadcasted successfully",
      data: notification
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/admin/notifications/:id
// @access  Private (Admin)
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
