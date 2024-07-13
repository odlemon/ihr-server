import asyncHandler from "express-async-handler";
import Task from "../models/taskModel.js";

const evaluatePerformance = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;

    // Find all tasks assigned to the specified user that are not trashed
    const tasks = await Task.find({
      team: userId, 
      isTrashed: false,
    }).populate('team', 'name');

    // Check if no tasks are assigned to the user
    if (tasks.length === 0) {
      return res.status(200).json({ status: false, message: "User has no tasks assigned." });
    }

    // Initialize status counts object with all categories
    const statusCounts = {
      completed: 0,
      'in progress': 0,
      started: 0,
      todo: 0,
      delayed: 0
    };

    // Count tasks for each status category
    tasks.forEach(task => {
      if (statusCounts.hasOwnProperty(task.stage)) {
        statusCounts[task.stage]++;
      }
    });

    // Fetch user details
    const userPerformance = tasks.length > 0 ? tasks[0].team[0] : null;
    if (!userPerformance) {
      return res.status(404).json({ status: false, message: "User not found." });
    }

    const totalTasks = tasks.length;

    // Calculate overall rating based on all status categories
    let totalWeightedScore = 0;
    Object.keys(statusCounts).forEach(status => {
      const weight = getStatusWeight(status);
      totalWeightedScore += statusCounts[status] * weight;
    });

    const overallRating = totalWeightedScore / totalTasks;

    // Construct response object
    const performanceRating = {
      user: userPerformance.name,
      overallRating: overallRating.toFixed(2),
      statusCounts,
      totalTasks,
    };

    // Send successful response
    res.status(200).json({ status: true, performance: performanceRating });
  } catch (error) {
    console.error("Error in evaluatePerformance:", error);
    return res.status(400).json({ status: false, message: error.message });
  }
});

function getStatusWeight(status) {
  switch (status) {
    case 'completed':
      return 5;
    case 'in progress':
      return 4;
    case 'started':
      return 3;
    case 'todo':
      return 2;
    case 'delayed':
      return 1;
    default:
      return 0;
  }
}

export { evaluatePerformance };
