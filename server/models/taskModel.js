import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, default: new Date() },
    priority: {
      type: String,
      default: "normal",
      enum: ["high", "medium", "normal", "low"],
    },
    stage: {
      type: String,
      default: "todo",
      enum: ["todo", "in progress", "completed"],
    },
    status: {
      type: String,
      enum: [
        "Started",
        "Delayed",
        "Mid-way",
        "Complete",
        "Amber Zone",
        "Red Zone",
      ],
    },
    activities: [
      {
        type: {
          type: String,
          default: "assigned",
          enum: ["todo", "in progress", "completed"],
        },
        activity: String,
        date: { type: Date, default: new Date() },
        by: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    subTasks: [
      {
        title: String,
        date: Date,
        tag: String,
      },
    ],
    assets: [String],
    team: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isTrashed: { type: Boolean, default: false },
    monetaryValue: { type: Number, default: 0 },
    duration: { type: Number }, // New field for duration
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
