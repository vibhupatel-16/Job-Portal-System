import cron from "node-cron";
import { Interview } from "../models/interview.model.js";
import { Job } from "../models/job.model.js";
import sendEmail from "../utils/sendEmail.js";
import { Notification } from "../models/notification.model.js";

const parseInterviewDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;

  let normalizedDate = dateStr;
  const parts = dateStr.split("-");
  if (parts.length === 3 && parts[0].length === 2) {
    normalizedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  const parsed = new Date(`${normalizedDate} ${timeStr}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatTime = (dateObj) =>
  dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const sendReminderEmail = async (interview, timeLeftLabel, reminderFlag) => {
  const interviewDateTime = parseInterviewDateTime(
    interview.date,
    interview.time,
  );
  if (!interviewDateTime) return;

  const formattedTime = formatTime(interviewDateTime);
  const emailHtml = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #6A38C2; border-radius: 10px;">
            <h2 style="color: #6A38C2;">Interview Reminder: ${timeLeftLabel} Left</h2>
            <p>Hi <b>${interview.jobseeker?.fullname || "Candidate"}</b>, your interview for <b>${interview.job?.title || "your role"}</b> is in ${timeLeftLabel}.</p>
            <p><b>Date:</b> ${interview.date} | <b>Time:</b> ${formattedTime}</p>
            ${
              interview.mode === "online" && interview.meetingLink
                ? `<a href="${interview.meetingLink}" style="background:#6A38C2; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Join Now</a>`
                : ""
            }
        </div>
    `;

  await sendEmail({
    email: interview.jobseeker?.email,
    subject: `Interview Reminder (${timeLeftLabel})`,
    html: emailHtml,
  });

  await Notification.create({
    recipient: interview.jobseeker?._id,
    sender: interview.scheduledBy,
    type: "INTERVIEW_SCHEDULED",
    title: `Interview in ${timeLeftLabel}`,
    message: `Your interview for ${interview.job?.title || "your role"} is at ${formattedTime}.`,
    link: "/jobseeker/interviews",
  });

  interview[reminderFlag] = true;
  await interview.save();
};

const finalizeInterviewIfDue = async (interview, now) => {
  if (!["scheduled", "reschedule_requested"].includes(interview.status)) return;

  const interviewDateTime = parseInterviewDateTime(
    interview.date,
    interview.time,
  );
  if (!interviewDateTime) return;

  // Finalize exactly at scheduled end time (default 45 minutes).
  const durationMs = (interview.duration || 45) * 60 * 1000;
  const interviewEndMs = interviewDateTime.getTime() + durationMs;

  if (now.getTime() < interviewEndMs) return;

  const bothJoined =
    interview.joinedByJobseeker && interview.joinedByInterviewer;

  if (bothJoined) {
    interview.status = "completed";
    interview.completionSummary =
      "Interview finished: both interviewer and candidate joined.";
  } else {
    interview.status = "missed";

    if (!interview.joinedByJobseeker && !interview.joinedByInterviewer) {
      interview.completionSummary =
        "Interview missed: neither candidate nor interviewer joined.";
    } else if (!interview.joinedByJobseeker) {
      interview.completionSummary = "Interview missed: candidate did not join.";
    } else {
      interview.completionSummary =
        "Interview missed: interviewer did not join.";
    }
  }

  if (!interview.completionNotified) {
    const statusTitle =
      interview.status === "completed"
        ? "Interview Finished"
        : "Interview Missed";

    await Notification.create({
      recipient: interview.jobseeker,
      sender: interview.scheduledBy,
      type: "STATUS_UPDATED",
      title: statusTitle,
      message: interview.completionSummary,
      link: "/jobseeker/interviews",
    });

    await Notification.create({
      recipient: interview.scheduledBy,
      sender: interview.jobseeker,
      type: "STATUS_UPDATED",
      title: statusTitle,
      message: interview.completionSummary,
      link:
        interview.scheduledByRole === "admin"
          ? "/admin/interview-list"
          : "/employer/interview-list",
    });

    interview.completionNotified = true;
  }

  await interview.save();
};

const closeExpiredJobs = async (now) => {
  await Job.updateMany(
    {
      status: "approved",
      applicationDeadline: { $ne: null, $lte: now },
    },
    { $set: { status: "closed" } },
  );
};

// Every minute: reminders + interview auto-finalization.
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    await closeExpiredJobs(now);

    const interviews = await Interview.find({
      status: { $in: ["scheduled", "reschedule_requested"] },
    }).populate("jobseeker job company");

    for (const interview of interviews) {
      const interviewDateTime = parseInterviewDateTime(
        interview.date,
        interview.time,
      );
      if (!interviewDateTime) continue;

      const diffMs = interviewDateTime.getTime() - now.getTime();

      // 24h reminder window: between 23h and 24h before interview.
      if (
        !interview.reminderSent24h &&
        diffMs <= 24 * 60 * 60 * 1000 &&
        diffMs > 23 * 60 * 60 * 1000
      ) {
        await sendReminderEmail(interview, "24 Hours", "reminderSent24h");
      }

      // 1h reminder window: within 60 mins before start.
      if (!interview.reminderSent1h && diffMs <= 60 * 60 * 1000 && diffMs > 0) {
        await sendReminderEmail(interview, "1 Hour", "reminderSent1h");
      }

      await finalizeInterviewIfDue(interview, now);
    }
  } catch (error) {
    console.error("Interview cron error:", error);
  }
});
