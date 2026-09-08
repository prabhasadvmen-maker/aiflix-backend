const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: String,
      default: "",
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true }
);

const projectTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    dueDate: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);

const collaboratorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: "Artist",
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
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
      maxlength: 140,
    },
    projectCode: {
      type: String,
      trim: true,
      default: () => "PRJ-" + Math.floor(1000 + Math.random() * 9000),
    },
    tagline: {
      type: String,
      trim: true,
      default: "",
      maxlength: 220,
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
      required: [true, "Cover artwork is required"],
      trim: true,
    },
    mediaUrl: {
      type: String,
      default: "",
      trim: true,
    },
    projectUrl: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["in_progress", "rendering", "in_review", "completed", "planning", "paused"],
      default: "in_progress",
      index: true,
    },
    priority: {
      type: String,
      enum: ["urgent", "high", "medium", "low"],
      default: "medium",
    },
    phase: {
      type: String,
      enum: [
        "Planning",
        "Pre-Production",
        "Diffusion Generation",
        "Neural Upscaling & VFX",
        "Sound & Foley",
        "Color Grade & Master",
        "Final Delivery",
      ],
      default: "Pre-Production",
    },
    progress: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },
    client: {
      type: String,
      default: "Self-Initiated",
      trim: true,
    },
    budget: {
      type: Number,
      default: 0,
      min: 0,
    },
    spent: {
      type: Number,
      default: 0,
      min: 0,
    },
    deadline: {
      type: String,
      default: "2026-10-31",
      trim: true,
    },
    startDate: {
      type: String,
      default: "2026-09-01",
      trim: true,
    },
    milestones: {
      type: [milestoneSchema],
      default: [],
    },
    tasks: {
      type: [projectTaskSchema],
      default: [],
    },
    aiTools: [
      {
        type: String,
        trim: true,
      },
    ],
    deliverables: [
      {
        type: String,
        trim: true,
      },
    ],
    renderHours: {
      type: Number,
      default: 0,
      min: 0,
    },
    collaborators: {
      type: [collaboratorSchema],
      default: [],
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful index for compound creator filtering
projectSchema.index({ creatorId: 1, status: 1, category: 1 });

module.exports = mongoose.model("Project", projectSchema);
