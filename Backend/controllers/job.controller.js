import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";
//admin post job
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
        html: `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
        
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">New Job Opportunity!</h1>
          <p style="color: #bfdbfe; margin-top: 10px; font-size: 16px;">We found a role that matches the community interests.</p>
        </div>

        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">
            ${title}
          </h2>
          
          <div style="display: grid; gap: 15px; margin-bottom: 25px;">
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 10px; display: flex; align-items: center;">
              <span style="font-size: 20px; margin-right: 12px;">📍</span>
              <span style="color: #475569;"><strong>Location:</strong> ${location}</span>
            </div>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 10px; display: flex; align-items: center;">
              <span style="font-size: 20px; margin-right: 12px;">💼</span>
              <span style="color: #475569;"><strong>Job Type:</strong> ${jobType}</span>
            </div>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 10px; display: flex; align-items: center;">
              <span style="font-size: 20px; margin-right: 12px;">⏳</span>
              <span style="color: #475569;"><strong>Experience:</strong> ${experience} Years</span>
            </div>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 10px; display: flex; align-items: center;">
              <span style="font-size: 20px; margin-right: 12px;">💰</span>
              <span style="color: #475569;"><strong>Salary:</strong> ₹${salary}</span>
            </div>
          </div>

          <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
            ${description.substring(0, 150)}...
          </p>

          <div style="text-align: center;">
            <a href="http://localhost:5173/jobs" style="background-color: #2563eb; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block; transition: background-color 0.3s ease;">
              View Job & Apply Now
            </a>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 20px; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            You are receiving this because you're a registered JobSeeker on our portal.<br>
            © 2026 Job Portal System. All rights reserved.
          </p>
        </div>
      </div>
    `
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


    //  ADDITIONAL FILTERS 
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }



    if (salary) {
      if (salary === "0-3LPA") {
        query.salary = { $gte: 0, $lte: 300000 };
      }
      if (salary === "3-6LPA") {
        query.salary = { $gte: 300000, $lte: 600000 };
      }
      if (salary === "6-10LPA") {
        query.salary = { $gte: 600000, $lte: 1000000 };
      }
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