import { User } from "../models/user.model.js";

export const saveJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.body;

    const user = await User.findById(userId);

    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: "Job already saved" });
    }

    user.savedJobs.push(jobId);
    await user.save();

    res.json({ success: true, message: "Job saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Save job failed" });
  }
};

export const removeSavedJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.params;

    await User.findByIdAndUpdate(userId, {
      $pull: { savedJobs: jobId },
    });

    res.json({ success: true, message: "Job removed" });
  } catch (error) {
    res.status(500).json({ message: "Remove failed" });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedJobs",
      populate: {
        path: "company", 
      },
    });

    res.json({
      success: true,
      jobs: user.savedJobs, 
    });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};
