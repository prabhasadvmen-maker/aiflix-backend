const mongoose = require("mongoose");

const quickActionLogSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Creator",
      required: true,
      index: true,
    },
    actionType: {
      type: String,
      enum: [
        "upload_content",
        "payout_request",
        "ai_concept",
        "promo_blast",
        "support_ticket",
        "status_toggle",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ["completed", "pending", "in_progress", "failed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

quickActionLogSchema.index({ creatorId: 1, createdAt: -1 });

const QuickActionLog = mongoose.model("QuickActionLog", quickActionLogSchema);

module.exports = QuickActionLog;
