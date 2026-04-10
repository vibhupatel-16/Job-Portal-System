import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  role: {
    type: String,
    enum: ['jobseeker', 'employer'],
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending"
  },
  // backward compatibility
  isApproved: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);