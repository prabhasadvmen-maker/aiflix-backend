const express = require("express");
const router = express.Router();
const {
  checkUsername,
  signup,
  verifyOtp,
  resendOtp,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
  submitApplication,
} = require("../controllers/creatorAuthController");
const {
  getCreatorStatistics,
  seedCreatorContent,
} = require("../controllers/creatorStatsController");
const {
  getQuickActionsOverview,
  executeQuickAction,
  seedQuickActionHistory,
} = require("../controllers/creatorQuickActionController");
const {
  getPortfolioOverview,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  toggleFeaturedItem,
  seedPortfolioData,
} = require("../controllers/creatorPortfolioController");
const {
  getServicesOverview,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  seedServicesData,
} = require("../controllers/creatorServiceController");
const {
  getProjectsOverview,
  createProject,
  updateProject,
  updateProjectProgress,
  deleteProject,
  seedProjectsData,
} = require("../controllers/creatorProjectController");
const {
  getOrdersOverview,
  createCustomOrder,
  submitOrderDelivery,
  updateOrderStatus,
  seedOrdersData,
} = require("../controllers/creatorOrderController");
const { protectCreator } = require("../middleware/creatorAuthMiddleware");

// Public Creator Auth Routes
router.get("/check-username", checkUsername);
router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected Creator Routes
router.get("/me", protectCreator, getMe);
router.post("/apply", protectCreator, submitApplication);
router.get("/statistics", protectCreator, getCreatorStatistics);
router.post("/seed-data", protectCreator, seedCreatorContent);

// Quick Actions Routes
router.get("/quick-actions/overview", protectCreator, getQuickActionsOverview);
router.post("/quick-actions/execute", protectCreator, executeQuickAction);
router.post("/quick-actions/seed", protectCreator, seedQuickActionHistory);

// Portfolio Showcase Routes
router.get("/portfolio", protectCreator, getPortfolioOverview);
router.post("/portfolio", protectCreator, createPortfolioItem);
router.put("/portfolio/:id", protectCreator, updatePortfolioItem);
router.delete("/portfolio/:id", protectCreator, deletePortfolioItem);
router.patch("/portfolio/:id/toggle-featured", protectCreator, toggleFeaturedItem);
router.post("/portfolio/seed", protectCreator, seedPortfolioData);

// Creator Services Marketplace Routes
router.get("/services", protectCreator, getServicesOverview);
router.post("/services", protectCreator, createService);
router.put("/services/:id", protectCreator, updateService);
router.delete("/services/:id", protectCreator, deleteService);
router.patch("/services/:id/toggle-status", protectCreator, toggleServiceStatus);
router.post("/services/seed", protectCreator, seedServicesData);

// Creator Production Projects Routes
router.get("/projects", protectCreator, getProjectsOverview);
router.post("/projects", protectCreator, createProject);
router.put("/projects/:id", protectCreator, updateProject);
router.delete("/projects/:id", protectCreator, deleteProject);
router.patch("/projects/:id/progress", protectCreator, updateProjectProgress);
router.post("/projects/seed", protectCreator, seedProjectsData);

// Creator Client Orders Routes
router.get("/orders", protectCreator, getOrdersOverview);
router.post("/orders", protectCreator, createCustomOrder);
router.patch("/orders/:id/status", protectCreator, updateOrderStatus);
router.post("/orders/:id/deliver", protectCreator, submitOrderDelivery);
router.post("/orders/seed", protectCreator, seedOrdersData);

module.exports = router;
