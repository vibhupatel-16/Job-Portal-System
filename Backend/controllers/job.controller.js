import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";
import { jobPostingTemplate } from "../utils/emailTemplates.js";

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
      companyId
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
        success: false
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
      created_by: userId
    });

    //  FIND ALL JOB SEEKERS
    const users = await User.find({ role: "jobseeker" });

    // 📧 SEND EMAIL TO JOB SEEKERS
    for (const user of users) {
      await sendEmail({
        email: user.email,
        subject: ` New Opening: ${title} Position at Job Portal`,
        message: `A new job for ${title} is available in ${location}.`, // Plain text fallback
        html: jobPostingTemplate(
          title,
          location,
          jobType,
          experience,
          salary,
          description
        )
      });

    }

    return res.status(201).json({
      message: "Job created successfully ",
      job,
      success: true
    });

  } catch (error) {
    console.log("POST JOB ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
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
    const salary = req.query.salary || "";
    const experience = req.query.experience || "";
    const title = req.query.title || ""; // <-- Added to support Industry filter

    //  Pagination params
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    //  FIXED BASE QUERY (keyword optional)
    const query = { status: "approved" };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }
    
    // Support Industry (Title) filter from Frontend
    if (title) {
      // If we already have an $or (from keyword), it will be combined with this title regex by MongoDB implicitly via AND, 
      // but to be safe, we just set title explicitly if keyword isn't overriding it entirely, 
      // or we just add it to the query object.
      query.title = { $regex: title, $options: "i" };
    }

    //  ADDITIONAL FILTERS 
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }



    if (salary) {
      // Adjust numerical logic. The DB likely stores LPA as small numbers (e.g., 5, 12) or large (500000).
      // Filter choices: "0-3LPA", "3-6LPA", "6-10LPA"
      // We will check for BOTH small digit format and large digit format.
      let min = 0, max = 0;
      if (salary === "0-3LPA") { min = 0; max = 3; }
      if (salary === "3-6LPA") { min = 3; max = 6; }
      if (salary === "6-10LPA") { min = 6; max = 15; } // Extended max to cover "up to 10+"

      query.$or = query.$or || [];
      query.$or.push({ 
        $and: [ { salary: { $gte: min } }, { salary: { $lte: max } } ] // Match 3, 5 format
      }, {
        $and: [ { salary: { $gte: min * 100000 } }, { salary: { $lte: max * 100000 } } ] // Match 300000, 500000 format
      });
    }



    if (experience) {
      query.experienceLevel = Number(experience);
    }


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
      path: "applications"
    });
    if (!job) {
      return res.status(404).json({
        message: "jobs not found",
        success: false
      })
    };
    return res.status(200).json({
      job,
      success: true
    })

  } catch (error) {
    console.log(error)
  }
}
//how many create jobs by admin

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .sort({ createdAt: -1 })  //  latest jobs first
      .populate("company")      //  company details
      .populate({
        path: "applications",   //  applicants
        options: { sort: { createdAt: -1 } }, // latest applicants first
        populate: [
          { path: "applicant" }, // applicant details
          { path: "job" }        // job title for each applicant
        ]
      });

    if (!jobs) {
      return res.status(404).json({
        message: "No jobs found",
        success: false
      });
    }

    return res.status(200).json({
      jobs, // Now each job has: recent applications + populated job + applicant
      success: true
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

    if (req.body.location !== undefined) updateData.location = req.body.location;

    if (req.body.jobType !== undefined) updateData.jobType = req.body.jobType;

    if (req.body.experience !== undefined)
      updateData.experienceLevel = req.body.experience;

    if (req.body.position !== undefined)
      updateData.position = req.body.position;

    if (req.body.companyId !== undefined && req.body.companyId !== "")
      updateData.company = req.body.companyId;

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
    const userId = req.id; // Assuming middleware se user id mil rahi hai
    const user = await User.findById(userId);

    if (!user || user.role !== 'jobseeker') {
      return res.status(404).json({ message: "User not found or not a jobseeker", success: false });
    }

    const userSkills = user.profile.skills;

    // Logic: Agar user ke paas skills hain, toh match karo, 
    // nahi toh latest jobs dikhao
    let query = {};
    if (userSkills && userSkills.length > 0) {
      query = {
        $or: [
          { requirements: { $in: userSkills.map(skill => new RegExp(skill, 'i')) } },
          { title: { $in: userSkills.map(skill => new RegExp(skill, 'i')) } }
        ],
        status: 'approved' // Sirf approved jobs
      };
    }

    const recommendedJobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 })
      .limit(6); // Sirf top 6 jobs dashboard ke liye

    return res.status(200).json({
      success: true,
      recommendedJobs
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
}