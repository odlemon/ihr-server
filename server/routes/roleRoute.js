import express from "express";
import {
  createRole,
  deleteRole,
  getRoleById,
  getRoles,
  updateRole,
  getAllRoles,
} from "../controllers/roleController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

// Define permissions based on the operations related to roles
router.post("/create", protectRoute, checkPermission("can create roles"), createRole);
router.post("/get", protectRoute, checkPermission("can view roles"), getRoles);
router.get("/all", protectRoute, checkPermission("can view all roles"), getAllRoles);
router.get("/detail/:id", protectRoute, checkPermission("can view role details"), getRoleById);
router.put("/update/:id", protectRoute, checkPermission("can update roles"), updateRole);
router.delete("/delete/:id", protectRoute, checkPermission("can delete roles"), deleteRole);

export default router;
