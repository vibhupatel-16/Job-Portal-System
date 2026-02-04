import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    jobseeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },
    meetingLink: {
      type: String,
    },
    scheduledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Ye store karega ki interview kisne fix kiya
},
scheduledByRole: {
    type: String,
    enum: ['admin', 'employer'],
    required: true
},
 status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "reschedule_requested"], // "reschedule_requested" add kiya
      default: "scheduled",
    },

    // 2. Reschedule ke liye ye 3 nayi fields add karein
    suggestedDate: { 
      type: String // Jobseeker jo nayi date maang raha hai
    },
    suggestedTime: { 
      type: String // Jobseeker jo naya time maang raha hai
    },
    rescheduleReason: { 
      type: String // Jobseeker ne kyu reschedule kiya
    },
    // models/interview.model.js mein add karein
reminderSent24h: { type: Boolean, default: false },
reminderSent1h: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Interview = mongoose.model("Interview", interviewSchema);
