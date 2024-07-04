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

    // Group tasks by user
    const performance = {};
    tasks.forEach(task => {
      task.team.forEach(user => {
        if (user._id.toString() === userId.toString()) {
          if (!performance[user._id]) {
            performance[user._id] = { name: user.name, tasks: [] };
          }
          performance[user._id].tasks.push(task);
        }
      });
    });

    const userPerformance = performance[userId];
    if (!userPerformance) {
      return res.status(404).json({ status: false, message: "User not found or no tasks assigned." });
    }

    const totalTasks = userPerformance.tasks.length;
    const statusCounts = userPerformance.tasks.reduce((counts, task) => {
      counts[task.stage] = (counts[task.stage] || 0) + 1;
      return counts;
    }, {});

    const rating = (
      (statusCounts['completed'] || 0) * 5 +
      (statusCounts['in progress'] || 0) * 4 +
      (statusCounts['started'] || 0) * 3 +
      (statusCounts['todo'] || 0) * 2 +
      (statusCounts['delayed'] || 0) * 1
    ) / totalTasks;

    const performanceRating = {
      user: userPerformance.name,
      rating: rating.toFixed(2),
      statusCounts,
      totalTasks,
    };

    res.status(200).json({ status: true, performance: performanceRating });
  } catch (error) {
    console.error("Error in evaluatePerformance:", error);
    return res.status(400).json({ status: false, message: error.message });
  }
});

export { evaluatePerformance };
