const mongoose = require("mongoose");

const aiModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "AI Model name is required"],
      trim: true,
    },
    provider: {
      type: String,
      enum: ["OpenAI", "Anthropic", "Google", "Meta", "Other"],
      required: [true, "Provider is required"],
    },
    version: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    apiEndpoint: {
      type: String,
      trim: true,
    },
    costPer1kTokens: {
      type: Number,
      required: [true, "Cost per 1k tokens is required"],
      min: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Maintenance"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const AIModel = mongoose.model("AIModel", aiModelSchema);

module.exports = AIModel;
