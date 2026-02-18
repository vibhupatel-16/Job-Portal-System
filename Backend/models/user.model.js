import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['jobseeker', 'employer', 'admin'],
    required: true,
    default:"jobseeker"
  },

isBlocked: {
    type: Boolean,
    default: false
},
  savedJobs: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
],

  profile: {
    bio: { type: String },
    skills: [{ type: String }],
    resume: { type: String },
    resumeOriginalName: { type: String },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    profilePhoto: {
      type: String,
      default: ""
    }
  },
  // user.model.js mein add karein
notifications: [
    {
        message: { type: String, required: true },
        type: { type: String, enum: ['job_alert', 'application_update', 'general'], default: 'job_alert' },
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }
],
  resetPasswordToken: String,
  resetPasswordExpire: Date

}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
