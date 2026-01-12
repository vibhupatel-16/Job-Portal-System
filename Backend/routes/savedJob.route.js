import express from "express";
import {
  saveJob,
  removeSavedJob,
  getSavedJobs,
} from "../controllers/savedJob.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/save-job", isAuthenticated, saveJob);
router.get("/saved-jobs", isAuthenticated, getSavedJobs);
router.delete("/saved-jobs/:jobId", isAuthenticated, removeSavedJob);

export default router;
