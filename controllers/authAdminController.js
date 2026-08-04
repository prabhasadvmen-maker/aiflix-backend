const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const generateToken = (id, email, role) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured.");
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Please provide email and password." });

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin)
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    if (!admin.isActive)
      return res.status(403).json({ success: false, message: "Your account has been deactivated. Contact Super Admin." });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    const token = generateToken(admin._id, admin.email, admin.role);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { loginAdmin };
