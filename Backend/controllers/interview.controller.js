import { google } from "googleapis"
import { Interview } from "../models/interview.model.js";
import { Application } from "../models/application.model.js";
import sendEmail from "../utils/sendEmail.js";

import { Notification } from "../models/notification.model.js"; 

// Google OAuth Setup
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// ⭐ 1. Google Auth URL Generator
export const getGoogleAuthUrl = (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["https://www.googleapis.com/auth/calendar.events"],
    });
    return res.status(200).json({ url, success: true });
};

// interview.controller.js
export const googleCallback = async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        
        console.log("👉 YOUR_REFRESH_TOKEN:", tokens.refresh_token); 

        if (tokens.refresh_token) {
            // Success hone par seedha Employer Dashboard par redirect karein
            // Taaki URL se '?code=...' hat jaye aur refresh karne par error na aaye
            return res.redirect(`http://localhost:5173/employer/dashboard?auth=success`);
        } else {
            return res.status(400).send("Failed to get refresh token. Please try again.");
        }
    } catch (error) {
        console.error("Token Error:", error.message);
        // Error hone par bhi dashboard par bhej dein error message ke sath
        return res.redirect(`http://localhost:5173/employer/dashboard?auth=failed`);
    }
};

export const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, date, time, mode, meetingLink } = req.body;

    const scheduledByRole = req.user.role; 
    const scheduledById = req.id;

    const formattedDate = new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-');

    // Time Format: 02:30 PM
    const formattedTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const application = await Application.findById(applicationId)
      .populate({
        path: "job",
        populate: { path: "company" }
      })
      .populate("applicant");

    if (!application) {
      return res.status(404).json({ message: "Application not found", success: false });
    }
// ⭐ STEP 1: Pehle Security/Role Check karein
    if (scheduledByRole === "employer" && application.job.created_by.toString() !== scheduledById.toString()) {
      return res.status(403).json({
        message: "You are not allowed to schedule interview for this job",
        success: false
      });
    }

    // ⭐ STEP 2: Variable declare karein
    let finalMeetingLink = meetingLink || ""; 

    // ⭐ STEP 3: Automatic Google Meet generation (After security check)
    if (mode === "online") {
        try {
            // Check karein ki token hai ya nahi
            if (!process.env.GOOGLE_REFRESH_TOKEN) {
                console.error("Missing GOOGLE_REFRESH_TOKEN in .env");
            } else {
                oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
                const calendar = google.calendar({ version: "v3", auth: oauth2Client });

                const event = {
                    summary: `Interview: ${application.job.title}`,
                    description: `Candidate: ${application.applicant.fullname} | Company: ${application.job.company.name}`,
                    start: { dateTime: new Date(`${date}T${time}:00`).toISOString(), timeZone: "Asia/Kolkata" },
                    end: { dateTime: new Date(new Date(`${date}T${time}:00`).getTime() + 3600000).toISOString(), timeZone: "Asia/Kolkata" },
                    conferenceData: {
                        createRequest: { requestId: `req-${Date.now()}`, conferenceSolutionKey: { type: "hangoutsMeet" } }
                    },
                };

                const response = await calendar.events.insert({
                    calendarId: "primary",
                    resource: event,
                    conferenceDataVersion: 1,
                });
                finalMeetingLink = response.data.hangoutLink; 
                console.log("Generated Link:", finalMeetingLink);
            }
        } catch (err) {
            console.error("Google Meet API Error:", err.message);
        }
    }

    // ⭐ STEP 4: Create Interview with finalMeetingLink
    const interview = await Interview.create({
      application: application._id,
      job: application.job._id,
      company: application.job.company._id,
      jobseeker: application.applicant._id,
      date,
      time,
      mode,
      meetingLink: finalMeetingLink, // Ab sahi link save hogi
      scheduledBy: scheduledById,
      scheduledByRole: scheduledByRole
    });

    /* ================= 🔔 2. SAVE NOTIFICATION TO DATABASE ================= */
    const notification = await Notification.create({
      recipient: application.applicant._id,
      sender: scheduledById,
      type: "INTERVIEW_SCHEDULED",
      title: "New Interview Scheduled!",
      message: `Your interview for ${application.job.title} at ${application.job.company.name} is fixed for ${formattedDate} at ${formattedTime}.`,
      link: "/jobseeker/interviews" 
    });

    /* ================= 🚀 SOCKET.IO ================= */
    if (req.io) {
      const notificationData = {
        id: notification._id, 
        type: notification.type,
        title: notification.title,
        message: notification.message,
        details: { date, time, mode, meetingLink }
      };
      req.io.to(application.applicant._id.toString()).emit("notification", notificationData);
    }

    /* ================= 📅 GOOGLE CALENDAR LINK LOGIC (NEW) ================= */
    // Format: YYYYMMDDTHHmmSSZ
    const startDateTime = new Date(`${date}T${time}:00`).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDateTime = new Date(new Date(`${date}T${time}:00`).getTime() + 3600000).toISOString().replace(/-|:|\.\d\d\d/g, ""); // 1 Hour Duration
    
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Interview: ${application.job.title} at ${application.job.company.name}`)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(`Meeting Link: ${finalMeetingLink || 'N/A'}`)}&location=${encodeURIComponent(finalMeetingLink || 'Office')}`;

    /* ================= 📧 ATTRACTIVE EMAIL TEMPLATE (UPDATED) ================= */

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #6A38C2; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Interview Invitation</h1>
        </div>
        
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #333;">Hi <b>${application.applicant.fullname}</b>,</p>
          <p style="font-size: 15px; color: #555; line-height: 1.6;">
            Great news! Your application for the <b>${application.job.title}</b> position at <b>${application.job.company.name}</b> has moved to the interview stage.
          </p>
          
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #6A38C2;">
            <p style="margin: 5px 0; color: #333;">📅 <b>Date:</b> ${formattedDate}</p>
            <p style="margin: 5px 0; color: #333;">⏰ <b>Time:</b> ${formattedTime}</p>
            <p style="margin: 5px 0; color: #333;">📍 <b>Mode:</b> ${mode.toUpperCase()}</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            ${mode === "online" && finalMeetingLink ? `
              <a href="${finalMeetingLink}" style="background-color: #6A38C2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-bottom: 15px;">
                Join Interview (Meeting Link)
              </a>
            ` : ""}
            <br/>
            <a href="${googleCalendarUrl}" style="color: #4285F4; text-decoration: none; font-size: 14px; font-weight: 600; border: 1px solid #4285F4; padding: 8px 20px; border-radius: 6px; display: inline-block;">
               🗓️ Add to Google Calendar
            </a>
          </div>

          <p style="font-size: 14px; color: #888; margin-top: 40px; text-align: center; line-height: 1.5;">
            If you have any questions, please feel free to reply to this email.<br/>
            Best of luck with your interview!
          </p>
        </div>

        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #aaa;">
          Sent by <b>${application.job.company.name}</b> Recruitment Team via JobPortal
        </div>
      </div>
    `;

    await sendEmail({
      email: application.applicant.email,
      subject: `Interview Invitation: ${application.job.title} at ${application.job.company.name}`,
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
    .populate('company')
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
        const userId = req.id; 

        const interviews = await Interview.find()
            .populate({
                path: 'application',
                populate: { 
                    path: 'applicant', 
                    select: 'fullname email phoneNumber' 
                }
            })
            .populate('jobseeker', 'fullname email') // ⭐ Seedha jobseeker ko populate karein
            .populate({
                path: 'job',
                match: { created_by: userId } 
            })
            .populate('company');

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
            .populate('jobseeker', 'fullname email')
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

export const requestReschedule = async (req, res) => {
    try {
        const { interviewId, reason, preferredTime } = req.body;
        const [newDate, newTime] = preferredTime.split('T');

        const interview = await Interview.findByIdAndUpdate(interviewId, {
            status: 'reschedule_requested',
            suggestedDate: newDate,
            suggestedTime: newTime,
            rescheduleReason: reason
        }, { new: true });

        // ⭐ Fix: Notification ab 'scheduledBy' wale user ko jayegi
        // Chahe wo Admin ho ya Employer
        await Notification.create({
            recipient: interview.scheduledBy, // Ye wahi insaan hai jisne interview schedule kiya tha
            sender: req.id, // Jobseeker ki ID
            type: "STATUS_UPDATED",
            title: "Reschedule Request Received",
            message: `Candidate has requested a new time for the interview.`,
            link: interview.scheduledByRole === 'admin' ? "/admin/interviews" : "/employer/interviews"
        });

        return res.status(200).json({ message: "Request sent successfully", success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};
export const approveReschedule = async (req, res) => {
    try {
        const { interviewId, newDate, newTime } = req.body;
        const userId = req.id; 

        // ⭐ FIX 1: Populate use karein taaki 'jobseeker' aur 'job' ka data mil sake
        const interview = await Interview.findById(interviewId)
            .populate("jobseeker") // Isse email aur fullname milega
            .populate("job");      // Isse job title milega

        if (!interview) return res.status(404).json({ message: "Interview not found", success: false });

        // Formatting logic
        const formattedDate = new Date(newDate).toLocaleDateString('en-GB').replace(/\//g, '-');
        const formattedTime = new Date(`2000-01-01T${newTime}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        // 2. Google OAuth Setup
        if (!process.env.GOOGLE_REFRESH_TOKEN) {
            return res.status(500).json({ message: "Google Calendar not configured", success: false });
        }

        oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        const startDateTime = new Date(`${newDate}T${newTime}:00`);
        const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); 

        const event = {
            summary: `Rescheduled: ${interview.job?.title || "Interview"}`, // Safe access with ?.
            description: `Interview rescheduled by Employer.`,
            start: { dateTime: startDateTime.toISOString(), timeZone: "Asia/Kolkata" },
            end: { dateTime: endDateTime.toISOString(), timeZone: "Asia/Kolkata" },
            conferenceData: {
                createRequest: { 
                    requestId: `resched-${Date.now()}`, 
                    conferenceSolutionKey: { type: "hangoutsMeet" } 
                },
            },
        };

        const response = await calendar.events.insert({
            calendarId: "primary",
            resource: event,
            conferenceDataVersion: 1,
        });

        const newMeetingLink = response.data.hangoutLink;

        // 5. Database Update
        interview.date = newDate;
        interview.time = newTime;
        interview.meetingLink = newMeetingLink;
        interview.status = 'scheduled'; 
        interview.rescheduleRequest = undefined; 
        await interview.save();

        // 6. Notification save
        await Notification.create({
            recipient: interview.jobseeker._id,
            sender: userId,
            type: "STATUS_UPDATED",
            title: "Reschedule Approved ✅",
            message: `Your interview for ${interview.job?.title} is approved for ${formattedDate} at ${formattedTime}.`,
            link: "/jobseeker/interviews"
        });

        /* ================= 📧 EMAIL TEMPLATE ================= */
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #22c55e; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Reschedule Approved</h1>
            </div>
            <div style="padding: 30px; background-color: #ffffff;">
              <p>Hi <b>${interview.jobseeker?.fullname || "Candidate"}</b>,</p>
              <p>Your request to reschedule the interview for <b>${interview.job?.title || "your applied job"}</b> has been <b>approved</b>.</p>
              
              <div style="background-color: #f0fdf4; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #22c55e;">
                <p style="margin: 5px 0;">📅 <b>New Date:</b> ${formattedDate}</p>
                <p style="margin: 5px 0;">⏰ <b>New Time:</b> ${formattedTime}</p>
              </div>

              <div style="text-align: center; margin-top: 25px;">
                <a href="${newMeetingLink}" style="background-color: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Join Rescheduled Interview
                </a>
              </div>
            </div>
          </div>
        `;

        // ⭐ FIX 2: Ensure email is sent to the populated email field
        await sendEmail({
            email: interview.jobseeker.email, // Ab yeh available hoga populate ki wajah se
            subject: `Reschedule Approved: ${interview.job?.title || "Interview"}`,
            message: `Your interview is rescheduled for ${formattedDate} at ${formattedTime}`,
            html: emailHtml
        });

        return res.status(200).json({ 
            message: "Approved! New link generated and email sent.", 
            success: true 
        });

    } catch (error) {
        console.error("Detailed Error:", error);
        res.status(500).json({ 
            message: "Internal Server Error. Please check logs.", 
            success: false 
        });
    }
};

export const deleteInterview = async (req, res) => {
    try {
        const interviewId = req.params.id;
        const userId = req.id; 
        const userRole = req.user.role; 

        // Interview fetch karein
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json({ message: "Interview not found", success: false });
        }

        // ⭐ SECURITY LOGIC UPDATE:
        // 1. Agar user Admin hai toh delete kar sakta hai.
        // 2. Agar user Employer hai, toh wo TABHI delete kar sakta hai jab usne khud schedule kiya ho.
        const isOwner = interview.scheduledBy.toString() === userId.toString();

        if (userRole !== 'admin' && !isOwner) {
            return res.status(403).json({
                message: "You can only delete interviews that you have scheduled.",
                success: false
            });
        }

        await Interview.findByIdAndDelete(interviewId);

        // Jobseeker ko cancelation notification
        await Notification.create({
            recipient: interview.jobseeker,
            sender: userId,
            type: "STATUS_UPDATED",
            title: "Interview Cancelled",
            message: `Your scheduled interview has been cancelled by the ${userRole}.`,
            link: "/jobseeker/interviews"
        });

        return res.status(200).json({
            message: "Interview cancelled successfully",
            success: true
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};