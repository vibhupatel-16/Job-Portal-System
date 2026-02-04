import cron from 'node-cron';
import { Interview } from '../models/interview.model.js';
import sendEmail from '../utils/sendEmail.js';
import { Notification } from '../models/notification.model.js';

// Har 15 minute mein check karega
cron.schedule('*/15 * * * *', async () => {
    try {
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
        const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        // 1. Logic for 24 Hours Reminder
        const upcoming24h = await Interview.find({
            date: twentyFourHoursFromNow.toISOString().split('T')[0],
            reminderSent24h: { $ne: true } // Visualizer mein ab dikhega update hone par
        }).populate('jobseeker job company');

        for (const inter of upcoming24h) {
            await sendProfessionalEmail(inter, "24 Hours", "reminderSent24h");
        }

        // 2. Logic for 1 Hour Reminder
        const upcoming1h = await Interview.find({
            date: now.toISOString().split('T')[0],
            time: { 
                $gte: now.toTimeString().slice(0,5), 
                $lte: oneHourFromNow.toTimeString().slice(0,5) 
            },
            reminderSent1h: { $ne: true }
        }).populate('jobseeker job company');

        for (const inter of upcoming1h) {
            await sendProfessionalEmail(inter, "1 Hour", "reminderSent1h");
        }
    } catch (error) {
        console.error("Cron Error:", error);
    }
});

async function sendProfessionalEmail(inter, timeLeft, flag) {
    const formattedTime = new Date(`2000-01-01T${inter.time}`).toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true
    });

    const emailHtml = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #6A38C2; border-radius: 10px;">
            <h2 style="color: #6A38C2;">Interview Reminder: ${timeLeft} Left</h2>
            <p>Hi <b>${inter.jobseeker.fullname}</b>, your interview for <b>${inter.job.title}</b> is in ${timeLeft}.</p>
            <p>⏰ <b>Time:</b> ${formattedTime}</p>
            <a href="${inter.meetingLink}" style="background:#6A38C2; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Join Now</a>
        </div>
    `;

    await sendEmail({
        email: inter.jobseeker.email,
        subject: `Interview Reminder (${timeLeft}) ⏰`,
        html: emailHtml
    });

    // Save to Database Notification (Bell Icon)
    await Notification.create({
        recipient: inter.jobseeker._id,
        type: "INTERVIEW_SCHEDULED",
        title: `Interview in ${timeLeft} ⏰`,
        message: `Your interview for ${inter.job.title} is at ${formattedTime}.`,
        link: "/jobseeker/interviews"
    });

    // Database update (Iske baad fields visualizer mein dikhengi)
    inter[flag] = true;
    await inter.save();
}