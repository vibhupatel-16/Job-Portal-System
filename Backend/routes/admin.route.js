import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { checkRole } from "../middlewares/checkRole.js";

import { getAdminStats } from "../controllers/admin.controller.js";
import { getAllUsers, deleteUser } from "../controllers/adminUser.controller.js";
import {
  getAllCompaniesAdmin,
  deleteCompanyAdmin
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

// MANAGE COMPANIES
router.get(
  "/companies",
  isAuthenticated,
  checkRole("admin"),
  getAllCompaniesAdmin
);

router.delete(
  "/companies/:id",
  isAuthenticated,
  checkRole("admin"),
  deleteCompanyAdmin
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


export default router;
