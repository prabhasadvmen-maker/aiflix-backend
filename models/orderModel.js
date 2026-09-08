const mongoose = require("mongoose");

const deliverableFileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      default: "video/mp4",
      trim: true,
    },
    fileSize: {
      type: String,
      default: "250 MB",
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true }
);

const timelineEventSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    actor: {
      type: String,
      default: "System",
      trim: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: () => "ORD-" + Math.floor(1000 + Math.random() * 9000),
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Creator",
      required: true,
      index: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },
    serviceTitle: {
      type: String,
      required: true,
      trim: true,
    },
    serviceCategory: {
      type: String,
      default: "AI Video & Film",
      trim: true,
    },
    packageTier: {
      type: String,
      enum: ["Basic", "Standard", "Premium", "Custom Enterprise"],
      default: "Standard",
    },
    client: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
      company: {
        type: String,
        default: "Independent",
        trim: true,
      },
      avatar: {
        type: String,
        default: "",
        trim: true,
      },
      country: {
        type: String,
        default: "United States",
        trim: true,
      },
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    platformFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    creatorEarnings: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "in_progress",
        "in_review",
        "revision_requested",
        "completed",
        "pending_requirements",
        "cancelled",
      ],
      default: "in_progress",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid_escrow", "released", "refunded"],
      default: "paid_escrow",
    },
    deliveryDays: {
      type: Number,
      default: 5,
      min: 1,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: String,
      default: "2026-10-15",
      trim: true,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    revisionsAllowed: {
      type: Number,
      default: 3,
    },
    revisionsUsed: {
      type: Number,
      default: 0,
    },
    requirements: {
      brief: {
        type: String,
        default: "",
        trim: true,
      },
      aspectRatio: {
        type: String,
        default: "16:9",
        trim: true,
      },
      targetResolution: {
        type: String,
        default: "4K UHD",
        trim: true,
      },
      references: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    deliverables: {
      type: [deliverableFileSchema],
      default: [],
    },
    timeline: {
      type: [timelineEventSchema],
      default: [],
    },
    rating: {
      stars: {
        type: Number,
        default: 5,
        min: 1,
        max: 5,
      },
      reviewText: {
        type: String,
        default: "",
        trim: true,
      },
      reviewedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ creatorId: 1, status: 1 });

module.exports = mongoose.model("Order", orderSchema);
