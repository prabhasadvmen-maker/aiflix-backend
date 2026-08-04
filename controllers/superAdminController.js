const jwt = require("jsonwebtoken");
const SuperAdmin = require("../models/superAdminModel");

const generateToken = (id, email, role) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured.");
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route POST /api/superadmin/login
const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide both email and password." });
    }

    const admin = await SuperAdmin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = generateToken(admin._id, admin.email, admin.role);

    return res.status(200).json({
      success: true,
      message: "Super Admin authenticated successfully",
      token,
      superAdmin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("SuperAdmin Login Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// @route GET /api/superadmin/me
const getSuperAdminProfile = async (req, res) => {
  res.status(200).json({ success: true, superAdmin: req.superAdmin });
};

// Auto Seed Super Admin on Startup
const seedSuperAdminAccount = async () => {
  try {
    const defaultEmail = (process.env.SUPERADMIN_EMAIL || "superadmin@aiflix.com").toLowerCase().trim();
    const defaultPassword = process.env.SUPERADMIN_PASSWORD;

    if (!defaultPassword) {
      console.warn("[SEED] SUPERADMIN_PASSWORD not set in .env — skipping seed.");
      return;
    }

    const existing = await SuperAdmin.findOne({ email: defaultEmail });
    if (!existing) {
      await SuperAdmin.create({ name: "AIflix Master Admin", email: defaultEmail, password: defaultPassword, role: "superadmin" });
      console.log(`[SEED] Created default Super Admin: ${defaultEmail}`);
    }
  } catch (error) {
    console.log("[SEED] Skipping auto-seed:", error.message);
  }
};

module.exports = { loginSuperAdmin, getSuperAdminProfile, seedSuperAdminAccount };
