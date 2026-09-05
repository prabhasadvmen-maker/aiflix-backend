const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription plan name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
    },
    currency: {
      type: String,
      default: "USD",
      trim: true,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly", "weekly", "quarterly"],
      default: "monthly",
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    maxScreens: {
      type: Number,
      default: 1,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
