const Subscription = require("../models/subscriptionModel");

// Helper function to seed initial subscriptions if empty
const ensureSeedSubscriptions = async () => {
  try {
    const count = await Subscription.countDocuments();
    if (count === 0) {
      const defaultSubscriptions = [
        {
          name: "Basic",
          description: "Essential access for single users",
          price: 9.99,
          currency: "USD",
          billingCycle: "monthly",
          features: ["720p Video Quality", "1 Screen", "Ad-supported"],
          status: "active",
          maxScreens: 1,
          isPopular: false,
        },
        {
          name: "Standard",
          description: "Great video quality and resolution",
          price: 15.99,
          currency: "USD",
          billingCycle: "monthly",
          features: ["1080p Video Quality", "2 Screens", "No Ads"],
          status: "active",
          maxScreens: 2,
          isPopular: true,
        },
        {
          name: "Premium",
          description: "Best video quality and unlimited access",
          price: 22.99,
          currency: "USD",
          billingCycle: "monthly",
          features: ["4K+HDR Video Quality", "4 Screens", "No Ads", "Spatial Audio", "Downloads"],
          status: "active",
          maxScreens: 4,
          isPopular: false,
        },
      ];
      await Subscription.insertMany(defaultSubscriptions);
      console.log("Database seeded with default subscriptions");
    }
  } catch (error) {
    console.error("Error seeding subscriptions:", error);
  }
};

// @desc    Get all subscriptions
// @route   GET /api/superadmin/subscriptions
// @access  Private (SuperAdmin)
exports.getSubscriptions = async (req, res) => {
  try {
    await ensureSeedSubscriptions();

    const { search, status, sort } = req.query;

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (status) {
      query.status = status;
    }

    let sortObj = { createdAt: -1 };
    if (sort === "priceAsc") sortObj = { price: 1 };
    if (sort === "priceDesc") sortObj = { price: -1 };
    if (sort === "popular") sortObj = { isPopular: -1 };

    const subscriptions = await Subscription.find(query).sort(sortObj);

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch subscriptions",
      error: error.message,
    });
  }
};

// @desc    Get single subscription
// @route   GET /api/superadmin/subscriptions/:id
// @access  Private (SuperAdmin)
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Create a new subscription
// @route   POST /api/superadmin/subscriptions
// @access  Private (SuperAdmin)
exports.createSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.create(req.body);
    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: subscription,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation Error: Could not create subscription",
      error: error.message,
    });
  }
};

// @desc    Update a subscription
// @route   PUT /api/superadmin/subscriptions/:id
// @access  Private (SuperAdmin)
exports.updateSubscription = async (req, res) => {
  try {
    let subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: subscription,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation Error: Could not update subscription",
      error: error.message,
    });
  }
};

// @desc    Toggle subscription status (active/inactive)
// @route   PATCH /api/superadmin/subscriptions/:id/status
// @access  Private (SuperAdmin)
exports.toggleSubscriptionStatus = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    subscription.status = subscription.status === "active" ? "inactive" : "active";
    await subscription.save();

    res.status(200).json({
      success: true,
      message: `Subscription status changed to ${subscription.status}`,
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Delete a subscription
// @route   DELETE /api/superadmin/subscriptions/:id
// @access  Private (SuperAdmin)
exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    await subscription.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
