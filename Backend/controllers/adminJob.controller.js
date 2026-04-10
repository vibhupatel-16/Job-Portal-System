import { Job } from "../models/job.model.js";
import sendEmail from "../utils/sendEmail.js";
import { User } from "../models/user.model.js";
import { jobPostingTemplate } from "../utils/emailTemplates.js";

export const getAllJobsForAdmin = async (req, res) => {
  try {
    const { company, location, employer } = req.query;

    let query = {};

    // 🔹 COMPANY FILTER (by company name)
    if (company) {
      query["company.name"] = { $regex: company, $options: "i" };
    }

    // 🔹 LOCATION FILTER
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // 🔹 EMPLOYER FILTER (by name)
    if (employer) {
      query["created_by.fullname"] = { $regex: employer, $options: "i" };
    }

    const jobs = await Job.aggregate([
      {
        $lookup: {
          from: "companies",
          localField: "company",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },

      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          as: "created_by",
        },
      },
      { $unwind: "$created_by" },

      { $match: query },
      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.log("Admin get jobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

export const deleteJobByAdmin = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.log("Delete job error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};

// adminJob.controller.js

export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const jobId = req.params.id;

    const job = await Job.findByIdAndUpdate(
      jobId,
      { status },
      { new: true },
    ).populate("company");
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (status === "approved") {
     
      const users = await User.find({ role: "jobseeker" });

    
      const newNotification = {
        message: `New Job Match: ${job.title} at ${job.company?.name || "Top Company"}`,
        type: "job_alert",
        jobId: job._id,
        isRead: false,
        createdAt: new Date(),
      };

      await User.updateMany(
        { role: "jobseeker" },
        { $push: { notifications: newNotification } },
      );

      for (const user of users) {
        await sendEmail({
          email: user.email,
          subject: `New Opening: ${job.title}`,
          message: `${job.title} is now live in ${job.location}.`,
          html: jobPostingTemplate(
            job.title,
            job.location,
            job.jobType,
            job.experienceLevel,
            job.salary,
            job.description,
          ),
        });
      }
    }

    const responseMessage =
      status === "approved"
        ? "Job approved, users notified and notifications saved."
        : `Job ${status} successfully.`;

    return res.status(200).json({
      success: true,
      message: responseMessage,
    });
  } catch (error) {
    console.log("Error in updateJobStatus:", error);
    return res.status(500).json({ success: false });
  }
};
