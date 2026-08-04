require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db");
const superAdminRoutes = require("./routes/superAdminRoutes");
const adminRoutes = require("./routes/adminRoutes");
const creatorAuthRoutes = require("./routes/creatorAuthRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes");
const { seedSuperAdminAccount } = require("./controllers/superAdminController");

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers
app.use(helmet());

// Restrict CORS to frontend origin only
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// Body Parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// NoSQL Injection Sanitization
app.use(mongoSanitize());

// Global Auth Rate Limiter — 20 attempts per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many login attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP Rate Limiter — 5 attempts per 10 min
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many OTP requests. Please wait before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Connect DB & Seed default superadmin
connectDB().then(() => {
  seedSuperAdminAccount();
});

// Root Route
app.get("/", (req, res) => {
  res.json({
    status: "online",
    platform: "AIflix OTT API",
    version: "1.0.0",
  });
});

// Mount Routes with rate limiting on auth endpoints
app.use("/api/superadmin/login", authLimiter);
app.use("/api/admin/login", authLimiter);
app.use("/api/creator/login", authLimiter);
app.use("/api/creator/signup", authLimiter);
app.use("/api/creator/verify-otp", otpLimiter);
app.use("/api/creator/resend-otp", otpLimiter);
app.use("/api/creator/forgot-password", otpLimiter);
app.use("/api/user/login", authLimiter);
app.use("/api/user/signup", authLimiter);
app.use("/api/user/verify-otp", otpLimiter);
app.use("/api/user/resend-otp", otpLimiter);
app.use("/api/user/forgot-password", otpLimiter);

app.use("/api/superadmin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/creator", creatorAuthRoutes);
app.use("/api/user", userAuthRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal server error." : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AIflix Backend running on http://localhost:${PORT}`);
});
