const User = require("../models/userModel");
const Content = require("../models/contentModel");
const Payment = require("../models/paymentModel");
const SupportTicket = require("../models/supportTicketModel");

// Helper to get date filters
const getDateFilter = (timeframe) => {
  const now = new Date();
  if (timeframe === "7d") {
    return { $gte: new Date(now.setDate(now.getDate() - 7)) };
  } else if (timeframe === "30d") {
    return { $gte: new Date(now.setDate(now.getDate() - 30)) };
  } else if (timeframe === "ytd") {
    return { $gte: new Date(now.getFullYear(), 0, 1) };
  }
  return null; // All time
};

exports.getReportSummary = async (req, res) => {
  try {
    const { timeframe = "30d" } = req.query;
    const dateFilter = getDateFilter(timeframe);
    const dateMatch = dateFilter ? { createdAt: dateFilter } : {};

    // 1. KPI Stats
    const newUsersCount = await User.countDocuments(dateMatch);
    const newContentCount = await Content.countDocuments(dateMatch);
    const resolvedTickets = await SupportTicket.countDocuments({ ...dateMatch, status: "resolved" });

    // Revenue KPI
    const [revenueData] = await Payment.aggregate([
      { $match: { status: "Completed", ...dateMatch } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueData ? revenueData.total : 0;

    // 2. Trend Data for Charts (Grouped by Day/Month)
    // To make it look good in recharts, we'll group by Date string
    const trendFormat = timeframe === "ytd" || timeframe === "all" ? "%Y-%m" : "%Y-%m-%d";
    
    const userTrend = await User.aggregate([
      { $match: dateMatch },
      { $group: { _id: { $dateToString: { format: trendFormat, date: "$createdAt" } }, users: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const revenueTrend = await Payment.aggregate([
      { $match: { status: "Completed", ...dateMatch } },
      { $group: { _id: { $dateToString: { format: trendFormat, date: "$createdAt" } }, revenue: { $sum: "$amount" } } },
      { $sort: { _id: 1 } }
    ]);

    // Merge trends into a single array for Recharts
    const trendMap = {};
    userTrend.forEach(t => { trendMap[t._id] = { date: t._id, users: t.users, revenue: 0 }; });
    revenueTrend.forEach(t => {
      if (!trendMap[t._id]) trendMap[t._id] = { date: t._id, users: 0, revenue: 0 };
      trendMap[t._id].revenue = t.revenue;
    });
    const combinedTrend = Object.values(trendMap).sort((a, b) => a.date.localeCompare(b.date));

    // 3. Content Distribution
    const contentDistribution = await Content.aggregate([
      { $match: dateMatch },
      { $group: { _id: "$visibility", value: { $sum: 1 } } }
    ]);

    const formattedContentDist = contentDistribution.map(d => {
      const name = d._id ? d._id : "Unknown";
      return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: d.value
      };
    });

    // 4. Recent Activity (for Data Grid)
    const recentPayments = await Payment.find(dateMatch)
      .sort({ createdAt: -1 })
      .limit(10)
      .select("transactionId amount status createdAt planName userName userEmail");

    res.status(200).json({
      success: true,
      data: {
        kpis: { newUsers: newUsersCount, newContent: newContentCount, resolvedTickets, totalRevenue },
        trends: combinedTrend.length > 0 ? combinedTrend : [{ date: new Date().toISOString().split('T')[0], users: 0, revenue: 0 }],
        contentDistribution: formattedContentDist.length > 0 ? formattedContentDist : [{ name: "No Data", value: 1 }],
        recentActivity: recentPayments
      }
    });

  } catch (error) {
    console.error("Report generation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
