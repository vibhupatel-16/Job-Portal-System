import express from 'express';
import { submitTestimonial, getApprovedTestimonials, getPendingTestimonials, approveTestimonial, deleteTestimonial } from '../controllers/testimonial.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js'; // Aapki file ka sahi path aur naam check kar lein
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

// Public route: Landing page ke liye
router.get('/approved', getApprovedTestimonials);

// Submit (separate for Jobseeker/Employer)
router.post("/submit/jobseeker", isAuthenticated, checkRole("jobseeker"), submitTestimonial);
router.post("/submit/employer", isAuthenticated, checkRole("employer"), submitTestimonial);
// Backward compatible
router.post('/submit', isAuthenticated, submitTestimonial);


router.get('/pending', isAuthenticated, checkRole("admin"), getPendingTestimonials); 
router.put('/approve/:id', isAuthenticated, checkRole("admin"), approveTestimonial);
router.delete('/delete/:id', isAuthenticated, checkRole("admin"), deleteTestimonial);

export default router;