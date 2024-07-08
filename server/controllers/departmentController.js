import asyncHandler from "express-async-handler";
import Department from "../models/departmentModel.js";

// POST - Create a new department
const createDepartment = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const departmentExists = await Department.findOne({ name });

  if (departmentExists) {
    return res
      .status(400)
      .json({ status: false, message: "department already exists" });
  }

  const department = await Department.create({
    name,
    description,
  });

  if (department) {
    res.status(201).json(department);
  } else {
    return res.status(400).json({ status: false, message: "Invalid department data" });
  }
});

// GET - Get all departments
const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find();

  res.status(200).json(departments);
});

// GET - Get a single department by ID
const getDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const department = await Department.findById(id);

  if (department) {
    res.status(200).json(department);
  } else {
    res.status(404).json({ status: false, message: "department not found" });
  }
});

// PUT - Update a department
const updateDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const department = await Department.findById(id);

  if (department) {
    department.name = name || department.name;
    department.description = description || department.description;

    const updatedDepartment = await Department.save();

    res.status(200).json({
      status: true,
      message: "department updated successfully",
      department: updatedDepartment,
    });
  } else {
    res.status(404).json({ status: false, message: "department not found" });
  }
});

// DELETE - Delete a department
const deleteDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Department.findByIdAndDelete(id);

  res.status(200).json({ status: true, message: "department deleted successfully" });
});

export {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
