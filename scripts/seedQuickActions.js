require("dotenv").config();
const mongoose = require("mongoose");
const Creator = require("../models/creatorModel");
const QuickActionLog = require("../models/quickActionLogModel");

const seedQuickActions = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGO_URI not found in environment.");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas.");

    const creators = await Creator.find({ applicationStatus: "approved" });
    if (creators.length === 0) {
      console.log("No approved creators found.");
      process.exit(0);
    }

    console.log(`Found ${creators.length} approved creators. Seeding quick actions history...`);

    for (const creator of creators) {
      const sampleLogs = [
        {
          creatorId: creator._id,
          actionType: "upload_content",
          title: 'Uploaded "Chronicles of Neo-Kyoto: The Cyber Blade"',
          description: "MOVIE • Cyberpunk • 1h 42m • 4K Dolby Vision",
          metadata: { format: "4K Ultra-HD", status: "published" },
          status: "completed",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
        },
        {
          creatorId: creator._id,
          actionType: "payout_request",
          title: "Payout Request: $1,250.00",
          description: "Method: UPI • ID: 9876543210@axl",
          metadata: { amount: 1250, method: "UPI" },
          status: "completed",
          createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22h ago
        },
        {
          creatorId: creator._id,
          actionType: "ai_concept",
          title: 'AI Storyboard: "Quantum Dyson Sphere"',
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

      await QuickActionLog.deleteMany({ creatorId: creator._id });
      await QuickActionLog.insertMany(sampleLogs);
      console.log(`Seeded ${sampleLogs.length} quick action logs for ${creator.name}.`);
    }

    console.log("Quick actions seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding quick actions:", err);
    process.exit(1);
  }
};

seedQuickActions();
