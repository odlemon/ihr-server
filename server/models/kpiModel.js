import mongoose, { Schema } from "mongoose";
import Branch from "./branchModel.js"; // Import the Branch model

// Define the KPI schema with reference to Branch
const kpiSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ['Monetary', 'Percentage'],
    },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true }, // Reference to Branch
  },
  { timestamps: true }
);

const KPI = mongoose.model("KPI", kpiSchema);

export default KPI;
