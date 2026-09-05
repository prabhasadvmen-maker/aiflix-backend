const AIModel = require("../models/aiModel");

// Helper function to seed initial AI models if empty
const ensureSeedAIModels = async () => {
  try {
    const count = await AIModel.countDocuments();
    if (count === 0) {
      const defaultModels = [
        {
          name: "GPT-4 Turbo",
          provider: "OpenAI",
          version: "gpt-4-turbo",
          description: "Most capable OpenAI model, great for complex tasks.",
          apiEndpoint: "https://api.openai.com/v1/chat/completions",
          costPer1kTokens: 0.01,
          status: "Active",
        },
        {
          name: "Claude 3 Opus",
          provider: "Anthropic",
          version: "claude-3-opus",
          description: "Powerful model for reasoning and coding.",
          apiEndpoint: "https://api.anthropic.com/v1/messages",
          costPer1kTokens: 0.015,
          status: "Active",
        },
        {
          name: "Gemini 1.5 Pro",
          provider: "Google",
          version: "gemini-1.5-pro",
          description: "Google's flagship multimodal model.",
          apiEndpoint: "https://generativelanguage.googleapis.com/v1beta/models",
          costPer1kTokens: 0.007,
          status: "Maintenance",
        }
      ];
      await AIModel.insertMany(defaultModels);
      console.log("Database seeded with default AI Models");
    }
  } catch (error) {
    console.error("Error seeding AI Models:", error);
  }
};

// @desc    Get all AI Models
// @route   GET /api/superadmin/ai-models
// @access  Private (SuperAdmin)
exports.getAiModels = async (req, res) => {
  try {
    await ensureSeedAIModels();

    const { search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { provider: { $regex: search, $options: "i" } },
      ];
    }

    const models = await AIModel.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: models,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch AI models",
      error: error.message,
    });
  }
};

// @desc    Create new AI Model
// @route   POST /api/superadmin/ai-models
// @access  Private (SuperAdmin)
exports.createAiModel = async (req, res) => {
  try {
    const newModel = await AIModel.create(req.body);
    res.status(201).json({
      success: true,
      message: "AI Model created successfully",
      data: newModel,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create AI Model",
    });
  }
};

// @desc    Update AI Model
// @route   PUT /api/superadmin/ai-models/:id
// @access  Private (SuperAdmin)
exports.updateAiModel = async (req, res) => {
  try {
    const model = await AIModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!model) {
      return res.status(404).json({ success: false, message: "AI Model not found" });
    }

    res.status(200).json({
      success: true,
      message: "AI Model updated successfully",
      data: model,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update AI Model",
    });
  }
};

// @desc    Toggle AI Model status
// @route   PATCH /api/superadmin/ai-models/:id/status
// @access  Private (SuperAdmin)
exports.toggleAiModelStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!["Active", "Inactive", "Maintenance"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const model = await AIModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!model) {
      return res.status(404).json({ success: false, message: "AI Model not found" });
    }

    res.status(200).json({
      success: true,
      message: `AI Model marked as ${status}`,
      data: model,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Delete AI Model
// @route   DELETE /api/superadmin/ai-models/:id
// @access  Private (SuperAdmin)
exports.deleteAiModel = async (req, res) => {
  try {
    const model = await AIModel.findByIdAndDelete(req.params.id);

    if (!model) {
      return res.status(404).json({ success: false, message: "AI Model not found" });
    }

    res.status(200).json({
      success: true,
      message: "AI Model deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
