const Infrastructure = require("../models/infrastructureModel");

// Default initial data for seeding
const defaultInfra = [
  {
    name: "Production API Server",
    type: "Server",
    provider: "AWS",
    region: "ap-south-1",
    ipAddress: "13.232.0.100",
    monthlyCost: 150,
    status: "Healthy",
  },
  {
    name: "MongoDB Atlas Cluster",
    type: "Database",
    provider: "AWS",
    region: "ap-south-1",
    ipAddress: "N/A",
    monthlyCost: 200,
    status: "Healthy",
  },
  {
    name: "S3 Media Storage",
    type: "Storage",
    provider: "AWS",
    region: "ap-south-1",
    ipAddress: "N/A",
    monthlyCost: 80,
    status: "Healthy",
  },
  {
    name: "Frontend Vercel App",
    type: "Server",
    provider: "Vercel",
    region: "Global",
    ipAddress: "N/A",
    monthlyCost: 20,
    status: "Healthy",
  },
];

// @desc    Get all infrastructure nodes (with auto-seeding)
// @route   GET /api/superadmin/infrastructure
// @access  Private/SuperAdmin
exports.getInfraNodes = async (req, res) => {
  try {
    let infraNodes = await Infrastructure.find().sort({ createdAt: -1 });

    // Auto-seed if collection is empty
    if (infraNodes.length === 0) {
      await Infrastructure.insertMany(defaultInfra);
      infraNodes = await Infrastructure.find().sort({ createdAt: -1 });
    }

    res.status(200).json(infraNodes);
  } catch (error) {
    console.error("Error fetching infra nodes:", error);
    res.status(500).json({ message: "Server error fetching infrastructure data." });
  }
};

// @desc    Create a new infrastructure node
// @route   POST /api/superadmin/infrastructure
// @access  Private/SuperAdmin
exports.createInfraNode = async (req, res) => {
  try {
    const { name, type, provider, region, ipAddress, monthlyCost, status } = req.body;

    if (!name || !type || !provider) {
      return res.status(400).json({ message: "Name, type, and provider are required." });
    }

    const newNode = new Infrastructure({
      name,
      type,
      provider,
      region,
      ipAddress,
      monthlyCost,
      status: status || "Healthy",
    });

    const savedNode = await newNode.save();
    res.status(201).json(savedNode);
  } catch (error) {
    console.error("Error creating infra node:", error);
    res.status(500).json({ message: "Server error creating infrastructure data." });
  }
};

// @desc    Update an infrastructure node
// @route   PUT /api/superadmin/infrastructure/:id
// @access  Private/SuperAdmin
exports.updateInfraNode = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedNode = await Infrastructure.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedNode) {
      return res.status(404).json({ message: "Infrastructure node not found." });
    }

    res.status(200).json(updatedNode);
  } catch (error) {
    console.error("Error updating infra node:", error);
    res.status(500).json({ message: "Server error updating infrastructure data." });
  }
};

// @desc    Toggle an infrastructure node status
// @route   PATCH /api/superadmin/infrastructure/:id/status
// @access  Private/SuperAdmin
exports.toggleInfraNodeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedNode = await Infrastructure.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedNode) {
      return res.status(404).json({ message: "Infrastructure node not found." });
    }

    res.status(200).json(updatedNode);
  } catch (error) {
    console.error("Error toggling infra node status:", error);
    res.status(500).json({ message: "Server error updating infrastructure status." });
  }
};

// @desc    Delete an infrastructure node
// @route   DELETE /api/superadmin/infrastructure/:id
// @access  Private/SuperAdmin
exports.deleteInfraNode = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNode = await Infrastructure.findByIdAndDelete(id);

    if (!deletedNode) {
      return res.status(404).json({ message: "Infrastructure node not found." });
    }

    res.status(200).json({ message: "Infrastructure node deleted successfully." });
  } catch (error) {
    console.error("Error deleting infra node:", error);
    res.status(500).json({ message: "Server error deleting infrastructure data." });
  }
};
