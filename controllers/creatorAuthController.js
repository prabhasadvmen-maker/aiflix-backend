const Creator = require("../models/creatorModel");
const sendEmail = require("../utils/sendEmail");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Cryptographically secure 6-digit OTP
const generateSecureOtp = () => crypto.randomInt(100000, 999999).toString();

// 0. Check Username Availability
const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ available: false, message: "Username parameter is required." });
    }

    const normalized = username.toLowerCase().trim();
    const usernameRegex = /^[a-z0-9_]{3,20}$/;

    if (!usernameRegex.test(normalized)) {
      return res.status(200).json({ available: false, message: "Only lowercase letters, numbers, underscores (3-20 chars)." });
    }

    const existing = await Creator.findOne({ username: normalized });

    if (existing) {
      return res.status(200).json({ available: false, message: "Username already taken" });
    }

    return res.status(200).json({ available: true, message: "Username available" });
  } catch (error) {
    console.error("Check username error:", error);
    return res.status(500).json({ available: false, message: error.message });
  }
};

// 1. Signup Creator (Generates & Sends 6-digit OTP)
const signup = async (req, res) => {
  try {
    const { name, username, email, mobile, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, username, email, and password are required." });
    }

    const normalizedUsername = username.toLowerCase().trim();
    const usernameRegex = /^[a-z0-9_]{3,20}$/;

    if (!usernameRegex.test(normalizedUsername)) {
      return res.status(400).json({
        success: false,
        message: "Username must be 3-20 characters long and contain only lowercase letters, numbers, and underscores.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if username is already taken by another account
    const existingUsernameCreator = await Creator.findOne({ username: normalizedUsername });
    if (existingUsernameCreator && existingUsernameCreator.email !== normalizedEmail) {
      return res.status(400).json({ success: false, message: "Username already taken" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
    }

    let creator = await Creator.findOne({ email: normalizedEmail });

    if (creator) {
      if (creator.isEmailVerified) {
        return res.status(400).json({ success: false, message: "An account with this email already exists." });
      }
      // If unverified account exists, update details & resend OTP
      creator.name = name;
      creator.username = normalizedUsername;
      creator.mobile = mobile || "";
      creator.password = password; // Will be hashed by pre-save hook
    } else {
      creator = new Creator({
        name,
        username: normalizedUsername,
        email: normalizedEmail,
        mobile: mobile || "",
        password,
        isEmailVerified: false,
      });
    }

    // Generate 6-digit OTP (cryptographically secure)
    const plainOtp = generateSecureOtp();
    const hashedOtp = await bcrypt.hash(plainOtp, 10);

    creator.emailOtp = hashedOtp;
    creator.emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await creator.save();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background-color: #0d0d15; color: #ffffff; padding: 30px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); text-align: center;">
        <h2 style="color: #6c63ff; margin-bottom: 10px;">Verify Your Email</h2>
        <p style="color: #9ca3af; font-size: 14px; margin-bottom: 25px;">Hi ${name}, use the code below to verify your AIflix Creator account.</p>
        <div style="background: rgba(108, 99, 255, 0.12); border: 1px solid rgba(108, 99, 255, 0.3); border-radius: 12px; padding: 18px; display: inline-block; margin-bottom: 25px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #00d4ff; font-family: monospace;">${plainOtp}</span>
        </div>
        <p style="color: #6b7280; font-size: 12px;">This code expires in 10 minutes. If you did not request this code, please ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: creator.email,
        toName: creator.name,
        subject: "Your AIflix Verification Code",
        htmlContent,
      });
    } catch (emailErr) {
      console.error("Email sending failed during signup:", emailErr.message);
      // Rollback OTP if email fails so user knows to retry
      creator.emailOtp = undefined;
      creator.emailOtpExpiry = undefined;
      await creator.save();
      return res.status(500).json({ success: false, message: "Failed to send verification email. Please try again." });
    }

    return res.status(201).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP code are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const creator = await Creator.findOne({ email: normalizedEmail });

    if (!creator) {
      return res.status(400).json({ success: false, message: "Creator account not found." });
    }

    if (creator.isEmailVerified) {
      return res.status(400).json({ success: false, message: "Email is already verified. Please log in." });
    }

    if (!creator.emailOtp || !creator.emailOtpExpiry) {
      return res.status(400).json({ success: false, message: "No OTP found. Please request a new code." });
    }

    if (Date.now() > creator.emailOtpExpiry.getTime()) {
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new code." });
    }

    const isMatch = await bcrypt.compare(otp.toString().trim(), creator.emailOtp);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid OTP code. Please check and try again." });
    }

    creator.isEmailVerified = true;
    creator.emailOtp = undefined;
    creator.emailOtpExpiry = undefined;
    await creator.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
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

    const normalizedEmail = email.toLowerCase().trim();
    const creator = await Creator.findOne({ email: normalizedEmail });

    if (!creator) {
      return res.status(400).json({ success: false, message: "Creator account not found." });
    }

    if (creator.isEmailVerified) {
      return res.status(400).json({ success: false, message: "Email is already verified." });
    }

    // Rate limit check: if expiry is still > 9 minutes away, reject
    if (creator.emailOtpExpiry && creator.emailOtpExpiry.getTime() - Date.now() > 9 * 60 * 1000) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting a new OTP.",
      });
    }

    // Generate new 6-digit OTP (cryptographically secure)
    const plainOtp = generateSecureOtp();
    const hashedOtp = await bcrypt.hash(plainOtp, 10);

    creator.emailOtp = hashedOtp;
    creator.emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await creator.save();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background-color: #0d0d15; color: #ffffff; padding: 30px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); text-align: center;">
        <h2 style="color: #6c63ff; margin-bottom: 10px;">Your New Verification Code</h2>
        <p style="color: #9ca3af; font-size: 14px; margin-bottom: 25px;">Hi ${creator.name}, use the code below to verify your AIflix Creator account.</p>
        <div style="background: rgba(108, 99, 255, 0.12); border: 1px solid rgba(108, 99, 255, 0.3); border-radius: 12px; padding: 18px; display: inline-block; margin-bottom: 25px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #00d4ff; font-family: monospace;">${plainOtp}</span>
        </div>
        <p style="color: #6b7280; font-size: 12px;">This code expires in 10 minutes. If you did not request this code, please ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: creator.email,
        toName: creator.name,
        subject: "Your AIflix Verification Code",
        htmlContent,
      });
    } catch (emailErr) {
      console.error("Resend OTP email error:", emailErr.message);
      return res.status(500).json({ success: false, message: "Failed to send OTP email. Please try again." });
    }

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const creator = await Creator.findOne({ email: email.toLowerCase().trim() });

    if (!creator) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    if (!creator.isEmailVerified) {
      return res.status(403).json({ success: false, message: "Please verify your email first." });
    }

    if (!creator.isActive) {
      return res.status(403).json({ success: false, message: "Account deactivated." });
    }

    if (creator.applicationStatus === "rejected") {
      return res.status(403).json({ success: false, message: "Your creator application was rejected." });
    }

    const isMatch = await creator.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    creator.lastLogin = new Date();
    await creator.save();

    const tokenPayload = {
      id: creator._id,
      email: creator.email,
      role: creator.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      creator: {
        id: creator._id,
        name: creator.name,
        username: creator.username,
        email: creator.email,
        mobile: creator.mobile,
        role: creator.role,
        applicationStatus: creator.applicationStatus,
        applicationSubmitted: creator.applicationSubmitted,
        brandName: creator.brandName,
        bio: creator.bio,
        category: creator.category,
        skills: creator.skills,
        experience: creator.experience,
        languages: creator.languages,
        country: creator.country,
        state: creator.state,
        city: creator.city,
        portfolio: creator.portfolio,
        instagram: creator.instagram,
        facebook: creator.facebook,
        profileImage: creator.profileImage,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Refresh Token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Refresh token is required." });
    }

    const secret = process.env.CREATOR_JWT_REFRESH_SECRET;
    const decoded = jwt.verify(token, secret);

    const creator = await Creator.findById(decoded.id);

    if (!creator || !creator.isActive) {
      return res.status(401).json({ success: false, message: "Invalid token or inactive account." });
    }

    const newAccessToken = generateAccessToken({
      id: creator._id,
      email: creator.email,
      role: creator.role,
    });

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired refresh token." });
  }
};

// 6. Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const creator = await Creator.findOne({ email: email.toLowerCase().trim() });

    if (!creator) {
      return res.status(200).json({
        success: true,
        message: "Password reset email sent if account exists.",
      });
    }

    const resetToken = creator.generatePasswordResetToken();
    await creator.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/creator/reset-password?token=${resetToken}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d0d15; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
        <h2 style="color: #6c63ff; margin-bottom: 20px;">AIflix Password Reset Request</h2>
        <p>Hi ${creator.name},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetLink}" style="background: linear-gradient(135deg, #6c63ff 0%, #00d4ff 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #9ca3af; font-size: 13px;">Or copy and paste this link into your browser:<br/><a href="${resetLink}" style="color: #00d4ff;">${resetLink}</a></p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">This link will expire in 1 hour. If you did not request this, please ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: creator.email,
        toName: creator.name,
        subject: "Reset your AIflix Creator Password",
        htmlContent,
      });
    } catch (emailErr) {
      console.error("Reset email failed:", emailErr.message);
      // Rollback reset token so it can't be used
      creator.passwordResetToken = undefined;
      creator.passwordResetExpiry = undefined;
      await creator.save();
      return res.status(500).json({ success: false, message: "Failed to send reset email. Please try again." });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset email sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Reset Password
const resetPassword = async (req, res) => {
  try {
    const token = req.query.token || req.body.token;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Reset token is required." });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters long." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const creator = await Creator.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiry: { $gt: Date.now() },
    });

    if (!creator) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    creator.password = password;
    creator.passwordResetToken = undefined;
    creator.passwordResetExpiry = undefined;
    await creator.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Get Current Creator Profile
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      creator: req.creator,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 9. Submit Creator Application
const submitApplication = async (req, res) => {
  try {
    const {
      brandName,
      bio,
      category,
      skills,
      experience,
      languages,
      country,
      state,
      city,
      portfolio,
      instagram,
      facebook,
      termsAccepted,
      privacyAccepted,
      profileImage,
    } = req.body;

    if (
      !brandName ||
      !bio ||
      !category ||
      !experience ||
      !country ||
      !state ||
      !city ||
      !portfolio ||
      !instagram ||
      !facebook
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required application fields.",
      });
    }

    if (!termsAccepted || !privacyAccepted) {
      return res.status(400).json({
        success: false,
        message: "You must accept both Terms & Conditions and Privacy Policy.",
      });
    }

    const updateData = {
      brandName: brandName.trim(),
      displayName: brandName.trim() || req.creator.name,
      bio: bio.trim(),
      category,
      skills: Array.isArray(skills) ? skills : [],
      experience,
      languages: Array.isArray(languages) ? languages : [],
      country,
      state,
      city: city.trim(),
      portfolio: portfolio.trim(),
      instagram: instagram.trim(),
      facebook: facebook.trim(),
      termsAccepted: Boolean(termsAccepted),
      privacyAccepted: Boolean(privacyAccepted),
      applicationSubmitted: true,
    };

    if (profileImage) {
      updateData.profileImage = profileImage;
    }

    const creator = await Creator.findByIdAndUpdate(
      req.creator._id,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Application submitted successfully.",
      creator: {
        id: creator._id,
        name: creator.name,
        username: creator.username,
        email: creator.email,
        mobile: creator.mobile,
        role: creator.role,
        applicationStatus: creator.applicationStatus,
        applicationSubmitted: creator.applicationSubmitted,
        brandName: creator.brandName,
        bio: creator.bio,
        category: creator.category,
        skills: creator.skills,
        experience: creator.experience,
        languages: creator.languages,
        country: creator.country,
        state: creator.state,
        city: creator.city,
        portfolio: creator.portfolio,
        instagram: creator.instagram,
        facebook: creator.facebook,
        profileImage: creator.profileImage,
      },
    });
  } catch (error) {
    console.error("Submit application error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
