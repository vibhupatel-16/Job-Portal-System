import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, User, Briefcase, MapPin, Trash2, CheckCircle2, Timer  } from "lucide-react";
import { toast } from "sonner";
import FeedbackModal from './FeedbackModel';

// ⭐ 1. Countdown Timer Component
const CountdownTimer = ({ targetDate, targetTime }) => {
    const [timeLeft, setTimeLeft] = useState("");
   

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            // Date aur Time ko combine karke target banayein
            const interviewDateTime = new Date(`${targetDate.split('T')[0]}T${targetTime}`).getTime();
            const distance = interviewDateTime - now;

          if (distance < 0) {
    
    setTimeLeft("Meeting Finished?"); 
    clearInterval(timer);
    return;
}

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            let timeString = "";
            if (days > 0) timeString += `${days}d `;
            timeString += `${hours}h ${minutes}m ${seconds}s`;
            setTimeLeft(timeString);
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate, targetTime]);

    return (
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-100 mt-1">
            <Timer size={12} className="animate-pulse" />
            <span>Starts in: {timeLeft}</span>
        </div>
    );
};
const ScheduledInterviews = () => {
    const [interviews, setInterviews] = useState([]);

    const [openFeedback, setOpenFeedback] = useState(false);
    const [selectedInterviewId, setSelectedInterviewId] = useState(null);

    // 1. Fetch List function (Isse humne refresh ke liye bahar nikala hai)
    const fetchList = async () => {
        try {
            const res = await axios.get(`${INTERVIEW_API_END_POINT}/scheduled-list`, { withCredentials: true });
            if (res.data.success) {
                setInterviews(res.data.interviews);
            }
        } catch (error) {
            console.error("Error fetching scheduled interviews", error);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    // 2. Approve Handler
    const handleApproveReschedule = async (interviewId, newDate, newTime) => {
        try {
            const res = await axios.post(`${INTERVIEW_API_END_POINT}/approve-reschedule`, 
                { interviewId, newDate, newTime }, 
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success("Interview rescheduled successfully!");
                fetchList(); // List refresh karein taaki naya time dikhe
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to approve");
        }
    };

    // 3. Delete function (Aapka existing logic)
    const deleteInterview = async (id) => {
        if(!window.confirm("Are you sure you want to cancel this interview?")) return;
        try {
            const res = await axios.delete(`${INTERVIEW_API_END_POINT}/interview/${id}`, { withCredentials: true });
            if(res.data.success) {
                toast.success(res.data.message);
                fetchList();
            }
        } catch (error) {
            toast.error("Error cancelling interview", error);
        }
    };

    return (
        <div className='max-w-6xl mx-auto my-10 p-4'>
            <h1 className='font-bold text-2xl mb-6'>Manage Scheduled Interviews</h1>
            <div className='bg-white border rounded-2xl shadow-sm overflow-hidden'>
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Job Role</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Mode</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {interviews.map((item) => (
                            <TableRow key={item._id} className="hover:bg-gray-50 transition-colors">
                                {/* Candidate Name Section */}
                                {/* Candidate Detail Section Update karein */}
<TableCell>
    <div className="flex items-center gap-2">
        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
            <User size={16} />
        </div>
        <span className="font-medium text-gray-800">
            {/* ⭐ Change this line */}
            {item.jobseeker?.fullname || item.application?.applicant?.fullname || "Candidate Name"}
        </span>
    </div>
</TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={16} className="text-gray-400" />
                                        <span className="text-gray-700">{item.job?.title}</span>
                                    </div>
                                </TableCell>

                              <TableCell>
    <div className="flex flex-col text-sm">
        <span className="font-medium text-gray-700 flex items-center gap-1">
            <Calendar size={13}/> 
            {/* Date format: 30 Jan 2026 */}
            {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
        <span className="text-gray-500 flex items-center gap-1">
            <Clock size={13}/> 
            {/* Time format: 11:30 AM */}
            {new Date(`2000-01-01T${item.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
        </span>
        {item.status !== "Completed" && item.status !== "Rejected" && (
                                            <CountdownTimer targetDate={item.date} targetTime={item.time} />
                                        )}
    </div>
</TableCell>


                                <TableCell>
                                    <Badge className={item.mode === 'online' ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}>
                                        {item.mode.toUpperCase()}
                                    </Badge>
                                </TableCell>

                                {/* Action Column mein jahan Approve button hai */}
                                {/* --- Naya Meeting Link Column --- */}
<TableCell>
    {item.mode === "online" && item.meetingLink ? (
        <a 
            href={item.meetingLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:underline flex items-center gap-1 font-medium text-sm"
        >
            <Video size={16} /> Join Meeting
        </a>
    ) : (
        <span className="text-gray-500 flex items-center gap-1 text-sm">
            <MapPin size={16} /> {item.mode === 'online' ? 'Link Pending' : 'In-Person'}
        </span>
    )}
</TableCell>
<TableCell className="text-center">
    <div className="flex items-center justify-center gap-2">
        {new Date(`${item.date.split('T')[0]}T${item.time}`).getTime() < new Date().getTime() && item.status !== "Completed" ? (
            <button 
                onClick={() => {
                    setSelectedInterviewId(item._id);
                    setOpenFeedback(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white hover:bg-purple-700 rounded-full shadow-md transition-all animate-pulse"
            >
                <CheckCircle2 size={14} />
                <span className="text-[10px] font-bold">GIVE FEEDBACK</span>
            </button>
        ) : null}
        
        {/* ⭐ FIX: Status ke saath yeh bhi check karein ki kya login user hi scheduler hai? */}
      
{(item.status === 'reschedule_requested' && item.scheduledByRole === 'employer') ? (
    <div className="flex flex-col gap-2 p-2 bg-orange-50 rounded-xl border border-orange-100">
        <div className="text-left mb-1">
            <p className="text-[9px] font-bold text-orange-600 uppercase">New Requested Slot:</p>
            <p className="text-[10px] font-bold text-gray-700">
                📅 {new Date(item.suggestedDate).toLocaleDateString('en-GB')} 
                <br/>
                ⏰ {new Date(`2000-01-01T${item.suggestedTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
            </p>
        </div>
        <button 
            onClick={() => handleApproveReschedule(item._id, item.suggestedDate, item.suggestedTime)}
            className="flex items-center justify-center gap-1 p-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-all shadow-sm"
        >
            <CheckCircle2 size={16} />
            <span className="text-[10px] font-bold">APPROVE & UPDATE LINK</span>
        </button>
    </div>
) : null }

        {/* Delete button hamesha rahega agar aap chahein */}
        {/* ⭐ NEW: Delete Button logic */}
        {/* Sirf tab dikhao jab interview Employer ne schedule kiya ho */}
        {item.scheduledByRole === 'employer' ? (
            <button 
                onClick={() => deleteInterview(item._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
                <Trash2 size={18} />
            </button>
        ) : (
            // Admin dwara schedule kiye gaye interview par Delete button ki jagah 'ReadOnly' status
            <span className="text-[10px] text-gray-400 italic">Controlled by Admin</span>
        )}
    </div>
</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {interviews.length === 0 && (
                    <div className='text-center py-20 bg-gray-50 text-gray-400'>
                        No interviews found.
                    </div>
                )}
            </div>
            <FeedbackModal 
                open={openFeedback} 
                setOpen={setOpenFeedback} 
                interviewId={selectedInterviewId}
                onFeedbackSubmit={() => fetchList()} 
            />
        </div>
    );
};

export default ScheduledInterviews;