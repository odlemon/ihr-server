import mongoose, { Schema } from "mongoose";

const permissionSchema = new Schema({
  name: { type: String, required: true },
  value: { type: Boolean, default: false },
});

const roleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [permissionSchema],
    description: { type: String },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

export default Role;
