import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import sendEmail from "../utils/sendEmail.js";
import { applicationStatusTemplate } from "../utils/emailTemplates.js";
import { Notification } from "../models/notification.model.js";

import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getAiMatchScore = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const application = await Application.findById(applicationId).populate('job applicant');

        if (!application) return res.status(404).json({ message: "Application not found", success: false });

        const resumeUrl = application.applicant.profile.resume;
        if (!resumeUrl) return res.status(400).json({ message: "Resume URL not found", success: false });

        const response = await axios.get(resumeUrl, { responseType: "arraybuffer" });

        let resumeText = "";
        try {
            const buffer = Buffer.from(response.data);
            const data = await pdfParse(buffer);
            resumeText = data.text;
            console.log("✅ Resume Text Extracted");
        } catch (pdfErr) {
            return res.status(500).json({ message: "Could not read PDF.", success: false });
        }

        // --- 🟢 NEW OPTIMIZATION START ---
        // Faltu spaces aur characters hatayein taaki Tokens kam consume hon
        const cleanResume = resumeText.replace(/\s+/g, ' ').trim().substring(0, 4000);
        const cleanJobDesc = application.job.description.substring(0, 1000);
        // --- 🟢 NEW OPTIMIZATION END ---

        try {
            // Model selection (gemini-2.0-flash-lite is good for quota)
            const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

            const prompt = `
                Analyze Resume vs Job.
                JOB: ${application.job.title} - ${cleanJobDesc}
                RESUME: ${cleanResume}
                Return ONLY JSON: {"score": number, "insights": "string"}
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            const cleanedJson = responseText.replace(/```json|```/g, "").trim();
            const aiResult = JSON.parse(cleanedJson);

            application.matchScore = aiResult.score;
            application.aiInsights = aiResult.insights;
            await application.save();

            return res.status(200).json({
                message: "AI Scan successful",
                score: aiResult.score,
                insights: aiResult.insights,
                success: true
            });

        } catch (aiErr) {
            // Agar Quota 429 error aaye toh handle karein
            console.error("🔥 AI Limit Reached:", aiErr.message);
            return res.status(429).json({
                message: "AI Limit reached. Please try after some time.",
                success: false
            });
        }

    } catch (error) {
        console.error("🔥 Global Error:", error.message);
        res.status(500).json({ message: "Server Error", success: false });
    }
};
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "job id is required",
                success: false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }
        //check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId

        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message: "Job Applied Successfully",
            success: true
        })


    } catch (error) {
        console.log(error);
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            option: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } },
            }
        });
        if (!application) {
            return res.status(404).json({
                message: "No Appplications",
                success: false
            })
        };

        return res.status(200).json({
            application,
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}

//admin dekhega kitne user ne apply ne kiya hai

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: [
                {
                    path: 'applicant',
                    select: 'fullname email phoneNumber profile createdAt'
                },
                { path: "job" }
            ]
        });

        if (!job) {
            return res.status(404).json({
                message: 'Job not found',
                success: false
            })
        };

        return res.status(200).json({
            job,
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: "status is required",
                success: false
            });
        }

        // 🔍 Find application + populate applicant & job
        const application = await Application.findOne({ _id: applicationId })
            .populate("applicant")
            .populate("job");

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            });
        }

        // ✅ Update status
        application.status = status.toLowerCase();
        application.statusHistory.push({
            status: status.toLowerCase(),
            changedAt: new Date()
        });
        await application.save();

        // 🎨 Status color
        const statusColor = status === "accepted" ? "#22c55e" : "#ef4444";
        await Notification.create({
            recipient: application.applicant._id,
            sender: req.id, // Employer ID
            type: "STATUS_UPDATED",
            title: `Application ${status.toUpperCase()}`,
            message: `Your application for ${application.job.title} has been ${status}.`,
            link: "/profile"
        });
        await sendEmail({
            email: application.applicant.email,
            subject: `Application Update: ${application.job.title}`,
            message: `Your application status has been updated to ${status}.`, // fallback
            html: applicationStatusTemplate(
                application.applicant.fullname,
                application.job.title,
                status.toLowerCase(),
                statusColor
            )
        });


        return res.status(200).json({
            message: "Status updated successfully and email sent",
            success: true
        });

    } catch (error) {
        console.log("Update status error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getHiringStats = async (req, res) => {
    try {
        const employerId = req.id;

        // 1. Saare jobs dhoondo jo is employer ne banaye hain
        const jobs = await Job.find({ created_by: employerId });
        const jobIds = jobs.map(job => job._id);

        // 2. Un jobs ke saare applications fetch karein
        const applications = await Application.find({ job: { $in: jobIds } });

        // 3. Status wise counting
        const stats = {
            totalApplied: applications.length,
            shortlisted: applications.filter(app => app.status === 'shortlisted').length,
            accepted: applications.filter(app => app.status === 'accepted').length, // Interview stage
            rejected: applications.filter(app => app.status === 'rejected').length
        };

        return res.status(200).json({ stats, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// application.controller.js mein ye function add karein
export const getAnalyticsData = async (req, res) => {
    try {
        const employerId = req.id;

        // 1. Employer ki saare jobs dhoondo
        const jobs = await Job.find({ created_by: employerId }).populate('applications');

        // 2. Bar Chart Data (Job vs Applications)
        const jobPerformance = jobs.map(job => ({
            name: job.title.length > 15 ? job.title.slice(0, 15) + "..." : job.title,
            count: job.applications.length
        }));

        // 3. Pie Chart Data (Status Distribution)
        const jobIds = jobs.map(j => j._id);
        const allApps = await Application.find({ job: { $in: jobIds } });

        const statusData = [
            { name: 'Pending', value: allApps.filter(a => a.status === 'pending').length },
            { name: 'Shortlisted', value: allApps.filter(a => a.status === 'shortlisted').length },
            { name: 'Accepted', value: allApps.filter(a => a.status === 'accepted').length },
            { name: 'Rejected', value: allApps.filter(a => a.status === 'rejected').length },
        ];

        return res.status(200).json({
            jobPerformance,
            statusData,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Analytics Error", success: false });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const userId = req.id;
        const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
        return res.status(200).json({ notifications, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch notifications" });
    }
};

// application.controller.js
export const generateInterviewQuestions = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const application = await Application.findById(applicationId).populate('job applicant');

        if (!application) return res.status(404).json({ message: "Application not found", success: false });

        // Optimization: Resume aur Job details ko limit karein
        const cleanResume = (application.aiInsights || "Professional candidate").substring(0, 2000);
        const jobDesc = application.job.description.substring(0, 1000);

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `
            Analyze this candidate for ${application.job.title}.
            Resume Insights: ${cleanResume}
            Job Requirements: ${jobDesc}
            Generate 5 specific technical interview questions.
            Return ONLY a raw JSON array of strings like: ["Question 1", "Question 2"]
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().replace(/```json|```/g, "").trim();
        const questions = JSON.parse(responseText);

        application.interviewQuestions = questions;
        await application.save();

        return res.status(200).json({ questions, success: true });
    } catch (error) {
        res.status(500).json({ message: "AI is busy, try later", success: false });
    }
};