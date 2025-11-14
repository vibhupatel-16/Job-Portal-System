import express from 'express';
import { forgotPassword,  login, logout, register, resetPassword, updateProfile } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { singleUpload } from '../middlewares/multer.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();
router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticated,logout);
router.route("/profile/update").post(isAuthenticated , singleUpload, updateProfile);


// Forgot password routes
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

router.get("/jobseeker/profile",
  isAuthenticated,
  checkRole("jobseeker"), // ✅ remove []
  (req, res) => {
    res.status(200).json({
      message: "Welcome Jobseeker! You can update your profile and apply for jobs.",
      success: true
    });
  }
);

router.get("/employer/dashboard",
  isAuthenticated,
  checkRole("employer"), // ✅ remove []
  (req, res) => {
    res.status(200).json({
      message: "Welcome Employer! You can post and manage jobs here.",
      success: true
    });
  }
);

router.get("/admin/panel",
  isAuthenticated,
  checkRole("admin"), // ✅ remove []
  (req, res) => {
    res.status(200).json({
      message: "Welcome Super Admin! You can manage users, jobs, and companies.",
      success: true
    });
  }
);
export default router;
