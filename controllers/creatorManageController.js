const Creator = require("../models/creatorModel");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");

// GET /api/superadmin/creators - list all creators
const getCreators = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status) {
      filter.applicationStatus = status;
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { email: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const creators = await Creator.find(filter).select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      creators,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/superadmin/creators/:id/approve
const approveCreator = async (req, res) => {
  try {
    const creator = await Creator.findById(req.params.id);

    if (!creator) {
      return res.status(404).json({ success: false, message: "Creator not found." });
    }

    creator.applicationStatus = "approved";
    await creator.save();

    res.status(200).json({
      success: true,
      message: `Creator ${creator.name} approved successfully.`,
      creator: {
        id: creator._id,
        name: creator.name,
        email: creator.email,
        applicationStatus: creator.applicationStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/superadmin/creators/:id/reject
const rejectCreator = async (req, res) => {
  try {
    const creator = await Creator.findById(req.params.id);

    if (!creator) {
      return res.status(404).json({ success: false, message: "Creator not found." });
    }

    creator.applicationStatus = "rejected";
    await creator.save();

    res.status(200).json({
      success: true,
      message: `Creator ${creator.name} application rejected.`,
      creator: {
        id: creator._id,
        name: creator.name,
        email: creator.email,
        applicationStatus: creator.applicationStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/superadmin/creators/:id/impersonate
const impersonateCreator = async (req, res) => {
  try {
    const creator = await Creator.findById(req.params.id).select("-password");

    if (!creator) {
      return res.status(404).json({ success: false, message: "Creator not found." });
    }

    if (!creator.isActive) {
      return res.status(400).json({ success: false, message: "Creator account is inactive." });
    }

    const superAdminEmail = req.superAdmin ? req.superAdmin.email : "superadmin";
    console.log(
      `[IMPERSONATE LOG] SuperAdmin (${superAdminEmail}) generated login token for Creator (${creator.email}) at ${new Date().toISOString()}`
    );

    const tokenPayload = {
      id: creator._id,
      email: creator.email,
      role: creator.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.status(200).json({
      success: true,
      message: `Impersonation token generated for Creator ${creator.name}`,
      accessToken,
      refreshToken,
      creator: {
        id: creator._id,
        name: creator.name,
        email: creator.email,
        role: creator.role,
        applicationStatus: creator.applicationStatus,
        applicationSubmitted: creator.applicationSubmitted,
        bio: creator.bio,
        category: creator.category,
        portfolio: creator.portfolio,
        profileImage: creator.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/superadmin/creators/:id
const deleteCreator = async (req, res) => {
  try {
    const creator = await Creator.findByIdAndDelete(req.params.id);

    if (!creator) {
      return res.status(404).json({ success: false, message: "Creator not found." });
    }

    res.status(200).json({
      success: true,
      message: `Creator ${creator.name} deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCreators,
  approveCreator,
  rejectCreator,
  impersonateCreator,
  deleteCreator,
};

