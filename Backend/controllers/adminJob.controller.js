import { Job } from "../models/job.model.js";

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
          as: "company"
        }
      },
      { $unwind: "$company" },

      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          as: "created_by"
        }
      },
      { $unwind: "$created_by" },

      { $match: query },
      { $sort: { createdAt: -1 } }
    ]);

    return res.status(200).json({
      success: true,
      jobs
    });

  } catch (error) {
    console.log("Admin get jobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs"
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
        message: "Job not found"
      });
    }

    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully"
    });
  } catch (error) {
    console.log("Delete job error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed"
    });
  }
};
