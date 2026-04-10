import express from "express";
import {
  clearAllNotifications,
  deleteNotification,
  getAllInterviewsForAdmin,
  getNotifications,
  markInterviewJoined,
  markAsRead,
  markNotificationAsRead,
  scheduleInterview,
  requestReschedule,
  approveReschedule,
  deleteInterview,
} from "../controllers/interview.controller.js";
import {
  getJobseekerInterviews,
  getScheduledInterviewsByCreator,
} from "../controllers/interview.controller.js";
import {
  getGoogleAuthUrl,
  googleCallback,
} from "../controllers/interview.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js"; // Default import
import { checkRole } from "../middlewares/checkRole.js"; // Role check import
import {
  submitFeedback,
  getFeedbackByInterviewId,
} from "../controllers/interview.controller.js";
import { getBookedSlots } from "../controllers/interview.controller.js";

const router = express.Router();


router.post(
  "/interviews",
  isAuthenticated,
  checkRole("admin", "employer"),
  scheduleInterview,
);

router.get(
  "/scheduled-list",
  isAuthenticated,
  checkRole("admin", "employer"),
  getScheduledInterviewsByCreator,
);


router.get(
  "/admin/all-interviews",
  isAuthenticated,
  checkRole("admin"),
  getAllInterviewsForAdmin,
);

router.get("/my-interviews", isAuthenticated, getJobseekerInterviews);

router.get("/notifications", isAuthenticated, getNotifications);
router.put("/notifications/mark-read", isAuthenticated, markAsRead);
router.put(
  "/notifications/:id/mark-read",
  isAuthenticated,
  markNotificationAsRead,
);
router.delete("/notifications", isAuthenticated, clearAllNotifications);
router.delete("/notifications/:id", isAuthenticated, deleteNotification);

// Is line ko routes mein add karein
router.post("/reschedule-request", isAuthenticated, requestReschedule);

router.post(
  "/approve-reschedule",
  isAuthenticated,
  checkRole("admin", "employer"),
  approveReschedule,
);


router.route("/interview/:id").delete(isAuthenticated, deleteInterview);
router.post("/interview/:id/join", isAuthenticated, markInterviewJoined);
// ⭐ NEW GOOGLE AUTH ROUTES
router.get(
  "/google/auth",
  isAuthenticated,
  checkRole("admin", "employer"),
  getGoogleAuthUrl,
);
router.get("/google/callback", googleCallback); 

router.route("/:interviewId/feedback").post(isAuthenticated, submitFeedback);


router
  .route("/feedback/:interviewId")
  .get(isAuthenticated, getFeedbackByInterviewId);

router.get("/booked-slots", isAuthenticated, getBookedSlots);
export default router;
