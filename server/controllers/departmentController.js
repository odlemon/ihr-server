import asyncHandler from "express-async-handler";
import Department from "../models/departmentModel.js";
import Branch from "../models/branchModel.js"; // Import the Branch model

// POST - Create a new department
const createDepartment = asyncHandler(async (req, res) => {
  const { name, description, branchId } = req.body;

  // Validate that the branch exists
  const branch = await Branch.findById(branchId);
  if (!branch) {
    return res.status(400).json({ status: false, message: "Branch not found" });
  }

  // Check if department already exists
  const departmentExists = await Department.findOne({ name });

  if (departmentExists) {
    return res
      .status(400)
      .json({ status: false, message: "Department already exists" });
  }

  // Create new department
  const department = await Department.create({
    name,
    description,
    branch: branchId, // Set the branch reference
  });

  if (department) {
    res.status(201).json(department);
  } else {
    return res.status(400).json({ status: false, message: "Invalid department data" });
  }
});

// GET - Get all departments or filter by branchId
const getDepartments = asyncHandler(async (req, res) => {
  const { branchId } = req.body; // Extract branchId from request body

  // Check if branchId is provided
  if (!branchId) {
    return res.status(400).json({ message: "branchId is required" });
  }

  const query = { branch: branchId };

  // Fetch departments based on branchId and populate branch field
  const departments = await Department.find(query).populate('branch');

  res.status(200).json(departments);
});


// GET - Get a single department by ID
const getDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const department = await Department.findById(id).populate('branch'); // Populate branch field

  if (department) {
    res.status(200).json(department);
  } else {
    res.status(404).json({ status: false, message: "Department not found" });
  }
});

// PUT - Update a department
const updateDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, branchId } = req.body;

  const department = await Department.findById(id);

  if (department) {
    department.name = name || department.name;
    department.description = description || department.description;

    // Update branch if provided in the request body
    if (branchId) {
      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(400).json({ status: false, message: "Branch not found" });
      }
      department.branch = branchId;
    }

    const updatedDepartment = await department.save(); // Use .save() on the instance

    res.status(200).json({
      status: true,
      message: "Department updated successfully",
      department: updatedDepartment,
    });
  } else {
    res.status(404).json({ status: false, message: "Department not found" });
  }
});

// DELETE - Delete a department
const deleteDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Department.findByIdAndDelete(id);

  res.status(200).json({ status: true, message: "Department deleted successfully" });
});

export {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
