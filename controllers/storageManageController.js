const Storage = require("../models/storageModel");

// Default initial data for seeding
const defaultStorage = [
  {
    name: "aiphlix-main-media",
    provider: "AWS S3",
    region: "ap-south-1",
    usedStorage: 450,
    totalStorage: 1000,
    bandwidth: 120,
    status: "Active",
    type: "Storage"
  },
  {
    name: "aiphlix-global-cdn",
    provider: "Cloudflare",
    region: "Global",
    usedStorage: 0,
    totalStorage: 0,
    bandwidth: 850,
    status: "Active",
    type: "CDN"
  },
  {
    name: "user-uploads-temp",
    provider: "AWS S3",
    region: "us-east-1",
    usedStorage: 890,
    totalStorage: 1000,
    bandwidth: 45,
    status: "Warning",
    type: "Storage"
  }
];

// @desc    Get all storage resources (with auto-seeding)
// @route   GET /api/superadmin/storage
// @access  Private/SuperAdmin
exports.getStorageNodes = async (req, res) => {
  try {
    let storageNodes = await Storage.find().sort({ createdAt: -1 });

    // Auto-seed if collection is empty
    if (storageNodes.length === 0) {
      await Storage.insertMany(defaultStorage);
      storageNodes = await Storage.find().sort({ createdAt: -1 });
    }

    res.status(200).json(storageNodes);
  } catch (error) {
    console.error("Error fetching storage nodes:", error);
    res.status(500).json({ message: "Server error fetching storage data." });
  }
};

// @desc    Create a new storage resource
// @route   POST /api/superadmin/storage
// @access  Private/SuperAdmin
exports.createStorageNode = async (req, res) => {
  try {
    const { name, type, provider, region, totalStorage, status } = req.body;

    if (!name || !type || !provider) {
      return res.status(400).json({ message: "Name, type, and provider are required." });
    }

    const newNode = new Storage({
      name,
      type,
      provider,
      region,
      totalStorage: type === "Storage" ? totalStorage : 0,
      usedStorage: 0,
      bandwidth: 0,
      status: status || "Active",
    });

    const savedNode = await newNode.save();
    res.status(201).json(savedNode);
  } catch (error) {
    console.error("Error creating storage node:", error);
    res.status(500).json({ message: "Server error creating storage data." });
  }
};

// @desc    Update a storage resource
// @route   PUT /api/superadmin/storage/:id
// @access  Private/SuperAdmin
exports.updateStorageNode = async (req, res) => {
  try {
    const { id } = req.params;
    
    // If it's a CDN, ensure totalStorage and usedStorage aren't accidentally updated incorrectly, or let the schema handle it
    const updatedNode = await Storage.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedNode) {
      return res.status(404).json({ message: "Storage resource not found." });
    }

    res.status(200).json(updatedNode);
  } catch (error) {
    console.error("Error updating storage node:", error);
    res.status(500).json({ message: "Server error updating storage data." });
  }
};

// @desc    Delete a storage resource
// @route   DELETE /api/superadmin/storage/:id
// @access  Private/SuperAdmin
exports.deleteStorageNode = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNode = await Storage.findByIdAndDelete(id);

    if (!deletedNode) {
      return res.status(404).json({ message: "Storage resource not found." });
    }

    res.status(200).json({ message: "Storage resource deleted successfully." });
  } catch (error) {
    console.error("Error deleting storage node:", error);
    res.status(500).json({ message: "Server error deleting storage data." });
  }
};
