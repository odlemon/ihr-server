import express from "express";
import {
  createKPI,
  deleteKPI,
  getKPIById,
  getKPIs,
  updateKPI,
  getAllKPIs,
} from "../controllers/kpiController.js";
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protectRoute, isAdminRoute, createKPI);
router.post("/get", protectRoute, isAdminRoute, getKPIs);
router.get("/all", protectRoute, isAdminRoute, getAllKPIs);
router.get("/detail/:id", protectRoute, isAdminRoute, getKPIById);
router.put("/update/:id", protectRoute, isAdminRoute, updateKPI);
router.delete("/delete/:id", protectRoute, isAdminRoute, deleteKPI);

export default router;
