const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Content title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: ["movie", "short", "series", "animation", "documentary"],
      default: "movie",
    },
    category: {
      type: String,
      default: "Sci-Fi",
      trim: true,
    },
    genres: [
      {
        type: String,
        trim: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    thumbnailUrl: {
      type: String,
      default: "",
    },
    bannerUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    trailerUrl: {
      type: String,
      default: "",
    },
    duration: {
      type: String,
      default: "1h 30m",
      trim: true,
    },
    releaseYear: {
      type: Number,
      default: 2026,
    },
    maturityRating: {
      type: String,
      enum: ["All", "U", "PG", "PG-13", "13+", "16+", "18+", "R"],
      default: "PG-13",
    },
    status: {
      type: String,
      enum: ["published", "pending", "draft", "rejected"],
      default: "published",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    creatorName: {
      type: String,
      default: "AIflix Originals",
      trim: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Creator",
      default: null,
    },
    aiToolsUsed: [
      {
        type: String,
        trim: true,
      },
    ],
    accessType: {
      type: String,
      enum: ["free", "premium", "rent"],
      default: "free",
    },
  },
  { timestamps: true }
);

// Index for fast search and filtering
contentSchema.index({ title: "text", description: "text", category: 1, type: 1, status: 1 });

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;
