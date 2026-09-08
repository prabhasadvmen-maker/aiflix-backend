const Project = require("../models/projectModel");
const Creator = require("../models/creatorModel");

// Curated high-fidelity production projects matching AIflix studio pipeline
const SAMPLE_PROJECTS = [
  {
    title: "CYBER-DUNE: Neural Chronicles (Ep. 1)",
    projectCode: "PRJ-9104",
    tagline: "4K Generative sci-fi episode set in a post-biological desert megacity.",
    category: "AI Video & Film",
    coverImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-41544-large.mp4",
    projectUrl: "https://aiflix.tv/productions/cyber-dune",
    status: "rendering",
    priority: "urgent",
    phase: "Diffusion Generation",
    progress: 74,
    client: "Neon Frontier Studios",
    budget: 9500,
    spent: 6200,
    deadline: "2026-10-15",
    startDate: "2026-08-10",
    renderHours: 86.4,
    aiTools: ["Runway Gen-3", "OpenAI Sora", "Midjourney v6", "ComfyUI", "Topaz Video AI", "DaVinci Resolve"],
    deliverables: [
      "4K Pro-Res 422HQ Master Video (12 mins)",
      "Dolby Atmos 5.1 Surround Stems",
      "Production Storyboard Deck (PDF)",
      "9:16 Vertical Cutdowns for Socials (x4)",
    ],
    milestones: [
      { title: "Script & Treatment Locked", dueDate: "2026-08-18", completed: true, notes: "Approved by client" },
      { title: "Midjourney Continuity Keyframes (320 shots)", dueDate: "2026-08-30", completed: true, notes: "Consistent character LoRAs" },
      { title: "Runway Gen-3 Temporal Generation", dueDate: "2026-09-12", completed: true, notes: "Batches 1-4 completed" },
      { title: "Topaz 4K Upscale & Color Master", dueDate: "2026-10-05", completed: false, notes: "Running in queue" },
      { title: "Final Studio Screening & Delivery", dueDate: "2026-10-15", completed: false, notes: "Sign-off pending" },
    ],
    tasks: [
      { title: "Fix character ear consistency in scene 4", status: "done", priority: "high", dueDate: "2026-09-02" },
      { title: "Re-render dune sandstorm volumetric pass", status: "in_progress", priority: "urgent", dueDate: "2026-09-10" },
      { title: "Sync ElevenLabs dialogue pacing with lip keyframes", status: "todo", priority: "medium", dueDate: "2026-09-18" },
    ],
    collaborators: [
      { name: "Elena Vance", role: "Diffusion Lead", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
      { name: "Marcus Chen", role: "VFX Supervisor", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
    ],
    description: "An episodic generative cinema production featuring custom LoRA character continuity, Sora environment synthesis, and DaVinci Resolve color grading.",
    notes: "Client requested cinematic 2.39:1 anamorphic framing and gritty cyber-noir synth textures.",
  },
  {
    title: "KRONOS-7: Autonomous Mech Rig & Nanite Asset",
    projectCode: "PRJ-8422",
    tagline: "Heavy assault mech 3D character pipeline with Nanite mesh & Control Rig for UE5.4.",
    category: "3D & Animation",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    mediaUrl: "",
    projectUrl: "",
    status: "in_progress",
    priority: "high",
    phase: "Pre-Production",
    progress: 42,
    client: "Apex Interactive Gaming",
    budget: 5800,
    spent: 2400,
    deadline: "2026-11-20",
    startDate: "2026-08-25",
    renderHours: 42.0,
    aiTools: ["Blender 4.2", "Unreal Engine 5.4", "Substance 3D", "ComfyUI", "Topaz Gigapixel"],
    deliverables: [
      "Rigged FBX & USD Character Assets",
      "Unreal Engine 5.4 Migration Package",
      "4K PBR Substance Texture Maps",
      "5 Custom Attack & Idle Animation Sequences",
    ],
    milestones: [
      { title: "2D AI Concept Orthographics", dueDate: "2026-08-28", completed: true, notes: "Approved" },
      { title: "High-Poly Sub-D & Hard Surface Modeling", dueDate: "2026-09-15", completed: true, notes: "Mesh clean" },
      { title: "IK/FK Skeletal & Hydraulic Rigging", dueDate: "2026-10-01", completed: false, notes: "In progress" },
      { title: "Unreal Engine 5.4 Integration & Lumen Testing", dueDate: "2026-10-25", completed: false, notes: "Pending" },
    ],
    tasks: [
      { title: "Tune hydraulic cylinder constraints on knee joint", status: "in_progress", priority: "high", dueDate: "2026-09-12" },
      { title: "Bake normal maps from 12M poly high-res sculpt", status: "todo", priority: "medium", dueDate: "2026-09-20" },
    ],
    collaborators: [
      { name: "Devon Ross", role: "3D Rigger", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
    ],
    description: "Hard-surface mechanical walker asset built for interactive AAA virtual production environments and game cinematics.",
    notes: "Requires full compatibility with UE5 standard skeleton and custom control rig widgets.",
  },
  {
    title: "NEO-SHINJUKU: Volumetric Rain & Deep Compositing",
    projectCode: "PRJ-7650",
    tagline: "Hollywood-grade deep compositing combining live-action plates with AI matte passes.",
    category: "VFX & Compositing",
    coverImage: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=80",
    mediaUrl: "",
    projectUrl: "",
    status: "in_review",
    priority: "medium",
    phase: "Color Grade & Master",
    progress: 88,
    client: "Tokyo Synthetics Media",
    budget: 7200,
    spent: 5900,
    deadline: "2026-09-28",
    startDate: "2026-07-15",
    renderHours: 112.5,
    aiTools: ["Foundry Nuke", "ComfyUI", "Runway Gen-3", "EbSynth", "DaVinci Resolve Studio"],
    deliverables: [
      "12 Visual Effects Shots (EXR 32-bit float)",
      "ACEScc Graded Master QuickTime",
      "Clean Plate Archives & Rotoscoping Mattes",
    ],
    milestones: [
      { title: "Plate Ingestion & Camera 3D Tracking", dueDate: "2026-07-25", completed: true, notes: "Done" },
      { title: "AI Cyberpunk Building Extensions", dueDate: "2026-08-10", completed: true, notes: "Generated" },
      { title: "Volumetric Neon Fog & Rain Simulation", dueDate: "2026-08-30", completed: true, notes: "Integrated" },
      { title: "Client Color Grading Review", dueDate: "2026-09-22", completed: false, notes: "Under review" },
    ],
    tasks: [
      { title: "Tweak specular bounce on wet pavement in shot 08", status: "in_progress", priority: "high", dueDate: "2026-09-14" },
    ],
    collaborators: [
      { name: "Yuki Tanaka", role: "Lead Compositor", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" },
    ],
    description: "Photorealistic compositing integrating multi-layered atmospheric passes into high-resolution live footage.",
    notes: "Delivered in ACEScg color space for seamless IMAX projection mastering.",
  },
  {
    title: "AETHER ECHOES: Neural Symphony & Spatial OST",
    projectCode: "PRJ-6311",
    tagline: "Original soundtrack featuring neural choral synthesis and 7.1.4 Dolby Atmos mix.",
    category: "Audio & Voice Synthesis",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80",
    mediaUrl: "",
    projectUrl: "",
    status: "in_progress",
    priority: "medium",
    phase: "Sound & Foley",
    progress: 52,
    client: "Quantum Records UK",
    budget: 4200,
    spent: 1800,
    deadline: "2026-10-30",
    startDate: "2026-08-20",
    renderHours: 35.8,
    aiTools: ["Suno v3.5", "ElevenLabs", "Ableton Live 12", "iZotope Ozone 11", "FabFilter"],
    deliverables: [
      "10-Track Original Soundtrack Album (WAV 96kHz / 24-bit)",
      "Dolby Atmos ADM BWF Master Files",
      "Isolated Instrumental, Choral, and Sub-bass Stems",
    ],
    milestones: [
      { title: "Motif & Harmonic Theme Exploration", dueDate: "2026-08-28", completed: true, notes: "Approved" },
      { title: "Neural Choral Stem Generation", dueDate: "2026-09-15", completed: true, notes: "Generated" },
      { title: "Analog Synthesizer & Orchestral Layering", dueDate: "2026-10-05", completed: false, notes: "Recording" },
      { title: "Spatial Audio Atmos Spatialization", dueDate: "2026-10-20", completed: false, notes: "Pending" },
    ],
    tasks: [
      { title: "Master dynamic range for track 'Event Horizon'", status: "todo", priority: "medium", dueDate: "2026-09-25" },
    ],
    collaborators: [
      { name: "Julian Gray", role: "Audio Engineer", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80" },
    ],
    description: "Hybrid generative sonic landscape fusing analog synthesis with deep learning vocal resonance.",
    notes: "Intended for theatrical exhibition and spatial headphones release.",
  },
  {
    title: "SOLARIS ARCHIVE: Worldbuilding Matte Paintings",
    projectCode: "PRJ-5520",
    tagline: "30 Ultra-high-resolution matte concept paintings for a sci-fi streaming franchise.",
    category: "Concept Art & Matte Painting",
    coverImage: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80",
    mediaUrl: "",
    projectUrl: "https://aiflix.tv/productions/solaris-archive",
    status: "completed",
    priority: "low",
    phase: "Final Delivery",
    progress: 100,
    client: "Mythos Media Global",
    budget: 6500,
    spent: 4900,
    deadline: "2026-09-01",
    startDate: "2026-06-10",
    renderHours: 54.0,
    aiTools: ["Midjourney v6", "Adobe Photoshop 2026", "Magnific AI", "Blender 4.2"],
    deliverables: [
      "30 Matte Painting PSDs with Separated Parallax Layers",
      "8K 300DPI High-Res Key Visual Prints",
      "Style Guide & Architectural Bible Deck",
    ],
    milestones: [
      { title: "Color Palettes & Moodboards", dueDate: "2026-06-20", completed: true, notes: "Approved" },
      { title: "15 Exterior Planetary Landscapes", dueDate: "2026-07-15", completed: true, notes: "Delivered" },
      { title: "15 Interior Megastructure Concepts", dueDate: "2026-08-10", completed: true, notes: "Delivered" },
      { title: "Final Layered Parallax Handoff", dueDate: "2026-09-01", completed: true, notes: "Archived" },
    ],
    tasks: [],
    collaborators: [
      { name: "Chloe Dupont", role: "Concept Artist", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" },
    ],
    description: "Monumental environment worldbuilding concept art showcasing alien orbital rings and terraformed biospheres.",
    notes: "Project completed ahead of schedule. Client awarded 5/5 review.",
  },
  {
    title: "CHRONO-RUNNER: Custom Diffusion Model & LoRA",
    projectCode: "PRJ-4980",
    tagline: "Fine-tuned Flux & SDXL LoRA weights trained on 1,500 curated futuristic wardrobe sketches.",
    category: "Custom AI Model & LoRA",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    mediaUrl: "",
    projectUrl: "",
    status: "in_progress",
    priority: "high",
    phase: "Diffusion Generation",
    progress: 65,
    client: "Synthetix Labs",
    budget: 8200,
    spent: 5100,
    deadline: "2026-10-18",
    startDate: "2026-08-15",
    renderHours: 140.0,
    aiTools: ["Kohya_ss", "RunPod H100", "Flux.1", "ComfyUI", "Python 3.11"],
    deliverables: [
      "Trained Safetensors LoRA Model File",
      "Comprehensive Prompt Trigger Word Documentation",
      "ComfyUI Latent Workflow Json",
      "Validation Dataset Sample Gallery (200 images)",
    ],
    milestones: [
      { title: "Dataset Cleaning & High-Pass Captioning", dueDate: "2026-08-25", completed: true, notes: "1500 images labeled" },
      { title: "RunPod H100 Training Cluster Epochs 1-20", dueDate: "2026-09-08", completed: true, notes: "Loss down to 0.042" },
      { title: "Stress-Testing & Overfitting Calibration", dueDate: "2026-09-25", completed: false, notes: "Underway" },
      { title: "Model Package Deployment to Studio HuggingFace", dueDate: "2026-10-18", completed: false, notes: "Pending" },
    ],
    tasks: [
      { title: "Inspect epoch 16 weights for prompt bleeding", status: "in_progress", priority: "urgent", dueDate: "2026-09-12" },
    ],
    collaborators: [
      { name: "Dr. Aris Thorne", role: "AI Research Engineer", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" },
    ],
    description: "State-of-the-art model adaptation allowing creators to generate coherent futuristic costumes and props.",
    notes: "Requires zero commercial licensing restrictions on downstream render outputs.",
  },
];

/**
 * @desc Get all projects for logged-in creator with live KPIs & filters
 * @route GET /api/creator/projects
 * @access Protected (Creator)
 */
const getProjectsOverview = async (req, res) => {
  try {
    const creatorId = req.creator._id;

    // Check if creator has projects; auto-seed if 0
    let count = await Project.countDocuments({ creatorId, isArchived: false });
    if (count === 0) {
      const seeded = SAMPLE_PROJECTS.map((proj) => ({
        ...proj,
        creatorId,
      }));
      await Project.insertMany(seeded);
    }

    // Extract query parameters
    const {
      search = "",
      category = "All",
      status = "All",
      sortBy = "newest",
    } = req.query;

    // Build filter query
    const filter = { creatorId, isArchived: false };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (status && status !== "All") {
      filter.status = status;
    }

    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: searchRegex },
        { projectCode: searchRegex },
        { client: searchRegex },
        { tagline: searchRegex },
        { description: searchRegex },
        { aiTools: { $in: [searchRegex] } },
      ];
    }

    // Determine sort
    let sortOptions = { createdAt: -1 };
    if (sortBy === "newest") {
      sortOptions = { createdAt: -1 };
    } else if (sortBy === "oldest") {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === "progress_high") {
      sortOptions = { progress: -1 };
    } else if (sortBy === "progress_low") {
      sortOptions = { progress: 1 };
    } else if (sortBy === "budget_high") {
      sortOptions = { budget: -1 };
    } else if (sortBy === "budget_low") {
      sortOptions = { budget: 1 };
    } else if (sortBy === "deadline") {
      sortOptions = { deadline: 1 };
    } else if (sortBy === "title") {
      sortOptions = { title: 1 };
    }

    // Fetch filtered projects
    const projects = await Project.find(filter).sort(sortOptions);

    // Compute live telemetry from ALL unarchived projects of this creator
    const allProjects = await Project.find({ creatorId, isArchived: false });

    const totalProjects = allProjects.length;
    const inProduction = allProjects.filter(
      (p) => p.status === "in_progress" || p.status === "rendering"
    ).length;
    const completedProjects = allProjects.filter((p) => p.status === "completed").length;
    const totalBudget = allProjects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
    const totalSpent = allProjects.reduce((sum, p) => sum + (Number(p.spent) || 0), 0);
    const totalRenderHours = Number(
      allProjects.reduce((sum, p) => sum + (Number(p.renderHours) || 0), 0).toFixed(1)
    );
    const avgProgress =
      totalProjects > 0
        ? Math.round(
            allProjects.reduce((sum, p) => sum + (Number(p.progress) || 0), 0) / totalProjects
          )
        : 0;

    // Calculate category counts
    const categoryCounts = { All: totalProjects };
    allProjects.forEach((p) => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    // Creator profile info
    const creator = await Creator.findById(creatorId).select(
      "name brandName profileImage category username email isApproved"
    );

    return res.status(200).json({
      success: true,
      projects,
      kpis: {
        totalProjects,
        inProduction,
        completedProjects,
        totalBudget,
        totalSpent,
        avgProgress,
        totalRenderHours,
      },
      categoryCounts,
      creator,
    });
  } catch (error) {
    console.error("Error fetching projects overview:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching projects overview.",
      error: error.message,
    });
  }
};

/**
 * @desc Create a new production project
 * @route POST /api/creator/projects
 * @access Protected (Creator)
 */
const createProject = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    const {
      title,
      projectCode,
      tagline,
      category,
      coverImage,
      mediaUrl,
      projectUrl,
      status,
      priority,
      phase,
      progress,
      client,
      budget,
      spent,
      deadline,
      startDate,
      milestones,
      tasks,
      aiTools,
      deliverables,
      renderHours,
      description,
      notes,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Project title is required." });
    }

    if (!coverImage || !coverImage.trim()) {
      return res.status(400).json({ success: false, message: "Cover artwork is required." });
    }

    const newProject = new Project({
      creatorId,
      title: title.trim(),
      projectCode: projectCode || "PRJ-" + Math.floor(1000 + Math.random() * 9000),
      tagline: tagline ? tagline.trim() : "",
      category: category || "AI Video & Film",
      coverImage: coverImage.trim(),
      mediaUrl: mediaUrl ? mediaUrl.trim() : "",
      projectUrl: projectUrl ? projectUrl.trim() : "",
      status: status || "in_progress",
      priority: priority || "medium",
      phase: phase || "Pre-Production",
      progress: Number(progress) || 10,
      client: client ? client.trim() : "Self-Initiated",
      budget: Number(budget) || 0,
      spent: Number(spent) || 0,
      deadline: deadline || "2026-10-31",
      startDate: startDate || new Date().toISOString().split("T")[0],
      milestones: Array.isArray(milestones) ? milestones : [],
      tasks: Array.isArray(tasks) ? tasks : [],
      aiTools: Array.isArray(aiTools) ? aiTools : [],
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      renderHours: Number(renderHours) || 0,
      description: description ? description.trim() : "",
      notes: notes ? notes.trim() : "",
    });

    const savedProject = await newProject.save();

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project: savedProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      success: false,
      message: "Server error creating project.",
      error: error.message,
    });
  }
};

/**
 * @desc Update an existing production project
 * @route PUT /api/creator/projects/:id
 * @access Protected (Creator)
 */
const updateProject = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    const { id } = req.params;

    const project = await Project.findOne({ _id: id, creatorId });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found or not owned by you." });
    }

    const updatableFields = [
      "title",
      "projectCode",
      "tagline",
      "category",
      "coverImage",
      "mediaUrl",
      "projectUrl",
      "status",
      "priority",
      "phase",
      "progress",
      "client",
      "budget",
      "spent",
      "deadline",
      "startDate",
      "milestones",
      "tasks",
      "aiTools",
      "deliverables",
      "renderHours",
      "description",
      "notes",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    // Auto-complete status if progress is 100%
    if (Number(project.progress) >= 100 && project.status !== "completed") {
      project.status = "completed";
      project.phase = "Final Delivery";
    }

    const updated = await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      project: updated,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating project.",
      error: error.message,
    });
  }
};

/**
 * @desc Quick-patch project progress and phase
 * @route PATCH /api/creator/projects/:id/progress
 * @access Protected (Creator)
 */
const updateProjectProgress = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    const { id } = req.params;
    const { progress, phase, status } = req.body;

    const project = await Project.findOne({ _id: id, creatorId });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    if (progress !== undefined) project.progress = Math.min(100, Math.max(0, Number(progress)));
    if (phase !== undefined) project.phase = phase;
    if (status !== undefined) project.status = status;

    if (project.progress === 100) {
      project.status = "completed";
      project.phase = "Final Delivery";
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project progress updated.",
      project,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating progress.",
      error: error.message,
    });
  }
};

/**
 * @desc Delete project (soft or hard)
 * @route DELETE /api/creator/projects/:id
 * @access Protected (Creator)
 */
const deleteProject = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    const { id } = req.params;

    const deleted = await Project.findOneAndDelete({ _id: id, creatorId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Project not found or already removed." });
    }

    return res.status(200).json({
      success: true,
      message: "Project removed from studio successfully.",
      id,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({
      success: false,
      message: "Server error deleting project.",
      error: error.message,
    });
  }
};

/**
 * @desc Explicitly re-seed sample projects data
 * @route POST /api/creator/projects/seed
 * @access Protected (Creator)
 */
const seedProjectsData = async (req, res) => {
  try {
    const creatorId = req.creator._id;

    // Remove existing
    await Project.deleteMany({ creatorId });

    // Seed default sample projects
    const seeded = SAMPLE_PROJECTS.map((proj) => ({
      ...proj,
      creatorId,
    }));
    const inserted = await Project.insertMany(seeded);

    return res.status(200).json({
      success: true,
      message: `Seeded ${inserted.length} high-fidelity studio projects successfully.`,
      projects: inserted,
    });
  } catch (error) {
    console.error("Error seeding projects:", error);
    return res.status(500).json({
      success: false,
      message: "Server error seeding projects.",
      error: error.message,
    });
  }
};

module.exports = {
  getProjectsOverview,
  createProject,
  updateProject,
  updateProjectProgress,
  deleteProject,
  seedProjectsData,
};
