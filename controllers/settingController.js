const Setting = require("../models/settingModel");
const AuditLog = require("../models/auditLogModel");

// @desc    Get global settings
// @route   GET /api/superadmin/settings
// @access  Private/SuperAdmin
exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    // Auto-seed if collection is empty
    if (!settings) {
      settings = await Setting.create({
        platformName: "AIflix OTT",
        supportEmail: "support@aiflix.com",
        maintenanceMode: false,
        soraApiKey: "",
        elevenLabsApiKey: ""
      });
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Server error fetching settings." });
  }
};

// @desc    Update global settings
// @route   PUT /api/superadmin/settings
// @access  Private/SuperAdmin
exports.updateSettings = async (req, res) => {
  try {
    const { platformName, supportEmail, maintenanceMode, soraApiKey, elevenLabsApiKey } = req.body;

    let settings = await Setting.findOne();

    if (!settings) {
      settings = new Setting();
    }

    settings.platformName = platformName !== undefined ? platformName : settings.platformName;
    settings.supportEmail = supportEmail !== undefined ? supportEmail : settings.supportEmail;
    settings.maintenanceMode = maintenanceMode !== undefined ? maintenanceMode : settings.maintenanceMode;
    settings.soraApiKey = soraApiKey !== undefined ? soraApiKey : settings.soraApiKey;
    settings.elevenLabsApiKey = elevenLabsApiKey !== undefined ? elevenLabsApiKey : settings.elevenLabsApiKey;

    const updatedSettings = await settings.save();
    
    // Log the action
    await AuditLog.create({
      action: "SETTINGS_UPDATED",
      performedBy: req.user ? req.user.email : "superadmin",
      details: "Global system settings were updated.",
      severity: maintenanceMode ? "Warning" : "Info",
      ipAddress: req.ip || "127.0.0.1"
    });

    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Server error updating settings." });
  }
};
