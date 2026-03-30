import express from "express";
import { deleteNotification, getAllInterviewsForAdmin, getNotifications, markAsRead, scheduleInterview, requestReschedule, approveReschedule, deleteInterview } from "../controllers/interview.controller.js";
import { getJobseekerInterviews, getScheduledInterviewsByCreator } from "../controllers/interview.controller.js";
import { getGoogleAuthUrl, googleCallback } from "../controllers/interview.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js"; // Default import
import { checkRole } from "../middlewares/checkRole.js"; // Role check import
import { submitFeedback, getFeedbackByInterviewId } from "../controllers/interview.controller.js";
import { getBookedSlots } from "../controllers/interview.controller.js";

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

router.get("/notifications", isAuthenticated, getNotifications);
router.put("/notifications/mark-read", isAuthenticated, markAsRead);
router.delete("/notifications/:id", isAuthenticated, deleteNotification);

// Is line ko routes mein add karein
router.post("/reschedule-request", isAuthenticated, requestReschedule);

router.post("/approve-reschedule", isAuthenticated, checkRole("admin", "employer"), approveReschedule);

// interview.route.js mein add karein
router.route("/interview/:id").delete(isAuthenticated, deleteInterview);
// ⭐ NEW GOOGLE AUTH ROUTES
router.get("/google/auth", isAuthenticated, checkRole("admin", "employer"), getGoogleAuthUrl);
router.get("/google/callback", googleCallback); // Ye public rahega redirection ke liye

router.route("/:interviewId/feedback").post(isAuthenticated, submitFeedback);

// interview.route.js mein ye line add karein
router.route("/feedback/:interviewId").get(isAuthenticated, getFeedbackByInterviewId);

router.get("/booked-slots", isAuthenticated, getBookedSlots);
export default router;