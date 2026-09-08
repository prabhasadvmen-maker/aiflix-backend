const mongoose = require("mongoose");

const pricingTierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: "Standard",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryDays: {
      type: Number,
      default: 3,
      min: 1,
    },
    revisions: {
      type: Number,
      default: 2,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Creator",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
      maxlength: 120,
    },
    tagline: {
      type: String,
      trim: true,
      default: "",
      maxlength: 200,
    },
    category: {
      type: String,
      enum: [
        "AI Video & Film",
        "3D & Animation",
        "VFX & Compositing",
        "Audio & Voice Synthesis",
        "Concept Art & Matte Painting",
        "Custom AI Model & LoRA",
        "Scriptwriting & Storyboarding",
      ],
      default: "AI Video & Film",
      index: true,
    },
    coverImage: {
      type: String,
      required: [true, "Cover image URL is required"],
      trim: true,
    },
    startingPrice: {
      type: Number,
      required: [true, "Starting price is required"],
      min: 0,
      default: 199,
    },
    deliveryDays: {
      type: Number,
      default: 3,
      min: 1,
    },
    revisions: {
      type: Number,
      default: 2,
    },
    pricingTiers: {
      type: [pricingTierSchema],
      default: [],
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    deliverables: [
      {
        type: String,
        trim: true,
      },
    ],
    aiTools: [
      {
        type: String,
        trim: true,
      },
    ],
    faq: [
      {
        question: { type: String, trim: true },
        answer: { type: String, trim: true },
      },
    ],
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    ordersCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
    inProgressOrders: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "paused", "draft"],
      default: "active",
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound text index
serviceSchema.index({
  title: "text",
  tagline: "text",
  description: "text",
  deliverables: "text",
  aiTools: "text",
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
