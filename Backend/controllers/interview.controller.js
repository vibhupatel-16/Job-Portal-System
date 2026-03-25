import { google } from "googleapis"
import { Feedback } from "../models/feedback.model.js";
import { Interview } from "../models/interview.model.js";
import { Application } from "../models/application.model.js";
import sendEmail from "../utils/sendEmail.js";

import { Notification } from "../models/notification.model.js";
import { interviewScheduleTemplate } from "../utils/emailTemplates.js";

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
        const { applicationId, jobseekerId, date, time, mode, meetingLink } = req.body;

        const scheduledByRole = req.user.role;
        const scheduledById = req.id;

        // --- ⭐ TIME FORMAT FIX HELPER ---
        const convertTo24Hour = (timeStr) => {
            if (!timeStr) return "00:00";
            if (!timeStr.includes("AM") && !timeStr.includes("PM")) {
                return timeStr.length === 5 ? timeStr : `0${timeStr}`.slice(-5);
            }
            const [timePart, modifier] = timeStr.split(' ');
            let [hours, minutes] = timePart.split(':');
            if (hours === '12') hours = '00';
            if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
            return `${hours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
        };

        const time24 = convertTo24Hour(time);
        const startDateTimeStr = `${date}T${time24}:00`;
        const startDateTime = new Date(startDateTimeStr);

        const now = new Date();
        if (startDateTime < now) {
            return res.status(400).json({
                message: "You cannot schedule an interview for a past date or time.",
                success: false
            });
        }

        // Validation Check
        if (isNaN(startDateTime.getTime())) {
            return res.status(400).json({
                message: "Invalid Date or Time format. Please select again.",
                success: false
            });
        }

        const endDateTime = new Date(startDateTime.getTime() + 3600000); // 1 Hour later

        // Display formats
        const formattedDate = startDateTime.toLocaleDateString('en-GB').replace(/\//g, '-');
        const formattedTime = startDateTime.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', hour12: true
        });

        /* ================= ⭐ SLOT CHECK ================= */
        const isSlotBusy = await Interview.findOne({
            scheduledBy: scheduledById,
            date: formattedDate,
            time: formattedTime,
            status: { $ne: 'cancelled' }
        });

        if (isSlotBusy) {
            return res.status(400).json({
                message: `Aapka is time (${formattedTime}) par pehle se ek interview scheduled hai.`,
                success: false
            });
        }

        const application = await Application.findById(applicationId)
            .populate({ path: "job", populate: { path: "company" } })
            .populate("applicant");

        if (!application) return res.status(404).json({ message: "Application not found", success: false });

        let finalMeetingLink = meetingLink || "";

        /* ================= 📅 GOOGLE MEET GENERATION ================= */
        if (mode === "online") {
            try {
                if (process.env.GOOGLE_REFRESH_TOKEN) {
                    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
                    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

                    const event = {
                        summary: `Interview: ${application.job.title}`,
                        description: `Candidate: ${application.applicant.fullname}`,
                        start: { dateTime: startDateTime.toISOString(), timeZone: "Asia/Kolkata" },
                        end: { dateTime: endDateTime.toISOString(), timeZone: "Asia/Kolkata" },
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
                }
            } catch (err) {
                console.error("Google Meet Error:", err.message);
            }
        }

        /* ================= ⭐ DB & NOTIFICATION ================= */
        const interview = await Interview.create({
            application: application._id,
            job: application.job._id,
            company: application.job.company._id,
            jobseeker: application.applicant._id,
            date: formattedDate,
            time: formattedTime,
            mode,
            meetingLink: finalMeetingLink,
            scheduledBy: scheduledById,
            scheduledByRole: scheduledByRole
        });

        const notification = await Notification.create({
            recipient: application.applicant._id,
            sender: scheduledById,
            type: "INTERVIEW_SCHEDULED",
            title: "New Interview Scheduled!",
            message: `Your interview for ${application.job.title} at ${application.job.company.name} is fixed for ${formattedDate} at ${formattedTime}.`,
            link: "/jobseeker/interviews"
        });

        if (req.io) {
            req.io.to(application.applicant._id.toString()).emit("notification", {
                id: notification._id,
                title: notification.title,
                message: notification.message,
                type: notification.type
            });
        }

        /* ================= 📅 GOOGLE CALENDAR LINK LOGIC (NEW) ================= */
        // Format: YYYYMMDDTHHmmSSZ
        const calStart = startDateTime.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const calEnd = endDateTime.toISOString().replace(/-|:|\.\d\d\d/g, "");

        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Interview: ${application.job.title} at ${application.job.company.name}`)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(`Meeting Link: ${finalMeetingLink || 'N/A'}`)}&location=${encodeURIComponent(finalMeetingLink || 'Office')}`;

        /* ================= 📧 ATTRACTIVE EMAIL TEMPLATE (UPDATED) ================= */

        const emailHtml = interviewScheduleTemplate(
            application.applicant.fullname,
            application.job.title,
            application.job.company.name,
            formattedDate,
            formattedTime,
            mode,
            finalMeetingLink,
            googleCalendarUrl,
            application.applicant.profile?.resume || "",
            false
        );

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
            .populate('jobseeker', 'fullname email')
            .populate({
                path: 'job',
                match: { created_by: userId }
            })
            .populate('company')
            // ⭐ Change: select '_id' agar aapko sirf ID chahiye, 
            // ya poora object rehne dein par frontend par access sahi karein
            .populate('scheduledBy', '_id fullname email')
            .sort({ createdAt: -1 });

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
        const { interviewId, reason, suggestedDate, suggestedTime } = req.body;

        if (!interviewId || !suggestedDate || !suggestedTime) {
            return res.status(400).json({
                message: "Interview ID, Date and Time are required",
                success: false
            });
        }

        const interview = await Interview.findByIdAndUpdate(interviewId, {
            status: 'reschedule_requested',
            suggestedDate: suggestedDate,
            suggestedTime: suggestedTime,
            rescheduleReason: reason
        }, { new: true });

        if (!interview) {
            return res.status(404).json({ message: "Interview not found", success: false });
        }

        // Notification logic
        await Notification.create({
            recipient: interview.scheduledBy,
            sender: req.id,
            type: "STATUS_UPDATED",
            title: "Reschedule Request Received",
            message: `Candidate has requested a new time: ${suggestedDate} at ${suggestedTime}`,
            link: interview.scheduledByRole === 'admin' ? "/admin/interviews" : "/employer/interviews"
        });

        return res.status(200).json({ message: "Request sent successfully", success: true });
    } catch (error) {
        console.error("Reschedule Error:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
export const approveReschedule = async (req, res) => {
    try {
        const { interviewId, newDate, newTime } = req.body;
        const userId = req.id;

        // 1. Data check and Populate
        const interview = await Interview.findById(interviewId).populate("jobseeker").populate({
            path: "job",
            populate: { path: "company" }
        });
        if (!interview) return res.status(404).json({ message: "Interview not found", success: false });

        // ⭐ Helper: Convert "12:00 PM" to "12:00"
        const convertTo24Hour = (timeStr) => {
            if (!timeStr.includes(' ')) return timeStr;
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':');
            if (hours === '12') hours = '00';
            if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
        };

        const time24 = convertTo24Hour(newTime);
        const startDateTime = new Date(`${newDate}T${time24}:00`);

        if (isNaN(startDateTime.getTime())) {
            return res.status(400).json({ message: "Invalid Date/Time received", success: false });
        }

        const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

        // ⭐ CHANGE 1: Variable names ko theek karein (formattedDate/formattedTime create karein)
        const formattedDate = new Date(newDate).toLocaleDateString('en-GB').replace(/\//g, '-');
        const formattedTime = newTime; // Yeh "12:00 PM" format mein hi hai

        // 2. Google OAuth & Event Update
        oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        const event = {
            summary: `Rescheduled: ${interview.job?.title}`,
            start: { dateTime: startDateTime.toISOString(), timeZone: "Asia/Kolkata" },
            end: { dateTime: endDateTime.toISOString(), timeZone: "Asia/Kolkata" },
            conferenceData: { createRequest: { requestId: `res-${Date.now()}`, conferenceSolutionKey: { type: "hangoutsMeet" } } },
        };

        const response = await calendar.events.insert({
            calendarId: "primary",
            resource: event,
            conferenceDataVersion: 1,
        });

        const newMeetingLink = response.data.hangoutLink; // ⭐ CHANGE 2: Is variable ko define karein (email mein use ho raha hai)

        // 3. Database Update
        interview.date = formattedDate;
        interview.time = formattedTime;
        interview.meetingLink = newMeetingLink;
        interview.status = 'scheduled';
        interview.rescheduleRequest = undefined;
        await interview.save();

        // 6. Notification save (formattedDate aur formattedTime use karein)
        await Notification.create({
            recipient: interview.jobseeker._id,
            sender: userId,
            type: "STATUS_UPDATED",
            title: "Reschedule Approved ✅",
            message: `Your interview for ${interview.job?.title} is approved for ${formattedDate} at ${formattedTime}.`,
            link: "/jobseeker/interviews"
        });

        /* ================= 📧 EMAIL TEMPLATE ================= */
        const emailHtml = interviewScheduleTemplate(
            interview.jobseeker?.fullname || "Candidate",
            interview.job?.title || "your applied job",
            interview.job?.company?.name || "The Hiring Team",
            formattedDate,
            formattedTime,
            interview.mode || 'online',
            newMeetingLink,
            '', 
            interview.jobseeker?.profile?.resume || "",
            true
        );

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

export const submitFeedback = async (req, res) => {
    try {
        const { interviewId } = req.params; // Backend route :id use kar raha hai
        const { ratings, comment, recommendation } = req.body;
        const interviewerId = req.id;

        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ message: "Interview not found", success: false });
        }

        const overallRating = (ratings.technical + ratings.communication + ratings.cultureFit) / 3;

        const feedback = await Feedback.create({
            interviewId,
            interviewerId,
            jobseekerId: interview.jobseeker,
            ratings,
            overallRating: overallRating.toFixed(1),
            comment,
            recommendation
        });

        // 🟢 FIX: Ensure this value exists in your Interview Model's Enum
        interview.status = "completed";
        await interview.save();

        /* ================= 🔔 SAVE NOTIFICATION ================= */
        const notification = await Notification.create({
            recipient: interview.jobseeker,
            sender: interviewerId,
            type: "STATUS_UPDATED",
            title: "Interview Evaluated",
            message: `Feedback has been submitted for your interview. Result: ${recommendation}`,
            link: "/jobseeker/interviews"
        });

        /* ================= 🚀 REAL-TIME SOCKET (Optional) ================= */
        if (req.io) {
            req.io.to(interview.jobseeker.toString()).emit("notification", notification);
        }

        return res.status(201).json({
            message: "Feedback submitted successfully",
            feedback,
            success: true
        });

    } catch (error) {
        console.log(error); // Ab aapko console mein validation error nahi dikhegi
        res.status(500).json({ message: "Error submitting feedback", success: false });
    }
};

// interview.controller.js mein niche add karein
export const getFeedbackByInterviewId = async (req, res) => {
    try {
        const { interviewId } = req.params; // Route se interviewId le rahe hain

        const feedback = await Feedback.findOne({ interviewId }).populate('interviewerId', 'fullname');

        if (!feedback) {
            return res.status(404).json({
                message: "No feedback found for this interview.",
                success: false
            });
        }

        return res.status(200).json({
            feedback,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const getBookedSlots = async (req, res) => {
    try {
        const { date, employerId: queryEmployerId } = req.query;

        // ⭐ Priority logic: 
        // 1. Agar query mein employerId hai (Jobseeker side se), toh woh use karein.
        // 2. Agar nahi hai, toh req.id use karein (Employer side se).
        const targetEmployerId = queryEmployerId || req.id;

        if (!targetEmployerId) {
            return res.status(400).json({ message: "Employer ID is required", success: false });
        }

        const formattedDate = new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-');

        const bookedInterviews = await Interview.find({
            scheduledBy: targetEmployerId,
            date: formattedDate,
            status: { $ne: 'cancelled' }
        }).select('time');

        const bookedTimes = bookedInterviews.map(item => item.time);

        return res.status(200).json({
            bookedTimes,
            success: true
        });
    } catch (error) {
        console.log("Error in getBookedSlots:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};