import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Video, MapPin, Calendar, Clock, Timer, Building2, Send, X } from "lucide-react";
import { toast } from 'sonner'; 
import ViewFeedbackModal from './ViewFeedbackModal';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import axiosInstance from '@/utils/axiosInstance';


const JobseekerInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    
    // --- ⭐ NEW STATES FOR RESCHEDULE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);
   // JobseekerInterviews.jsx ke shuruat mein state badlein:
const [rescheduleData, setRescheduleData] = useState({ 
    reason: '', 
    preferredTime: '', 
    preferredDate: '' 
});

    const [feedbackOpen, setFeedbackOpen] = useState(false);
const [selectedFeedback, setSelectedFeedback] = useState(null);

const [bookedSlots, setBookedSlots] = useState([]);
const WORKING_SLOTS = [
    "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", 
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];


const [availableSlots, setAvailableSlots] = useState([]);


const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    setRescheduleData({ ...rescheduleData, preferredDate: selectedDate, preferredTime: '' });

    if (selectedDate) {
        try {
           
            const employerId = selectedInterview?.scheduledBy?._id || selectedInterview?.scheduledBy;
            
            const res = await   axiosInstance.get(
                `/interview/booked-slots?date=${selectedDate}&employerId=${employerId}`, 
                
            );

            if (res.data.success) {
               
                const booked = res.data.bookedTimes || [];
                setBookedSlots(booked);
                setAvailableSlots(WORKING_SLOTS.filter((slot) => !booked.includes(slot)));
            }
        } catch (error) {
            console.error("Error fetching slots:", error);
            toast.error("Failed to fetch available slots");
        }
    }
};
  
const fetchList = async () => {
    try {
        const res = await axiosInstance.get(`/interview/my-interviews`);
        if (res.data.success) {
            setInterviews(res.data.interviews || []);
        }
    } catch (error) {
        console.error("Error fetching your interviews", error);
    }
};

useEffect(() => {
        fetchList();
    }, []);

   // --- ⭐ FIXED HANDLER FOR RESCHEDULE ---
const handleRescheduleSubmit = async () => {
    if(!rescheduleData.reason || !rescheduleData.preferredTime || !rescheduleData.preferredDate) {
        return toast.error("Please fill all details (Date, Time and Reason)");
    }

    try {
        const res = await axiosInstance.post(`/interview/reschedule-request`, 
            { 
                interviewId: selectedInterview?._id, 
                suggestedDate: rescheduleData.preferredDate,
                suggestedTime: rescheduleData.preferredTime, 
                reason: rescheduleData.reason 
            }, 
            
        );

        if (res.data.success) {
            toast.success("Request sent to employer!");
            setIsModalOpen(false);
            setRescheduleData({ reason: '', preferredTime: '', preferredDate: '' });
            fetchList();
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to send request");
    }
};

const CountdownTimer = ({ targetDate, targetTime }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            if (!targetDate || !targetTime) return;

            const now = new Date().getTime();
            let formattedDate = targetDate;
            if (targetDate.includes('-')) {
                const parts = targetDate.split('-');
                if (parts[0].length === 2) { 
                    formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
            }

            const interviewDateTime = new Date(`${formattedDate} ${targetTime}`).getTime();
            const distance = interviewDateTime - now;

            if (distance < 0 || isNaN(distance)) {
                setTimeLeft("Started / Finished"); 
                clearInterval(timer);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate, targetTime]);

    return (
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-100 mt-1 w-fit">
            <Timer size={12} className="animate-pulse" />
            {timeLeft || "Calculating..."}
        </div>
    );
};

const handleCancelInterview = async (interviewId) => {
    if (!confirm("Are you sure you want to cancel this interview? This action cannot be undone.")) return;
    
    try {
        const res = await axiosInstance.delete(`/interview/interview/${interviewId}`);
        if (res.data.success) {
            toast.success("Interview cancelled successfully");
            fetchList(); // Refresh the list
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to cancel interview");
    }
};

const handleViewFeedback = async (interviewId) => {
    try {
        const res = await axiosInstance.get(`/interview/feedback/${interviewId}`);
        if (res.data.success) {
            setSelectedFeedback(res.data.feedback);
            setFeedbackOpen(true);
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Feedback is not available yet");
    }
};

const markJoinAndOpen = async (interviewId, meetingLink) => {
    try {
        await axiosInstance.post(`/interview/interview/${interviewId}/join`);
    } catch (error) {
        toast.error(error.response?.data?.message || "Could not mark join attendance");
    }

    if (meetingLink) {
        window.open(meetingLink, "_blank", "noopener,noreferrer");
    }
};
        


    return (
        <div className='min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-10 relative overflow-hidden'>
            {/* Decorative Blobs */}
            <div className="absolute top-0 -left-20 w-[600px] h-[600px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-0 -right-20 w-[600px] h-[600px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 pointer-events-none"></div>

            <div className='max-w-6xl mx-auto px-4 sm:px-6 relative z-10'>
                <Motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8"
                >
                    <h1 className='font-black text-3xl text-gray-900 tracking-tight flex items-center gap-3'>
                        <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                           <Calendar size={24} />
                        </div>
                        My Scheduled Interviews
                    </h1>
                    <p className="mt-2 text-gray-500 font-medium ml-1">Track upcoming meetings and view recruiter feedback.</p>
                </Motion.div>

                <Motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className='bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden'
                >
                    <Table>
                        <TableHeader className="bg-gray-50/80 border-b border-gray-100">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-bold text-gray-500 py-5">Company & Role</TableHead>
                                <TableHead className="font-bold text-gray-500">Date & Time</TableHead>
                                <TableHead className="font-bold text-gray-500">Status</TableHead>
                                <TableHead className="font-bold text-gray-500 text-right pr-6">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-50/50">
                            {interviews.map((item) => (
                                <TableRow key={item._id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <TableCell className="py-5">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                                {item.company?.logo ? (
                                                    <img src={item.company.logo} alt="logo" className="w-8 h-8 object-contain" />
                                                ) : (
                                                    <Building2 className="text-gray-400" size={20} />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-[15px]">{item.company?.name || "Company"}</h3>
                                                <p className="text-xs font-semibold text-indigo-600 mt-1 uppercase tracking-widest">{item.job?.title || "Role"}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    
                                    <TableCell>
                                        <div className="flex flex-col text-sm gap-1.5">
                                            <span className="font-semibold text-gray-700 flex items-center gap-2">
                                                <div className="p-1 bg-orange-100 rounded text-orange-600"><Calendar size={12}/></div> 
                                                {item.date ? (() => {
                                                    const parts = item.date.split('-');
                                                    if (parts.length === 3 && parts[0].length === 4) return `${parts[2]}-${parts[1]}-${parts[0]}`;
                                                    return item.date;
                                                })() : "N/A"}
                                            </span>
                                            <span className="font-medium text-gray-500 flex items-center gap-2">
                                                <div className="p-1 bg-orange-50 rounded text-orange-400"><Clock size={12}/></div> 
                                                {item.time}
                                            </span>
                                            <CountdownTimer targetDate={item.date} targetTime={item.time} />
                                        </div>
                                    </TableCell>
                                    
                                    <TableCell>
                                        {item.status === "completed" ? (
                                            <div className="flex flex-col items-start gap-2">
                                                <Badge className="bg-green-50 text-green-700 border border-green-200 font-bold text-[10px] uppercase tracking-widest px-3 py-1">
                                                    Finished
                                                </Badge>
                                                {item.completionSummary && <p className="text-[10px] text-green-700">{item.completionSummary}</p>}
                                                <button 
                                                    onClick={() => handleViewFeedback(item._id)}
                                                    className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full font-bold hover:bg-purple-100 transition-colors uppercase tracking-widest"
                                                >
                                                    View Feedback
                                                </button>
                                            </div>
                                        ) : item.status === "missed" ? (
                                            <div className="flex flex-col items-start gap-2">
                                                <Badge className="bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px] uppercase tracking-widest px-3 py-1">
                                                    Missed
                                                </Badge>
                                                {item.completionSummary && <p className="text-[10px] text-amber-700">{item.completionSummary}</p>}
                                            </div>
                                        ) : item.status === "cancelled" ? (
                                            <Badge className="bg-red-50 text-red-700 border border-red-200 font-bold text-[10px] uppercase tracking-widest px-3 py-1">
                                                Cancelled
                                            </Badge>
                                        ) : (
                                            <Badge className={`${
                                                item.status === 'scheduled' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
                                                'bg-orange-50 text-orange-700 border-orange-200'
                                            } border font-bold text-[10px] uppercase tracking-widest px-3 py-1`}>
                                                {item.status}
                                            </Badge>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-right pr-6">
                                        <div className="flex flex-col items-end gap-2">
                                            {item.mode === "online" && item.meetingLink ? (
                                                <button onClick={() => markJoinAndOpen(item._id, item.meetingLink)} className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                                                    <Video size={14} /> Join Now
                                                </button>
                                            ) : (
                                                <span className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold border border-gray-200">
                                                    <MapPin size={14} /> In-Person
                                                </span>
                                            )}

                                            <button 
                                                onClick={() => { setSelectedInterview(item); setIsModalOpen(true); }}
                                                disabled={!['scheduled', 'reschedule_requested'].includes(item.status)}
                                                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                                            >
                                                <Clock size={14} /> Reschedule
                                            </button>

                                            {!['cancelled', 'completed', 'missed'].includes(item.status) && (
                                                <button 
                                                    onClick={() => handleCancelInterview(item._id)}
                                                    className="inline-flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                                                >
                                                    <X size={14} /> Cancel
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    
                    {interviews.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                               <Calendar size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No scheduled interviews</h3>
                            <p className="text-sm text-gray-500 mt-1">When an employer schedules an interview, it will appear here.</p>
                        </div>
                    )}
                </Motion.div>
            </div>

            {/* --- ⭐ RESCHEDULE MODAL --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <Motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md"
                    >
                        <Motion.div 
                            initial={{ scale: 0.95, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: -20, opacity: 0 }}
                            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                            className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative"
                        >
                            {/* Header Gradient */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                            
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 p-2 bg-gray-50 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="p-8 pt-10">
                                <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Request Reschedule</h2>
                                <p className="text-gray-500 text-sm mb-8 font-medium">Suggest a new time and date to <span className="text-indigo-600 font-bold">{selectedInterview?.company?.name || 'the employer'}</span>.</p>

                                <div className="space-y-6">
                                    {/* 📅 DATE INPUT */}
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 mb-2 block uppercase tracking-widest">Select New Date</label>
                                        <div className="relative group">
                                            <input 
                                                type="date"
                                                value={rescheduleData.preferredDate}
                                                onChange={handleDateChange}
                                                className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all appearance-none"
                                            />
                                            <Calendar className="absolute left-4 top-4 text-gray-400 pointer-events-none group-focus-within:text-orange-500" size={20}/>
                                        </div>
                                    </div>

                                    {/* ⏰ TIME SELECT */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block">
                                            Select Preferred Slot
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {WORKING_SLOTS.map((slot) => {
                                                const isBooked = bookedSlots.includes(slot);
                                                const isSelected = rescheduleData.preferredTime === slot;

                                                return (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        disabled={isBooked}
                                                        onClick={() => setRescheduleData({ ...rescheduleData, preferredTime: slot })}
                                                        className={`py-3 rounded-2xl text-[11px] font-bold transition-all border
                                                            ${isBooked 
                                                                ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                                                : isSelected
                                                                    ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-600/20'
                                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700'
                                                            }`}
                                                    >
                                                        {slot}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {rescheduleData.preferredDate && availableSlots.length === 0 && (
                                            <p className="text-[10px] text-red-500 font-bold text-center mt-2 flex items-center justify-center gap-1">
                                                <X size={12}/> No slots available for this date.
                                            </p>
                                        )}
                                    </div>

                                    {/* 💬 REASON TEXTAREA */}
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 mb-2 block uppercase tracking-widest">Reason for Rescheduling</label>
                                        <textarea 
                                            rows="3"
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all resize-none placeholder-gray-400"
                                            placeholder="Explain briefly why you are requesting to change the time..."
                                            value={rescheduleData.reason}
                                            onChange={(e) => setRescheduleData({...rescheduleData, reason: e.target.value})}
                                        />
                                    </div>

                                    {/* BUTTONS */}
                                    <div className="flex gap-3 pt-4">
                                        <button 
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 text-[13px] font-bold rounded-2xl hover:bg-gray-50 hover:text-gray-900 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleRescheduleSubmit}
                                            className="flex-[2] py-4 bg-gray-900 text-white text-[13px] font-bold rounded-2xl hover:bg-orange-600 shadow-xl shadow-gray-900/10 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Send size={16} /> Send Request
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Motion.div>
                    </Motion.div>
                )}
            </AnimatePresence>
            <ViewFeedbackModal 
            open={feedbackOpen} 
            setOpen={setFeedbackOpen} 
            feedback={selectedFeedback} 
        />
        </div>

    );
};

export default JobseekerInterviews;
