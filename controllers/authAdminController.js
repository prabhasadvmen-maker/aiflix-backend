const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const SuperAdmin = require("../models/superAdminModel");

const generateToken = (id, email, role) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured.");
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Please provide email and password." });

    const normalizedEmail = email.toLowerCase().trim();
    let user = await Admin.findOne({ email: normalizedEmail });
    let isSuperAdmin = false;

    if (!user) {
      user = await SuperAdmin.findOne({ email: normalizedEmail });
      if (user) isSuperAdmin = true;
    }

    if (!user)
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    if (!isSuperAdmin && !user.isActive)
      return res.status(403).json({ success: false, message: "Your account has been deactivated. Contact Super Admin." });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    const role = isSuperAdmin ? "superadmin" : (user.role || "admin");
    const token = generateToken(user._id, user.email, role);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { loginAdmin };
