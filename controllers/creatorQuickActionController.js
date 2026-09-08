const QuickActionLog = require("../models/quickActionLogModel");
const Content = require("../models/contentModel");
const Creator = require("../models/creatorModel");
const SupportTicket = require("../models/supportTicketModel");

// Helper to parse duration string
const parseDurationMinutes = (durationStr) => {
  if (!durationStr) return 20;
  let total = 0;
  const hoursMatch = durationStr.match(/(\d+)\s*h/i);
  const minsMatch = durationStr.match(/(\d+)\s*m/i);
  if (hoursMatch) total += parseInt(hoursMatch[1], 10) * 60;
  if (minsMatch) total += parseInt(minsMatch[1], 10);
  return total > 0 ? total : 20;
};

// @desc    Get Quick Actions Overview & History
// @route   GET /api/creator/quick-actions/overview
// @access  Private/Creator
const getQuickActionsOverview = async (req, res) => {
  try {
    const creator = req.creator;

    // Get creator's content
    const contentList = await Content.find({
      $or: [
        { creatorId: creator._id },
        { creatorName: creator.brandName || creator.name },
      ],
    });

    // Calculate earnings
    let totalEarnings = 0;
    contentList.forEach((c) => {
      const cpm = c.accessType === "premium" ? 8.0 : 3.5;
      totalEarnings += ((Number(c.viewsCount) || 0) / 1000) * cpm;
    });
    totalEarnings = Math.round(totalEarnings * 100) / 100;

    // Calculate payouts requested/completed
    const payoutLogs = await QuickActionLog.find({
      creatorId: creator._id,
      actionType: "payout_request",
      status: { $in: ["completed", "pending"] },
    });

    const totalPaidOut = payoutLogs.reduce(
      (sum, p) => sum + (Number(p.metadata?.amount) || 0),
      0
    );

    const availableBalance = Math.max(
      0,
      Math.round((totalEarnings - totalPaidOut) * 100) / 100
    );

    // Storage telemetry (e.g. 2.4 GB per video)
    const storageUsedGB = Math.min(
      95,
      Math.round((contentList.length * 2.4 + 2.8) * 10) / 10
    );
    const storageTotalGB = 100;

    // Recent action logs (last 15)
    const recentLogs = await QuickActionLog.find({ creatorId: creator._id })
      .sort({ createdAt: -1 })
      .limit(15);

    return res.status(200).json({
      success: true,
      studioStatus: {
        creatorId: creator._id,
        creatorName: creator.name,
        brandName: creator.brandName || creator.name,
        availableBalance,
        totalEarnings,
        totalPaidOut,
        storageUsedGB,
        storageTotalGB,
        storagePercentage: Math.round((storageUsedGB / storageTotalGB) * 100),
        contentCount: contentList.length,
        isStudioActive: creator.isActive !== false,
      },
      recentLogs,
    });
  } catch (error) {
    console.error("Quick actions overview error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load quick actions overview",
    });
  }
};

// @desc    Execute a Quick Action
// @route   POST /api/creator/quick-actions/execute
// @access  Private/Creator
const executeQuickAction = async (req, res) => {
  try {
    const creator = req.creator;
    const { actionType, data = {} } = req.body;

    if (!actionType) {
      return res.status(400).json({
        success: false,
        message: "actionType is required",
      });
    }

    let resultLog = null;

    // ─── 1. QUICK CONTENT UPLOAD ──────────────────────────────────────────
    if (actionType === "upload_content") {
      const {
        title,
        description,
        type = "short",
        category = "Sci-Fi",
        duration = "15m",
        thumbnailUrl,
        videoUrl,
        aiToolsUsed = ["Midjourney v6", "Runway Gen-3"],
        accessType = "free",
      } = data;

      if (!title) {
        return res.status(400).json({ success: false, message: "Title is required for video upload" });
      }

      const newContent = await Content.create({
        title: title.trim(),
        description: description || "Created via Creator Studio Quick Upload",
        type,
        category,
        genres: [category, type],
        tags: ["Quick Upload", "AI Studio"],
        thumbnailUrl:
          thumbnailUrl ||
          "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
        videoUrl:
          videoUrl ||
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        duration,
        releaseYear: 2026,
        maturityRating: "16+",
        status: "published",
        isFeatured: false,
        isTrending: true,
        viewsCount: 2400,
        likesCount: 310,
        creatorId: creator._id,
        creatorName: creator.brandName || creator.name,
        aiToolsUsed: Array.isArray(aiToolsUsed) ? aiToolsUsed : [aiToolsUsed],
        accessType,
      });

      resultLog = await QuickActionLog.create({
        creatorId: creator._id,
        actionType: "upload_content",
        title: `Uploaded "${newContent.title}"`,
        description: `${newContent.type.toUpperCase()} • ${newContent.category} • ${newContent.duration}`,
        metadata: {
          contentId: newContent._id,
          title: newContent.title,
          accessType: newContent.accessType,
        },
        status: "completed",
      });

      return res.status(201).json({
        success: true,
        message: `Video "${newContent.title}" published successfully!`,
        content: newContent,
        log: resultLog,
      });
    }

    // ─── 2. INSTANT PAYOUT REQUEST ────────────────────────────────────────
    if (actionType === "payout_request") {
      const { amount, method = "UPI", accountDetails } = data;

      if (!amount || Number(amount) <= 0) {
        return res.status(400).json({ success: false, message: "Valid payout amount is required" });
      }

      if (!accountDetails) {
        return res.status(400).json({ success: false, message: "Account or UPI details are required" });
      }

      resultLog = await QuickActionLog.create({
        creatorId: creator._id,
        actionType: "payout_request",
        title: `Payout Request: $${Number(amount).toFixed(2)}`,
        description: `Method: ${method} • Account: ${accountDetails}`,
        metadata: {
          amount: Number(amount),
          method,
          accountDetails,
          requestedAt: new Date().toISOString(),
        },
        status: "pending",
      });

      return res.status(201).json({
        success: true,
        message: `Payout request of $${Number(amount).toFixed(2)} submitted for processing!`,
        log: resultLog,
      });
    }

    // ─── 3. AI SCRIPT & STORYBOARD CONCEPT ────────────────────────────────
    if (actionType === "ai_concept") {
      const { prompt, genre = "Sci-Fi", aiEngine = "OpenAI Sora" } = data;

      if (!prompt) {
        return res.status(400).json({ success: false, message: "Concept prompt is required" });
      }

      const generatedTitle = `Concept: ${prompt.slice(0, 35)}...`;

      const draftConcept = await Content.create({
        title: generatedTitle,
        description: prompt,
        type: "short",
        category: genre,
        genres: [genre, "AI Generation"],
        tags: ["AI Storyboard", aiEngine, "Concept Draft"],
        thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
        videoUrl: "",
        duration: "10m",
        releaseYear: 2026,
        maturityRating: "PG-13",
        status: "draft",
        creatorId: creator._id,
        creatorName: creator.brandName || creator.name,
        aiToolsUsed: [aiEngine],
        accessType: "free",
        viewsCount: 0,
        likesCount: 0,
      });

      resultLog = await QuickActionLog.create({
        creatorId: creator._id,
        actionType: "ai_concept",
        title: `AI Concept: "${generatedTitle}"`,
        description: `Engine: ${aiEngine} • Genre: ${genre}`,
        metadata: {
          prompt,
          aiEngine,
          contentId: draftConcept._id,
        },
        status: "completed",
      });

      return res.status(201).json({
        success: true,
        message: `AI Storyboard concept saved as draft!`,
        concept: draftConcept,
        log: resultLog,
      });
    }

    // ─── 4. SOCIAL MEDIA PROMO BLAST ──────────────────────────────────────
    if (actionType === "promo_blast") {
      const { platform = "Twitter/X", campaignName = "New Release Announcement", copyText } = data;

      resultLog = await QuickActionLog.create({
        creatorId: creator._id,
        actionType: "promo_blast",
        title: `Promo Blast on ${platform}`,
        description: `${campaignName} • Reach Broadcast Generated`,
        metadata: {
          platform,
          campaignName,
          copyText: copyText || "Watch our newest release now exclusively on AIflix OTT!",
        },
        status: "completed",
      });

      return res.status(201).json({
        success: true,
        message: `Promo blast prepared for ${platform}!`,
        log: resultLog,
      });
    }

    // ─── 5. PRIORITY SUPPORT TICKET ────────────────────────────────────────
    if (actionType === "support_ticket") {
      const { subject, category = "Content", priority = "High", description } = data;

      if (!subject || !description) {
        return res.status(400).json({ success: false, message: "Subject and description are required" });
      }

      const ticketId = `TK-${Math.floor(100000 + Math.random() * 900000)}`;

      const newTicket = await SupportTicket.create({
        ticketId,
        userEmail: creator.email,
        subject: `[Creator Priority] ${subject}`,
        description,
        priority,
        category,
        status: "Open",
      });

      resultLog = await QuickActionLog.create({
        creatorId: creator._id,
        actionType: "support_ticket",
        title: `Priority Support: ${ticketId}`,
        description: `${subject} (${priority} Priority)`,
        metadata: {
          ticketId,
          subject,
          priority,
          category,
        },
        status: "in_progress",
      });

      return res.status(201).json({
        success: true,
        message: `Support ticket ${ticketId} created successfully!`,
        ticket: newTicket,
        log: resultLog,
      });
    }

    // ─── 6. STUDIO VISIBILITY TOGGLE ───────────────────────────────────────
    if (actionType === "status_toggle") {
      const newStatus = data.isActive !== undefined ? Boolean(data.isActive) : !creator.isActive;
      creator.isActive = newStatus;
      await creator.save();

      resultLog = await QuickActionLog.create({
        creatorId: creator._id,
        actionType: "status_toggle",
        title: `Studio Visibility: ${newStatus ? "Public & Live" : "Private Focus Mode"}`,
        description: newStatus
          ? "Your studio and content catalog are public to all subscribers"
          : "Studio catalog is temporarily set to private mode",
        metadata: { isActive: newStatus },
        status: "completed",
      });

      return res.status(200).json({
        success: true,
        message: `Studio visibility set to ${newStatus ? "Public" : "Private"}`,
        isStudioActive: newStatus,
        log: resultLog,
      });
    }

    return res.status(400).json({
      success: false,
      message: `Unknown actionType: ${actionType}`,
    });
  } catch (error) {
    console.error("Execute quick action error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to execute quick action",
    });
  }
};

// @desc    Seed sample quick actions history for demo
// @route   POST /api/creator/quick-actions/seed
// @access  Private/Creator
const seedQuickActionHistory = async (req, res) => {
  try {
    const creator = req.creator;

    const sampleLogs = [
      {
        creatorId: creator._id,
        actionType: "upload_content",
        title: 'Uploaded "Chronicles of Neo-Kyoto"',
        description: "MOVIE • Cyberpunk • 1h 42m",
        metadata: { format: "4K Ultra-HD", quality: "Dolby Vision" },
        status: "completed",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        creatorId: creator._id,
        actionType: "payout_request",
        title: "Payout Request: $1,250.00",
        description: "Method: UPI • ID: 9876543210@axl",
        metadata: { amount: 1250, method: "UPI" },
        status: "completed",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        creatorId: creator._id,
        actionType: "ai_concept",
        title: 'AI Concept: "Quantum Dyson Sphere Narrative"',
        description: "Engine: OpenAI Sora • Genre: Hard Sci-Fi",
        metadata: { aiEngine: "OpenAI Sora" },
        status: "completed",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        creatorId: creator._id,
        actionType: "promo_blast",
        title: "Promo Blast on Twitter/X",
        description: "Cyberpunk Weekend Campaign • Reach: 18.4K",
        metadata: { platform: "Twitter/X", impressions: 18400 },
        status: "completed",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        creatorId: creator._id,
        actionType: "support_ticket",
        title: "Priority Support: TK-849102",
        description: "Ultra-HD Bitrate Optimization for Smart TV",
        metadata: { ticketId: "TK-849102", priority: "High" },
        status: "completed",
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      },
      {
        creatorId: creator._id,
        actionType: "status_toggle",
        title: "Studio Visibility: Public & Live",
        description: "Your studio and content catalog are public to all subscribers",
        metadata: { isActive: true },
        status: "completed",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
    ];

    // Clear old logs for this creator before inserting
    await QuickActionLog.deleteMany({ creatorId: creator._id });
    const inserted = await QuickActionLog.insertMany(sampleLogs);

    return res.status(201).json({
      success: true,
      message: `Seeded ${inserted.length} action logs for creator ${creator.name}`,
      count: inserted.length,
    });
  } catch (error) {
    console.error("Seed quick action history error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getQuickActionsOverview,
  executeQuickAction,
  seedQuickActionHistory,
};
