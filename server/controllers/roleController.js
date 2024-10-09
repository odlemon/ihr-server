import asyncHandler from "express-async-handler";
import Role from "../models/roleModel.js";
import Branch from "../models/branchModel.js";

const createRole = asyncHandler(async (req, res) => {
  const { name, permissions, description, branchId } = req.body;

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
    permissions, 
    description,
    branch: branchId,
  });

  if (role) {
    res.status(201).json(role);
  } else {
    return res.status(400).json({ status: false, message: "Invalid role data" });
  }
});

const getRoles = asyncHandler(async (req, res) => {
  const { branchId } = req.body;
  if (!branchId) {
    return res.status(400).json({ message: "branchId is required" });
  }

  const query = { branch: branchId }; 
  const roles = await Role.find(query).populate('branch');

  res.status(200).json(roles);
});

const getAllRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find().populate('branch');

  res.status(200).json(roles);
});

const getRoleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findById(id).populate('branch'); 

  if (role) {
    res.status(200).json(role);
  } else {
    res.status(404).json({ status: false, message: "Role not found" });
  }
});

const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, permissions, description } = req.body;

  const role = await Role.findById(id);

  if (role) {
    role.name = name || role.name;
    role.description = description || role.description;

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
  getAllRoles,
};
