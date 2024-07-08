import express from "express";
import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
} from "../controllers/departmentController.js";
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protectRoute, isAdminRoute, createDepartment);
router.get("/get", protectRoute, isAdminRoute, getDepartments);
router.get("/detail/:id", protectRoute, isAdminRoute, getDepartmentById);
router.put("/update/:id", protectRoute, isAdminRoute, updateDepartment);
router.delete("/delete/:id", protectRoute, isAdminRoute, deleteDepartment);

export default router;
