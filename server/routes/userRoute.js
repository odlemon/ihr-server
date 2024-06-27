import express from "express";
import {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getNotificationsList,
  getTeamList,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/get-team", isAdminRoute, getTeamList); // No protectRoute middleware
router.get("/notifications", getNotificationsList); // No protectRoute middleware

router.put("/profile", updateUserProfile); // No protectRoute middleware
router.put("/read-noti", markNotificationRead); // No protectRoute middleware
router.put("/change-password", changeUserPassword); // No protectRoute middleware

// ADMIN ROUTES - protected by isAdminRoute only
router.put("/:id", isAdminRoute, activateUserProfile);
router.delete("/:id", isAdminRoute, deleteUserProfile);

export default router;
