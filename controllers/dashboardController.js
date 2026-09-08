const User = require("../models/userModel");
const Creator = require("../models/creatorModel");
const Content = require("../models/contentModel");
const Payment = require("../models/paymentModel");
const Subscription = require("../models/subscriptionModel");
const Admin = require("../models/adminModel");
const SupportTicket = require("../models/supportTicketModel");
const AuditLog = require("../models/auditLogModel");
const Storage = require("../models/storageModel");

// @desc    Get dashboard statistics
// @route   GET /api/superadmin/dashboard-stats
// @access  Private/SuperAdmin
exports.getDashboardStats = async (req, res) => {
  try {
    // Fetch real counts from DB in parallel
    const [
      totalUsers,
      totalCreators,
      totalContent,
      totalAdmins,
      totalSubscriptions,
      totalTickets,
      openTickets,
      criticalLogs,
      totalStorage,
      payments,
    ] = await Promise.all([
      User.countDocuments(),
      Creator.countDocuments(),
      Content.countDocuments(),
      Admin.countDocuments(),
      Subscription.countDocuments(),
      SupportTicket.countDocuments(),
      SupportTicket.countDocuments({ status: "Open" }),
      AuditLog.countDocuments({ severity: "Critical" }),
      Storage.countDocuments(),
      Payment.find({}).select("amount"),
    ]);

    // Calculate total revenue from payments
    const totalRevenueRaw = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const totalRevenue =
      totalRevenueRaw >= 1000000
        ? `$${(totalRevenueRaw / 1000000).toFixed(2)}M`
        : totalRevenueRaw >= 1000
        ? `$${(totalRevenueRaw / 1000).toFixed(1)}K`
        : `$${totalRevenueRaw.toFixed(2)}`;

    // ─── Generate last 6 months labels ───────────────────────────────────────
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return { year: d.getFullYear(), month: d.getMonth(), label: monthNames[d.getMonth()] };
    });

    // ─── User Registrations Trend (last 6 months) ────────────────────────────
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    const userRegAgg = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } }
    ]);

    const creatorRegAgg = await Creator.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } }
    ]);

    // Merge user + creator counts per month
    const regMap = {};
    [...userRegAgg, ...creatorRegAgg].forEach(({ _id, count }) => {
      const key = `${_id.year}-${_id.month}`;
      regMap[key] = (regMap[key] || 0) + count;
    });

    const maxReg = Math.max(...last6Months.map(m => regMap[`${m.year}-${m.month + 1}`] || 0), 1);
    const userRegistrationsTrend = last6Months.map(m => {
      const count = regMap[`${m.year}-${m.month + 1}`] || 0;
      return {
        month: m.label,
        val: Math.round((count / maxReg) * 95) || 5,
        count: count.toLocaleString()
      };
    });

    // ─── Financial Trends (last 6 months income vs estimated expenses) ────────
    const paymentAgg = await Payment.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, total: { $sum: "$amount" } } }
    ]);

    const payMap = {};
    paymentAgg.forEach(({ _id, total }) => {
      payMap[`${_id.year}-${_id.month}`] = total;
    });

    const maxPay = Math.max(...last6Months.map(m => payMap[`${m.year}-${m.month + 1}`] || 0), 1);
    const financialTrends = last6Months.map(m => {
      const inc = payMap[`${m.year}-${m.month + 1}`] || 0;
      const incPct = Math.round((inc / maxPay) * 90) || 5;
      const expPct = Math.round(incPct * 0.38); // simulate ~38% operating cost ratio
      return { month: m.label, inc: incPct, exp: expPct };
    });

    // ─── Net profit margin ────────────────────────────────────────────────────
    const totalInc = paymentAgg.reduce((s, p) => s + p.total, 0);
    const estimatedExp = totalInc * 0.38;
    const netMargin = totalInc > 0 ? Math.round(((totalInc - estimatedExp) / totalInc) * 100) : 0;

    const stats = {
      overview: {
        totalUsers: totalUsers + totalCreators + totalAdmins,
        totalCreators,
        totalContent,
        totalRevenue: totalRevenueRaw > 0 ? totalRevenue : "N/A",
        totalSubscriptions,
        totalTickets,
        openTickets,
        criticalLogs,
        totalStorage,
      },
      userRegistrationsTrend,
      financialTrends,
      netMargin,
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error fetching dashboard stats." });
  }
};
