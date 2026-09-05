const Payment = require("../models/paymentModel");

// Helper function to generate a random transaction ID
const generateTxId = () => {
  return "TXN-" + Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Seed initial payments if empty
const ensureSeedPayments = async () => {
  try {
    const count = await Payment.countDocuments();
    if (count === 0) {
      const defaultPayments = [
        {
          transactionId: generateTxId(),
          userName: "Alice Smith",
          userEmail: "alice@example.com",
          amount: 22.99,
          currency: "USD",
          paymentMethod: "Credit Card",
          status: "Completed",
          planName: "Premium",
        },
        {
          transactionId: generateTxId(),
          userName: "Bob Johnson",
          userEmail: "bob@example.com",
          amount: 9.99,
          currency: "USD",
          paymentMethod: "PayPal",
          status: "Completed",
          planName: "Basic",
        },
        {
          transactionId: generateTxId(),
          userName: "Charlie Brown",
          userEmail: "charlie@example.com",
          amount: 15.99,
          currency: "USD",
          paymentMethod: "Stripe",
          status: "Failed",
          planName: "Standard",
        },
        {
          transactionId: generateTxId(),
          userName: "Diana Prince",
          userEmail: "diana@example.com",
          amount: 22.99,
          currency: "USD",
          paymentMethod: "Credit Card",
          status: "Refunded",
          planName: "Premium",
        },
        {
          transactionId: generateTxId(),
          userName: "Eve Adams",
          userEmail: "eve@example.com",
          amount: 15.99,
          currency: "USD",
          paymentMethod: "Crypto",
          status: "Pending",
          planName: "Standard",
        },
        {
          transactionId: generateTxId(),
          userName: "Frank Castle",
          userEmail: "frank@example.com",
          amount: 9.99,
          currency: "USD",
          paymentMethod: "UPI",
          status: "Completed",
          planName: "Basic",
        }
      ];
      await Payment.insertMany(defaultPayments);
      console.log("Database seeded with default payments");
    }
  } catch (error) {
    console.error("Error seeding payments:", error);
  }
};

// @desc    Get all payments
// @route   GET /api/superadmin/payments
// @access  Private (SuperAdmin)
exports.getPayments = async (req, res) => {
  try {
    await ensureSeedPayments();

    let { page = 1, limit = 10, search, status, method, sort } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: "i" } },
        { userEmail: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } }
      ];
    }
    
    if (status && status !== "all") {
      query.status = status;
    }
    
    if (method && method !== "all") {
      query.paymentMethod = method;
    }

    let sortObj = { createdAt: -1 };
    if (sort === "oldest") sortObj = { createdAt: 1 };
    if (sort === "amount_asc") sortObj = { amount: 1 };
    if (sort === "amount_desc") sortObj = { amount: -1 };

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: payments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch payments",
      error: error.message,
    });
  }
};

// @desc    Get payment statistics
// @route   GET /api/superadmin/payments/stats
// @access  Private (SuperAdmin)
exports.getPaymentStats = async (req, res) => {
  try {
    await ensureSeedPayments();
    
    const [stats] = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "Completed"] }, "$amount", 0]
            }
          },
          refundedAmount: {
            $sum: {
              $cond: [{ $eq: ["$status", "Refunded"] }, "$amount", 0]
            }
          },
          totalTransactions: { $sum: 1 },
          successfulTransactions: {
            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats || { totalRevenue: 0, refundedAmount: 0, totalTransactions: 0, successfulTransactions: 0 }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not generate payment stats",
      error: error.message,
    });
  }
};

// @desc    Refund a payment
// @route   PATCH /api/superadmin/payments/:id/refund
// @access  Private (SuperAdmin)
exports.refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    if (payment.status !== "Completed") {
      return res.status(400).json({ success: false, message: "Only completed payments can be refunded" });
    }

    payment.status = "Refunded";
    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment refunded successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Delete a payment record
// @route   DELETE /api/superadmin/payments/:id
// @access  Private (SuperAdmin)
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    await payment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
