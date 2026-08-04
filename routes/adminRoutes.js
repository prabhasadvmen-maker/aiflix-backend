const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/authAdminController");
const { protectAdmin } = require("../middleware/authMiddleware");
const { getCreators, approveCreator, rejectCreator, deleteCreator } = require("../controllers/creatorManageController");

router.post("/login", loginAdmin);

// Creator Management (Admin access)
router.get("/creators", protectAdmin, getCreators);
router.put("/creators/:id/approve", protectAdmin, approveCreator);
router.put("/creators/:id/reject", protectAdmin, rejectCreator);
router.delete("/creators/:id", protectAdmin, deleteCreator);

module.exports = router;
