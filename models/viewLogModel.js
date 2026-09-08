const mongoose = require("mongoose");

const viewLogSchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    device: {
      type: String,
      enum: ["Mobile (App)", "Desktop (Web)", "Smart TV"],
      default: "Mobile (App)",
    },
    views: {
      type: Number,
      default: 1,
    },
    likes: {
      type: Number,
      default: 0,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

viewLogSchema.index({ viewedAt: 1, contentId: 1 });

const ViewLog = mongoose.model("ViewLog", viewLogSchema);

module.exports = ViewLog;
