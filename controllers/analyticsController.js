const User = require("../models/userModel");
const Content = require("../models/contentModel");
const Creator = require("../models/creatorModel");
const Payment = require("../models/paymentModel");

// @desc    Get dashboard analytics
// @route   GET /api/superadmin/analytics/dashboard
// @access  Private (SuperAdmin)
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Fetch KPI Counts
    const totalUsers = await User.countDocuments();
    const activeCreators = await Creator.countDocuments({ status: "approved" });
    const totalContent = await Content.countDocuments();
    
    const [revenueData] = await Payment.aggregate([
      { $match: { status: "Completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueData ? revenueData.total : 0;

    // 2. Fetch Chart Data (Mocking 6-month historical data for visual appeal)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const revenueTrend = months.map(month => ({
      name: month,
      revenue: Math.floor(Math.random() * 5000) + 1000,
      users: Math.floor(Math.random() * 500) + 100
    }));

    // 3. Content Distribution
    const contentStats = await Content.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);
    const contentDistribution = contentStats.map(stat => ({
      name: stat._id.charAt(0).toUpperCase() + stat._id.slice(1),
      value: stat.count
    }));

    // 4. Payment Status Distribution
    const paymentStats = await Payment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const paymentDistribution = paymentStats.map(stat => ({
      name: stat._id,
      value: stat.count
    }));

    // 5. Recent Activity
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("name email createdAt");
    const recentPayments = await Payment.find().sort({ createdAt: -1 }).limit(5).select("transactionId amount status createdAt");

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalUsers,
          activeCreators,
          totalContent,
          totalRevenue
        },
        charts: {
          revenueTrend,
          contentDistribution: contentDistribution.length > 0 ? contentDistribution : [{ name: "No Data", value: 1 }],
          paymentDistribution: paymentDistribution.length > 0 ? paymentDistribution : [{ name: "No Data", value: 1 }]
        },
        recentActivity: {
          users: recentUsers,
          payments: recentPayments
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch analytics data",
      error: error.message,
    });
  }
};
