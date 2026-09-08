require("dotenv").config();
const mongoose = require("mongoose");
const Creator = require("../models/creatorModel");
const Content = require("../models/contentModel");

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGO_URI not found in environment.");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas.");

    // Find all approved creators
    const creators = await Creator.find({ applicationStatus: "approved" });
    if (creators.length === 0) {
      console.log("No approved creators found to seed content for.");
      process.exit(0);
    }

    console.log(`Found ${creators.length} approved creators.`);

    const sampleCatalog = [
      {
        title: "Chronicles of Neo-Kyoto: The Cyber Blade",
        description: "In 2099 Neo-Kyoto, an augmented ronin uncovers a rogue AI syndicate lurking in the neon shadows.",
        type: "movie",
        category: "Cyberpunk",
        genres: ["Cyberpunk", "Sci-Fi", "Action", "Neo-Noir"],
        tags: ["Sora", "Cyberpunk", "AI Cinema", "4K"],
        thumbnailUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
        bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        duration: "1h 42m",
        releaseYear: 2026,
        maturityRating: "16+",
        status: "published",
        isFeatured: true,
        isTrending: true,
        viewsCount: 184500,
        likesCount: 16400,
        aiToolsUsed: ["OpenAI Sora", "Midjourney v6", "Runway Gen-3", "ElevenLabs"],
        accessType: "premium",
      },
      {
        title: "The Quantum Horizon: Deep Resonance",
        description: "An evocative psychological odyssey inside an orbital particle accelerator discovering multi-verse memories.",
        type: "short",
        category: "Sci-Fi",
        genres: ["Sci-Fi", "Drama", "Mystery"],
        tags: ["Quantum", "Short Film", "Deep Space"],
        thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
        bannerUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        duration: "24m",
        releaseYear: 2026,
        maturityRating: "PG-13",
        status: "published",
        isFeatured: true,
        isTrending: false,
        viewsCount: 94200,
        likesCount: 8900,
        aiToolsUsed: ["Runway Gen-3", "Kling AI", "ElevenLabs"],
        accessType: "free",
      },
      {
        title: "Aethelgard Legends: The Obsidian Throne",
        description: "Episode 1: The Shattered Citadel. Ancient elemental guardians awaken to protect the high-fantasy realm.",
        type: "series",
        category: "Fantasy",
        genres: ["Fantasy", "Epic Adventure", "Dark Fantasy"],
        tags: ["Web Series", "Magic", "Dragons"],
        thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
        bannerUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        duration: "48m / ep",
        releaseYear: 2026,
        maturityRating: "16+",
        status: "published",
        isFeatured: true,
        isTrending: true,
        viewsCount: 248000,
        likesCount: 22100,
        aiToolsUsed: ["Midjourney v6", "Kling AI", "Hailuo AI", "ElevenLabs"],
        accessType: "premium",
      },
      {
        title: "Neon Echoes: Midnight Protocol",
        description: "A rogue synth agent must breach an impenetrable quantum mainframe before the network purges all human identities.",
        type: "short",
        category: "Action",
        genres: ["Action", "Thriller", "Cyberpunk"],
        tags: ["AI Action", "Sora", "Synthwave"],
        thumbnailUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
        bannerUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=1600&auto=format&fit=crop&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        duration: "16m",
        releaseYear: 2026,
        maturityRating: "13+",
        status: "published",
        isFeatured: false,
        isTrending: true,
        viewsCount: 68400,
        likesCount: 5700,
        aiToolsUsed: ["OpenAI Sora", "Luma Dream Machine", "ElevenLabs"],
        accessType: "free",
      },
      {
        title: "Celestial Architecture: Cities of 3000",
        description: "A breathtaking architectural docu-series visualizing gravity-defying cloud megastructures.",
        type: "documentary",
        category: "Sci-Fi",
        genres: ["Documentary", "Visual Arts", "Futurism"],
        tags: ["Documentary", "Architecture", "Midjourney"],
        thumbnailUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80",
        bannerUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&auto=format&fit=crop&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        duration: "32m",
        releaseYear: 2026,
        maturityRating: "All",
        status: "published",
        isFeatured: false,
        isTrending: false,
        viewsCount: 41200,
        likesCount: 3800,
        aiToolsUsed: ["Midjourney v6", "Runway Gen-3"],
        accessType: "free",
      },
      {
        title: "Synthetic Dreams: Season 2 (Upcoming)",
        description: "Production teaser for the critically acclaimed AI psychological thriller.",
        type: "series",
        category: "Thriller",
        genres: ["Mystery", "Thriller"],
        tags: ["Teaser", "Draft"],
        thumbnailUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
        bannerUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80",
        videoUrl: "",
        duration: "55m / ep",
        releaseYear: 2026,
        maturityRating: "16+",
        status: "pending",
        isFeatured: false,
        isTrending: false,
        viewsCount: 0,
        likesCount: 0,
        aiToolsUsed: ["OpenAI Sora", "Hailuo AI"],
        accessType: "premium",
      },
    ];

    for (const creator of creators) {
      console.log(`Seeding content for creator: ${creator.name} (${creator.email})`);

      // Check if creator already has content
      const existingCount = await Content.countDocuments({ creatorId: creator._id });
      if (existingCount > 0) {
        console.log(`Creator already has ${existingCount} content items. Skipping.`);
        continue;
      }

      const creatorDocs = sampleCatalog.map((item) => ({
        ...item,
        creatorId: creator._id,
        creatorName: creator.brandName || creator.name,
      }));

      await Content.insertMany(creatorDocs);
      console.log(`Inserted ${creatorDocs.length} items for ${creator.name}.`);
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
};

seedData();
