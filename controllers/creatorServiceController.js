const Service = require("../models/serviceModel");
const Creator = require("../models/creatorModel");

// Default initial high-value creator services
const SAMPLE_SERVICES = [
  {
    title: "Full 4K AI Cinema Trailer & Storyboard",
    tagline: "Broadcast-grade cinematic trailer generated with Runway Gen-3 & Sora pipelines.",
    category: "AI Video & Film",
    coverImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
    startingPrice: 499,
    deliveryDays: 4,
    revisions: 3,
    pricingTiers: [
      {
        name: "Basic",
        price: 499,
        deliveryDays: 4,
        revisions: 2,
        description: "30-second teaser trailer, 1080p master, stereo audio mix.",
        features: ["30s Video Runtime", "1080p FHD Export", "Sound Design & VO", "2 Revision Rounds"],
      },
      {
        name: "Standard",
        price: 899,
        deliveryDays: 6,
        revisions: 4,
        description: "60-second cinematic trailer, 4K Pro-Res, custom storyboard PDF & character prompt blueprints.",
        features: ["60s Video Runtime", "4K Pro-Res Master", "Full Storyboard PDF", "ElevenLabs Custom Voiceover", "4 Revision Rounds"],
      },
      {
        name: "Premium",
        price: 1499,
        deliveryDays: 10,
        revisions: -1,
        description: "90-second festival-grade cinematic trailer, 8K Topaz upscaled, multi-track audio stems & commercial buyout.",
        features: ["90s Video Runtime", "8K Neural Upscale", "Multi-track Audio Stems", "Full Commercial Rights", "Unlimited Revisions"],
      },
    ],
    description: "I will direct and produce a Hollywood-grade cinematic trailer using the industry's most advanced AI video models (Runway Gen-3 Alpha, Sora, Midjourney v6). Includes script polish, prompt engineering, continuity locking, camera motion stabilization, and professional sound design.",
    deliverables: ["4K Pro-Res Master Video", "Social Media Cuts (9:16 & 1:1)", "Custom Storyboard Deck", "Prompt Architecture Blueprint"],
    aiTools: ["Runway Gen-3", "OpenAI Sora", "Midjourney v6", "ElevenLabs", "Topaz Video AI", "DaVinci Resolve"],
    faq: [
      { question: "Can I provide my own script or concept?", answer: "Yes! You can share your treatment, logline, or script. We will adapt it into shot-by-shot AI keyframes." },
      { question: "Are commercial rights included?", answer: "Yes, all final render assets include full commercial broadcast and streaming licenses." },
    ],
    rating: 4.96,
    reviewsCount: 38,
    ordersCompleted: 42,
    inProgressOrders: 3,
    status: "active",
    isFeatured: true,
    tags: ["trailer", "cinema", "sci-fi", "runway", "sora"],
  },
  {
    title: "Custom 3D Character Rigging & Neural Animation",
    tagline: "Ultra-detailed 3D game & film character creation with facial capture blendshapes.",
    category: "3D & Animation",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    startingPrice: 349,
    deliveryDays: 5,
    revisions: 3,
    pricingTiers: [
      {
        name: "Basic",
        price: 349,
        deliveryDays: 5,
        revisions: 2,
        description: "Low-poly stylized character model with basic skeletal rig.",
        features: ["Single Character Mesh", "Basic FK/IK Rig", "Diffuse Textures", "FBX Export"],
      },
      {
        name: "Standard",
        price: 699,
        deliveryDays: 7,
        revisions: 3,
        description: "High-poly character with 52 ARKit facial blendshapes, 4K PBR textures, ready for Unreal Engine 5.",
        features: ["High-Poly Nanite Mesh", "ARKit Facial Rig", "4K PBR Texture Suite", "UE5 Control Rig"],
      },
      {
        name: "Premium",
        price: 1199,
        deliveryDays: 12,
        revisions: 5,
        description: "Full cinematic character with dynamic cloth/hair physics, custom motion capture integration & 3 action animations.",
        features: ["Cinematic Quality Mesh", "Cloth & Groom Physics", "3 Custom Animations", "Mocap Data Cleaned", "Source Blender & Maya Files"],
      },
    ],
    description: "End-to-end 3D character pipeline using Blender 4.2 and Unreal Engine 5.4. Optimized for real-time virtual production, game development, and cinematic CGI renders.",
    deliverables: ["FBX / USD Character Asset", "Unreal Engine 5.4 Project File", "4K Substance PBR Textures", "Blendshape Calibration File"],
    aiTools: ["Blender 4.2", "Unreal Engine 5.4", "Substance 3D", "Character Creator 4", "ComfyUI"],
    faq: [
      { question: "Can the character be used in Unreal Engine 5?", answer: "Yes, fully rigged to the standard UE5 Mannequin skeleton with Lumen & Nanite support." },
    ],
    rating: 4.92,
    reviewsCount: 29,
    ordersCompleted: 31,
    inProgressOrders: 2,
    status: "active",
    isFeatured: true,
    tags: ["3d", "character", "animation", "unreal-engine", "rigging"],
  },
  {
    title: "Hyper-Realistic Voice Cloning & Multi-Language Dubbing",
    tagline: "Natural voice cloning, accent localization & lip-synced video dubbing in 28 languages.",
    category: "Audio & Voice Synthesis",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80",
    startingPrice: 199,
    deliveryDays: 2,
    revisions: 2,
    pricingTiers: [
      {
        name: "Basic",
        price: 199,
        deliveryDays: 2,
        revisions: 2,
        description: "Up to 5 minutes voiceover in 1 language with custom voice cloning.",
        features: ["Up to 5 mins VO", "1 Cloned Voice", "Clean 24-bit WAV", "Commercial Rights"],
      },
      {
        name: "Standard",
        price: 399,
        deliveryDays: 3,
        revisions: 3,
        description: "Up to 15 minutes of video lip-sync dubbing across 3 target languages.",
        features: ["Up to 15 mins Runtime", "3 Languages Dubbed", "AI Lip-Sync Matching", "BGM & SFX Mixing"],
      },
      {
        name: "Premium",
        price: 799,
        deliveryDays: 5,
        revisions: 4,
        description: "Up to 45 minutes multi-character voice cast (up to 5 actors) with broadcast mastering.",
        features: ["Up to 45 mins Audio", "5 Distinct Voices", "Broadcast Mastered", "Timed Dialogue Stems"],
      },
    ],
    description: "Studio-grade neural voice synthesis and automated lip-sync dubbing. We capture voice emotion, cadence, and breath dynamics with ElevenLabs Prime Voice AI and Wav2Lip deep learning models.",
    deliverables: ["24-bit 48kHz WAV Audio Stems", "Lip-Synced MP4 Video Files", "SRT Subtitle Files", "Voice Model Profile"],
    aiTools: ["ElevenLabs", "Sync Labs", "iZotope RX 11", "Pro Tools", "Whisper AI"],
    faq: [
      { question: "What languages are supported?", answer: "English, Spanish, Hindi, French, German, Japanese, Mandarin, Arabic, and 20+ other global languages." },
    ],
    rating: 4.98,
    reviewsCount: 54,
    ordersCompleted: 62,
    inProgressOrders: 4,
    status: "active",
    isFeatured: false,
    tags: ["voiceover", "cloning", "dubbing", "elevenlabs", "lip-sync"],
  },
  {
    title: "Broadcast VFX Compositing & 8K Neural Upscaling",
    tagline: "Professional cleanup, green screen removal, dynamic lighting & 8K neural enhancement.",
    category: "VFX & Compositing",
    coverImage: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=80",
    startingPrice: 279,
    deliveryDays: 3,
    revisions: 2,
    pricingTiers: [
      {
        name: "Basic",
        price: 279,
        deliveryDays: 3,
        revisions: 2,
        description: "3 shots composited: wire removal, clean plate generation & 4K AI upscaling.",
        features: ["3 VFX Shots", "Rotoscoping & Cleanup", "4K Video AI Upscale", "Color Grading"],
      },
      {
        name: "Standard",
        price: 549,
        deliveryDays: 5,
        revisions: 3,
        description: "8 shots composited: camera tracking, CGI element integration & grain matching.",
        features: ["8 VFX Shots", "3D Camera Tracking", "CGI Pass Integration", "8K Neural Upscaling", "LUT Color Profile"],
      },
      {
        name: "Premium",
        price: 999,
        deliveryDays: 8,
        revisions: 5,
        description: "Full sequence (up to 20 shots) complex multi-pass compositing with deep comp and motion blur matching.",
        features: ["Up to 20 Shots", "Deep Compositing", "Complex Fluid / Particle FX", "8K Master Pro-Res 4444XQ", "Full Nuke Script Handover"],
      },
    ],
    description: "Senior visual effects artist specializing in bridging AI generation with classic feature film compositing. Using Foundry Nuke and Topaz Video AI to remove AI artifacts and blend CG elements seamlessly.",
    deliverables: ["ProRes 422 HQ / 4444 Master", "EXR Linear Image Sequences", "Nuke Compositing Scripts", "Shot Breakdown Reel"],
    aiTools: ["Foundry Nuke", "Topaz Video AI 5", "After Effects", "Mocha Pro", "Magnific AI"],
    faq: [
      { question: "Can you upscale blurry AI video renders?", answer: "Yes, we reconstruct sub-pixel detail, remove flicker, and sharpen motion vectors up to 8K DCI." },
    ],
    rating: 4.95,
    reviewsCount: 22,
    ordersCompleted: 26,
    inProgressOrders: 1,
    status: "active",
    isFeatured: true,
    tags: ["vfx", "compositing", "upscale", "topaz", "nuke"],
  },
  {
    title: "Bespoke Style LoRA & Diffusion Model Training",
    tagline: "Custom-trained AI models locked to your brand identity, product line, or character face.",
    category: "Custom AI Model & LoRA",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    startingPrice: 399,
    deliveryDays: 4,
    revisions: 3,
    pricingTiers: [
      {
        name: "Basic",
        price: 399,
        deliveryDays: 4,
        revisions: 2,
        description: "Single Subject/Face LoRA trained on SDXL or Flux.1 with 95%+ likeness consistency.",
        features: ["1 LoRA Model (.safetensors)", "Dataset Curation (30 images)", "Trigger Word Prompt Guide", "10 Sample Verification Renders"],
      },
      {
        name: "Standard",
        price: 749,
        deliveryDays: 6,
        revisions: 4,
        description: "Brand Style or Product LoRA with multi-angle consistency, ComfyUI workflow included.",
        features: ["Full Style / Product LoRA", "Dataset Curation (80 images)", "Custom ComfyUI Workflow JSON", "25 High-Res Render Samples"],
      },
      {
        name: "Premium",
        price: 1399,
        deliveryDays: 10,
        revisions: -1,
        description: "Comprehensive enterprise model package: 3 LoRAs, API integration script, and private weights.",
        features: ["3 Custom LoRAs", "Python Inference Script", "RunPod / Replicate Deployment Guide", "Exclusive Private Weights", "1-on-1 Consultation"],
      },
    ],
    description: "Machine learning fine-tuning for creative agencies and brands. We prepare curated datasets, synthetic regularization images, and train rank-64 LoRA weights on SDXL and Flux.1 architectures.",
    deliverables: [".safetensors Model Weights", "Curated Training Dataset Zip", "ComfyUI Workflow JSON", "Prompt Cheat Sheet"],
    aiTools: ["Flux.1", "SDXL", "Kohya_ss", "ComfyUI", "Python / PyTorch"],
    faq: [
      { question: "How many reference photos do I need to provide?", answer: "For a person or character, 20-30 varied photos. For a product or art style, 40-60 high-res images." },
    ],
    rating: 5.0,
    reviewsCount: 19,
    ordersCompleted: 21,
    inProgressOrders: 1,
    status: "active",
    isFeatured: false,
    tags: ["lora", "flux", "sdxl", "custom-model", "fine-tuning"],
  },
  {
    title: "Sci-Fi Concept Matte Painting & Keyframe Pack",
    tagline: "Production-ready worldbuilding matte paintings & keyframe illustrations for film & games.",
    category: "Concept Art & Matte Painting",
    coverImage: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80",
    startingPrice: 249,
    deliveryDays: 3,
    revisions: 2,
    pricingTiers: [
      {
        name: "Basic",
        price: 249,
        deliveryDays: 3,
        revisions: 2,
        description: "2 widescreen environment concept art pieces (4K resolution).",
        features: ["2 Concept Artworks", "4K Resolution", "Day or Night Lighting", "PSD Layered File"],
      },
      {
        name: "Standard",
        price: 499,
        deliveryDays: 5,
        revisions: 3,
        description: "5 production keyframes with cinematic camera compositions and callout sheets.",
        features: ["5 Cinematic Keyframes", "Camera Callout Sheets", "6K Resolution", "Separated Foreground/Background Layers"],
      },
      {
        name: "Premium",
        price: 899,
        deliveryDays: 8,
        revisions: 4,
        description: "Complete worldbuilding package: 10 keyframes, 2.5D camera projection setup, 8K ultra-res.",
        features: ["10 Keyframe Illustrations", "2.5D Camera Projection Nuke Comp", "8K Resolution", "World Lore Design Document"],
      },
    ],
    description: "Epic environment illustrations combining generative 3D base geometry with digital overpainting and photobashing. Perfect for pitch decks, game pre-production, and film moodboards.",
    deliverables: ["Layered Adobe Photoshop PSDs", "8K High-Res PNG Exports", "Color Palette & Moodboard PDF", "Callout Sheet Details"],
    aiTools: ["Midjourney v6", "Adobe Photoshop", "Blender", "Generative Fill", "Krita"],
    faq: [
      { question: "Can you match my existing project art style?", answer: "Yes, send moodboards or reference art and we will align lighting, palette, and texture density." },
    ],
    rating: 4.9,
    reviewsCount: 33,
    ordersCompleted: 37,
    inProgressOrders: 0,
    status: "active",
    isFeatured: false,
    tags: ["concept-art", "matte-painting", "worldbuilding", "photoshop"],
  },
  {
    title: "Generative Ambient & Orchestral Soundtrack Scoring",
    tagline: "Adaptive musical compositions, synthetic soundscapes & immersive sound design.",
    category: "Audio & Voice Synthesis",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    startingPrice: 299,
    deliveryDays: 3,
    revisions: 2,
    pricingTiers: [
      {
        name: "Basic",
        price: 299,
        deliveryDays: 3,
        revisions: 2,
        description: "1 full original track (up to 3 mins) with stereo master.",
        features: ["1 Original Track", "Up to 3 Minutes", "WAV & MP3 Master", "Loopable Version"],
      },
      {
        name: "Standard",
        price: 599,
        deliveryDays: 5,
        revisions: 3,
        description: "3 themed soundtrack pieces with dynamic intensity stems for interactive media.",
        features: ["3 Soundtrack Pieces", "Individual Audio Stems", "Interactive Game Loops", "Commercial License"],
      },
      {
        name: "Premium",
        price: 999,
        deliveryDays: 9,
        revisions: 4,
        description: "Complete 6-track EP or film score with live acoustic hybrid overlay and 5.1 surround mix.",
        features: ["6 Full Tracks", "5.1 Surround Sound Mix", "Live Instrument Overlays", "Cue Sheet for Film/TV Sync", "Exclusive Copyright Transfer"],
      },
    ],
    description: "Original scores composed using modern AI synthesizers (Suno, Udio) merged with orchestral sample libraries (Spitfire Audio, Native Instruments) and analogue modular synths.",
    deliverables: ["24-bit 96kHz Master Audio", "Unmixed Stem Tracks", "Loop Points Metadata", "Sync Cue Sheet"],
    aiTools: ["Suno v3.5", "Udio AI", "Spitfire Audio", "Ableton Live 12", "Ozone 11"],
    faq: [
      { question: "Is the music 100% royalty-free?", answer: "Yes, you own 100% of the commercial synchronization rights worldwide in perpetuity." },
    ],
    rating: 4.97,
    reviewsCount: 16,
    ordersCompleted: 18,
    inProgressOrders: 1,
    status: "active",
    isFeatured: false,
    tags: ["soundtrack", "scoring", "ambient", "orchestral", "music"],
  },
];

// Helper: Seed initial services if creator has none
const autoSeedIfEmpty = async (creatorId) => {
  const count = await Service.countDocuments({ creatorId });
  if (count === 0) {
    const servicesToInsert = SAMPLE_SERVICES.map((s) => ({
      ...s,
      creatorId,
    }));
    await Service.insertMany(servicesToInsert);
  }
};

/**
 * 1. GET /api/creator/services
 * Fetches services with search, category filter, status filter, sort & live KPIs
 */
exports.getServicesOverview = async (req, res) => {
  try {
    const creatorId = req.creator._id;

    // Auto seed if empty
    await autoSeedIfEmpty(creatorId);

    const {
      search = "",
      category = "All",
      status = "All",
      sort = "newest",
      page = 1,
      limit = 24,
    } = req.query;

    const query = { creatorId };

    if (category && category !== "All") {
      query.category = category;
    }

    if (status && status !== "All") {
      query.status = status;
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { title: { $regex: s, $options: "i" } },
        { tagline: { $regex: s, $options: "i" } },
        { description: { $regex: s, $options: "i" } },
        { deliverables: { $elemMatch: { $regex: s, $options: "i" } } },
        { aiTools: { $elemMatch: { $regex: s, $options: "i" } } },
      ];
    }

    // Determine sort
    let sortObj = { createdAt: -1 };
    if (sort === "price_high") sortObj = { startingPrice: -1 };
    else if (sort === "price_low") sortObj = { startingPrice: 1 };
    else if (sort === "orders") sortObj = { ordersCompleted: -1 };
    else if (sort === "rating") sortObj = { rating: -1 };
    else if (sort === "title") sortObj = { title: 1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 24));
    const skip = (pageNum - 1) * limitNum;

    const [services, totalFiltered, allServices] = await Promise.all([
      Service.find(query).sort(sortObj).skip(skip).limit(limitNum).lean(),
      Service.countDocuments(query),
      Service.find({ creatorId }).select("startingPrice ordersCompleted inProgressOrders rating status category").lean(),
    ]);

    // Aggregate dynamic KPIs
    const totalServices = allServices.length;
    const activeServices = allServices.filter((s) => s.status === "active").length;
    const pausedServices = allServices.filter((s) => s.status === "paused").length;
    const draftServices = allServices.filter((s) => s.status === "draft").length;
    const totalOrdersCompleted = allServices.reduce((acc, curr) => acc + (curr.ordersCompleted || 0), 0);
    const inProgressOrders = allServices.reduce((acc, curr) => acc + (curr.inProgressOrders || 0), 0);

    // Estimated revenue from completed gigs
    const totalRevenue = allServices.reduce((acc, curr) => {
      const avgGigValue = curr.startingPrice ? curr.startingPrice * 1.3 : 300;
      return acc + (curr.ordersCompleted || 0) * avgGigValue;
    }, 0);

    // Calculate weighted average rating
    const ratedServices = allServices.filter((s) => s.rating > 0);
    const averageRating = ratedServices.length > 0
      ? (ratedServices.reduce((acc, curr) => acc + curr.rating, 0) / ratedServices.length).toFixed(2)
      : "5.00";

    // Category distribution counts
    const categoryCounts = { All: totalServices };
    const allCategories = [
      "AI Video & Film",
      "3D & Animation",
      "VFX & Compositing",
      "Audio & Voice Synthesis",
      "Concept Art & Matte Painting",
      "Custom AI Model & LoRA",
      "Scriptwriting & Storyboarding",
    ];

    allCategories.forEach((cat) => {
      categoryCounts[cat] = allServices.filter((s) => s.category === cat).length;
    });

    return res.status(200).json({
      success: true,
      kpis: {
        totalServices,
        activeServices,
        pausedServices,
        draftServices,
        totalOrdersCompleted,
        inProgressOrders,
        totalRevenue: Math.round(totalRevenue),
        averageRating: parseFloat(averageRating),
      },
      categoryCounts,
      services,
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
        brandName: req.creator.brandName || "AIflix Studio",
        category: req.creator.category || "AI Film & Production",
        profileImage: req.creator.profileImage,
        portfolio: req.creator.portfolio,
      },
    });
  } catch (error) {
    console.error("Get Services Overview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load creator services.",
      error: error.message,
    });
  }
};

/**
 * 2. POST /api/creator/services
 * Creates a new service offering
 */
exports.createService = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    const {
      title,
      tagline,
      category,
      coverImage,
      startingPrice,
      deliveryDays,
      revisions,
      pricingTiers,
      description,
      deliverables,
      aiTools,
      faq,
      status,
      tags,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Service title is required." });
    }

    if (!coverImage || !coverImage.trim()) {
      return res.status(400).json({ success: false, message: "Cover image URL is required." });
    }

    const price = Math.max(1, parseInt(startingPrice, 10) || 199);

    // Process deliverables
    let processedDeliverables = [];
    if (Array.isArray(deliverables)) {
      processedDeliverables = deliverables.map((d) => String(d).trim()).filter(Boolean);
    } else if (typeof deliverables === "string" && deliverables.trim()) {
      processedDeliverables = deliverables.split(",").map((d) => d.trim()).filter(Boolean);
    }

    // Process AI Tools
    let processedTools = [];
    if (Array.isArray(aiTools)) {
      processedTools = aiTools.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof aiTools === "string" && aiTools.trim()) {
      processedTools = aiTools.split(",").map((t) => t.trim()).filter(Boolean);
    }

    // Default pricing tiers if none provided
    const tiers = Array.isArray(pricingTiers) && pricingTiers.length > 0
      ? pricingTiers
      : [
          {
            name: "Basic",
            price: price,
            deliveryDays: deliveryDays || 3,
            revisions: revisions || 2,
            description: "Entry package with standard deliverables.",
            features: ["Standard Resolution", "Commercial Rights", "2 Revision Rounds"],
          },
          {
            name: "Standard",
            price: Math.round(price * 1.8),
            deliveryDays: (deliveryDays || 3) + 2,
            revisions: (revisions || 2) + 2,
            description: "Enhanced package with source project files and premium upscaling.",
            features: ["4K High-Res Export", "Source Project Files", "Priority Support", "4 Revision Rounds"],
          },
          {
            name: "Premium",
            price: Math.round(price * 3),
            deliveryDays: (deliveryDays || 3) + 5,
            revisions: -1,
            description: "VIP production package with unlimited revisions and dedicated creative direction.",
            features: ["8K Neural Master", "Multi-Track Stems", "Full Commercial Buyout", "Unlimited Revisions"],
          },
        ];

    const newService = await Service.create({
      creatorId,
      title: title.trim(),
      tagline: tagline ? tagline.trim() : "",
      category: category || "AI Video & Film",
      coverImage: coverImage.trim(),
      startingPrice: price,
      deliveryDays: parseInt(deliveryDays, 10) || 3,
      revisions: parseInt(revisions, 10) || 2,
      pricingTiers: tiers,
      description: description ? description.trim() : "",
      deliverables: processedDeliverables,
      aiTools: processedTools,
      faq: Array.isArray(faq) ? faq : [],
      status: status || "active",
      tags: Array.isArray(tags) ? tags : [],
    });

    return res.status(201).json({
      success: true,
      message: "Service offering created successfully!",
      service: newService,
    });
  } catch (error) {
    console.error("Create Service Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create service.",
    });
  }
};

/**
 * 3. PUT /api/creator/services/:id
 * Updates an existing service
 */
exports.updateService = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    const { id } = req.params;

    const service = await Service.findOne({ _id: id, creatorId });
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found or unauthorized." });
    }

    const {
      title,
      tagline,
      category,
      coverImage,
      startingPrice,
      deliveryDays,
      revisions,
      pricingTiers,
      description,
      deliverables,
      aiTools,
      faq,
      status,
      tags,
    } = req.body;

    if (title) service.title = title.trim();
    if (tagline !== undefined) service.tagline = tagline.trim();
    if (category) service.category = category;
    if (coverImage) service.coverImage = coverImage.trim();
    if (startingPrice !== undefined) service.startingPrice = Math.max(1, parseInt(startingPrice, 10) || service.startingPrice);
    if (deliveryDays !== undefined) service.deliveryDays = Math.max(1, parseInt(deliveryDays, 10) || service.deliveryDays);
    if (revisions !== undefined) service.revisions = parseInt(revisions, 10);
    if (description !== undefined) service.description = description.trim();
    if (status) service.status = status;

    if (pricingTiers && Array.isArray(pricingTiers)) {
      service.pricingTiers = pricingTiers;
    }

    if (deliverables !== undefined) {
      if (Array.isArray(deliverables)) {
        service.deliverables = deliverables.map((d) => String(d).trim()).filter(Boolean);
      } else if (typeof deliverables === "string") {
        service.deliverables = deliverables.split(",").map((d) => d.trim()).filter(Boolean);
      }
    }

    if (aiTools !== undefined) {
      if (Array.isArray(aiTools)) {
        service.aiTools = aiTools.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof aiTools === "string") {
        service.aiTools = aiTools.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }

    if (faq && Array.isArray(faq)) service.faq = faq;
    if (tags && Array.isArray(tags)) service.tags = tags;

    await service.save();

    return res.status(200).json({
      success: true,
      message: "Service updated successfully!",
      service,
    });
  } catch (error) {
    console.error("Update Service Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update service.",
    });
  }
};

/**
 * 4. DELETE /api/creator/services/:id
 * Removes a service
 */
exports.deleteService = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    const { id } = req.params;

    const deleted = await Service.findOneAndDelete({ _id: id, creatorId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Service not found or unauthorized." });
    }

    return res.status(200).json({
      success: true,
      message: "Service removed successfully.",
      deletedId: id,
    });
  } catch (error) {
    console.error("Delete Service Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete service.",
    });
  }
};

/**
 * 5. PATCH /api/creator/services/:id/toggle-status
 * Toggles between 'active' and 'paused'
 */
exports.toggleServiceStatus = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    const { id } = req.params;

    const service = await Service.findOne({ _id: id, creatorId });
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    service.status = service.status === "active" ? "paused" : "active";
    await service.save();

    return res.status(200).json({
      success: true,
      message: `Service status updated to ${service.status.toUpperCase()}`,
      status: service.status,
      service,
    });
  } catch (error) {
    console.error("Toggle Service Status Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle service status.",
    });
  }
};

/**
 * 6. POST /api/creator/services/seed
 * Seeds realistic AI creative services into MongoDB
 */
exports.seedServicesData = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    const { overwrite = false } = req.body;

    if (overwrite) {
      await Service.deleteMany({ creatorId });
    }

    const count = await Service.countDocuments({ creatorId });
    if (count > 0 && !overwrite) {
      return res.status(200).json({
        success: true,
        message: `Services already contain ${count} items. Set overwrite: true to re-seed.`,
        count,
      });
    }

    const servicesToInsert = SAMPLE_SERVICES.map((s) => ({
      ...s,
      creatorId,
    }));

    const inserted = await Service.insertMany(servicesToInsert);

    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${inserted.length} creator services into MongoDB Atlas!`,
      count: inserted.length,
      services: inserted,
    });
  } catch (error) {
    console.error("Seed Services Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to seed services.",
    });
  }
};
