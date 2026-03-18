import React, { useState } from "react";
import { MessageSquareHeart, Star, Send } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance";

const TestimonialFeedbackForm = ({
  submitPath,
  title = "How's your experience?",
  subtitle = "Share your journey with us",
  placeholder = "Tell us about your experience...",
}) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || content.trim().length < 10) {
      return toast.error("Please provide a rating and at least 10 characters of feedback.");
    }

    try {
      setSubmitting(true);
      const res = await axiosInstance.post(submitPath, { content, rating });
      if (res.data?.success) {
        toast.success(res.data.message || "Testimonial submitted for admin approval!");
        setContent("");
        setRating(0);
      } else {
        toast.error(res.data?.message || "Failed to submit");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
          <MessageSquareHeart size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight">{title}</h2>
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                size={28}
                className={`${star <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
              />
            </button>
          ))}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-purple-200 outline-none text-gray-700 min-h-[100px] resize-none"
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {submitting ? "Submitting..." : <>Submit Testimonial <Send size={18} /></>}
        </button>
      </form>
    </div>
  );
};

export default TestimonialFeedbackForm;

