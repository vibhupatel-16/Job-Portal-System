import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import sendEmail from "../utils/sendEmail.js";
export const applyJob = async (req, res)=>{
    try{
        const userId = req.id;
        const jobId = req.params.id;
        
        if(!jobId){
            return res.status(400).json({
                message:"job id is required",
                success:false
            })
        };
       // check if the user has already applied for the job
        const existingApplication = await Application.findOne({job:jobId, applicant:userId}) ;

        if(existingApplication){
            return res.status(400).json({
                message:"You have already applied for this jobs",
                success:false
            });
        }
        //check if the job exists
        const job  = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message:"Job not found",
                success:false
            })
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant:userId

        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message: "Job Applied Successfully",
            success:true
        })

        
    }catch(error){
        console.log(error);
    }
};

export const getAppliedJobs = async(req, res)=>{
    try{
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path: 'job',
            option: {sort:{createdAt:-1}},
            populate:{
                path: 'company',
                options: {sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message: "No Appplications",
                success:false
            })
        };

        return res.status(200).json({
            application,
            success:true
        })

    }catch(error){
        console.log(error);
    }
}

//admin dekhega kitne user ne apply ne kiya hai

export const getApplicants = async (req, res)=>{
    try{
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate: [
           { path: "applicant" },
           { path: "job" }   
      ]
        });

        if(!job){
          return res.status(404).json({
            message:'Job not found',
            success: false
          })  
        };

        return res.status(200).json({
            job,
            success:true
        });

    }catch(error){
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
    await application.save();

    //  Send attractive email to applicant
    await sendEmail({
      email: application.applicant.email,
      subject: "Your Job Application Status Has Been Updated",
      message: `
Hello ${application.applicant.fullname},

We would like to inform you that the status of your job application has been updated.

Job Title: ${application.job.title}
Current Status: ${status}

Our team is reviewing your profile. If your application moves forward,
we will contact you with the next steps.

Thank you for applying and best of luck!

Regards,
Job Portal Team
      `
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
