import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BadgeCheck, MessageSquareText, Star } from "lucide-react";

const ViewFeedbackModal = ({ open, setOpen, feedback }) => {
    if (!feedback) return null;

    const ratingItems = [
        { key: "technical", label: "Technical Skills" },
        { key: "communication", label: "Communication" },
        { key: "cultureFit", label: "Culture Fit" },
    ];

    const calcAverage = () => {
        const t = Number(feedback.ratings?.technical || 0);
        const c = Number(feedback.ratings?.communication || 0);
        const cf = Number(feedback.ratings?.cultureFit || 0);
        const avg = (t + c + cf) / 3;
        return Number.isFinite(avg) ? avg.toFixed(1) : "0.0";
    };

    const verdictTone =
        feedback.recommendation === "Strong Hire" || feedback.recommendation === "Hire"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-rose-100 text-rose-700";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-hidden rounded-[2rem] p-0">
                <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 py-5 text-white">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/75">Feedback Response</p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight">Interview Performance</h2>
                    <p className="mt-1 text-sm text-white/85">
                        {feedback.interviewerId?.fullname ? `Shared by ${feedback.interviewerId.fullname}` : "Shared by interviewer"}
                    </p>
                </div>

                <div className="max-h-[calc(90vh-110px)] overflow-y-auto px-6 py-5">
                <DialogHeader>
                    <DialogTitle className="sr-only">Interview feedback details</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                        <p className="text-sm font-semibold text-indigo-700">Overall Score</p>
                        <div className="flex items-center gap-2 text-indigo-700">
                            <Star size={15} className="fill-indigo-500 text-indigo-500" />
                            <span className="text-lg font-black">{feedback.overallRating || calcAverage()}/5</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {ratingItems.map((item) => (
                            <div key={item.key} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{item.label}</p>
                                <p className="mt-2 text-xl font-black text-slate-800">{Number(feedback.ratings?.[item.key] || 0)}/5</p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
                            <MessageSquareText size={14} /> Interviewer Comment
                        </p>
                        <p className="text-sm italic text-slate-700">"{feedback.comment || "No written comment provided."}"</p>
                    </div>

                    <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-black ${verdictTone}`}>
                        <BadgeCheck size={15} /> Verdict: {feedback.recommendation}
                    </div>

                    <p className="text-xs font-medium text-slate-500">
                        Submitted on {feedback.createdAt ? new Date(feedback.createdAt).toLocaleString("en-GB") : "N/A"}
                    </p>
                </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewFeedbackModal;