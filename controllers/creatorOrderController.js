const Order = require("../models/orderModel");
const Creator = require("../models/creatorModel");

// Curated realistic sample client orders
const SAMPLE_ORDERS = [
  {
    orderNumber: "ORD-9421",
    serviceTitle: "Full 4K AI Cinema Trailer & Storyboard",
    serviceCategory: "AI Video & Film",
    packageTier: "Standard",
    client: {
      name: "Alexander Wright",
      email: "alex.wright@quantumfilm.io",
      company: "Quantum Studios UK",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      country: "United Kingdom",
    },
    amount: 899,
    platformFee: 89.9,
    creatorEarnings: 809.1,
    status: "in_progress",
    paymentStatus: "paid_escrow",
    deliveryDays: 6,
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    deadline: "2026-09-14",
    revisionsAllowed: 4,
    revisionsUsed: 0,
    requirements: {
      brief: "A 60-second sci-fi teaser trailer focusing on an abandoned lunar observatory discovered by deep-space scavengers. Tone should be eerie, cinematic, inspired by Blade Runner 2049 and Prometheus.",
      aspectRatio: "2.39:1 (Anamorphic)",
      targetResolution: "4K Pro-Res",
      references: ["https://images.unsplash.com/photo-1578632767115-351597cf2477"],
    },
    deliverables: [],
    timeline: [
      { action: "Order Placed", note: "Client purchased Standard Trailer Package ($899 in Escrow)", actor: "Client", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { action: "Requirements Provided", note: "Client submitted concept brief and visual references", actor: "Client", timestamp: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000) },
      { action: "Production Started", note: "Creator initiated Sora & Runway diffusion generation", actor: "Creator", timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000) },
    ],
  },
  {
    orderNumber: "ORD-8930",
    serviceTitle: "Custom 3D Character Rigging & Neural Animation",
    serviceCategory: "3D & Animation",
    packageTier: "Premium",
    client: {
      name: "Sophia Martinez",
      email: "sophia@polygongames.es",
      company: "Polygon Interactive",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      country: "Spain",
    },
    amount: 1199,
    platformFee: 119.9,
    creatorEarnings: 1079.1,
    status: "in_review",
    paymentStatus: "paid_escrow",
    deliveryDays: 10,
    orderDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    deadline: "2026-09-11",
    deliveredAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    revisionsAllowed: 5,
    revisionsUsed: 1,
    requirements: {
      brief: "Cyber-ninja female character with 52 ARKit facial blendshapes, cloth simulation for dynamic coat, and 3 custom attack animations ready for Unreal Engine 5.4.",
      aspectRatio: "16:9",
      targetResolution: "Nanite UE5.4 Asset",
      references: [],
    },
    deliverables: [
      {
        title: "CyberNinja_UE5_Package_v1.zip",
        fileUrl: "https://aiflix.tv/downloads/orders/CyberNinja_UE5_Package_v1.zip",
        fileType: "application/zip",
        fileSize: "1.4 GB",
        notes: "Includes rigged FBX, UE5 migration folder, and 4K PBR Substance textures.",
      },
    ],
    timeline: [
      { action: "Order Placed", note: "Client purchased Premium 3D Character Rigging ($1,199 in Escrow)", actor: "Client", timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
      { action: "Work Delivered", note: "Creator uploaded final Nanite mesh and animation assets", actor: "Creator", timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) },
      { action: "In Review", note: "Client inspecting assets in Unreal Engine viewport", actor: "System", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
    ],
  },
  {
    orderNumber: "ORD-8215",
    serviceTitle: "Deep Compositing & AI VFX Sequence",
    serviceCategory: "VFX & Compositing",
    packageTier: "Standard",
    client: {
      name: "Kenji Sato",
      email: "kenji@tokyosyn.jp",
      company: "Tokyo Synthetics VFX",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      country: "Japan",
    },
    amount: 749,
    platformFee: 74.9,
    creatorEarnings: 674.1,
    status: "revision_requested",
    paymentStatus: "paid_escrow",
    deliveryDays: 5,
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    deadline: "2026-09-12",
    deliveredAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    revisionsAllowed: 3,
    revisionsUsed: 1,
    requirements: {
      brief: "Rotoscoping, holographic neon signs integration, and rain volumetrics for live action Tokyo night footage.",
      aspectRatio: "16:9",
      targetResolution: "ACEScg 32-bit EXR",
      references: [],
    },
    deliverables: [
      {
        title: "Tokyo_VFX_Shot01_v1.mov",
        fileUrl: "https://aiflix.tv/downloads/orders/Tokyo_VFX_Shot01_v1.mov",
        fileType: "video/quicktime",
        fileSize: "840 MB",
        notes: "First draft with atmospheric fog and rain.",
      },
    ],
    timeline: [
      { action: "Order Placed", note: "Client purchased VFX Compositing ($749 in Escrow)", actor: "Client", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { action: "Draft Delivered", note: "Creator submitted first visual effects cut", actor: "Creator", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      { action: "Revision Requested", note: "Client requested neon sign reflections to be 15% sharper on wet pavement", actor: "Client", timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000) },
    ],
  },
  {
    orderNumber: "ORD-7640",
    serviceTitle: "Original Neural Choral Soundtrack",
    serviceCategory: "Audio & Voice Synthesis",
    packageTier: "Basic",
    client: {
      name: "Claire Becker",
      email: "c.becker@auroramedia.de",
      company: "Aurora Media Berlin",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      country: "Germany",
    },
    amount: 499,
    platformFee: 49.9,
    creatorEarnings: 449.1,
    status: "completed",
    paymentStatus: "released",
    deliveryDays: 4,
    orderDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    deadline: "2026-08-30",
    deliveredAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    revisionsAllowed: 2,
    revisionsUsed: 0,
    requirements: {
      brief: "Ambient, haunting vocal choral arrangement with hybrid analog synthesizers for an indie documentary opening sequence.",
      aspectRatio: "Audio Stems",
      targetResolution: "96kHz / 24-bit WAV",
      references: [],
    },
    deliverables: [
      {
        title: "Aurora_Choral_Theme_Master_96k.wav",
        fileUrl: "https://aiflix.tv/downloads/orders/Aurora_Choral_Theme.wav",
        fileType: "audio/wav",
        fileSize: "180 MB",
        notes: "Full mix + isolated choral and synth stems.",
      },
    ],
    timeline: [
      { action: "Order Placed", note: "Client ordered Neural Choral Track ($499 in Escrow)", actor: "Client", timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
      { action: "Work Delivered", note: "Creator uploaded final mastered WAV files", actor: "Creator", timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000) },
      { action: "Order Accepted", note: "Client accepted delivery with 5-star review. Funds released to Wallet!", actor: "Client", timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    ],
    rating: {
      stars: 5,
      reviewText: "Incredible sonic depth and fast turnaround! The neural vocal harmonies gave our documentary exactly the haunting tone we were seeking. Will order again!",
      reviewedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  },
  {
    orderNumber: "ORD-7108",
    serviceTitle: "Architectural Worldbuilding Matte Painting Suite",
    serviceCategory: "Concept Art & Matte Painting",
    packageTier: "Premium",
    client: {
      name: "Jonathan Drake",
      email: "jdrake@vanguardfilms.com",
      company: "Vanguard Films US",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      country: "United States",
    },
    amount: 1450,
    platformFee: 145.0,
    creatorEarnings: 1305.0,
    status: "completed",
    paymentStatus: "released",
    deliveryDays: 7,
    orderDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    deadline: "2026-08-25",
    deliveredAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    revisionsAllowed: 3,
    revisionsUsed: 1,
    requirements: {
      brief: "5 Layered matte paintings for camera parallax projection showcasing orbital city ring and colossal atmospheric harvester station.",
      aspectRatio: "16:9 & 21:9",
      targetResolution: "8K PSD Layers",
      references: [],
    },
    deliverables: [
      {
        title: "OrbitalRing_MatteSuite_8K.zip",
        fileUrl: "https://aiflix.tv/downloads/orders/OrbitalRing_8K.zip",
        fileType: "application/zip",
        fileSize: "2.1 GB",
        notes: "Clean separated foreground, midground, and background layers.",
      },
    ],
    timeline: [
      { action: "Order Placed", note: "Client commissioned Matte Painting Suite ($1,450 in Escrow)", actor: "Client", timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
      { action: "Delivered", note: "All 5 multi-layer PSD files uploaded", actor: "Creator", timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      { action: "Completed", note: "Client approved work. $1,305 transferred to creator wallet.", actor: "System", timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
    ],
    rating: {
      stars: 5,
      reviewText: "Hollywood standard concept art. The separation of parallax planes was flawless for Nuke projection. True masterclass.",
      reviewedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  },
  {
    orderNumber: "ORD-6892",
    serviceTitle: "Custom LoRA Diffusion Model Adaptation",
    serviceCategory: "Custom AI Model & LoRA",
    packageTier: "Custom Enterprise",
    client: {
      name: "Dr. Maya Patel",
      email: "maya.patel@synthetix.ai",
      company: "Synthetix AI Corp",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      country: "Canada",
    },
    amount: 2200,
    platformFee: 220.0,
    creatorEarnings: 1980.0,
    status: "in_progress",
    paymentStatus: "paid_escrow",
    deliveryDays: 12,
    orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    deadline: "2026-09-20",
    revisionsAllowed: 5,
    revisionsUsed: 0,
    requirements: {
      brief: "Flux.1 enterprise LoRA trained on proprietary corporate hardware renders. Low rank 64, alpha 32, zero prompt bleeding.",
      aspectRatio: "Safetensors Model",
      targetResolution: "Rank 64 LoRA",
      references: [],
    },
    deliverables: [],
    timeline: [
      { action: "Custom Order Created", note: "Custom offer sent & accepted ($2,200 deposited to Escrow)", actor: "System", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { action: "Dataset Ingested", note: "Creator validated 800 training keyframes", actor: "Creator", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    ],
  },
];

/**
 * @desc Get all client orders for logged-in creator with live KPIs & filters
 * @route GET /api/creator/orders
 * @access Protected (Creator)
 */
const getOrdersOverview = async (req, res) => {
  try {
    const creatorId = req.creator._id;

    // Auto-seed sample orders if creator has 0
    let count = await Order.countDocuments({ creatorId });
    if (count === 0) {
      const seeded = SAMPLE_ORDERS.map((ord) => ({
        ...ord,
        creatorId,
      }));
      await Order.insertMany(seeded);
    }

    const { search = "", status = "All", sortBy = "newest" } = req.query;

    const filter = { creatorId };

    if (status && status !== "All") {
      filter.status = status;
    }

    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { orderNumber: regex },
        { serviceTitle: regex },
        { packageTier: regex },
        { "client.name": regex },
        { "client.company": regex },
        { "client.email": regex },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === "newest") sortOption = { orderDate: -1 };
    else if (sortBy === "oldest") sortOption = { orderDate: 1 };
    else if (sortBy === "deadline") sortOption = { deadline: 1 };
    else if (sortBy === "amount_high") sortOption = { amount: -1 };
    else if (sortBy === "amount_low") sortOption = { amount: 1 };
    else if (sortBy === "client") sortOption = { "client.name": 1 };

    const orders = await Order.find(filter).sort(sortOption);

    // Compute live KPIs from ALL creator orders
    const allOrders = await Order.find({ creatorId });

    const totalOrders = allOrders.length;
    const inProgressCount = allOrders.filter((o) => o.status === "in_progress").length;
    const inReviewCount = allOrders.filter((o) => o.status === "in_review").length;
    const revisionCount = allOrders.filter((o) => o.status === "revision_requested").length;
    const activeOrders = inProgressCount + inReviewCount + revisionCount;
    const completedOrders = allOrders.filter((o) => o.status === "completed").length;

    // Financial calculations
    const completedList = allOrders.filter((o) => o.status === "completed");
    const grossRevenue = completedList.reduce((sum, o) => sum + (o.amount || 0), 0);
    const netEarnings = completedList.reduce((sum, o) => sum + (o.creatorEarnings || 0), 0);

    const activeList = allOrders.filter(
      (o) => o.status === "in_progress" || o.status === "in_review" || o.status === "revision_requested"
    );
    const inEscrow = activeList.reduce((sum, o) => sum + (o.amount || 0), 0);

    const avgOrderValue = totalOrders > 0
      ? Math.round(allOrders.reduce((sum, o) => sum + (o.amount || 0), 0) / totalOrders)
      : 0;

    const onTimeDeliveryRate = 100; // 100% on-time record

    // Dynamic status count tabs
    const statusCounts = {
      All: totalOrders,
      in_progress: inProgressCount,
      in_review: inReviewCount,
      revision_requested: revisionCount,
      completed: completedOrders,
      pending_requirements: allOrders.filter((o) => o.status === "pending_requirements").length,
    };

    const creator = await Creator.findById(creatorId).select(
      "name brandName profileImage category username email isApproved"
    );

    return res.status(200).json({
      success: true,
      orders,
      kpis: {
        totalOrders,
        activeOrders,
        completedOrders,
        grossRevenue,
        netEarnings,
        inEscrow,
        avgOrderValue,
        onTimeDeliveryRate,
      },
      statusCounts,
      creator,
    });
  } catch (error) {
    console.error("Error fetching orders overview:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching orders overview.",
      error: error.message,
    });
  }
};

/**
 * @desc Create a custom / direct commissioned order
 * @route POST /api/creator/orders
 * @access Protected (Creator)
 */
const createCustomOrder = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    const {
      serviceTitle,
      serviceCategory,
      packageTier,
      clientName,
      clientEmail,
      clientCompany,
      amount,
      deliveryDays,
      deadline,
      brief,
      aspectRatio,
      targetResolution,
    } = req.body;

    if (!serviceTitle || !serviceTitle.trim()) {
      return res.status(400).json({ success: false, message: "Service title is required." });
    }

    if (!clientName || !clientName.trim() || !clientEmail || !clientEmail.trim()) {
      return res.status(400).json({ success: false, message: "Client name and email are required." });
    }

    const orderAmount = Number(amount) || 299;
    const platformFee = Number((orderAmount * 0.1).toFixed(2));
    const creatorEarnings = Number((orderAmount - platformFee).toFixed(2));

    const newOrder = new Order({
      orderNumber: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      creatorId,
      serviceTitle: serviceTitle.trim(),
      serviceCategory: serviceCategory || "AI Video & Film",
      packageTier: packageTier || "Standard",
      client: {
        name: clientName.trim(),
        email: clientEmail.trim(),
        company: clientCompany ? clientCompany.trim() : "Direct Client",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        country: "Client Direct",
      },
      amount: orderAmount,
      platformFee,
      creatorEarnings,
      status: "in_progress",
      paymentStatus: "paid_escrow",
      deliveryDays: Number(deliveryDays) || 5,
      deadline: deadline || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      requirements: {
        brief: brief ? brief.trim() : "Custom studio deliverable requested by client.",
        aspectRatio: aspectRatio || "16:9",
        targetResolution: targetResolution || "4K UHD",
      },
      timeline: [
        {
          action: "Direct Order Generated",
          note: `Creator initiated custom order for ${clientName.trim()} ($${orderAmount})`,
          actor: "Creator",
          timestamp: new Date(),
        },
      ],
    });

    const saved = await newOrder.save();

    return res.status(201).json({
      success: true,
      message: "Custom order created successfully.",
      order: saved,
    });
  } catch (error) {
    console.error("Error creating custom order:", error);
    return res.status(500).json({
      success: false,
      message: "Server error creating custom order.",
      error: error.message,
    });
  }
};

/**
 * @desc Submit deliverables for an order
 * @route POST /api/creator/orders/:id/deliver
 * @access Protected (Creator)
 */
const submitOrderDelivery = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    const { id } = req.params;
    const { title, fileUrl, fileType, fileSize, notes } = req.body;

    if (!fileUrl || !fileUrl.trim()) {
      return res.status(400).json({ success: false, message: "Deliverable download URL is required." });
    }

    const order = await Order.findOne({ _id: id, creatorId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    const deliverable = {
      title: title ? title.trim() : `${order.serviceTitle} Final Deliverable`,
      fileUrl: fileUrl.trim(),
      fileType: fileType || "video/mp4",
      fileSize: fileSize || "450 MB",
      submittedAt: new Date(),
      notes: notes ? notes.trim() : "Final render files ready for review.",
    };

    order.deliverables.push(deliverable);
    order.status = "in_review";
    order.deliveredAt = new Date();

    order.timeline.push({
      action: "Work Delivered",
      note: `Creator uploaded deliverable: ${deliverable.title}`,
      actor: "Creator",
      timestamp: new Date(),
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Deliverables submitted. Order moved to 'In Review'!",
      order,
    });
  } catch (error) {
    console.error("Error submitting delivery:", error);
    return res.status(500).json({
      success: false,
      message: "Server error submitting delivery.",
      error: error.message,
    });
  }
};

/**
 * @desc Update order status (e.g. Complete, Cancel, Request Revision)
 * @route PATCH /api/creator/orders/:id/status
 * @access Protected (Creator)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    const { id } = req.params;
    const { status, note } = req.body;

    const order = await Order.findOne({ _id: id, creatorId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    const validStatuses = [
      "in_progress",
      "in_review",
      "revision_requested",
      "completed",
      "pending_requirements",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    order.status = status;

    if (status === "completed") {
      order.paymentStatus = "released";
      order.completedAt = new Date();
    } else if (status === "cancelled") {
      order.paymentStatus = "refunded";
    }

    order.timeline.push({
      action: `Status Updated to ${status.replace("_", " ").toUpperCase()}`,
      note: note || `Order transitioned to ${status}`,
      actor: "Creator",
      timestamp: new Date(),
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}.`,
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating status.",
      error: error.message,
    });
  }
};

/**
 * @desc Seed sample orders data
 * @route POST /api/creator/orders/seed
 * @access Protected (Creator)
 */
const seedOrdersData = async (req, res) => {
  try {
    const creatorId = req.creator._id;
    await Order.deleteMany({ creatorId });

    const seeded = SAMPLE_ORDERS.map((ord) => ({
      ...ord,
      creatorId,
    }));

    const inserted = await Order.insertMany(seeded);

    return res.status(200).json({
      success: true,
      message: `Seeded ${inserted.length} client commission orders successfully.`,
      orders: inserted,
    });
  } catch (error) {
    console.error("Error seeding orders:", error);
    return res.status(500).json({
      success: false,
      message: "Server error seeding orders.",
      error: error.message,
    });
  }
};

module.exports = {
  getOrdersOverview,
  createCustomOrder,
  submitOrderDelivery,
  updateOrderStatus,
  seedOrdersData,
};
