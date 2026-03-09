import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import sendEmail from "../utils/sendEmail.js";
import { Notification } from "../models/notification.model.js";
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
           { path: 'applicant',
                select: 'fullname email profile' },
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
    application.statusHistory.push({
    status: status.toLowerCase(),
    changedAt: new Date()
});
    await application.save();

   // 🎨 Status color
const statusColor = status === "accepted" ? "#22c55e" : "#ef4444";
await Notification.create({
    recipient: application.applicant._id,
    sender: req.id, // Employer ID
    type: "STATUS_UPDATED",
    title: `Application ${status.toUpperCase()}`,
    message: `Your application for ${application.job.title} has been ${status}.`,
    link: "/profile"
});
await sendEmail({
  email: application.applicant.email,
  subject: `Application Update: ${application.job.title}`,
  message: `Your application status has been updated to ${status}.`, // fallback
  html: `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 14px; overflow: hidden; border: 1px solid #e5e7eb;">
    
    <!-- Header -->
    <div style="background: ${statusColor}; padding: 22px; text-align: center;">
      <h2 style="color: #ffffff; margin: 0;">Application Status Update</h2>
    </div>

    <!-- Body -->
    <div style="padding: 28px; background-color: #ffffff;">
      <p style="font-size: 17px; color: #111827;">
        Hello <strong>${application.applicant.fullname}</strong>,
      </p>

      <p style="font-size: 15px; color: #374151; line-height: 1.6;">
        We wanted to inform you that the status of your application has been updated after reviewing your profile.
      </p>

      <!-- Job Info -->
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 18px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #6b7280;">Job Title</p>
        <h3 style="margin: 4px 0 12px 0; color: #111827;">${application.job.title}</h3>

        <p style="margin: 0; font-size: 14px; color: #6b7280;">Current Status</p>
        <h2 style="margin: 6px 0; color: ${statusColor}; text-transform: capitalize;">
          ${status}
        </h2>
      </div>

      ${
        status === "accepted"
          ? `<p style="color: #374151;">
              🎉 Congratulations! Our team will contact you soon regarding the next steps, including interview scheduling.
            </p>`
          : `<p style="color: #374151;">
              We appreciate your interest. Although you were not selected this time, we encourage you to apply again in the future.
            </p>`
      }

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;" />

      <p style="font-size: 13px; color: #9ca3af; text-align: center;">
        © ${new Date().getFullYear()} Job Portal Team<br/>
        This is an automated message, please do not reply.
      </p>
    </div>
  </div>
  `,
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

export const getHiringStats = async (req, res) => {
    try {
        const employerId = req.id;

        // 1. Saare jobs dhoondo jo is employer ne banaye hain
        const jobs = await Job.find({ created_by: employerId });
        const jobIds = jobs.map(job => job._id);

        // 2. Un jobs ke saare applications fetch karein
        const applications = await Application.find({ job: { $in: jobIds } });

        // 3. Status wise counting
        const stats = {
            totalApplied: applications.length,
            shortlisted: applications.filter(app => app.status === 'shortlisted').length,
            accepted: applications.filter(app => app.status === 'accepted').length, // Interview stage
            rejected: applications.filter(app => app.status === 'rejected').length
        };

        return res.status(200).json({ stats, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// application.controller.js mein ye function add karein
export const getAnalyticsData = async (req, res) => {
    try {
        const employerId = req.id;

        // 1. Employer ki saare jobs dhoondo
        const jobs = await Job.find({ created_by: employerId }).populate('applications');

        // 2. Bar Chart Data (Job vs Applications)
        const jobPerformance = jobs.map(job => ({
            name: job.title.length > 15 ? job.title.slice(0, 15) + "..." : job.title,
            count: job.applications.length
        }));

        // 3. Pie Chart Data (Status Distribution)
        const jobIds = jobs.map(j => j._id);
        const allApps = await Application.find({ job: { $in: jobIds } });

        const statusData = [
            { name: 'Pending', value: allApps.filter(a => a.status === 'pending').length },
            { name: 'Shortlisted', value: allApps.filter(a => a.status === 'shortlisted').length },
            { name: 'Accepted', value: allApps.filter(a => a.status === 'accepted').length },
            { name: 'Rejected', value: allApps.filter(a => a.status === 'rejected').length },
        ];

        return res.status(200).json({
            jobPerformance,
            statusData,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Analytics Error", success: false });
    }
};