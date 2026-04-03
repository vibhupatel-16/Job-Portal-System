import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { checkRole } from "../middlewares/checkRole.js";
import {
  createSupportTicket,
  getAllSupportTickets,
  getUserSupportTickets,
  getSupportTicketDetail,
  updateSupportTicket,
  deleteSupportTicket,
  getSupportTicketsByStatus,
} from "../controllers/support.controller.js";

const router = express.Router();

// PUBLIC route - Create support ticket
router.post("/create", createSupportTicket);

// PROTECTED routes - User can view their own tickets
router.get("/user/:userId", isAuthenticated, getUserSupportTickets);
router.get("/detail/:ticketId", getSupportTicketDetail);

// ADMIN routes - Manage all tickets
router.get("/all", isAuthenticated, checkRole("admin"), getAllSupportTickets);
router.get(
  "/status/:status",
  isAuthenticated,
  checkRole("admin"),
  getSupportTicketsByStatus,
);
router.put(
  "/update/:ticketId",
  isAuthenticated,
  checkRole("admin"),
  updateSupportTicket,
);
router.delete(
  "/delete/:ticketId",
  isAuthenticated,
  checkRole("admin"),
  deleteSupportTicket,
);

export default router;
