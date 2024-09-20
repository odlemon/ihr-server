import asyncHandler from "express-async-handler";
import Task from "../models/taskModel.js";

const evaluatePerformance = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;

    const tasks = await Task.find({
      team: userId, 
      isTrashed: false,
    }).populate('team', 'name').populate('kpi', 'name');

    if (tasks.length === 0) {
      return res.status(200).json({ status: false, message: "User has no tasks assigned." });
    }

    const statusCounts = {
      completed: 0,
      'in progress': 0,
      started: 0,
      todo: 0,
      delayed: 0
    };

    tasks.forEach(task => {
      if (statusCounts.hasOwnProperty(task.stage)) {
        statusCounts[task.stage]++;
      }
    });

    const userPerformance = tasks.length > 0 ? tasks[0].team[0] : null;
    if (!userPerformance) {
      return res.status(404).json({ status: false, message: "User not found." });
    }

    const totalTasks = tasks.length;
    let totalWeightedScore = 0;
    Object.keys(statusCounts).forEach(status => {
      const weight = getStatusWeight(status);
      totalWeightedScore += statusCounts[status] * weight;
    });

    const overallRating = totalWeightedScore / totalTasks;
    const performanceRating = {
      user: userPerformance.name,
      overallRating: overallRating.toFixed(2),
      statusCounts,
      totalTasks,
      tasks: tasks.map(task => ({
        _id: task._id,
        name: task.title,
        kpiName: task.kpi ? task.kpi.name : 'N/A',
        created_at: task.created_at,
        stage: task.stage,
      })),
    };

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