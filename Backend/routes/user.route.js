import express from 'express';
import { 
  forgotPassword,  
  login, 
  logout, 
  register, 
  resetPassword, 
  updateProfile,
  recordProfileView
} from '../controllers/user.controller.js';

import isAuthenticated from '../middlewares/isAuthenticated.js';
import { upload } from '../middlewares/multer.js';   // ✔ Correct import
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

// Register user
router.post("/register", upload, register);

// Login
router.post("/login", login);

// Logout
router.get("/logout", isAuthenticated, logout);

// Update profile (resume + profile photo)
router.post("/profile/update", isAuthenticated, upload, updateProfile);

// Forgot / Reset password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Record profile view
router.post("/profile/view/:id", isAuthenticated, recordProfileView);

// Role based routes
router.get("/jobseeker/profile",
  isAuthenticated,
  checkRole("jobseeker"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Jobseeker! You can update your profile and apply for jobs.",
      success: true
    });
  }
);

router.get("/employer/dashboard",
  isAuthenticated,
  checkRole("employer"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Employer! You can post and manage jobs here.",
      success: true
    });
  }
);

router.get("/admin/panel",
  isAuthenticated,
  checkRole("admin"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Super Admin! You can manage users, jobs, and companies.",
      success: true
    });
  }
);

// Me endpoint
router.get("/me", isAuthenticated, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

export default router;
