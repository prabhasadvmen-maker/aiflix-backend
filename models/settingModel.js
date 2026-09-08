const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      required: true,
      default: "AIflix OTT",
      trim: true,
    },
    supportEmail: {
      type: String,
      required: true,
      default: "support@aiflix.com",
      trim: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    soraApiKey: {
      type: String,
      default: "",
    },
    elevenLabsApiKey: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;
