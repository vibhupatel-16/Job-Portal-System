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

// ✅ ATTRACTIVE EMAIL FOR STATUS UPDATE
const statusColor = status === "accepted" ? "#10b981" : "#ef4444"; // Green for accepted, Red for rejected

await sendEmail({
  email: application.applicant.email,
  subject: `Application Update: ${application.job.title}`,
  message: `Your application status for ${application.job.title} has been updated to ${status}.`, // Fallback
  html: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background-color: ${statusColor}; padding: 20px; text-align: center;">
        <h2 style="color: white; margin: 0; font-size: 22px; letter-spacing: 1px;">Application Update</h2>
      </div>

      <div style="padding: 30px; background-color: #ffffff;">
        <p style="font-size: 18px; color: #1e293b;">Hi <strong>${application.applicant.fullname}</strong>,</p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          Thank you for your interest in the <strong>${application.job.title}</strong> position. We have reviewed your profile and updated your application status:
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; text-align: center; margin: 25px 0;">
          <p style="margin: 0; color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: bold;">New Status</p>
          <h1 style="margin: 10px 0; color: ${statusColor}; font-size: 32px; text-transform: capitalize;">${status}</h1>
        </div>

        ${status === 'accepted' 
          ? `<p style="color: #475569;">Our recruitment team will contact you shortly regarding the next steps and interview scheduling.</p>` 
          : `<p style="color: #475569;">Although we are not moving forward with your application at this time, we will keep your profile in our database for future opportunities.</p>`
        }

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        
        <p style="font-size: 14px; color: #94a3b8; text-align: center;">
          Sent by <strong>Job Portal Recruitment Team</strong>
        </p>
      </div>
    </div>
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
