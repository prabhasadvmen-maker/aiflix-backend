const express = require("express");
const router = express.Router();
const {
  loginSuperAdmin,
  getSuperAdminProfile,
} = require("../controllers/superAdminController");
const { protectSuperAdmin } = require("../middleware/authMiddleware");
const { getAdmins, createAdmin, updateAdmin, deleteAdmin, impersonateAdmin } = require("../controllers/adminController");
const { getCreators, approveCreator, rejectCreator, impersonateCreator, deleteCreator } = require("../controllers/creatorManageController");

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

module.exports = router;
