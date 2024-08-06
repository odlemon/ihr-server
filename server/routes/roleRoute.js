import express from "express";
import {
  createRole,
  deleteRole,
  getRoleById,
  getRoles,
  updateRole,
} from "../controllers/roleController.js";
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protectRoute, isAdminRoute, createRole);
router.post("/get", protectRoute, isAdminRoute, getRoles);
router.get("/detail/:id", protectRoute, isAdminRoute, getRoleById);
router.put("/update/:id", protectRoute, isAdminRoute, updateRole);
router.delete("/delete/:id", protectRoute, isAdminRoute, deleteRole);

export default router;
