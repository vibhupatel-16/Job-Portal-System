import { Application } from "../models/application.model.js";
import sendEmail from "../utils/sendEmail.js";

// ================= GET ALL APPLICATIONS (ADMIN) =================
export const getAllApplicationsAdmin = async (req, res) => {
  try {
    const { status, companyId } = req.query;

    let matchQuery = {};

    // ✅ STATUS FILTER
    if (status) {
      matchQuery.status = status;
    }

    let applications = await Application.find(matchQuery)
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name"
        }
      })
      .populate("applicant", "fullname email profile")
      .sort({ createdAt: -1 });

    // ✅ COMPANY FILTER (FIXED & SAFE)
    if (companyId) {
      applications = applications.filter(
        (app) =>
          app.job &&
          app.job.company &&
          app.job.company._id.toString() === companyId
      );
    }

    res.status(200).json({
      success: true,
      applications
    });

  } catch (error) {
    console.log("ADMIN APPLICATION ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications"
    });
  }
};

// ================= DELETE APPLICATION =================
export const deleteApplicationAdmin = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Application deleted successfully"
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to delete application"
    });
  }
};

// ================= UPDATE STATUS + EMAIL =================
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false });
    }

    const application = await Application.findById(req.params.id)
      .populate("applicant")
      .populate("job");

    if (!application) {
      return res.status(404).json({ success: false });
    }

    application.status = status;
    await application.save();

    // ✅ EMAIL
    await sendEmail({
      email: application.applicant.email,
      subject: "Application Status Updated",
      message: `
Hello ${application.applicant.fullname},

Your application for "${application.job.title}" has been ${status.toUpperCase()}.

Regards,
Job Portal Team
      `
    });

    res.status(200).json({
      success: true,
      application
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};
