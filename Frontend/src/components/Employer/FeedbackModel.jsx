import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BadgeCheck, MessageSquareText, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance";

const recommendationOptions = ["Strong Hire", "Hire", "Hold", "No Hire"];

const FeedbackModal = ({ open, setOpen, interviewId, onFeedbackSubmit }) => {
  const [ratings, setRatings] = useState({ technical: 0, communication: 0, cultureFit: 0 });
  const [comment, setComment] = useState("");
  const [recommendation, setRecommendation] = useState("Hire");
  const [loading, setLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const averageRating = (
    (Number(ratings.technical || 0) + Number(ratings.communication || 0) + Number(ratings.cultureFit || 0)) / 3
  ).toFixed(1);

  const resetForm = () => {
    setRatings({ technical: 0, communication: 0, cultureFit: 0 });
    setComment("");
    setRecommendation("Hire");
    setAlreadySubmitted(false);
  };

  useEffect(() => {
    const checkExistingFeedback = async () => {
      if (!open || !interviewId) return;
      try {
        setCheckingExisting(true);
        const res = await axiosInstance.get(`/interview/feedback/${interviewId}`);
        if (res.data?.success && res.data?.feedback) {
          const existing = res.data.feedback;
          setRatings({
            technical: Number(existing.ratings?.technical || 0),
            communication: Number(existing.ratings?.communication || 0),
            cultureFit: Number(existing.ratings?.cultureFit || 0),
          });
          setComment(existing.comment || "");
          setRecommendation(existing.recommendation || "Hire");
          setAlreadySubmitted(true);
        }
      } catch (error) {
        setAlreadySubmitted(false);
      } finally {
        setCheckingExisting(false);
      }
    };

    checkExistingFeedback();
  }, [open, interviewId]);

  const handleSubmit = async () => {
    if (!interviewId) return toast.error("Interview not selected");
    if (!ratings.technical || !ratings.communication || !ratings.cultureFit) {
      return toast.error("Please rate all sections");
    }
    if (!comment || comment.trim().length < 10) {
      return toast.error("Please add at least 10 characters in feedback comment");
    }
    if (alreadySubmitted) {
      return toast.error("Feedback already submitted for this interview");
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post(`/interview/${interviewId}/feedback`, {
        ratings,
        comment: comment.trim(),
        recommendation,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        onFeedbackSubmit();
        setOpen(false);
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ label, category }) => (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{ratings[category] || 0}/5</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={`cursor-pointer transition-all ${
              ratings[category] >= star ? "fill-amber-400 text-amber-400" : "text-slate-300 hover:text-amber-300"
            }`}
            onClick={() => setRatings({ ...ratings, [category]: star })}
          />
        ))}
      </div>
    </div>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-hidden rounded-[2rem] border-slate-100 p-0">
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-5 text-white">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
            <Sparkles size={14} /> Interview Evaluation
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight">Submit Structured Feedback</h2>
          <p className="mt-1 text-sm text-white/85">Rate the candidate and share your final hiring recommendation.</p>
        </div>

        <div className="max-h-[calc(90vh-110px)] overflow-y-auto px-6 pb-6 pt-5">
          <DialogHeader>
            <DialogTitle className="sr-only">Candidate Evaluation</DialogTitle>
          </DialogHeader>

          <div className="mb-4 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
            <p className="text-sm font-semibold text-indigo-700">Overall Rating Preview</p>
            <p className="text-lg font-black text-indigo-700">{averageRating}/5</p>
          </div>

          {alreadySubmitted && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              Feedback already submitted for this interview.
            </div>
          )}

          {checkingExisting ? (
            <div className="py-8 text-center text-sm font-semibold text-slate-500">Checking existing feedback...</div>
          ) : (
            <div className="space-y-3 py-2">
              <StarRating label="Technical Skills" category="technical" />
              <StarRating label="Communication" category="communication" />
              <StarRating label="Culture Fit" category="cultureFit" />

              <div className="mt-4">
                <label className="mb-2 inline-flex items-center gap-2 text-sm font-bold text-slate-700">
                  <MessageSquareText size={16} className="text-violet-600" />
                  Detailed Comment
                </label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                  rows="4"
                  placeholder="Highlight strengths, concerns, and interview observations..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={alreadySubmitted}
                />
                <p className="mt-1 text-[11px] font-medium text-slate-500">{comment.trim().length} characters</p>
              </div>

              <div className="mt-4">
                <label className="mb-2 inline-flex items-center gap-2 text-sm font-bold text-slate-700">
                  <BadgeCheck size={16} className="text-violet-600" />
                  Recommendation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {recommendationOptions.map((option) => {
                    const isSelected = recommendation === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setRecommendation(option)}
                        disabled={alreadySubmitted}
                        className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                          isSelected
                            ? "border-violet-300 bg-violet-100 text-violet-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-600"
                        } ${alreadySubmitted ? "cursor-not-allowed opacity-70" : ""}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="sticky bottom-0 mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 bg-white/95 pt-4 backdrop-blur">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              disabled={loading}
            >
              Close
            </Button>
            <Button
              className="w-full rounded-xl bg-violet-600 hover:bg-violet-700"
              onClick={handleSubmit}
              disabled={loading || checkingExisting || alreadySubmitted}
            >
              {loading ? "Submitting..." : alreadySubmitted ? "Already Submitted" : "Submit Feedback"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;