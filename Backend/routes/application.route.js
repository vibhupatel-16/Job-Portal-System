import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { applyJob, getApplicants, getAppliedJobs, updateStatus, getAnalyticsData, getAiMatchScore, getNotifications, generateInterviewQuestions } from '../controllers/application.controller.js';

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated,applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.route("/analytics").get(isAuthenticated, getAnalyticsData);

router.route("/status/:id/ai-scan").get(isAuthenticated, getAiMatchScore);
router.get("/notifications", isAuthenticated, getNotifications);
router.get("/:id/questions", isAuthenticated, generateInterviewQuestions);
export default router;