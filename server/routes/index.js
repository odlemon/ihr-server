import express from "express";
import userRoutes from "./userRoute.js";
import taskRoutes from "./taskRoute.js";
import roleRoutes from "./roleRoute.js";
import departmentRoutes from "./departmentRoute.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/task", taskRoutes);
router.use("/role", roleRoutes);
router.use("/department", departmentRoutes);

export default router;
