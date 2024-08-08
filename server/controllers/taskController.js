import asyncHandler from "express-async-handler";
import Notice from "../models/notis.js";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import KPI from "../models/kpiModel.js"; 

const createTask = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.user;
    const { 
      title, team, stage, date, priority, assets, 
      monetaryValue, percentValue, kpi,
      monetaryValueAchieved, percentValueAchieved, branch
    } = req.body;

    let kpiData;
    if (kpi && kpi.id) {
      const kpiRecord = await KPI.findById(kpi.id);
      if (!kpiRecord) {
        return res.status(400).json({ status: false, message: "Invalid KPI selected." });
      }
      kpiData = {
        id: kpi.id,
        name: kpi.name || kpiRecord.name,
        type: kpi.type || kpiRecord.type
      };
    }

    let text = "New task has been assigned to you";
    if (team?.length > 1) {
      text = text + ` and ${team?.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set as ${priority} priority, so check and act accordingly. The task date is ${new Date(date).toDateString()}. Thank you!!!`;

    const activity = {
      type: "todo",
      activity: text,
      date: new Date(),
      by: userId,
    };

    const task = await Task.create({
      title,
      team,
      date,
      branch,
      priority: priority.toLowerCase(),
      stage: stage.toLowerCase(),
      assets,
      activities: [activity],
      monetaryValue,
      percentValue,
      monetaryValueAchieved: monetaryValueAchieved || 0,
      percentValueAchieved: percentValueAchieved || 0,
      kpi: kpiData ? kpiData : null,
    });

    await Notice.create({
      team,
      text,
      task: task._id,
    });

    res.status(200).json({ status: true, task, message: "Task created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    title, date, team, stage, priority, assets, 
    monetaryValue, percentValue, kpi, 
    monetaryValueAchieved, percentValueAchieved
  } = req.body;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found." });
    }

    let kpiData;
    if (kpi && kpi.id) {
      const kpiRecord = await KPI.findById(kpi.id);
      if (!kpiRecord) {
        return res.status(400).json({ status: false, message: "Invalid KPI selected." });
      }
      kpiData = {
        id: kpi.id,
        name: kpi.name || kpiRecord.name,
        type: kpi.type || kpiRecord.type
      };
    }

    task.title = title || task.title;
    task.date = date || task.date;
    task.priority = priority ? priority.toLowerCase() : task.priority;
    task.assets = assets || task.assets;
    task.stage = stage ? stage.toLowerCase() : task.stage;
    task.team = team || task.team;
    task.monetaryValue = monetaryValue || task.monetaryValue;
    task.percentValue = percentValue || task.percentValue;
    task.monetaryValueAchieved = monetaryValueAchieved || task.monetaryValueAchieved;
    task.percentValueAchieved = percentValueAchieved || task.percentValueAchieved;
    task.kpi = kpiData ? kpiData : task.kpi;

    await task.save();

    res.status(200).json({ status: true, message: "Task updated successfully.", task });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
});

const duplicateTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found." });
    }

    let text = "New task has been assigned to you";
    if (task.team?.length > 1) {
      text = text + ` and ${task.team?.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set as ${
        task.priority
      } priority, so check and act accordingly. The task date is ${new Date(
        task.date
      ).toDateString()}. Thank you!!!`;

    const activity = {
      type: "todo",
      activity: text,
      by: userId,
    };

    const newTask = await Task.create({
      ...task.toObject(),
      title: "Duplicate - " + task.title,
      activities: [activity],
      monetaryValueAchieved: 0,
      percentValueAchieved: 0,
      kpi: task.kpi
    });

    await Notice.create({
      team: newTask.team,
      text,
      task: newTask._id,
    });

    res
      .status(200)
      .json({ status: true, message: "Task duplicated successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});


const updateTaskStage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, monetaryValueAchieved, percentValueAchieved } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found." });
    }

    task.stage = stage.toLowerCase();

    if (monetaryValueAchieved) {
      task.monetaryValueAchieved = (task.monetaryValueAchieved || 0) + monetaryValueAchieved;
    }

    if (percentValueAchieved) {
      task.percentValueAchieved = (task.percentValueAchieved || 0) + percentValueAchieved;
    }

    await task.save();

    res.status(200).json({ 
      status: true, 
      message: "Task stage and achievements updated successfully.",
      task: {
        stage: task.stage,
        monetaryValueAchieved: task.monetaryValueAchieved,
        percentValueAchieved: task.percentValueAchieved
      }
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

const createSubTask = asyncHandler(async (req, res) => {
  const { title, tag, date } = req.body;
  const { id } = req.params;

  try {
    const newSubTask = {
      title,
      date,
      tag,
    };

    const task = await Task.findById(id);

    task.subTasks.push(newSubTask);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "SubTask added successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

const getTasks = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.user;
  const { stage, isTrashed, search } = req.query;

  let query = { isTrashed: isTrashed ? true : false };

  if (!isAdmin) {
    query.team = { $all: [userId] };
  }
  if (stage) {
    query.stage = stage;
  }

  if (search) {
    const searchQuery = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { stage: { $regex: search, $options: "i" } },
        { priority: { $regex: search, $options: "i" } },
      ],
    };
    query = { ...query, ...searchQuery };
  }

  let queryResult = Task.find(query)
    .populate({
      path: "team",
      select: "name title email",
    })
    .sort({ _id: -1 });

  const tasks = await queryResult;

  res.status(200).json({
    status: true,
    tasks,
  });
});

const getAllTasks = asyncHandler(async (req, res) => {
  let queryResult = Task.find({})
    .populate({
      path: "team",
      select: "name title email",
    })
    .sort({ _id: -1 });

  const tasks = await queryResult;

  res.status(200).json({
    status: true,
    tasks,
  });
});


const getTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate({
        path: "team",
        select: "name title role email",
      })
      .populate({
        path: "activities.by",
        select: "name",
      })
      .sort({ _id: -1 });

    res.status(200).json({
      status: true,
      task,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch task", error);
  }
});
const postTaskActivity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { type, activity, monetaryValueAchieved, percentValueAchieved } = req.body;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    const data = {
      type,
      activity,
      by: userId,
    };
    task.activities.push(data);

    if (type === "completed") {
      task.stage = "completed";
    } else if (type === "in progress") {
      task.stage = "in progress";
    } else if (type === "todo") {
      task.stage = "todo";
    }

    if (task.kpi?.type === "Monetary" && monetaryValueAchieved) {
      task.monetaryValueAchieved = (task.monetaryValueAchieved || 0) + monetaryValueAchieved;
    } else if (task.kpi?.type === "Percentage" && percentValueAchieved) {
      task.percentValueAchieved = (task.percentValueAchieved || 0) + percentValueAchieved;
    }

    await task.save();

    res.status(200).json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});


const trashTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    task.isTrashed = true;

    await task.save();

    res.status(200).json({
      status: true,
      message: `Task trashed successfully.`,
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

const deleteRestoreTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const resp = await Task.findById(id);

      resp.isTrashed = false;

      resp.save();
    } else if (actionType === "restoreAll") {
      await Task.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } }
      );
    }

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

const dashboardStatistics = asyncHandler(async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;

    // Fetch all tasks from the database
    const allTasks = isAdmin
      ? await Task.find({ isTrashed: false })
          .populate({
            path: "team",
            select: "name role title email department",
          })
          .sort({ _id: -1 })
      : await Task.find({
          isTrashed: false,
          team: { $all: [userId] },
        })
          .populate({
            path: "team",
            select: "name role title email department",
          })
          .sort({ _id: -1 });

    // Add department field to each task
    const tasksWithDepartments = allTasks.map((task) => {
      const departments = task.team.map((member) => member.department).filter(Boolean);
      const uniqueDepartments = [...new Set(departments)];
      return { ...task.toObject(), department: uniqueDepartments.join(", ") };
    });

    const users = await User.find({ isActive: true })
      .select("name title role isActive department createdAt")
      .limit(10)
      .sort({ _id: -1 });

    // Group tasks by stage and calculate counts
    const groupedTasks = tasksWithDepartments.reduce((result, task) => {
      const stage = task.stage;
      result[stage] = (result[stage] || 0) + 1;
      return result;
    }, {});

    const graphData = Object.entries(
      tasksWithDepartments.reduce((result, task) => {
        const { priority } = task;
        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    const totalTasks = tasksWithDepartments.length;
    const last10Task = tasksWithDepartments.slice(0, 10);

    const departmentPerformance = tasksWithDepartments.reduce((result, task) => {
      task.team.forEach((member) => {
        const department = member.department;
        if (!department) return;

        if (!result[department]) {
          result[department] = { completed: 0, overdue: 0, inProgress: 0 };
        }

        const statusLower = task.status?.toLowerCase();
        if (statusLower === 'complete' || task.stage === 'completed') {
          result[department].completed += 1;
        } else if (statusLower === 'in progress' || task.stage === 'in progress') {
          result[department].inProgress += 1;
        } else if (new Date(task.date) < new Date()) {
          result[department].overdue += 1;
        }
      });
      return result;
    }, {});

    const kpiSummary = {};
    const branchSummary = {};

    tasksWithDepartments.forEach((task) => {
      const kpiName = task.kpi?.name || 'Uncategorized';
      const branch = task.branch || 'Unspecified';
      const statusLower = task.status?.toLowerCase();
      const isCompleted = statusLower === 'complete' || task.stage === 'completed';
      const monetaryValue = task.monetaryValue || 0;
      const percentValue = task.percentValue || 0;
      const type = task.kpi?.type || 'Monetary';

      // KPI Summary
      if (!kpiSummary[kpiName]) {
        kpiSummary[kpiName] = {
          totalMonetaryValue: 0,
          completedMonetaryValue: 0,
          revenueTarget: 0,
          revenueAchieved: 0,
          totalPercentageValue: 0,
          completedPercentageValue: 0,
          percentageRevenueTarget: 0,
          percentageRevenueAchieved: 0,
          branch: branch,
          type: type
        };
      }
      if (type === 'Monetary') {
        kpiSummary[kpiName].totalMonetaryValue += monetaryValue;
        if (isCompleted) {
          kpiSummary[kpiName].completedMonetaryValue += monetaryValue;
        }
      } else if (type === 'Percentage') {
        kpiSummary[kpiName].totalPercentageValue += percentValue;
        if (isCompleted) {
          kpiSummary[kpiName].completedPercentageValue += percentValue;
        }
      }

      // Branch Summary
      if (!branchSummary[branch]) {
        branchSummary[branch] = {
          totalMonetaryValue: 0,
          completedMonetaryValue: 0,
          revenueTarget: 0,
          revenueAchieved: 0,
          totalPercentageValue: 0,
          completedPercentageValue: 0,
          percentageRevenueTarget: 0,
          percentageRevenueAchieved: 0,
        };
      }
      if (type === 'Monetary') {
        branchSummary[branch].totalMonetaryValue += monetaryValue;
        if (isCompleted) {
          branchSummary[branch].completedMonetaryValue += monetaryValue;
        }
      } else if (type === 'Percentage') {
        branchSummary[branch].totalPercentageValue += percentValue;
        if (isCompleted) {
          branchSummary[branch].completedPercentageValue += percentValue;
        }
      }
    });

    // Calculate revenue target and achieved for each KPI and branch
    const calculateRevenue = (summary) => {
      Object.keys(summary).forEach(key => {
        const data = summary[key];
        if (data.type === 'Monetary') {
          data.revenueTarget = data.totalMonetaryValue - data.completedMonetaryValue;
          data.revenueAchieved = data.completedMonetaryValue;
        } else if (data.type === 'Percentage') {
          data.percentageRevenueTarget = data.totalPercentageValue - data.completedPercentageValue;
          data.percentageRevenueAchieved = data.completedPercentageValue;
        }
      });
    };

    calculateRevenue(kpiSummary);
    calculateRevenue(branchSummary);

    // Calculate overall totals for monetary and percentage values
    const overallMonetaryTotals = Object.values(kpiSummary).reduce((totals, kpi) => {
      if (kpi.type === 'Monetary') {
        totals.totalMonetaryValue += kpi.totalMonetaryValue;
        totals.completedMonetaryValue += kpi.completedMonetaryValue;
      }
      return totals;
    }, { totalMonetaryValue: 0, completedMonetaryValue: 0 });

    overallMonetaryTotals.revenueTarget = overallMonetaryTotals.totalMonetaryValue - overallMonetaryTotals.completedMonetaryValue;
    overallMonetaryTotals.revenueAchieved = overallMonetaryTotals.completedMonetaryValue;

    const overallPercentageTotals = Object.values(kpiSummary).reduce((totals, kpi) => {
      if (kpi.type === 'Percentage') {
        totals.totalPercentageValue += kpi.totalPercentageValue;
        totals.completedPercentageValue += kpi.completedPercentageValue;
      }
      return totals;
    }, { totalPercentageValue: 0, completedPercentageValue: 0 });

    overallPercentageTotals.percentageRevenueTarget = overallPercentageTotals.totalPercentageValue - overallPercentageTotals.completedPercentageValue;
    overallPercentageTotals.percentageRevenueAchieved = overallPercentageTotals.completedPercentageValue;

    // Combine results into a summary object
    const summary = {
      totalTasks,
      last10Task,
      users: isAdmin ? users : [],
      tasks: groupedTasks,
      graphData,
      departmentPerformance,
      kpiSummary,
      branchSummary,
      overallMonetaryTotals,
      overallPercentageTotals
    };

    res.status(200).json({ status: true, ...summary, message: "Successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
});




export {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
  updateTaskStage,
  getAllTasks,
};
