const SupportTicket = require("../models/supportTicketModel");

// Default initial data for seeding
const defaultTickets = [
  {
    ticketId: "TCK-1001",
    userEmail: "creator@example.com",
    subject: "Video upload failing",
    description: "I am trying to upload a 4K video but it keeps failing at 99%. Please help.",
    priority: "High",
    category: "Technical",
    status: "Open"
  },
  {
    ticketId: "TCK-1002",
    userEmail: "john.doe@email.com",
    subject: "Double charged for subscription",
    description: "My credit card was charged twice this month for the pro plan.",
    priority: "Urgent",
    category: "Billing",
    status: "In Progress"
  },
  {
    ticketId: "TCK-1003",
    userEmail: "samantha@domain.com",
    subject: "How to change password?",
    description: "I can't find the option to reset my password from the dashboard.",
    priority: "Low",
    category: "Account",
    status: "Resolved"
  }
];

// @desc    Get all support tickets (with auto-seeding)
// @route   GET /api/superadmin/support
// @access  Private/SuperAdmin
exports.getTickets = async (req, res) => {
  try {
    let tickets = await SupportTicket.find().sort({ createdAt: -1 });

    // Auto-seed if collection is empty
    if (tickets.length === 0) {
      await SupportTicket.insertMany(defaultTickets);
      tickets = await SupportTicket.find().sort({ createdAt: -1 });
    }

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error fetching support tickets." });
  }
};

// @desc    Create a new support ticket
// @route   POST /api/superadmin/support
// @access  Private/SuperAdmin
exports.createTicket = async (req, res) => {
  try {
    const { userEmail, subject, description, priority, category, status } = req.body;

    if (!userEmail || !subject || !description) {
      return res.status(400).json({ message: "Email, subject, and description are required." });
    }

    // Generate a unique ticket ID (TCK-XXXX)
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `TCK-${randomNum}`;

    const newTicket = new SupportTicket({
      ticketId,
      userEmail,
      subject,
      description,
      priority: priority || "Medium",
      category: category || "Other",
      status: status || "Open",
    });

    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Server error creating support ticket." });
  }
};

// @desc    Update a support ticket (e.g., status or priority)
// @route   PUT /api/superadmin/support/:id
// @access  Private/SuperAdmin
exports.updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedTicket = await SupportTicket.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: "Server error updating ticket." });
  }
};

// @desc    Delete a support ticket
// @route   DELETE /api/superadmin/support/:id
// @access  Private/SuperAdmin
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTicket = await SupportTicket.findByIdAndDelete(id);

    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    res.status(200).json({ message: "Ticket deleted successfully." });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Server error deleting ticket." });
  }
};
