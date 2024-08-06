import mongoose, { Schema } from "mongoose";
import Branch from "./branchModel.js"; // Import the Branch model

const permissionSchema = new Schema({
  name: { type: String, required: true },
  value: { type: Boolean, default: false },
});

const roleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [permissionSchema],
    description: { type: String },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true }, // Reference to Branch
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

export default Role;
