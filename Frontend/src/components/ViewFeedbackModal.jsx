import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ViewFeedbackModal = ({ open, setOpen, feedback }) => {
    if (!feedback) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[400px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-purple-700">Interview Performance</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Technical Score:</span>
                        <span className="font-bold">{feedback.ratings?.technical}/5</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Communication:</span>
                        <span className="font-bold">{feedback.ratings?.communication}/5</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-xs text-gray-500 font-bold mb-1">Interviewer's Comment:</p>
                        <p className="text-sm italic text-gray-700">"{feedback.comment}"</p>
                    </div>
                    <div className={`text-center p-2 rounded-lg font-bold ${feedback.recommendation === 'Strong Hire' || feedback.recommendation === 'Hire' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        Verdict: {feedback.recommendation}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewFeedbackModal;