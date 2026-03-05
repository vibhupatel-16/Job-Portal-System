import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { checkRole } from "../middlewares/checkRole.js";
import { upload } from "../middlewares/multer.js";

// ================= CONTROLLERS =================
import { getAdminStats } from "../controllers/admin.controller.js";
import { getAllUsers, deleteUser, toggleUserStatus } from "../controllers/adminUser.controller.js";

import {
  getAllCompaniesAdmin,
  deleteCompanyAdmin,
  createCompanyAdmin,
  updateCompanyAdmin,
  getAllEmployers,
  getCompanyByIdAdmin
} from "../controllers/adminCompany.controller.js";

// JOB CONTROLLERS
import {
  getAllJobsForAdmin,
  deleteJobByAdmin,
  updateJobStatus
} from "../controllers/adminJob.controller.js";

// APPLICATION CONTROLLERS
import {
  getAllApplicationsAdmin,
  deleteApplicationAdmin,
  updateApplicationStatus
} from "../controllers/adminApplication.controller.js";

import { postJob, updateJob } from "../controllers/job.controller.js";

// ✅ INTERVIEW CONTROLLER (ADDED)
import { scheduleInterview } from "../controllers/interview.controller.js";

import { getHiringStats } from "../controllers/application.controller.js";
const router = express.Router();

// ================= ADMIN DASHBOARD =================
router.get(
  "/stats",
  isAuthenticated,
  checkRole("admin"),
  getAdminStats
);

// ================= MANAGE USERS =================
router.get(
  "/users",
  isAuthenticated,
  checkRole("admin"),
  getAllUsers
);

router.delete(
  "/users/:id",
  isAuthenticated,
  checkRole("admin"),
  deleteUser
);

// ================= MANAGE JOBS =================
router.get(
  "/jobs",
  isAuthenticated,
  checkRole("admin"),
  getAllJobsForAdmin
);

router.delete(
  "/jobs/:id",
  isAuthenticated,
  checkRole("admin"),
  deleteJobByAdmin
);

// ADMIN → POST JOB
router.post(
  "/jobs/post",
  isAuthenticated,
  checkRole("admin"),
  postJob
);

// ADMIN → UPDATE JOB
router.put(
  "/jobs/update/:id",
  isAuthenticated,
  checkRole("admin"),
  updateJob
);

router.put("/users/:id/toggle-status", isAuthenticated, checkRole("admin"), toggleUserStatus);

// ================= MANAGE COMPANIES =================
router.get(
  "/companies",
  isAuthenticated,
  checkRole("admin"),
  getAllCompaniesAdmin
);

// CREATE COMPANY
router.post(
  "/companies",
  isAuthenticated,
  checkRole("admin"),
  upload,
  createCompanyAdmin
);

// UPDATE COMPANY
router.put(
  "/companies/:id",
  isAuthenticated,
  checkRole("admin"),
  upload,
  updateCompanyAdmin
);

// DELETE COMPANY
router.delete(
  "/companies/:id",
  isAuthenticated,
  checkRole("admin"),
  deleteCompanyAdmin
);

// GET COMPANY BY ID
router.get(
  "/companies/:id",
  isAuthenticated,
  checkRole("admin"),
  getCompanyByIdAdmin
);

// GET ALL EMPLOYERS (dropdown use)
router.get(
  "/employers",
  isAuthenticated,
  checkRole("admin"),
  getAllEmployers
);

// ================= MANAGE APPLICATIONS =================
router.get(
  "/applications",
  isAuthenticated,
  checkRole("admin"),
  getAllApplicationsAdmin
);

router.delete(
  "/applications/:id",
  isAuthenticated,
  checkRole("admin"),
  deleteApplicationAdmin
);

router.put(
  "/applications/:id/status",
  isAuthenticated,
  checkRole("admin"),
  updateApplicationStatus
);

// ================= INTERVIEW SCHEDULING (✅ ADDED) =================
router.post(
  "/interviews",
  isAuthenticated,
  checkRole("admin", "employer"),
  scheduleInterview
);
router.put(
  "/jobs/:id/status",
  isAuthenticated,
  checkRole("admin"),
  updateJobStatus
);


router.route("/stats").get(isAuthenticated, getHiringStats);


export default router;
