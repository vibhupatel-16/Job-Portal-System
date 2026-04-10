import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance";
const FeedbackModal = ({ open, setOpen, interviewId, onFeedbackSubmit }) => {
  const [ratings, setRatings] = useState({ technical: 0, communication: 0, cultureFit: 0 });
  const [comment, setComment] = useState("");
  const [recommendation, setRecommendation] = useState("Hire");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment) return toast.error("Please add a comment");
    try {
      setLoading(true);
const res = await axiosInstance.post(`/interview/${interviewId}/feedback`, 
    { ratings, comment, recommendation }, 
    
);
      if (res.data.success) {
        toast.success(res.data.message);
        onFeedbackSubmit(); // Refresh data on dashboard
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ label, category }) => (
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={`cursor-pointer ${ratings[category] >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            onClick={() => setRatings({ ...ratings, [category]: star })}
          />
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Candidate Evaluation</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <StarRating label="Technical Skills" category="technical" />
          <StarRating label="Communication" category="communication" />
          <StarRating label="Culture Fit" category="cultureFit" />
          
          <div className="mt-4">
            <label className="text-sm font-bold text-gray-700">Detailed Comment</label>
            <textarea
              className="w-full mt-1 p-3 border rounded-xl text-sm focus:ring-purple-500 outline-none"
              rows="3"
              placeholder="What are the strengths and weaknesses?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-bold text-gray-700">Recommendation</label>
            <select 
              className="w-full mt-1 p-2 border rounded-xl text-sm"
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
            >
              <option value="Strong Hire">Strong Hire</option>
              <option value="Hire">Hire</option>
              <option value="Hold">Hold</option>
              <option value="No Hire">No Hire</option>
            </select>
          </div>
        </div>
        <Button className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;