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

module.exports = router;
