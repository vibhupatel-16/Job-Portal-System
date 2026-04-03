import { Testimonial } from "../models/testimonial.model.js";

const normalizeRole = (role) => (role || "").toString().trim().toLowerCase();

const validateRating = (rating) => {
  const r = Number(rating);
  if (!Number.isFinite(r)) return null;
  if (r < 1 || r > 5) return null;
  return Math.round(r);
};

// 1) Submit testimonial (jobseeker/employer) -> status: pending
export const submitTestimonial = async (req, res) => {
  try {
    const { content, rating } = req.body;
    const userId = req.id;
    const userRole = normalizeRole(req.user?.role);

    const cleanContent = (content || "").toString().trim();
    const cleanRating = validateRating(rating);

    if (!cleanContent) {
      return res
        .status(400)
        .json({ success: false, message: "Content is required" });
    }
    if (!cleanRating) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
    }
    if (!["jobseeker", "employer"].includes(userRole)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only Jobseeker/Employer can submit testimonial",
        });
    }

    // One per user (simple rule)
    const existing = await Testimonial.findOne({ user: userId });
    if (existing) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You have already shared your feedback!",
        });
    }

    const newTestimonial = await Testimonial.create({
      user: userId,
      content: cleanContent,
      rating: cleanRating,
      role: userRole,
      status: "pending",
      isApproved: false, // backward compatibility
    });

    return res.status(201).json({
      success: true,
      message: "Thank you! Your feedback is sent for admin approval.",
      testimonialId: newTestimonial._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// 2) Public: only approved testimonials (landing page)
export const getApprovedTestimonials = async (req, res) => {
  try {
    const data = await Testimonial.find({ status: "approved" })
      .populate("user", "fullname email role profile")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      testimonials: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching data",
    });
  }
};

// 3) Admin: pending testimonials
export const getPendingTestimonials = async (req, res) => {
  try {
    const pending = await Testimonial.find({ status: "pending" })
      .populate("user", "fullname email role profile")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      testimonials: pending,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching pending testimonials",
    });
  }
};

// 4) Admin: approve testimonial
export const approveTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { status: "approved", isApproved: true },
      { new: true },
    );

    if (!testimonial) {
      return res
        .status(404)
        .json({ message: "Testimonial not found", success: false });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial Approved successfully!",
    });
  } catch (error) {
    return res.status(500).json({ message: "Approval failed", success: false });
  }
};

// 5) Admin: delete/reject testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    await Testimonial.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Testimonial Rejected/Deleted",
    });
  } catch (error) {
    return res.status(500).json({ message: "Deletion failed", success: false });
  }
};
