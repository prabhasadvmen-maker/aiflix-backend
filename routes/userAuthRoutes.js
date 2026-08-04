const express = require("express");
const router = express.Router();
const {
  signup,
  verifyOtp,
  resendOtp,
  googleAuth,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
} = require("../controllers/userAuthController");
const { protectUser } = require("../middleware/userAuthMiddleware");

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/google-auth", googleAuth);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protectUser, getMe);

module.exports = router;
