const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
      unique: true,
      trim: true,
    },
    userName: {
      type: String,
      required: [true, "User Name is required"],
      trim: true,
    },
    userEmail: {
      type: String,
      required: [true, "User Email is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    currency: {
      type: String,
      default: "USD",
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "PayPal", "UPI", "Crypto", "Stripe"],
      default: "Credit Card",
    },
    status: {
      type: String,
      enum: ["Completed", "Pending", "Failed", "Refunded"],
      default: "Completed",
    },
    planName: {
      type: String,
      required: [true, "Plan Name is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

// Add text index for fast searching by ID, name, or email
paymentSchema.index({ transactionId: "text", userName: "text", userEmail: "text" });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
