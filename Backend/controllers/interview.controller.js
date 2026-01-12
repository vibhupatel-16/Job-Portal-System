import { Interview } from "../models/interview.model.js";
import { Application } from "../models/application.model.js";
import sendEmail from "../utils/sendEmail.js";

import { Notification } from "../models/notification.model.js"; 

export const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, date, time, mode, meetingLink } = req.body;

    const scheduledByRole = req.user.role; 
    const scheduledById = req.id;

    const application = await Application.findById(applicationId)
      .populate({
        path: "job",
        populate: { path: "company" }
      })
      .populate("applicant");

    if (!application) {
      return res.status(404).json({ message: "Application not found", success: false });
    }

    if (
      scheduledByRole === "employer" &&
      application.job.created_by.toString() !== scheduledById.toString()
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
      scheduledBy: scheduledById,
      scheduledByRole
    });

    /* ================= 🔔 2. SAVE NOTIFICATION TO DATABASE ================= */
    const notification = await Notification.create({
      recipient: application.applicant._id,
      sender: scheduledById,
      type: "INTERVIEW_SCHEDULED",
      title: "New Interview Scheduled!",
      message: `Your interview for ${application.job.title} at ${application.job.company.name} is fixed for ${date} at ${time}.`,
      link: "/jobseeker/interviews" // Frontend link jahan user click karke ja sake
    });

    /* ================= 🚀 SOCKET.IO (Modified to use notification data) ================= */
    if (req.io) {
      const notificationData = {
        id: notification._id, // Saved notification ki ID
        type: notification.type,
        title: notification.title,
        message: notification.message,
        details: { date, time, mode, meetingLink }
      };

      req.io.to(application.applicant._id.toString()).emit("notification", notificationData);
    }

    /* ================= EMAIL LOGIC (SAME) ================= */
    const emailHtml = `
      <div style="font-family: Arial; max-width: 600px;">
        <h2 style="color:#2563eb">Interview Scheduled</h2>
        <p>Hi <b>${application.applicant.fullname}</b>,</p>
        <p>Your interview for <b>${application.job.title}</b> at <b>${application.job.company.name}</b> has been scheduled.</p>
        <p><b>Date:</b> ${date} | <b>Time:</b> ${time}</p>
        <p><b>Mode:</b> ${mode.toUpperCase()}</p>
        ${mode === "online" && meetingLink ? `<a href="${meetingLink}">Join Interview</a>` : ""}
        <p>Regards,<br/>${application.job.company.name} Recruitment Team</p>
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
      message: "Interview scheduled and notification saved!",
      interview
    });

  } catch (error) {
    console.error("Scheduling Error:", error);
    res.status(500).json({ message: "Interview scheduling failed", success: false });
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




// 1. Saari notifications fetch karna (For Bell Icon List)
export const getNotifications = async (req, res) => {
    try {
        const userId = req.id; // Logged-in user ID

        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 }) // Latest notifications upar
            .limit(20); // Last 20 notifications dikhayenge

        return res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// 2. Notification ko "Read" mark karna (Jab user bell icon click kare)
export const markAsRead = async (req, res) => {
    try {
        const userId = req.id;
        
        // Saari unread notifications ko read mark kar dena
        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { $set: { isRead: true } }
        );

        return res.status(200).json({
            message: "Notifications marked as read",
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// 3. Single notification delete karna (Optional)
export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        await Notification.findByIdAndDelete(notificationId);
        return res.status(200).json({
            message: "Notification deleted",
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting notification" });
    }
};