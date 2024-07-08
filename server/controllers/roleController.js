import asyncHandler from "express-async-handler";
import Role from "../models/roleModel.js";

// POST - Create a new role
const createRole = asyncHandler(async (req, res) => {
  const { name, permissions, description } = req.body;

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
  });

  if (role) {
    res.status(201).json(role);
  } else {
    return res.status(400).json({ status: false, message: "Invalid role data" });
  }
});

// GET - Get all roles
const getRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find();

  res.status(200).json(roles);
});

// GET - Get a single role by ID
const getRoleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findById(id);

  if (role) {
    res.status(200).json(role);
  } else {
    res.status(404).json({ status: false, message: "Role not found" });
  }
});

// PUT - Update a role
const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, permissions, description } = req.body;

  const role = await Role.findById(id);

  if (role) {
    role.name = name || role.name;
    role.description = description || role.description;

    // Update permissions if provided in the request body
    if (permissions) {
      role.permissions = permissions;
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
