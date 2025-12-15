import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { Application } from "../models/application.model.js";

export const getAdminStats = async (req, res) => {
    // console.log("🔥 ADMIN STATS HIT - USER:", req.user);
  try {
    const totalUsers = await User.countDocuments();
    const totalEmployers = await User.countDocuments({ role: "employer" });
    const totalJobseekers = await User.countDocuments({ role: "jobseeker" });

    const totalJobs = await Job.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalApplications = await Application.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalEmployers,
        totalJobseekers,
        totalJobs,
        totalCompanies,
        totalApplications
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load admin stats",
      error: error.message
    });
  }
};
