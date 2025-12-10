import {Job} from "../models/job.model.js";
//admin post job
export const postJob = async(req, res)=>{
    try{

        const {title, description, requirements, salary, location, jobType, experience, position, companyId} = req.body;
        const userId = req.id;

        if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId){
            return res.status(400).json({
                message:"Something is missing",
                success: false
            })
        };

        const job = await Job.create({
            title,
            description, 
            requirements: requirements.split(","),
            salary:Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company:companyId,
            created_by:userId
        });

        return res.status(201).json({
            message:"Job status created successfully",
            job,
            success:true
        });

    }catch(error){
        console.log(error);
    }
}
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

    // ⭐ Pagination params
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6; 
    const skip = (page - 1) * limit;

    // ⭐ FIXED BASE QUERY (keyword optional)
    const query = {};

   if (keyword) {
  query.$or = [
    { title: { $regex: keyword, $options: "i" } },
    { description: { $regex: keyword, $options: "i" } },
  ];
}


    // ⭐ ADDITIONAL FILTERS 
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


    // ⭐ total count
    const totalJobs = await Job.countDocuments(query);

    // ⭐ pagination apply
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
export const getJobById = async (req,res)=>{
    try{
        const jobId = req.params.id;
        const job  = await Job.findById(jobId).populate({
            path:"applications"
        });
        if(!job){
            return res.status(404).json({
                message: "jobs not found",
                success:false
            })
        };
        return res.status(200).json({
            job,
            success:true
        })

    }catch(error){
        console.log(error)
    }
}
//how many create jobs by admin

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .sort({ createdAt: -1 })  // 👈 latest jobs first
      .populate("company")      // 👈 company details
      .populate({
        path: "applications",   // 👈 applicants
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


// UPDATE JOB
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;

    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
      return res.status(400).json({
        message: "Please fill all fields",
        success: false,
      });
    }

    // Convert HTML → Array of strings
    const parsedRequirements = htmlToList(requirements);

    const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId, created_by: userId },
      {
        title,
        description,
        requirements: parsedRequirements,  // clean list
        salary: Number(salary),
        location,
        jobType,
        experienceLevel: experience,
        position,
        company: companyId
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
      success: true,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// Helper function
function htmlToList(html) {
  if (typeof html !== "string") return [];

  const text = html
    .replace(/<br>/g, "\n")
    .replace(/<\/li>/g, "\n")
    .replace(/<li>/g, "")
    .replace(/<\/?[^>]+(>|$)/g, "");

  return text
    .split("\n")
    .map(item => item.trim())
    .filter(item => item.length > 0);
}
