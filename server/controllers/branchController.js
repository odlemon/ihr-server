import asyncHandler from "express-async-handler";
import Branch from "../models/branchModel.js";

// POST - Create a new department
const createBranch = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const branchExists = await Branch.findOne({ name });

  if (branchExists) {
    return res
      .status(400)
      .json({ status: false, message: "branch already exists" });
  }

  const branch = await Branch.create({
    name,
    description,
  });

  if (branch) {
    res.status(201).json(branch);
  } else {
    return res.status(400).json({ status: false, message: "Invalid branch data" });
  }
});

// GET - Get all branches
const getBranches = asyncHandler(async (req, res) => {
  const branches = await Branch.find();

  res.status(200).json(branches);
});

// GET - Get a single department by ID
const getBranchById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: false, message: "No branch ID provided" });
    }

    const branch = await Branch.findById(id);

    if (branch) {
      res.status(200).json(branch);
    } else {
      res.status(404).json({ status: false, message: "Branch not found" });
    }
  } catch (error) {
    console.error("Error fetching branch details:", error); // Log the error on the server
    res.status(500).json({
      status: false,
      message: "An unexpected error occurred while fetching branch details",
      error: error.message, // Include the error message for debugging
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined // Include stack trace only in development
    });
  }
});


// PUT - Update a department
const updateBranch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const branch = await Branch.findById(id);

  if (branch) {
    branch.name = name || branch.name;
    branch.description = description || branch.description;

    const updatedBranch = await Branch.save();

    res.status(200).json({
      status: true,
      message: "branch updated successfully",
      branch: updatedBranch,
    });
  } else {
    res.status(404).json({ status: false, message: "branch not found" });
  }
});

// DELETE - Delete a department
const deleteBranch = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Branch.findByIdAndDelete(id);

  res.status(200).json({ status: true, message: "branch deleted successfully" });
});

export {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
};
