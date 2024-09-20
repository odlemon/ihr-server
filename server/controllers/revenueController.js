import asyncHandler from "express-async-handler";
import Revenue from "../models/revenueModel.js";
import Branch from "../models/branchModel.js";
import BranchRevenueModel from "../models/branchRevenueModel.js";
import mongoose from "mongoose";

const createRevenue = asyncHandler(async (req, res) => {
  const { revenueName, startDate, endDate, totalTarget, branchTargets } = req.body;

  if (typeof totalTarget !== 'number' || totalTarget <= 0) {
    return res.status(400).json({ status: false, message: "Invalid total target" });
  }

  if (typeof branchTargets !== 'object' || branchTargets === null) {
    return res.status(400).json({ status: false, message: "Invalid branch targets" });
  }

  const revenue = await Revenue.create({
    totalTarget: totalTarget,
    startDate: startDate,
    endDate: endDate,
    revenueName: revenueName,
    date: new Date(),
  });

  if (revenue) {
    const updatePromises = Object.entries(branchTargets).map(async ([branchId, revenueTarget]) => {
      if (!mongoose.Types.ObjectId.isValid(branchId) || typeof revenueTarget !== 'number') {
        throw new Error("Invalid branchId or revenueTarget");
      }
      return Branch.findByIdAndUpdate(
        branchId,
        { $set: { revenueTarget } },
        { new: true }
      );
    });

    try {
      const updatedBranches = await Promise.all(updatePromises);
      res.status(201).json({
        revenue,
        updatedBranches
      });
    } catch (error) {
      console.error("Error updating branches:", error);
      res.status(500).json({
        status: false,
        message: "An error occurred while updating branches",
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  } else {
    return res.status(400).json({ status: false, message: "Invalid revenue data" });
  }
});

const createBranchRevenue = asyncHandler(async (req, res) => {
  const { revenueAchieved } = req.body;

  if (typeof revenueAchieved !== 'number' || revenueAchieved < 0) {
    return res.status(400).json({ status: false, message: "Invalid revenue achieved value" });
  }

  const branchRevenue = await BranchRevenueModel.create({
    revenueAchieved,
    date: new Date(),
  });

  if (branchRevenue) {
    res.status(201).json({
      status: true,
      message: "Branch revenue created successfully",
      branchRevenue,
    });
  } else {
    res.status(400).json({ status: false, message: "Invalid branch revenue data" });
  }
});

const getAllBranchRevenue = asyncHandler(async (req, res) => {
  const branchRevenues = await BranchRevenueModel.find();

  res.status(200).json(branchRevenues);
});

// Get all revenue entries
const getRevenues = asyncHandler(async (req, res) => {
  const revenues = await Revenue.find();

  res.status(200).json(revenues);
});

// Get a single revenue entry by ID
const getRevenueById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: false, message: "No revenue ID provided" });
    }

    const revenue = await Revenue.findById(id);

    if (revenue) {
      res.status(200).json(revenue);
    } else {
      res.status(404).json({ status: false, message: "Revenue not found" });
    }
  } catch (error) {
    console.error("Error fetching revenue details:", error);
    res.status(500).json({
      status: false,
      message: "An unexpected error occurred while fetching revenue details",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

const updateRevenue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { revenueName, startDate, endDate, totalTarget, branchTargets } = req.body;
  console.log(req.body)
  const revenue = await Revenue.findById(id);

  if (!revenue) {
    return res.status(404).json({ status: false, message: "Revenue not found" });
  }

  // Update revenue fields if provided
  revenue.revenueName = revenueName || revenue.revenueName;
  revenue.startDate = startDate || revenue.startDate;
  revenue.endDate = endDate || revenue.endDate;
  revenue.totalTarget = totalTarget || revenue.totalTarget;

  try {
    // If branch targets are provided, update branches
    if (branchTargets && typeof branchTargets === 'object' && !Array.isArray(branchTargets)) {
      const updatePromises = Object.entries(branchTargets).map(async ([branchId, revenueTarget]) => {
        if (!mongoose.Types.ObjectId.isValid(branchId) || typeof revenueTarget !== 'number') {
          throw new Error("Invalid branchId or revenueTarget");
        }
        return Branch.findByIdAndUpdate(
          branchId,
          { $set: { revenueTarget } },
          { new: true }
        );
      });

      await Promise.all(updatePromises);
    }

    // Save the updated revenue
    const updatedRevenue = await revenue.save();

    res.status(200).json({
      status: true,
      message: "Revenue and branches updated successfully",
      revenue: updatedRevenue,
    });
  } catch (error) {
    console.error("Error updating branches:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating branches",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});


// Delete a revenue entry
const deleteRevenue = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Revenue.findByIdAndDelete(id);

  res.status(200).json({ status: true, message: "Revenue deleted successfully" });
});

export {
  createRevenue,
  getRevenues,
  getRevenueById,
  updateRevenue,
  deleteRevenue,
  createBranchRevenue,
  getAllBranchRevenue,
};
