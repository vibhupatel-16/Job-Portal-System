import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
      applicationDeadline,
    } = req.body;

    const userId = req.id;

    // Validation
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    //  Create Job
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
      ...(applicationDeadline ? { applicationDeadline } : {}),
    });

    return res.status(201).json({
      message: "Job created and sent for admin approval",
      job,
      success: true,
    });
  } catch (error) {
    console.log("POST JOB ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
//job seeker
// export const getAllJobs = async (req,res)=>{
//     try{
//         const keyword = req.query.keyword || "";
//         const query = {
//             $or:[
//                 {title:{$regex: keyword, $options:"i"}},
//                 {description:{$regex:keyword, $options:"i"}},
//             ]
//         };
//         const jobs = await Job.find(query).populate({
//             path: "company"
//         }).sort({createdAt: -1});
//         if(!jobs){
//             return res.status(404).json({
//                 message:"job not found",
//                 success:false
//             })
//         };
//         return res.status(200).json({
//             jobs,
//             success: true
//         })
//     }catch(error){
//         console.log(error)
//     }
// }

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const location = req.query.location || "";
    const category = req.query.category || "";
    const salary = req.query.salary || "";
    const experience = req.query.experience || "";
    const jobType = req.query.jobType || "";

    //  Pagination params
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const now = new Date();
    const andConditions = [
      { status: "approved" },
      {
        $or: [
          { applicationDeadline: { $exists: false } },
          { applicationDeadline: null },
          { applicationDeadline: { $gt: now } },
        ],
      },
    ];

    if (keyword) {
      const matchingCompanies = await Company.find({
        name: { $regex: keyword, $options: "i" },
      }).select("_id");

      const keywordOr = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
      ];

      if (matchingCompanies.length > 0) {
        keywordOr.push({
          company: { $in: matchingCompanies.map((company) => company._id) },
        });
      }

      andConditions.push({ $or: keywordOr });
    }

    // Category filter (replaces old title filter)
    if (category) {
      andConditions.push({ title: { $regex: category, $options: "i" } });
    }

    // Location filter
    if (location) {
      andConditions.push({ location: { $regex: location, $options: "i" } });
    }

    // Job Type filter (supports Full-Time, Full Time, fulltime)
    if (jobType) {
      const normalizedJobTypePattern = jobType
        .trim()
        .replace(/[-\s]+/g, "[-\\s]*");
      andConditions.push({
        jobType: {
          $regex: `^${normalizedJobTypePattern}$`,
          $options: "i",
        },
      });
    }

    // Experience filter - handle range strings
    if (experience) {
      if (experience === "0-1 years") {
        andConditions.push({ experienceLevel: { $gte: 0, $lte: 1 } });
      } else if (experience === "1-3 years") {
        andConditions.push({ experienceLevel: { $gte: 1, $lte: 3 } });
      } else if (experience === "3-5 years") {
        andConditions.push({ experienceLevel: { $gte: 3, $lte: 5 } });
      } else if (experience === "5+ years") {
        andConditions.push({ experienceLevel: { $gte: 5 } });
      }
    }

    // Salary filter
    if (salary) {
      let min = 0,
        max = 0;
      if (salary === "0-3LPA") {
        min = 0;
        max = 3;
      } else if (salary === "3-6LPA") {
        min = 3;
        max = 6;
      } else if (salary === "6-10LPA") {
        min = 6;
        max = 10;
      } else if (salary === "10-15+LPA") {
        min = 10;
        max = 100;
      } // High upper limit for 10+

      andConditions.push({ salary: { $gte: min, $lte: max } });
    }

    const query = { $and: andConditions };

    //  total count
    const totalJobs = await Job.countDocuments(query);

    //  pagination apply
    const jobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!jobs) {
      return res.status(404).json({
        message: "job not found",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: page,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//job seeker
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });
    if (!job) {
      return res.status(404).json({
        message: "jobs not found",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
//how many create jobs by admin

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .sort({ createdAt: -1 }) //  latest jobs first
      .populate("company") //  company details
      .populate({
        path: "applications", //  applicants
        options: { sort: { createdAt: -1 } }, // latest applicants first
        populate: [
          { path: "applicant" }, // applicant details
          { path: "job" }, // job title for each applicant
        ],
      });

    if (!jobs) {
      return res.status(404).json({
        message: "No jobs found",
        success: false,
      });
    }

    return res.status(200).json({
      jobs, // Now each job has: recent applications + populated job + applicant
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // Empty update object
    const updateData = {};

    // SAFE UPDATE SYSTEM
    if (req.body.title !== undefined) updateData.title = req.body.title;

    if (req.body.description !== undefined)
      updateData.description = req.body.description || "";

    if (req.body.requirements !== undefined) {
      if (Array.isArray(req.body.requirements)) {
        updateData.requirements = req.body.requirements;
      } else {
        updateData.requirements = [req.body.requirements];
      }
    }

    if (req.body.salary !== undefined) updateData.salary = req.body.salary;

    if (req.body.location !== undefined)
      updateData.location = req.body.location;

    if (req.body.jobType !== undefined) updateData.jobType = req.body.jobType;

    if (req.body.experience !== undefined)
      updateData.experienceLevel = req.body.experience;

    if (req.body.position !== undefined)
      updateData.position = req.body.position;

    if (req.body.companyId !== undefined && req.body.companyId !== "")
      updateData.company = req.body.companyId;

    if (req.body.applicationDeadline !== undefined) {
      updateData.applicationDeadline = req.body.applicationDeadline || null;
    }

    // Update database
    const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
      new: true,
      runValidators: false, // disable strict validation
    });

    return res.status(200).json({
      message: "Job updated successfully",
      success: true,
      job: updatedJob,
    });
  } catch (error) {
    console.log("UPDATE ERROR:", error.message);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (!user || user.role !== "jobseeker") {
      return res
        .status(404)
        .json({ message: "User not found or not a jobseeker", success: false });
    }

    const userSkills = user.profile.skills;

    let query = {};
    if (userSkills && userSkills.length > 0) {
      query = {
        $or: [
          {
            requirements: {
              $in: userSkills.map((skill) => new RegExp(skill, "i")),
            },
          },
          { title: { $in: userSkills.map((skill) => new RegExp(skill, "i")) } },
        ],
        status: "approved",
      };
    }

    const recommendedJobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 })
      .limit(6);

    return res.status(200).json({
      success: true,
      recommendedJobs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
