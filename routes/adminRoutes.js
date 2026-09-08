const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/authAdminController");
const { protectAdmin } = require("../middleware/authMiddleware");
const { getCreators, approveCreator, rejectCreator, deleteCreator } = require("../controllers/creatorManageController");
const { getUsers, getUserById, createUser, updateUser, toggleUserStatus } = require("../controllers/userManageController");
const { getContent, getContentById, createContent, updateContent, togglePublishStatus, toggleFeaturedStatus, deleteContent } = require("../controllers/contentManageController");
const { getReportSummary } = require("../controllers/reportController");
const { getPayments, getPaymentStats, refundPayment } = require("../controllers/paymentManageController");

router.post("/login", loginAdmin);

// Creator Management (Admin access)
router.get("/creators", protectAdmin, getCreators);
router.put("/creators/:id/approve", protectAdmin, approveCreator);
router.put("/creators/:id/reject", protectAdmin, rejectCreator);
router.delete("/creators/:id", protectAdmin, deleteCreator);

// User Management (Admin access - no delete/impersonate, those are SuperAdmin only)
router.get("/users", protectAdmin, getUsers);
router.get("/users/:id", protectAdmin, getUserById);
router.post("/users", protectAdmin, createUser);
router.put("/users/:id", protectAdmin, updateUser);
router.patch("/users/:id/status", protectAdmin, toggleUserStatus);

// Content Management (Admin access)
router.get("/content", protectAdmin, getContent);
router.get("/content/:id", protectAdmin, getContentById);
router.post("/content", protectAdmin, createContent);
router.put("/content/:id", protectAdmin, updateContent);
router.patch("/content/:id/publish", protectAdmin, togglePublishStatus);
router.patch("/content/:id/feature", protectAdmin, toggleFeaturedStatus);
router.delete("/content/:id", protectAdmin, deleteContent);

// Reports Management
router.get("/reports/summary", protectAdmin, getReportSummary);

// Analytics Management
const { getAdminAnalytics } = require("../controllers/analyticsController");
router.get("/analytics", protectAdmin, getAdminAnalytics);

// Payment Management (Admin access - no delete, that is SuperAdmin only)
router.get("/payments", protectAdmin, getPayments);
router.get("/payments/stats", protectAdmin, getPaymentStats);
router.patch("/payments/:id/refund", protectAdmin, refundPayment);

// Support Tickets Management
const { getTickets, createTicket, updateTicketStatus, deleteTicket } = require("../controllers/supportTicketController");
router.get("/support", protectAdmin, getTickets);
router.post("/support", protectAdmin, createTicket);
router.put("/support/:id", protectAdmin, updateTicketStatus);
router.delete("/support/:id", protectAdmin, deleteTicket);

// Roles & Permissions Management
const { getRoles, createRole, updateRole, deleteRole, toggleRoleStatus } = require("../controllers/roleController");
router.get("/roles", protectAdmin, getRoles);
router.post("/roles", protectAdmin, createRole);
router.put("/roles/:id", protectAdmin, updateRole);
router.delete("/roles/:id", protectAdmin, deleteRole);
router.patch("/roles/:id/status", protectAdmin, toggleRoleStatus);

// Global Settings Management
const { getSettings, updateSettings } = require("../controllers/settingController");
router.get("/settings", protectAdmin, getSettings);
router.put("/settings", protectAdmin, updateSettings);

// Broadcast Notifications Management
const { getNotifications, createNotification, deleteNotification } = require("../controllers/notificationController");
router.get("/notifications", protectAdmin, getNotifications);
router.post("/notifications", protectAdmin, createNotification);
router.delete("/notifications/:id", protectAdmin, deleteNotification);

// AI Moderation & Models
const { getAiModels, toggleAiModelStatus } = require("../controllers/aiModelManageController");
router.get("/ai-models", protectAdmin, getAiModels);
router.patch("/ai-models/:id/status", protectAdmin, toggleAiModelStatus);

// AI Moderation Queue
router.get("/ai-moderation/queue", protectAdmin, async (req, res) => {
  try {
    const Content = require("../models/contentModel");
    const queue = await Content.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ success: true, data: queue });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

