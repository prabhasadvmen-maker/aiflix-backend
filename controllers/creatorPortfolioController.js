const PortfolioItem = require("../models/portfolioModel");
const Creator = require("../models/creatorModel");

// Default initial high-quality showcase projects for creators
const SAMPLE_PORTFOLIO_ITEMS = [
  {
    title: "NEO-TOKYO 2088: Synthetic Rebirth",
    tagline: "A cinematic sci-fi trailer exploring sentient android consciousness in 8K resolution.",
    category: "AI Short Film",
    mediaType: "video",
    coverImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Generated using a hybrid pipeline of Runway Gen-3 Alpha for camera motions, Midjourney v6 for keyframe styling, and ElevenLabs for voice synthesis. Explores the line between synthetic identity and human emotion in a dystopian megacity.",
    aiTools: ["Runway Gen-3", "Midjourney v6", "ElevenLabs", "Topaz Video AI"],
    client: "Cybernetic Studios",
    completionDate: "August 2026",
    projectUrl: "https://youtube.com",
    views: 28400,
    likes: 2150,
    isFeatured: true,
    status: "published",
    tags: ["cyberpunk", "cinematic", "sci-fi", "virtual-production"],
  },
  {
    title: "CHRONO-SPHERE: Dimensional Drift",
    tagline: "Ultra-stylized 3D anime action sequence featuring temporal warp visual effects.",
    category: "3D Animation",
    mediaType: "video",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "Blender 4.2 geometric nodes combined with Stable Diffusion XL controlnets for anime line-art enhancement. Features full custom sound design and physics-based particle destruction.",
    aiTools: ["Blender 4.2", "SDXL ControlNet", "ComfyUI", "DaVinci Resolve Studio"],
    client: "Anima Global",
    completionDate: "July 2026",
    projectUrl: "https://vimeo.com",
    views: 19800,
    likes: 1640,
    isFeatured: true,
    status: "published",
    tags: ["anime", "temporal", "stylized", "vfx"],
  },
  {
    title: "ASTRAL ODYSSEY: Deep Space Leviathans",
    tagline: "Bioluminescent space creature concept art collection & environment worldbuilding.",
    category: "Concept Art",
    mediaType: "image",
    coverImage: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80",
    mediaUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=90",
    description: "Multi-layered environmental matte paintings for a space exploration franchise. Employs advanced custom LoRA weights trained on deep sea bioluminescence and cosmic nebula photography.",
    aiTools: ["Midjourney v6.1", "Adobe Photoshop Generative Fill", "Custom LoRA"],
    client: "Starbound Entertainment",
    completionDate: "June 2026",
    projectUrl: "https://artstation.com",
    views: 14200,
    likes: 980,
    isFeatured: false,
    status: "published",
    tags: ["creature-design", "matte-painting", "space", "bioluminescence"],
  },
  {
    title: "CYBER-LOTUS: Metamorphosis CGI",
    tagline: "High-fashion CGI brand commercial with procedural metallic fluid simulation.",
    category: "VFX & CGI",
    mediaType: "video",
    coverImage: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=80",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "Spec commercial developed for luxury tech brand Cyber-Lotus. Real-time Unreal Engine 5.4 Nanite and Lumen lighting system augmented with Sora generative transitions.",
    aiTools: ["Unreal Engine 5.4", "OpenAI Sora", "Substance Painter", "Houdini FX"],
    client: "Lotus Haute Tech",
    completionDate: "September 2026",
    projectUrl: "https://behance.net",
    views: 31200,
    likes: 2790,
    isFeatured: true,
    status: "published",
    tags: ["commercial", "procedural", "fashion", "luxury-tech"],
  },
  {
    title: "NEURAL SYMPHONY: Brainwave Resonances",
    tagline: "Generative ambient electronic score and interactive audiovisual reactive canvas.",
    category: "Generative Audio",
    mediaType: "audio",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80",
    mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    description: "Full 12-track ambient electronic score synthesized with Suno v3.5 and Udio, mastered with iZotope Ozone 11 AI mastering suite. Accompanied by real-time TouchDesigner audio visualizer.",
    aiTools: ["Suno v3.5", "Udio AI", "TouchDesigner", "iZotope Ozone 11"],
    client: "Self-Initiated",
    completionDate: "May 2026",
    projectUrl: "https://soundcloud.com",
    views: 8900,
    likes: 740,
    isFeatured: false,
    status: "published",
    tags: ["audio", "generative-soundtrack", "ambient", "suno"],
  },
  {
    title: "HYPER-DRIFT: Autonomous Hypercar Spec",
    tagline: "Adrenaline-fueled automotive showcase for next-gen electric hypercars.",
    category: "Commercial / Brand",
    mediaType: "video",
    coverImage: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200&auto=format&fit=crop&q=80",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    description: "Cinematic commercial blending CAD model renders with Luma Dream Machine camera moves. Dynamic rain physics and tire smoke simulations composited in Nuke.",
    aiTools: ["Luma Dream Machine", "Autodesk Maya", "Foundry Nuke", "Kling AI"],
    client: "Veloce Hypercars",
    completionDate: "August 2026",
    projectUrl: "https://youtube.com",
    views: 22100,
    likes: 1850,
    isFeatured: false,
    status: "published",
    tags: ["automotive", "hypercar", "speed", "commercial"],
  },
  {
    title: "SYNTHETIC MEMORIES: Lost Archive 04",
    tagline: "Experimental archival docufiction recounting human history through synthetic dreams.",
    category: "Case Study",
    mediaType: "video",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    description: "Detailed production case study documenting a 30-day AI film sprint. Includes full breakdown of prompt structuring, seed consistency techniques, and character face-locking.",
    aiTools: ["Midjourney v6", "FaceFusion", "Magnific AI", "Premiere Pro"],
    client: "AI Film Festival 2026",
    completionDate: "June 2026",
    projectUrl: "https://medium.com",
    views: 16500,
    likes: 1420,
    isFeatured: true,
    status: "published",
    tags: ["case-study", "workflow", "docufiction", "production-notes"],
  },
  {
    title: "QUANTUM RELIC: The Vault of Echoes",
    tagline: "Work-in-progress concept trailer for upcoming interactive VR game.",
    category: "3D Animation",
    mediaType: "video",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Early teaser demonstrating procedural asset generation in Houdini with neural texture upscaling. Features experimental raymarched volumetric nebulae.",
    aiTools: ["Houdini", "Runway Gen-3", "Magnific AI", "Unreal Engine 5.4"],
    client: "Echo VR Interactive",
    completionDate: "Upcoming (Q4 2026)",
    projectUrl: "",
    views: 4300,
    likes: 310,
    isFeatured: false,
    status: "draft",
    tags: ["vr", "game-dev", "unreal-engine", "draft"],
  },
];

// Helper: Seed initial items if collection is empty for creator
const autoSeedIfEmpty = async (creatorId) => {
  const count = await PortfolioItem.countDocuments({ creatorId });
  if (count === 0) {
    const itemsToInsert = SAMPLE_PORTFOLIO_ITEMS.map((item) => ({
      ...item,
      creatorId,
    }));
    await PortfolioItem.insertMany(itemsToInsert);
  }
};

/**
 * 1. GET /api/creator/portfolio
 * Fetches portfolio items with search, category filter, status filter, sort & KPIs
 */
exports.getPortfolioOverview = async (req, res) => {
  try {
    const creatorId = req.creator._id;

    // Ensure creator has data
    await autoSeedIfEmpty(creatorId);

    const {
      search = "",
      category = "All",
      status = "All",
      sort = "newest",
      page = 1,
      limit = 24,
    } = req.query;

    // Build filter query
    const query = { creatorId };

    if (category && category !== "All") {
      query.category = category;
    }

    if (status && status !== "All") {
      if (status === "featured") {
        query.isFeatured = true;
      } else {
        query.status = status;
      }
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { title: { $regex: s, $options: "i" } },
        { tagline: { $regex: s, $options: "i" } },
        { description: { $regex: s, $options: "i" } },
        { client: { $regex: s, $options: "i" } },
        { aiTools: { $elemMatch: { $regex: s, $options: "i" } } },
      ];
    }

    // Determine sort
    let sortObj = { createdAt: -1 };
    if (sort === "views") sortObj = { views: -1 };
    else if (sort === "likes") sortObj = { likes: -1 };
    else if (sort === "title") sortObj = { title: 1 };
    else if (sort === "oldest") sortObj = { createdAt: 1 };

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 24));
    const skip = (pageNum - 1) * limitNum;

    // Execute queries
    const [items, totalFiltered, allItems] = await Promise.all([
      PortfolioItem.find(query).sort(sortObj).skip(skip).limit(limitNum).lean(),
      PortfolioItem.countDocuments(query),
      PortfolioItem.find({ creatorId }).select("views likes isFeatured status category aiTools").lean(),
    ]);

    // Calculate dynamic KPIs
    const totalProjects = allItems.length;
    const totalViews = allItems.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalLikes = allItems.reduce((acc, curr) => acc + (curr.likes || 0), 0);
    const featuredCount = allItems.filter((i) => i.isFeatured).length;
    const publishedCount = allItems.filter((i) => i.status === "published").length;
    const draftCount = allItems.filter((i) => i.status === "draft").length;

    // Calculate category distribution counts
    const categoryCounts = { All: totalProjects };
    const allCategories = [
      "AI Short Film",
      "3D Animation",
      "VFX & CGI",
      "Concept Art",
      "Generative Audio",
      "Commercial / Brand",
      "Case Study",
    ];

    allCategories.forEach((cat) => {
      categoryCounts[cat] = allItems.filter((i) => i.category === cat).length;
    });

    // Determine top tool used
    const toolFrequency = {};
    allItems.forEach((item) => {
      if (Array.isArray(item.aiTools)) {
        item.aiTools.forEach((t) => {
          toolFrequency[t] = (toolFrequency[t] || 0) + 1;
        });
      }
    });

    let topTool = "Runway Gen-3";
    let maxFreq = 0;
    Object.entries(toolFrequency).forEach(([tool, freq]) => {
      if (freq > maxFreq) {
        maxFreq = freq;
        topTool = tool;
      }
    });

    return res.status(200).json({
      success: true,
      kpis: {
        totalProjects,
        totalViews,
        totalLikes,
        featuredCount,
        publishedCount,
        draftCount,
        topTool,
      },
      categoryCounts,
      items,
      pagination: {
        total: totalFiltered,
        page: pageNum,
        pages: Math.ceil(totalFiltered / limitNum) || 1,
        limit: limitNum,
      },
      creator: {
        name: req.creator.name,
        username: req.creator.username,
        email: req.creator.email,
        bio: req.creator.bio || "AI Cinematographer & Virtual Production Specialist",
        brandName: req.creator.brandName || "AIflix Creator Studio",
        category: req.creator.category || "AI Film & Animation",
        profileImage: req.creator.profileImage,
        portfolioUrl: req.creator.portfolio,
      },
    });
  } catch (error) {
    console.error("Get Portfolio Overview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load creator portfolio data.",
      error: error.message,
    });
  }
};

/**
 * 2. POST /api/creator/portfolio
 * Creates a new portfolio item
 */
exports.createPortfolioItem = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    const {
      title,
      tagline,
      category,
      mediaType,
      coverImage,
      mediaUrl,
      description,
      aiTools,
      client,
      completionDate,
      projectUrl,
      isFeatured,
      status,
      tags,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Project title is required." });
    }

    if (!coverImage || !coverImage.trim()) {
      return res.status(400).json({ success: false, message: "Cover image URL is required." });
    }

    // Process tools array
    let processedTools = [];
    if (Array.isArray(aiTools)) {
      processedTools = aiTools.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof aiTools === "string" && aiTools.trim()) {
      processedTools = aiTools.split(",").map((t) => t.trim()).filter(Boolean);
    }

    // Process tags array
    let processedTags = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof tags === "string" && tags.trim()) {
      processedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    const newItem = await PortfolioItem.create({
      creatorId,
      title: title.trim(),
      tagline: tagline ? tagline.trim() : "",
      category: category || "AI Short Film",
      mediaType: mediaType || "video",
      coverImage: coverImage.trim(),
      mediaUrl: mediaUrl ? mediaUrl.trim() : "",
      description: description ? description.trim() : "",
      aiTools: processedTools,
      client: client ? client.trim() : "Self-Initiated",
      completionDate: completionDate ? completionDate.trim() : new Date().getFullYear().toString(),
      projectUrl: projectUrl ? projectUrl.trim() : "",
      views: 0,
      likes: 0,
      isFeatured: Boolean(isFeatured),
      status: status || "published",
      tags: processedTags,
    });

    return res.status(201).json({
      success: true,
      message: "Portfolio project created successfully.",
      item: newItem,
    });
  } catch (error) {
    console.error("Create Portfolio Item Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create portfolio item.",
    });
  }
};

/**
 * 3. PUT /api/creator/portfolio/:id
 * Updates an existing portfolio item
 */
exports.updatePortfolioItem = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    const { id } = req.params;

    const item = await PortfolioItem.findOne({ _id: id, creatorId });
    if (!item) {
      return res.status(404).json({ success: false, message: "Project not found or unauthorized." });
    }

    const {
      title,
      tagline,
      category,
      mediaType,
      coverImage,
      mediaUrl,
      description,
      aiTools,
      client,
      completionDate,
      projectUrl,
      isFeatured,
      status,
      tags,
      views,
      likes,
    } = req.body;

    if (title) item.title = title.trim();
    if (tagline !== undefined) item.tagline = tagline.trim();
    if (category) item.category = category;
    if (mediaType) item.mediaType = mediaType;
    if (coverImage) item.coverImage = coverImage.trim();
    if (mediaUrl !== undefined) item.mediaUrl = mediaUrl.trim();
    if (description !== undefined) item.description = description.trim();
    if (client !== undefined) item.client = client.trim();
    if (completionDate !== undefined) item.completionDate = completionDate.trim();
    if (projectUrl !== undefined) item.projectUrl = projectUrl.trim();
    if (isFeatured !== undefined) item.isFeatured = Boolean(isFeatured);
    if (status) item.status = status;
    if (views !== undefined) item.views = Math.max(0, parseInt(views, 10) || 0);
    if (likes !== undefined) item.likes = Math.max(0, parseInt(likes, 10) || 0);

    if (aiTools !== undefined) {
      if (Array.isArray(aiTools)) {
        item.aiTools = aiTools.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof aiTools === "string") {
        item.aiTools = aiTools.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        item.tags = tags.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof tags === "string") {
        item.tags = tags.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }

    await item.save();

    return res.status(200).json({
      success: true,
      message: "Portfolio project updated successfully.",
      item,
    });
  } catch (error) {
    console.error("Update Portfolio Item Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update portfolio project.",
    });
  }
};

/**
 * 4. DELETE /api/creator/portfolio/:id
 * Removes a portfolio item
 */
exports.deletePortfolioItem = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    const { id } = req.params;

    const deleted = await PortfolioItem.findOneAndDelete({ _id: id, creatorId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Project not found or unauthorized." });
    }

    return res.status(200).json({
      success: true,
      message: "Portfolio project removed successfully.",
      deletedId: id,
    });
  } catch (error) {
    console.error("Delete Portfolio Item Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete portfolio project.",
    });
  }
};

/**
 * 5. PATCH /api/creator/portfolio/:id/toggle-featured
 * Toggles the featured spotlight status of a project
 */
exports.toggleFeaturedItem = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    const { id } = req.params;

    const item = await PortfolioItem.findOne({ _id: id, creatorId });
    if (!item) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    item.isFeatured = !item.isFeatured;
    await item.save();

    return res.status(200).json({
      success: true,
      message: item.isFeatured ? "Project pinned as Featured!" : "Project unpinned from Featured.",
      isFeatured: item.isFeatured,
      item,
    });
  } catch (error) {
    console.error("Toggle Featured Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle featured status.",
    });
  }
};

/**
 * 6. POST /api/creator/portfolio/seed
 * Forces re-seeding of realistic demo showcase projects
 */
exports.seedPortfolioData = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    const { overwrite = false } = req.body;

    if (overwrite) {
      await PortfolioItem.deleteMany({ creatorId });
    }

    const count = await PortfolioItem.countDocuments({ creatorId });
    if (count > 0 && !overwrite) {
      return res.status(200).json({
        success: true,
        message: `Portfolio already contains ${count} projects. Set overwrite: true to re-seed.`,
        count,
      });
    }

    const itemsToInsert = SAMPLE_PORTFOLIO_ITEMS.map((item) => ({
      ...item,
      creatorId,
    }));

    const inserted = await PortfolioItem.insertMany(itemsToInsert);

    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${inserted.length} cinematic portfolio projects into MongoDB Atlas!`,
      count: inserted.length,
      items: inserted,
    });
  } catch (error) {
    console.error("Seed Portfolio Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to seed portfolio data.",
    });
  }
};
