import express from "express";
import {
  createKPI,
  deleteKPI,
  getKPIById,
  getKPIs,
  updateKPI,
} from "../controllers/kpiController.js"; // Adjust the path as necessary
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes for KPI operations
router.post("/create", protectRoute, isAdminRoute, createKPI);
router.get("/get", protectRoute, isAdminRoute, getKPIs);
router.get("/detail/:id", protectRoute, isAdminRoute, getKPIById);
router.put("/update/:id", protectRoute, isAdminRoute, updateKPI);
router.delete("/delete/:id", protectRoute, isAdminRoute, deleteKPI);

export default router;
