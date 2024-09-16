import express from "express";
import {
  createRevenue,
//   deleteRevenue,
//   getRevenueById,
//   getRevenues,
      updateRevenue,
      getRevenues
} from "../controllers/revenueController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

router.post("/create", protectRoute, createRevenue);
// router.post("/get", protectRoute, checkPermission("can view revenues"), getRevenues);
 router.get("/all", protectRoute,  getRevenues);
// router.get("/detail/:id", protectRoute, checkPermission("can view revenue details"), getRevenueById);
router.put("/update/:id", protectRoute, updateRevenue);
// router.delete("/delete/:id", protectRoute, checkPermission("can delete revenues"), deleteRevenue);

export default router;
