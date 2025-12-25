import { Job } from "../models/job.model.js";

export const getAllJobsForAdmin = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company", "name location")
      .populate("created_by", "fullname email role")
      .sort({ createdAt: -1 });

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
      message: "Failed to delete job"
    });
  }
};
