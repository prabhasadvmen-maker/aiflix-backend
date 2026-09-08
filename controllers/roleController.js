const Role = require("../models/roleModel");

// Default roles to seed if collection is empty
const defaultRoles = [
  {
    name: "Super Admin",
    description: "Has full access to all modules and system settings.",
    permissions: [
      "manage_users", "manage_content", "manage_financials", 
      "manage_infra", "manage_settings", "manage_roles", "manage_support"
    ],
    usersCount: 1,
    isCustom: false,
    status: "Active"
  },
  {
    name: "Moderator",
    description: "Can manage content and support tickets, but no access to financials or settings.",
    permissions: ["manage_content", "manage_support"],
    usersCount: 3,
    isCustom: false,
    status: "Active"
  },
  {
    name: "Financial Analyst",
    description: "Can only view and manage financial data.",
    permissions: ["manage_financials"],
    usersCount: 2,
    isCustom: false,
    status: "Active"
  }
];

// @desc    Get all roles (with auto-seeding)
// @route   GET /api/superadmin/roles
// @access  Private/SuperAdmin
exports.getRoles = async (req, res) => {
  try {
    let roles = await Role.find().sort({ createdAt: 1 });

    // Auto-seed if collection is empty
    if (roles.length === 0) {
      await Role.insertMany(defaultRoles);
      roles = await Role.find().sort({ createdAt: 1 });
    }

    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Server error fetching roles." });
  }
};

// @desc    Create a new custom role
// @route   POST /api/superadmin/roles
// @access  Private/SuperAdmin
exports.createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Role name is required." });
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: "Role with this name already exists." });
    }

    const newRole = new Role({
      name,
      description,
      permissions: permissions || [],
      isCustom: true,
      usersCount: 0
    });

    const savedRole = await newRole.save();
    res.status(201).json(savedRole);
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Server error creating role." });
  }
};

// @desc    Update a role
// @route   PUT /api/superadmin/roles/:id
// @access  Private/SuperAdmin
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;

    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    // Optional: Prevent modifying default Super Admin permissions entirely, though we allow description changes
    if (role.name === "Super Admin" && !role.isCustom) {
      if (permissions && permissions.length === 0) {
        return res.status(400).json({ message: "Cannot remove all permissions from Super Admin." });
      }
    }

    role.name = name || role.name;
    role.description = description !== undefined ? description : role.description;
    role.permissions = permissions || role.permissions;
    if (req.body.status) role.status = req.body.status;

    const updatedRole = await role.save();
    res.status(200).json(updatedRole);
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Server error updating role." });
  }
};

// @desc    Delete a custom role
// @route   DELETE /api/superadmin/roles/:id
// @access  Private/SuperAdmin
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    if (!role.isCustom) {
      return res.status(403).json({ message: "Default system roles cannot be deleted." });
    }

    await Role.findByIdAndDelete(id);
    res.status(200).json({ message: "Role deleted successfully." });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Server error deleting role." });
  }
};

// @desc    Toggle role status (Active/Inactive)
// @route   PATCH /api/superadmin/roles/:id/status
// @access  Private/SuperAdmin
exports.toggleRoleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    if (role.name === "Super Admin" && !role.isCustom) {
      return res.status(400).json({ message: "Super Admin role cannot be deactivated." });
    }

    role.status = role.status === "Active" ? "Inactive" : "Active";
    const updatedRole = await role.save();

    res.status(200).json(updatedRole);
  } catch (error) {
    console.error("Error toggling role status:", error);
    res.status(500).json({ message: "Server error toggling role status." });
  }
};
