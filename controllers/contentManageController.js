const Content = require("../models/contentModel");

// Sample initial AIflix OTT titles for auto-seeding if collection is empty
const INITIAL_SEED_CONTENT = [
  {
    title: "Cyberpunk 2099: Neon Dawn",
    description: "In the rain-slicked sprawl of Neo-Tokyo, a rogue AI detective uncovers a corporate conspiracy that threatens the boundary between human consciousness and synthetic reality.",
    type: "movie",
    category: "Cyberpunk",
    genres: ["Cyberpunk", "Sci-Fi", "Action", "Neo-Noir"],
    tags: ["AI Cinema", "Sora", "Cyberpunk", "Future"],
    thumbnailUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: "1h 48m",
    releaseYear: 2026,
    maturityRating: "16+",
    status: "published",
    isFeatured: true,
    isTrending: true,
    viewsCount: 284500,
    likesCount: 19400,
    creatorName: "Aether AI Studios",
    aiToolsUsed: ["OpenAI Sora", "Midjourney v6", "Runway Gen-3", "ElevenLabs"],
    accessType: "free",
  },
  {
    title: "The Neural Horizon",
    description: "An evocative psychological journey inside an orbital quantum station where human memories are harvested and re-rendered into virtual celestial landscapes.",
    type: "short",
    category: "Sci-Fi",
    genres: ["Sci-Fi", "Drama", "Mystery"],
    tags: ["Short Film", "Quantum", "Visual Poetry"],
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: "18m",
    releaseYear: 2026,
    maturityRating: "PG-13",
    status: "published",
    isFeatured: true,
    isTrending: false,
    viewsCount: 142100,
    likesCount: 11200,
    creatorName: "Nexus Vision Lab",
    aiToolsUsed: ["Runway Gen-3", "Luma Dream Machine", "ElevenLabs"],
    accessType: "free",
  },
  {
    title: "Chronicles of Aethelgard: The Ashen King",
    description: "Episode 1: The Shattered Citadel. Ancient magic resurfaces in a shattered high-fantasy realm as forgotten stone guardians awaken to face the obsidian blight.",
    type: "series",
    category: "Fantasy",
    genres: ["Fantasy", "Epic Adventure", "Dark Fantasy"],
    tags: ["Web Series", "Fantasy", "Lore", "Dragons"],
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: "45m / ep",
    releaseYear: 2026,
    maturityRating: "16+",
    status: "published",
    isFeatured: true,
    isTrending: true,
    viewsCount: 389000,
    likesCount: 31000,
    creatorName: "MythicForge AI",
    aiToolsUsed: ["Midjourney v6", "Kling AI", "Hailuo AI", "ElevenLabs"],
    accessType: "premium",
  },
  {
    title: "Synthetic Dreams: Project Neo",
    description: "A breathless anime-infused cyberpunk animation following a pilot fleeing through underground bio-domes with an unauthorized conscious machine core.",
    type: "animation",
    category: "Anime",
    genres: ["Anime", "Animation", "Action", "Mecha"],
    tags: ["Anime", "Cyberpunk", "Animation", "Action"],
    thumbnailUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    duration: "32m",
    releaseYear: 2026,
    maturityRating: "13+",
    status: "published",
    isFeatured: false,
    isTrending: true,
    viewsCount: 198000,
    likesCount: 16500,
    creatorName: "Tokyo AI Animation Collective",
    aiToolsUsed: ["ComfyUI", "Animatediff", "OpenAI Sora"],
    accessType: "free",
  },
  {
    title: "Quantum Echoes: The Silent Signal",
    description: "Deep-space scientific exploration vessel Echo-7 intercepts a repeating biological heartbeat emanating from the accretion disk of a dormant black hole.",
    type: "movie",
    category: "Sci-Fi",
    genres: ["Sci-Fi", "Cosmic Horror", "Mystery"],
    tags: ["Deep Space", "Black Hole", "Cosmic Horror"],
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    duration: "1h 35m",
    releaseYear: 2026,
    maturityRating: "16+",
    status: "published",
    isFeatured: false,
    isTrending: false,
    viewsCount: 112000,
    likesCount: 8400,
    creatorName: "Starlight Digital AI",
    aiToolsUsed: ["Runway Gen-3", "Luma Dream Machine", "Midjourney"],
    accessType: "free",
  },
  {
    title: "Architects of the Infinite Mind",
    description: "A visionary docuseries exploring the real AI creators, mathematicians, and visual artists pioneering generative cinema and real-time world generation.",
    type: "documentary",
    category: "Documentary",
    genres: ["Documentary", "Tech", "Culture"],
    tags: ["Documentary", "AI Revolution", "Creators"],
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    duration: "52m",
    releaseYear: 2026,
    maturityRating: "All",
    status: "pending",
    isFeatured: false,
    isTrending: false,
    viewsCount: 45000,
    likesCount: 3900,
    creatorName: "DocuLab AI",
    aiToolsUsed: ["ElevenLabs", "Pika 2.0", "Midjourney v6"],
    accessType: "free",
  },
];

// Helper: Ensure sample titles exist
const ensureSeedContent = async () => {
  try {
    const count = await Content.countDocuments();
    if (count === 0) {
      await Content.insertMany(INITIAL_SEED_CONTENT);
      console.log(`[SEED CONTENT] Successfully seeded ${INITIAL_SEED_CONTENT.length} initial AIflix titles.`);
    }
  } catch (err) {
    console.warn("[SEED CONTENT] Seed check error:", err.message);
  }
};

// 1. GET /api/superadmin/content - List content with search, filters, sorting & stats
const getContent = async (req, res) => {
  try {
    await ensureSeedContent();

    const {
      page = 1,
      limit = 12,
      search = "",
      type = "all",
      status = "all",
      category = "all",
      sort = "newest",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    // Search by title, description, or creator
    if (search && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { description: { $regex: escaped, $options: "i" } },
        { creatorName: { $regex: escaped, $options: "i" } },
        { category: { $regex: escaped, $options: "i" } },
      ];
    }

    // Type filter
    if (type && type !== "all") {
      filter.type = type;
    }

    // Status filter
    if (status && status !== "all") {
      filter.status = status;
    }

    // Category filter
    if (category && category !== "all") {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // Sort order
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "most_viewed") sortOption = { viewsCount: -1 };
    if (sort === "most_liked") sortOption = { likesCount: -1 };
    if (sort === "title_asc") sortOption = { title: 1 };
    if (sort === "title_desc") sortOption = { title: -1 };

    // Parallel queries
    const [
      contentList,
      totalFiltered,
      totalAll,
      totalPublished,
      totalPending,
      totalDraft,
      moviesCount,
      shortsCount,
      seriesCount,
      viewsAggregation,
    ] = await Promise.all([
      Content.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Content.countDocuments(filter),
      Content.countDocuments(),
      Content.countDocuments({ status: "published" }),
      Content.countDocuments({ status: "pending" }),
      Content.countDocuments({ status: "draft" }),
      Content.countDocuments({ type: "movie" }),
      Content.countDocuments({ type: "short" }),
      Content.countDocuments({ type: "series" }),
      Content.aggregate([
        { $group: { _id: null, totalViews: { $sum: "$viewsCount" }, totalLikes: { $sum: "$likesCount" } } },
      ]),
    ]);

    const totalPages = Math.ceil(totalFiltered / limitNum) || 1;
    const totalViews = viewsAggregation.length > 0 ? viewsAggregation[0].totalViews : 0;
    const totalLikes = viewsAggregation.length > 0 ? viewsAggregation[0].totalLikes : 0;

    res.status(200).json({
      success: true,
      content: contentList,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalFiltered,
        totalPages,
      },
      stats: {
        total: totalAll,
        published: totalPublished,
        pending: totalPending,
        draft: totalDraft,
        totalViews,
        totalLikes,
        moviesCount,
        shortsCount,
        seriesCount,
      },
    });
  } catch (error) {
    console.error("Get content error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET /api/superadmin/content/:id - Get single content title
const getContentById = async (req, res) => {
  try {
    const item = await Content.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Content title not found." });
    }
    res.status(200).json({ success: true, content: item });
  } catch (error) {
    console.error("Get content by ID error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. POST /api/superadmin/content - Create new content title
const createContent = async (req, res) => {
  try {
    const {
      title,
      description,
      type = "movie",
      category = "Sci-Fi",
      genres = [],
      tags = [],
      thumbnailUrl = "",
      bannerUrl = "",
      videoUrl = "",
      trailerUrl = "",
      duration = "1h 30m",
      releaseYear = 2026,
      maturityRating = "PG-13",
      status = "published",
      isFeatured = false,
      isTrending = false,
      creatorName = "AIflix Studio",
      aiToolsUsed = [],
      accessType = "free",
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required." });
    }

    const newItem = await Content.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      type,
      category: category ? category.trim() : "Sci-Fi",
      genres: Array.isArray(genres) ? genres : genres.split(",").map((s) => s.trim()).filter(Boolean),
      tags: Array.isArray(tags) ? tags : tags.split(",").map((s) => s.trim()).filter(Boolean),
      thumbnailUrl: thumbnailUrl.trim() || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
      bannerUrl: bannerUrl.trim(),
      videoUrl: videoUrl.trim(),
      trailerUrl: trailerUrl.trim(),
      duration: duration.trim() || "1h 30m",
      releaseYear: Number(releaseYear) || 2026,
      maturityRating,
      status,
      isFeatured: Boolean(isFeatured),
      isTrending: Boolean(isTrending),
      creatorName: creatorName.trim() || "AIflix Studio",
      aiToolsUsed: Array.isArray(aiToolsUsed)
        ? aiToolsUsed
        : aiToolsUsed.split(",").map((s) => s.trim()).filter(Boolean),
      accessType,
      viewsCount: 0,
      likesCount: 0,
    });

    res.status(201).json({
      success: true,
      message: `Content "${newItem.title}" created successfully.`,
      content: newItem,
    });
  } catch (error) {
    console.error("Create content error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. PUT /api/superadmin/content/:id - Update content title
const updateContent = async (req, res) => {
  try {
    const item = await Content.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Content title not found." });
    }

    const fields = [
      "title",
      "description",
      "type",
      "category",
      "thumbnailUrl",
      "bannerUrl",
      "videoUrl",
      "trailerUrl",
      "duration",
      "releaseYear",
      "maturityRating",
      "status",
      "isFeatured",
      "isTrending",
      "creatorName",
      "accessType",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    if (req.body.genres !== undefined) {
      item.genres = Array.isArray(req.body.genres)
        ? req.body.genres
        : req.body.genres.split(",").map((s) => s.trim()).filter(Boolean);
    }

    if (req.body.tags !== undefined) {
      item.tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : req.body.tags.split(",").map((s) => s.trim()).filter(Boolean);
    }

    if (req.body.aiToolsUsed !== undefined) {
      item.aiToolsUsed = Array.isArray(req.body.aiToolsUsed)
        ? req.body.aiToolsUsed
        : req.body.aiToolsUsed.split(",").map((s) => s.trim()).filter(Boolean);
    }

    await item.save();

    res.status(200).json({
      success: true,
      message: `Content "${item.title}" updated successfully.`,
      content: item,
    });
  } catch (error) {
    console.error("Update content error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. PATCH /api/superadmin/content/:id/publish - Quick publish/unpublish toggle
const togglePublishStatus = async (req, res) => {
  try {
    const item = await Content.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Content title not found." });
    }

    item.status = item.status === "published" ? "draft" : "published";
    await item.save();

    res.status(200).json({
      success: true,
      message: `"${item.title}" is now ${item.status === "published" ? "Live / Published" : "Unpublished / Draft"}.`,
      status: item.status,
      content: item,
    });
  } catch (error) {
    console.error("Toggle publish status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. PATCH /api/superadmin/content/:id/featured - Quick featured toggle
const toggleFeaturedStatus = async (req, res) => {
  try {
    const item = await Content.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Content title not found." });
    }

    item.isFeatured = !item.isFeatured;
    await item.save();

    res.status(200).json({
      success: true,
      message: `"${item.title}" is now ${item.isFeatured ? "Featured" : "Regular"} title.`,
      isFeatured: item.isFeatured,
      content: item,
    });
  } catch (error) {
    console.error("Toggle featured status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. DELETE /api/superadmin/content/:id - Delete content title
const deleteContent = async (req, res) => {
  try {
    const item = await Content.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Content title not found." });
    }

    res.status(200).json({
      success: true,
      message: `Content "${item.title}" deleted successfully.`,
    });
  } catch (error) {
    console.error("Delete content error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getContent,
  getContentById,
  createContent,
  updateContent,
  togglePublishStatus,
  toggleFeaturedStatus,
  deleteContent,
};
