const mongoose = require("mongoose");

const storageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Storage Resource Name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["Storage", "CDN"],
      required: [true, "Type is required"],
    },
    provider: {
      type: String,
      enum: ["AWS S3", "Google Cloud Storage", "Cloudflare", "Cloudinary", "Vercel Blob", "Other"],
      required: [true, "Provider is required"],
    },
    region: {
      type: String,
      trim: true,
    },
    usedStorage: {
      type: Number,
      default: 0,
    },
    totalStorage: {
      type: Number,
      default: 1000,
    },
    bandwidth: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Warning", "Offline"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Storage = mongoose.model("Storage", storageSchema);

module.exports = Storage;
