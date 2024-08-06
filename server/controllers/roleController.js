import asyncHandler from "express-async-handler";
import Role from "../models/roleModel.js";
import Branch from "../models/branchModel.js"; // Import the Branch model

// POST - Create a new role
const createRole = asyncHandler(async (req, res) => {
  const { name, permissions, description, branchId } = req.body;

  // Validate that the branch exists
  const branch = await Branch.findById(branchId);
  if (!branch) {
    return res.status(400).json({ status: false, message: "Branch not found" });
  }

  const roleExists = await Role.findOne({ name });

  if (roleExists) {
    return res
      .status(400)
      .json({ status: false, message: "Role already exists" });
  }

  const role = await Role.create({
    name,
    permissions, // Assuming permissions are sent in the format [{ name: "permission_name", value: true/false }, ...]
    description,
    branch: branchId, // Set the branch reference
  });

  if (role) {
    res.status(201).json(role);
  } else {
    return res.status(400).json({ status: false, message: "Invalid role data" });
  }
});

const getRoles = asyncHandler(async (req, res) => {
  const { branchId } = req.body; // Extract branchId from request body

  // Check if branchId is provided
  if (!branchId) {
    return res.status(400).json({ message: "branchId is required" });
  }

  const query = { branch: branchId }; // Add branch filter if provided

  // Fetch roles based on branchId and populate branch field
  const roles = await Role.find(query).populate('branch');

  res.status(200).json(roles);
});



// GET - Get a single role by ID
const getRoleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findById(id).populate('branch'); // Populate branch field

  if (role) {
    res.status(200).json(role);
  } else {
    res.status(404).json({ status: false, message: "Role not found" });
  }
});

// PUT - Update a role
const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, permissions, description, branchId } = req.body;

  const role = await Role.findById(id);

  if (role) {
    role.name = name || role.name;
    role.description = description || role.description;

    // Update permissions if provided in the request body
    if (permissions) {
      role.permissions = permissions;
    }

    // Update branch if provided in the request body
    if (branchId) {
      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(400).json({ status: false, message: "Branch not found" });
      }
      role.branch = branchId;
    }

    const updatedRole = await role.save();

    res.status(200).json({
      status: true,
      message: "Role updated successfully",
      role: updatedRole,
    });
  } else {
    res.status(404).json({ status: false, message: "Role not found" });
  }
});

// DELETE - Delete a role
const deleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Role.findByIdAndDelete(id);

  res.status(200).json({ status: true, message: "Role deleted successfully" });
});

export {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
