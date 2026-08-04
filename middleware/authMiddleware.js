const jwt = require("jsonwebtoken");
const SuperAdmin = require("../models/superAdminModel");
const Admin = require("../models/adminModel");

// SuperAdmin only — blocks admin role
const protectSuperAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized, no token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access denied. Super Admin role required." });
    }

    req.superAdmin = await SuperAdmin.findById(decoded.id).select("-password") || decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized, token invalid or expired." });
  }
};

// Admin or SuperAdmin — for shared routes
const protectAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized, no token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin" && decoded.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access denied. Admin role required." });
    }

    if (decoded.role === "admin") {
      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin || !admin.isActive) {
        return res.status(403).json({ success: false, message: "Account not found or deactivated." });
      }
      req.admin = admin;
    } else {
      req.admin = await SuperAdmin.findById(decoded.id).select("-password") || decoded;
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized, token invalid or expired." });
  }
};

module.exports = { protectSuperAdmin, protectAdmin };
