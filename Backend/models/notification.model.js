import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['INTERVIEW_SCHEDULED', 'INTERVIEW_CANCELLED', 'JOB_APPLIED', 'STATUS_UPDATED'],
        required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String }, // User click karke direct page par ja sake
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);