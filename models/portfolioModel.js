const mongoose = require("mongoose");

const portfolioItemSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Creator",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Project title is required"],
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
        "AI Short Film",
        "3D Animation",
        "VFX & CGI",
        "Concept Art",
        "Generative Audio",
        "Commercial / Brand",
        "Case Study",
      ],
      default: "AI Short Film",
      index: true,
    },
    mediaType: {
      type: String,
      enum: ["video", "image", "audio", "interactive"],
      default: "video",
    },
    coverImage: {
      type: String,
      required: [true, "Cover image URL is required"],
      trim: true,
    },
    mediaUrl: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    aiTools: [
      {
        type: String,
        trim: true,
      },
    ],
    client: {
      type: String,
      default: "Self-Initiated",
      trim: true,
    },
    completionDate: {
      type: String,
      default: "2026",
      trim: true,
    },
    projectUrl: {
      type: String,
      default: "",
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ["published", "draft", "in_review", "archived"],
      default: "published",
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

// Compound text index for title, tagline, description, and aiTools
portfolioItemSchema.index({
  title: "text",
  tagline: "text",
  description: "text",
  aiTools: "text",
});

const PortfolioItem = mongoose.model("PortfolioItem", portfolioItemSchema);

module.exports = PortfolioItem;
