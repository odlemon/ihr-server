import mongoose, { Schema } from "mongoose";

const kpiSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ['Monetary', 'Percentage'],
    },
  },
  { timestamps: true }
);

const KPI = mongoose.model("KPI", kpiSchema);

export default KPI;
