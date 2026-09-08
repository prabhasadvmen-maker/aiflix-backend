const AuditLog = require("../models/auditLogModel");

// Default logs to seed if collection is empty
const defaultLogs = [
  {
    action: "SYSTEM_STARTUP",
    performedBy: "system@aiphlix.com",
    ipAddress: "127.0.0.1",
    details: "Platform backend services started successfully.",
    severity: "Info"
  },
  {
    action: "LOGIN_FAILED",
    performedBy: "unknown@email.com",
    ipAddress: "192.168.1.45",
    details: "Failed login attempt detected from new IP address.",
    severity: "Warning"
  },
  {
    action: "ROLE_DELETED",
    performedBy: "superadmin@aiphlix.com",
    ipAddress: "10.0.0.1",
    details: "Deleted custom role 'Content Reviewer'.",
    severity: "Critical"
  }
];

// @desc    Get all audit logs (with auto-seeding)
// @route   GET /api/superadmin/security/logs
// @access  Private/SuperAdmin
exports.getAuditLogs = async (req, res) => {
  try {
    let logs = await AuditLog.find().sort({ createdAt: -1 });

    // Auto-seed if collection is empty
    if (logs.length === 0) {
      await AuditLog.insertMany(defaultLogs);
      logs = await AuditLog.find().sort({ createdAt: -1 });
    }

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ message: "Server error fetching security logs." });
  }
};

// @desc    Create a new audit log (used for frontend testing or internal calls)
// @route   POST /api/superadmin/security/logs
// @access  Private/SuperAdmin
exports.createAuditLog = async (req, res) => {
  try {
    const { action, performedBy, details, severity, ipAddress } = req.body;

    if (!action || !performedBy || !details) {
      return res.status(400).json({ message: "Action, performedBy, and details are required." });
    }

    const newLog = new AuditLog({
      action,
      performedBy,
      ipAddress: ipAddress || req.ip || "127.0.0.1",
      details,
      severity: severity || "Info"
    });

    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    console.error("Error creating audit log:", error);
    res.status(500).json({ message: "Server error creating audit log." });
  }
};

// @desc    Delete/Clear all or specific audit logs
// @route   DELETE /api/superadmin/security/logs
// @access  Private/SuperAdmin
exports.clearAuditLogs = async (req, res) => {
  try {
    // Note: For production, clearing audit logs should be highly restricted or avoided. 
    // Here we allow it for demonstration purposes.
    await AuditLog.deleteMany({});
    
    // Insert a log that the logs were cleared
    await AuditLog.create({
      action: "LOGS_CLEARED",
      performedBy: "superadmin@aiphlix.com", // Idealy get from req.user
      details: "All system audit logs were manually cleared.",
      severity: "Critical"
    });

    res.status(200).json({ message: "Audit logs cleared successfully." });
  } catch (error) {
    console.error("Error clearing audit logs:", error);
    res.status(500).json({ message: "Server error clearing audit logs." });
  }
};
