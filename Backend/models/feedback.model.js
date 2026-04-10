import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    interviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview',
        required: true
    },
    interviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    jobseekerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ratings: {
        technical: { type: Number, min: 1, max: 5, default: 0 },
        communication: { type: Number, min: 1, max: 5, default: 0 },
        cultureFit: { type: Number, min: 1, max: 5, default: 0 }
    },
    overallRating: {
        type: Number,
        default: 0
    },
    comment: {
        type: String,
        required: true
    },
    recommendation: {
        type: String,
        enum: ['Strong Hire', 'Hire', 'Hold', 'No Hire'],
        required: true
    }
}, { timestamps: true });

export const Feedback = mongoose.model('Feedback', feedbackSchema);