const express = require("express");
const router = express.Router();
const {
  loginSuperAdmin,
  getSuperAdminProfile,
} = require("../controllers/superAdminController");
const { protectSuperAdmin } = require("../middleware/authMiddleware");
const { getAdmins, createAdmin, updateAdmin, deleteAdmin, impersonateAdmin } = require("../controllers/adminController");
const { getCreators, approveCreator, rejectCreator, impersonateCreator, deleteCreator } = require("../controllers/creatorManageController");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  impersonateUser,
  deleteUser,
} = require("../controllers/userManageController");

// Public login route
router.post("/login", loginSuperAdmin);

// Protected profile route
router.get("/me", protectSuperAdmin, getSuperAdminProfile);

// Admin CRUD routes (protected)
router.get("/admins", protectSuperAdmin, getAdmins);
router.post("/admins", protectSuperAdmin, createAdmin);
router.put("/admins/:id", protectSuperAdmin, updateAdmin);
router.delete("/admins/:id", protectSuperAdmin, deleteAdmin);
router.post("/admins/:id/login", protectSuperAdmin, impersonateAdmin);

// Creator Management routes (protected)
router.get("/creators", protectSuperAdmin, getCreators);
router.put("/creators/:id/approve", protectSuperAdmin, approveCreator);
router.put("/creators/:id/reject", protectSuperAdmin, rejectCreator);
router.post("/creators/:id/impersonate", protectSuperAdmin, impersonateCreator);
router.delete("/creators/:id", protectSuperAdmin, deleteCreator);

// User Management routes (protected)
router.get("/users", protectSuperAdmin, getUsers);
router.get("/users/:id", protectSuperAdmin, getUserById);
router.post("/users", protectSuperAdmin, createUser);
router.put("/users/:id", protectSuperAdmin, updateUser);
router.patch("/users/:id/status", protectSuperAdmin, toggleUserStatus);
router.post("/users/:id/impersonate", protectSuperAdmin, impersonateUser);
router.delete("/users/:id", protectSuperAdmin, deleteUser);

// Content / OTT Media Management routes (protected)
const {
  getContent,
  getContentById,
  createContent,
  updateContent,
  togglePublishStatus,
  toggleFeaturedStatus,
  deleteContent,
} = require("../controllers/contentManageController");

router.get("/content", protectSuperAdmin, getContent);
router.get("/content/:id", protectSuperAdmin, getContentById);
router.post("/content", protectSuperAdmin, createContent);
router.put("/content/:id", protectSuperAdmin, updateContent);
router.patch("/content/:id/publish", protectSuperAdmin, togglePublishStatus);
router.patch("/content/:id/featured", protectSuperAdmin, toggleFeaturedStatus);
router.delete("/content/:id", protectSuperAdmin, deleteContent);

// Subscription Management routes (protected)
const {
  getSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  toggleSubscriptionStatus,
  deleteSubscription,
} = require("../controllers/subscriptionManageController");

router.get("/subscriptions", protectSuperAdmin, getSubscriptions);
router.get("/subscriptions/:id", protectSuperAdmin, getSubscriptionById);
router.post("/subscriptions", protectSuperAdmin, createSubscription);
router.put("/subscriptions/:id", protectSuperAdmin, updateSubscription);
router.patch("/subscriptions/:id/status", protectSuperAdmin, toggleSubscriptionStatus);
router.delete("/subscriptions/:id", protectSuperAdmin, deleteSubscription);

// Payments Management routes (protected)
const {
  getPayments,
  getPaymentStats,
  refundPayment,
  deletePayment,
} = require("../controllers/paymentManageController");

router.get("/payments", protectSuperAdmin, getPayments);
router.get("/payments/stats", protectSuperAdmin, getPaymentStats);
router.patch("/payments/:id/refund", protectSuperAdmin, refundPayment);
router.delete("/payments/:id", protectSuperAdmin, deletePayment);

// Analytics & Telemetry routes (protected)
const { getDashboardStats } = require("../controllers/analyticsController");
router.get("/analytics/dashboard", protectSuperAdmin, getDashboardStats);

// AI Models Management routes (protected)
const {
  getAiModels,
  createAiModel,
  updateAiModel,
  toggleAiModelStatus,
  deleteAiModel,
} = require("../controllers/aiModelManageController");

router.get("/ai-models", protectSuperAdmin, getAiModels);
router.post("/ai-models", protectSuperAdmin, createAiModel);
router.put("/ai-models/:id", protectSuperAdmin, updateAiModel);
router.patch("/ai-models/:id/status", protectSuperAdmin, toggleAiModelStatus);
router.delete("/ai-models/:id", protectSuperAdmin, deleteAiModel);

// Infrastructure Management routes (protected)
const {
  getInfraNodes,
  createInfraNode,
  updateInfraNode,
  toggleInfraNodeStatus,
  deleteInfraNode,
} = require("../controllers/infrastructureManageController");

router.get("/infrastructure", protectSuperAdmin, getInfraNodes);
router.post("/infrastructure", protectSuperAdmin, createInfraNode);
router.put("/infrastructure/:id", protectSuperAdmin, updateInfraNode);
router.patch("/infrastructure/:id/status", protectSuperAdmin, toggleInfraNodeStatus);
router.delete("/infrastructure/:id", protectSuperAdmin, deleteInfraNode);

// Storage & CDN Management routes (protected)
const {
  getStorageNodes,
  createStorageNode,
  updateStorageNode,
  deleteStorageNode,
} = require("../controllers/storageManageController");

router.get("/storage", protectSuperAdmin, getStorageNodes);
router.post("/storage", protectSuperAdmin, createStorageNode);
router.put("/storage/:id", protectSuperAdmin, updateStorageNode);
router.delete("/storage/:id", protectSuperAdmin, deleteStorageNode);

// Support Tickets (Helpdesk) routes (protected)
const {
  getTickets,
  createTicket,
  updateTicketStatus,
  deleteTicket,
} = require("../controllers/supportTicketController");

router.get("/support", protectSuperAdmin, getTickets);
router.post("/support", protectSuperAdmin, createTicket);
router.put("/support/:id", protectSuperAdmin, updateTicketStatus);
router.delete("/support/:id", protectSuperAdmin, deleteTicket);

// Roles & Permissions routes (protected)
const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  toggleRoleStatus,
} = require("../controllers/roleController");

router.get("/roles", protectSuperAdmin, getRoles);
router.post("/roles", protectSuperAdmin, createRole);
router.put("/roles/:id", protectSuperAdmin, updateRole);
router.patch("/roles/:id/status", protectSuperAdmin, toggleRoleStatus);
router.delete("/roles/:id", protectSuperAdmin, deleteRole);

// Security & Audit Logs routes (protected)
const {
  getAuditLogs,
  createAuditLog,
  clearAuditLogs,
} = require("../controllers/securityController");

router.get("/security/logs", protectSuperAdmin, getAuditLogs);
router.post("/security/logs", protectSuperAdmin, createAuditLog);
router.delete("/security/logs", protectSuperAdmin, clearAuditLogs);

// Global Settings routes (protected)
const {
  getSettings,
  updateSettings,
} = require("../controllers/settingController");

router.get("/settings", protectSuperAdmin, getSettings);
router.put("/settings", protectSuperAdmin, updateSettings);

// Dashboard Stats route (protected)
const {
  getDashboardStats: getOverviewStats,
} = require("../controllers/dashboardController");

router.get("/dashboard-stats", protectSuperAdmin, getOverviewStats);

module.exports = router;
