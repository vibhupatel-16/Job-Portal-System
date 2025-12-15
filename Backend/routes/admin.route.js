import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { checkRole } from "../middlewares/checkRole.js";
import { getAdminStats } from "../controllers/admin.controller.js";

const router = express.Router();

// ADMIN: GET FULL DASHBOARD STATS
router.get("/stats",
  isAuthenticated,
  checkRole("admin"),
  getAdminStats
);

export default router;
