import { Interview } from "../models/interview.model.js";
import { Application } from "../models/application.model.js";
import sendEmail from "../utils/sendEmail.js";

export const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, date, time, mode, meetingLink } = req.body;

    // 🔹 Role detect
    const scheduledByRole = req.user.role; // admin / employer
    const scheduledById = req.id;

    const application = await Application.findById(applicationId)
      .populate({
        path: "job",
        populate: { path: "company" }
      })
      .populate("applicant");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false
      });
    }
    // interview.controller.js mein line 26 ke baad add karein
// console.log("Job Created By ID:", application.job.created_by.toString());
// console.log("Logged-in User ID:", scheduledById);
    // 🔐 Employer safety check
  // interview.controller.js mein safety check ko aise update karein:

if (
  scheduledByRole === "employer" &&
  application.job.created_by.toString() !== scheduledById.toString() // ✅ Dono ko string banayein
) {
  return res.status(403).json({
    message: "You are not allowed to schedule interview for this job",
    success: false
  });
}

    const interview = await Interview.create({
      application: application._id,
      job: application.job._id,
      company: application.job.company._id,
      jobseeker: application.applicant._id,
      date,
      time,
      mode,
      meetingLink,

      // ⭐ NEW (optional but important)
      scheduledBy: scheduledById,
      scheduledByRole
    });

    /* ================= 🚀 SOCKET.IO REAL-TIME NOTIFICATION ================= */
    if (req.io) {
      const notificationData = {
        type: "INTERVIEW_SCHEDULED",
        title: "New Interview Scheduled!",
        message: `Your interview for ${application.job.title} at ${application.job.company.name} is fixed for ${date} at ${time}.`,
        interviewId: interview._id,
        details: { date, time, mode, meetingLink }
      };

      // Specific applicant ko socket ke through message bhejna
      req.io.to(application.applicant._id.toString()).emit("notification", notificationData);
    }

    /* ================= EMAIL (UNCHANGED) ================= */
    const emailHtml = `
      <div style="font-family: Arial; max-width: 600px;">
        <h2 style="color:#2563eb">Interview Scheduled</h2>
        <p>Hi <b>${application.applicant.fullname}</b>,</p>
        <p>
          Your interview for <b>${application.job.title}</b> at
          <b>${application.job.company.name}</b> has been scheduled.
        </p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Time:</b> ${time}</p>
        <p><b>Mode:</b> ${mode.toUpperCase()}</p>

        ${mode === "online" && meetingLink ? `
          <a href="${meetingLink}">Join Interview</a>
        ` : ""}

        <p>Regards,<br/>
        ${application.job.company.name} Recruitment Team</p>
      </div>
    `;

    await sendEmail({
      email: application.applicant.email,
      subject: `Interview: ${application.job.title}`,
      message: `Interview scheduled on ${date} at ${time}`,
      html: emailHtml
    });

    return res.status(201).json({
      success: true,
      message: "Interview scheduled successfully",
      interview
    });

  } catch (error) {
    console.error("Scheduling Error:", error);
    res.status(500).json({
      message: "Interview scheduling failed",
      success: false
    });
  }
};

export const getJobseekerInterviews = async (req, res) => {
  try {
    const userId = req.id; // isAuthenticated middleware se mil raha hai

    const interviews = await Interview.find({ jobseeker: userId })
      .populate({
        path: "job",
        populate: { path: "company" }
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      interviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch interviews" });
  }
};


export const getScheduledInterviewsByCreator = async (req, res) => {
    try {
        const userId = req.id; // Logged-in user ki ID

        // Hum un interviews ko dhoondhenge jahan "application" ke andar job ka "created_by" wahi user ho
        // Ya fir simple rasta: Agar aapne Interview model mein 'company' save ki hai:
        const interviews = await Interview.find()
            .populate({
                path: 'application',
                populate: { path: 'applicant', select: 'fullname email phoneNumber' }
            })
            .populate({
                path: 'job',
                match: { created_by: userId } // Sirf wahi jobs jo is user ne banayi hain
            })
            .populate('company');

        // Filter karein taaki sirf wahi interviews dikhein jo is employer ke jobs ke hain
        const myScheduledInterviews = interviews.filter(item => item.job !== null);

        return res.status(200).json({
            success: true,
            interviews: myScheduledInterviews
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
}

// interview.controller.js mein add karein
export const getAllInterviewsForAdmin = async (req, res) => {
    try {
        // Admin ke liye koi filter nahi, bas saara data populate karke nikalna hai
        const interviews = await Interview.find()
            .populate({
                path: 'application',
                populate: { path: 'applicant', select: 'fullname email' }
            })
            .populate('job', 'title')
            .populate('company', 'name')
            .sort({ createdAt: -1 }); // Naye interviews upar dikhenge

        return res.status(200).json({
            success: true,
            interviews
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
}
