const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Generate access token for User impersonation
const generateUserToken = (id) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured.");
  return jwt.sign({ id, role: "user" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 1. GET /api/superadmin/users - Get all users with search, filters, pagination & stats
const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "all",
      provider = "all",
      verified = "all",
      sort = "newest",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const filter = {};

    // Search by name or email
    if (search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
      ];
    }

    // Status filter
    if (status === "active") {
      filter.isActive = true;
    } else if (status === "inactive" || status === "suspended") {
      filter.isActive = false;
    }

    // Auth Provider filter
    if (provider === "google") {
      filter.authProvider = "google";
    } else if (provider === "email") {
      filter.authProvider = "email";
    }

    // Email Verified filter
    if (verified === "true") {
      filter.isEmailVerified = true;
    } else if (verified === "false") {
      filter.isEmailVerified = false;
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "name_asc") sortOption = { name: 1 };
    if (sort === "name_desc") sortOption = { name: -1 };

    // Device filter
    if (req.query.device && req.query.device !== "all") {
      filter.device = req.query.device;
    }

    // Run queries concurrently
    const [users, totalFiltered, totalAll, totalActive, totalInactive, totalGoogle, totalEmail, totalVerified] =
      await Promise.all([
        User.find(filter)
          .select("-password -emailOtp -emailOtpExpiry -passwordResetToken -passwordResetExpiry")
          .sort(sortOption)
          .skip(skip)
          .limit(limitNum),
        User.countDocuments(filter),
        User.countDocuments(),
        User.countDocuments({ isActive: true }),
        User.countDocuments({ isActive: false }),
        User.countDocuments({ authProvider: "google" }),
        User.countDocuments({ authProvider: "email" }),
        User.countDocuments({ isEmailVerified: true }),
      ]);

    // Fetch latest completed payment for each user to get their active OTT subscription plan
    const Payment = require("../models/paymentModel");
    const userEmails = users.map((u) => u.email.toLowerCase());
    const payments = await Payment.find({
      userEmail: { $in: userEmails },
      status: "Completed",
    }).sort({ createdAt: -1 });

    const planMap = {};
    for (const p of payments) {
      const emailLower = p.userEmail.toLowerCase();
      if (!planMap[emailLower]) {
        planMap[emailLower] = {
          planName: p.planName,
          amount: p.amount,
          currency: p.currency,
          date: p.createdAt,
        };
      }
    }

    const enrichedUsers = users.map((u) => {
      const userObj = u.toObject();
      const planInfo = planMap[u.email.toLowerCase()];
      userObj.plan = planInfo ? planInfo.planName : "Free Tier";
      userObj.planDetails = planInfo || null;
      userObj.device = userObj.device || "Mobile (App)";
      return userObj;
    });

    const totalPages = Math.ceil(totalFiltered / limitNum) || 1;

    res.status(200).json({
      success: true,
      users: enrichedUsers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalFiltered,
        totalPages,
      },
      stats: {
        total: totalAll,
        active: totalActive,
        inactive: totalInactive,
        google: totalGoogle,
        email: totalEmail,
        verified: totalVerified,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET /api/superadmin/users/:id - Get single user detail
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -emailOtp -emailOtpExpiry -passwordResetToken -passwordResetExpiry"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. POST /api/superadmin/users - Manually create user
const createUser = async (req, res) => {
  try {
    const { name, email, password, isActive = true, isEmailVerified = true } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const exists = await User.findOne({ email: normalizedEmail });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      authProvider: "email",
      isActive: Boolean(isActive),
      isEmailVerified: Boolean(isEmailVerified),
    });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.emailOtp;
    delete userObj.emailOtpExpiry;

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: userObj,
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. PUT /api/superadmin/users/:id - Update user details
const updateUser = async (req, res) => {
  try {
    const { name, email, password, isActive, isEmailVerified } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (email && email.toLowerCase().trim() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "Another user is already using this email.",
        });
      }
      user.email = email.toLowerCase().trim();
    }

    if (name) user.name = name.trim();
    if (typeof isActive === "boolean") user.isActive = isActive;
    if (typeof isEmailVerified === "boolean") user.isEmailVerified = isEmailVerified;

    if (password && password.trim()) {
      if (password.trim().length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long.",
        });
      }
      user.password = password.trim();
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.emailOtp;
    delete userObj.emailOtpExpiry;

    res.status(200).json({
      success: true,
      message: `User ${user.name} updated successfully.`,
      user: userObj,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. PATCH /api/superadmin/users/:id/status - Toggle active/suspended status
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} is now ${user.isActive ? "active" : "suspended"}.`,
      isActive: user.isActive,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Toggle user status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. POST /api/superadmin/users/:id/impersonate - Direct login as User
const impersonateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: "Cannot impersonate a suspended/inactive user account.",
      });
    }

    const token = generateUserToken(user._id);

    const superAdminEmail = req.superAdmin ? req.superAdmin.email : "superadmin";
    console.log(
      `[IMPERSONATE USER] SuperAdmin (${superAdminEmail}) logged in as User (${user.email}) at ${new Date().toISOString()}`
    );

    res.status(200).json({
      success: true,
      message: `Logged in as User ${user.name}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Impersonate user error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. DELETE /api/superadmin/users/:id - Delete user permanently
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      message: `User ${user.name} deleted permanently.`,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  impersonateUser,
  deleteUser,
};
