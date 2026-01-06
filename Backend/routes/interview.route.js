import express from "express";
import { getAllInterviewsForAdmin, scheduleInterview } from "../controllers/interview.controller.js";
import { getJobseekerInterviews, getScheduledInterviewsByCreator } from "../controllers/interview.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js"; // Default import
import { checkRole } from "../middlewares/checkRole.js"; // Role check import

const router = express.Router();

// isAdmin ki jagah isAuthenticated + checkRole('admin') use karein
router.post(
  "/interviews",
  isAuthenticated,
  checkRole("admin", "employer"),
  scheduleInterview
);

router.get("/scheduled-list", isAuthenticated, checkRole("admin", "employer"), getScheduledInterviewsByCreator);

// interview.route.js mein
router.get("/admin/all-interviews", isAuthenticated, checkRole("admin"), getAllInterviewsForAdmin);

router.get("/my-interviews", isAuthenticated, getJobseekerInterviews);

export default router;