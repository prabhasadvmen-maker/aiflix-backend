const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");

// GET all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, admins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST create admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required." });

    const exists = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (exists)
      return res.status(400).json({ success: false, message: "Admin with this email already exists." });

    const admin = await Admin.create({ name, email, password });
    const adminObj = admin.toObject();
    delete adminObj.password;

    res.status(201).json({ success: true, admin: adminObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT update admin (name, email, password, isActive)
const updateAdmin = async (req, res) => {
  try {
    const { name, email, password, isActive } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase().trim();
    if (typeof isActive === "boolean") updateData.isActive = isActive;
    if (password) {
      // If updating password, save via instance so pre-save bcrypt hook fires
      const adminDoc = await Admin.findById(req.params.id);
      if (!adminDoc) return res.status(404).json({ success: false, message: "Admin not found." });
      if (name) adminDoc.name = name;
      if (email) adminDoc.email = email.toLowerCase().trim();
      if (typeof isActive === "boolean") adminDoc.isActive = isActive;
      adminDoc.password = password;
      await adminDoc.save();
      const updatedObj = adminDoc.toObject();
      delete updatedObj.password;
      return res.status(200).json({ success: true, admin: updatedObj });
    }

    const admin = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found." });
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE admin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found." });
    res.status(200).json({ success: true, message: "Admin deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST SuperAdmin direct login as Admin
const impersonateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found." });

    if (!admin.isActive) {
      return res.status(400).json({ success: false, message: "This admin account is inactive." });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role || "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`[IMPERSONATE LOG] SuperAdmin generated 1h token for Admin (${admin.email}) at ${new Date().toISOString()}`);

    res.status(200).json({
      success: true,
      message: `Logged in as Admin ${admin.name}`,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role || "admin",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAdmins, createAdmin, updateAdmin, deleteAdmin, impersonateAdmin };
