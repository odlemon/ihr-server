import express from "express";
import {
  createBranch,
  deleteBranch,
  getBranchById,
  getBranches,
  updateBranch,
} from "../controllers/branchController.js";
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protectRoute, isAdminRoute, createBranch);
router.get("/get", protectRoute, isAdminRoute, getBranches);
router.get("/detail/:id", protectRoute, isAdminRoute, getBranchById);
router.put("/update/:id", protectRoute, isAdminRoute, updateBranch);
router.delete("/delete/:id", protectRoute, isAdminRoute, deleteBranch);

export default router;
