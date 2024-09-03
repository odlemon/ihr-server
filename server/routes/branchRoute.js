import express from "express";
import {
  createBranch,
  deleteBranch,
  getBranchById,
  getBranches,
  updateBranch,
} from "../controllers/branchController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

router.post("/create", protectRoute, checkPermission("can create branches"), createBranch);
router.get("/get", protectRoute, checkPermission("can view branches"), getBranches);
router.get("/detail/:id", protectRoute, checkPermission("can view branch details"), getBranchById);
router.put("/update/:id", protectRoute, checkPermission("can update branches"), updateBranch);
router.delete("/delete/:id", protectRoute, checkPermission("can delete branches"), deleteBranch);

export default router;
