const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: [true, "Action name is required"],
      trim: true,
    },
    performedBy: {
      type: String,
      required: [true, "User email or identifier is required"],
      trim: true,
    },
    ipAddress: {
      type: String,
      default: "127.0.0.1",
    },
    details: {
      type: String,
      required: [true, "Action details are required"],
    },
    severity: {
      type: String,
      enum: ["Info", "Warning", "Critical"],
      default: "Info",
    },
  },
  { timestamps: true }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports = AuditLog;
