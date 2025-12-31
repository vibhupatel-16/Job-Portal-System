import { Application } from "../models/application.model.js";
import sendEmail from "../utils/sendEmail.js";

// GET ALL APPLICATIONS (ADMIN)
export const getAllApplicationsAdmin = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job", "title")
      .populate("applicant", "fullname email");

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load applications",
    });
  }
};

// DELETE APPLICATION (ADMIN)
export const deleteApplicationAdmin = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete application",
    });
  }
};


export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // 🔍 STEP 1: Find application with applicant & job
    const application = await Application.findById(req.params.id)
      .populate("applicant")
      .populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // ✅ STEP 2: Update status
    application.status = status;
    await application.save();

    // 📧 STEP 3: Send email to applicant
    await sendEmail({
      email: application.applicant.email,
      subject: "Application Status Updated",
      message: `
Hello ${application.applicant.fullname},

Your job application status has been updated by the admin.

Job Title: ${application.job.title}
Current Status: ${status.toUpperCase()}

Thank you for applying.
We wish you all the best!

Regards,
Job Portal Team
      `
    });

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      application,
    });

  } catch (error) {
    console.log("ADMIN STATUS UPDATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};
