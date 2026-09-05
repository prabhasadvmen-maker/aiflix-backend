const mongoose = require("mongoose");

const infrastructureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Infrastructure Name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["Server", "Database", "Storage", "CDN", "Other"],
      required: [true, "Type is required"],
    },
    provider: {
      type: String,
      enum: ["AWS", "GCP", "Azure", "Vercel", "DigitalOcean", "Other"],
      required: [true, "Provider is required"],
    },
    region: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    monthlyCost: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Healthy", "Warning", "Critical", "Offline"],
      default: "Healthy",
    },
  },
  { timestamps: true }
);

const Infrastructure = mongoose.model("Infrastructure", infrastructureSchema);

module.exports = Infrastructure;
