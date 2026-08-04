const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const admin = require("../config/firebaseAdmin");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

// Generate Tokens using JWT_SECRET
const generateAccessToken = (id) => {
  return jwt.sign({ id, role: "user" }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id, role: "user" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// 1. Signup (Email + Password)
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (user && user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "An account already exists with this email address.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (user && !user.isEmailVerified) {
      user.name = name.trim();
      user.password = password;
      user.emailOtp = hashedOtp;
      user.emailOtpExpiry = otpExpiry;
      await user.save();
    } else {
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        authProvider: "email",
        emailOtp: hashedOtp,
        emailOtpExpiry: otpExpiry,
      });
    }

    // Send OTP email via Brevo REST API
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0d0d15; color: #ffffff; border-radius: 16px;">
        <h2 style="color: #6c63ff; text-align: center;">Welcome to AIflix</h2>
        <p style="font-size: 16px; text-align: center;">Your verification code for User Registration is:</p>
        <div style="background: linear-gradient(135deg, #6c63ff, #00d4ff); padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #ffffff; border-radius: 12px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #a0a0b0; text-align: center;">This code will expire in 10 minutes. Do not share it with anyone.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: normalizedEmail,
        toName: name,
        subject: "Verify your AIflix Account",
        htmlContent,
      });
    } catch (emailErr) {
      console.error("Failed to send signup OTP email:", emailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful. Verification code sent to email.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("User signup error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (
      !user ||
      !user.emailOtp ||
      !user.emailOtpExpiry ||
      user.emailOtpExpiry < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    const isMatch = await bcrypt.compare(otp, user.emailOtp);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    user.isEmailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Resend OTP
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: "User account not found." });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: "Email is already verified." });
    }

    // 60-second cooldown check (9 mins remaining out of 10)
    if (user.emailOtpExpiry && user.emailOtpExpiry - Date.now() > 9 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: "Please wait 60 seconds before requesting a new code.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.emailOtp = hashedOtp;
    user.emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0d0d15; color: #ffffff; border-radius: 16px;">
        <h2 style="color: #6c63ff; text-align: center;">AIflix Verification Code</h2>
        <p style="font-size: 16px; text-align: center;">Your new verification code is:</p>
        <div style="background: linear-gradient(135deg, #6c63ff, #00d4ff); padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #ffffff; border-radius: 12px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #a0a0b0; text-align: center;">This code will expire in 10 minutes.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: normalizedEmail,
        toName: user.name,
        subject: "Your New AIflix Verification Code",
        htmlContent,
      });
    } catch (emailErr) {
      console.error("Resend OTP email error:", emailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "A new verification code has been sent to your email.",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Google Authentication (Firebase ID Token)
const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Firebase ID token is required for Google login.",
      });
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (authErr) {
      console.error("Firebase token verification error:", authErr.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Google authentication token.",
      });
    }

    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google account does not provide an email address.",
      });
    }

    const normalizedEmail = email.toLowerCase();
    let user = await User.findOne({
      $or: [{ googleId: uid }, { email: normalizedEmail }],
    });

    if (user) {
      user.googleId = uid;
      user.isEmailVerified = true;
      if (picture && !user.avatar) user.avatar = picture;
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = await User.create({
        name: name || email.split("@")[0],
        email: normalizedEmail,
        googleId: uid,
        avatar: picture || "",
        authProvider: "google",
        isEmailVerified: true,
        lastLogin: new Date(),
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Google login successful.",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Login (Email + Password)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email address before logging in.",
        isEmailVerified: false,
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("User login error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Refresh Token
const refreshToken = async (req, res) => {
  try {
    const token =
      req.body.refreshToken ||
      req.headers["x-refresh-token"] ||
      (req.headers.authorization && req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or account deactivated.",
      });
    }

    const newAccessToken = generateAccessToken(user._id);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("User refresh token error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token.",
    });
  }
};

// 7. Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address.",
      });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/user/reset-password?token=${resetToken}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0d0d15; color: #ffffff; border-radius: 16px;">
        <h2 style="color: #6c63ff; text-align: center;">Reset Your Password</h2>
        <p style="font-size: 15px;">Hello ${user.name},</p>
        <p style="font-size: 14px; color: #cccccc;">You requested a password reset for your AIflix User account. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #6c63ff, #00d4ff); color: #ffffff; padding: 12px 28px; text-decoration: none; font-weight: bold; border-radius: 10px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 12px; color: #888899;">If you did not request this, please ignore this email. Link expires in 1 hour.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        toName: user.name,
        subject: "Reset your AIflix Password",
        htmlContent,
      });
    } catch (emailErr) {
      console.error("Reset email error:", emailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email address.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Reset Password
const resetPassword = async (req, res) => {
  try {
    const token = req.query.token || req.body.token;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Reset token is required." });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long.",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 9. Get Current User Profile
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  signup,
  verifyOtp,
  resendOtp,
  googleAuth,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
};
