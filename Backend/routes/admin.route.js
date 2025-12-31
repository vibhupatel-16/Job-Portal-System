import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { checkRole } from "../middlewares/checkRole.js";
 import { upload } from "../middlewares/multer.js";

import { getAdminStats } from "../controllers/admin.controller.js";
import { getAllUsers, deleteUser } from "../controllers/adminUser.controller.js";
import {
  getAllCompaniesAdmin,
  deleteCompanyAdmin,
  createCompanyAdmin,
  updateCompanyAdmin,
  getAllEmployers,
  getCompanyByIdAdmin
} from "../controllers/adminCompany.controller.js";



// 🆕 JOB CONTROLLERS
import {
  getAllJobsForAdmin,
  deleteJobByAdmin
} from "../controllers/adminJob.controller.js";

import {
  getAllApplicationsAdmin,
  deleteApplicationAdmin
} from "../controllers/adminApplication.controller.js";
import { updateApplicationStatus } from "../controllers/adminApplication.controller.js";

import { postJob, updateJob } from "../controllers/job.controller.js";


const router = express.Router();

// ================= ADMIN DASHBOARD =================
router.get(
  "/stats",
  isAuthenticated,
  checkRole("admin"),
  getAdminStats
);

// ================= MANAGE USERS ====================
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

// ================= MANAGE JOBS =====================
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


// GET ALL COMPANIES
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
  upload,              // ✅ SAME AS company.route.js
  createCompanyAdmin
);

// UPDATE COMPANY
router.put(
  "/companies/:id",
  isAuthenticated,
  checkRole("admin"),
  upload,              // ✅ SAME AS company.route.js
  updateCompanyAdmin
);

// DELETE COMPANY
router.delete(
  "/companies/:id",
  isAuthenticated,
  checkRole("admin"),
  deleteCompanyAdmin
);

// GET ALL EMPLOYERS (for dropdown)
router.get(
  "/employers",
  isAuthenticated,
  checkRole("admin"),
  getAllEmployers
);

router.get(
  "/companies/:id",
  isAuthenticated,
  checkRole("admin"),
  getCompanyByIdAdmin
);



// MANAGE APPLICATIONS
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

router.get(
  "/employers",
  isAuthenticated,
  checkRole("admin"),
  getAllEmployers
);


export default router;
