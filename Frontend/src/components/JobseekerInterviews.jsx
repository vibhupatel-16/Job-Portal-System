import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Video, MapPin, Calendar, Clock, Timer } from "lucide-react";
import { toast } from 'sonner'; // Notification ke liye
import ViewFeedbackModal from './ViewFeedbackModal';


const JobseekerInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    
    // --- ⭐ NEW STATES FOR RESCHEDULE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);
   // JobseekerInterviews.jsx ke shuruat mein state badlein:
const [rescheduleData, setRescheduleData] = useState({ 
    reason: '', 
    preferredTime: '', 
    preferredDate: '' // ⭐ Ye line add karein
});

    const [feedbackOpen, setFeedbackOpen] = useState(false);
const [selectedFeedback, setSelectedFeedback] = useState(null);

const [bookedSlots, setBookedSlots] = useState([]);
const [isSlotBusy, setIsSlotBusy] = useState(false);
const WORKING_SLOTS = [
    "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", 
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];


const [availableSlots, setAvailableSlots] = useState([]);
// Time ko AM/PM mein convert karne ke liye (Validation ke liye zaroori hai)
const formatToAmPm = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};


const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    setRescheduleData({ ...rescheduleData, preferredDate: selectedDate, preferredTime: '' });

    if (selectedDate) {
        try {
            // Hum employerId nikalenge selected interview se
            const employerId = selectedInterview?.scheduledBy?._id || selectedInterview?.scheduledBy;
            
            const res = await axios.get(
                `${INTERVIEW_API_END_POINT}/booked-slots?date=${selectedDate}&employerId=${employerId}`, 
                { withCredentials: true }
            );

            if (res.data.success) {
                // Backend se aaye hue booked slots ko set karein
                setBookedSlots(res.data.bookedTimes || []);
            }
        } catch (error) {
            console.error("Error fetching slots:", error);
            toast.error("Failed to fetch available slots");
        }
    }
};
  
useEffect(() => {
        const fetchMyInterviews = async () => {
            try {
                const res = await axios.get(`${INTERVIEW_API_END_POINT}/my-interviews`, { withCredentials: true });
                if (res.data.success) {
                    setInterviews(res.data.interviews);
                }
            } catch (error) {
                console.error("Error fetching your interviews", error);
            }
        };
        fetchMyInterviews();
    }, []);

   // --- ⭐ FIXED HANDLER FOR RESCHEDULE ---
const handleRescheduleSubmit = async () => {
    // Backend suggestedDate aur suggestedTime mangta hai
    if(!rescheduleData.reason || !rescheduleData.preferredTime || !rescheduleData.preferredDate) {
        return toast.error("Please fill all details (Date, Time and Reason)");
    }

    try {
        const res = await axios.post(`${INTERVIEW_API_END_POINT}/reschedule-request`, 
            { 
                interviewId: selectedInterview?._id, 
                suggestedDate: rescheduleData.preferredDate, // Backend key se match kiya
                suggestedTime: rescheduleData.preferredTime, // Backend key se match kiya
                reason: rescheduleData.reason 
            }, 
            { withCredentials: true }
        );

        if (res.data.success) {
            toast.success("Request sent to employer!");
            setIsModalOpen(false);
            setRescheduleData({ reason: '', preferredTime: '', preferredDate: '' });
            fetchList(); // List refresh karne ke liye
        }
    } catch (error) {
        // console.error("Submit Error:", error.response?.data);
        // toast.error(error.response?.data?.message || "Failed to send request");
    }
};
    const getGoogleCalendarLink = (item) => {
        const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
        const title = encodeURIComponent(`Interview: ${item.job.title} at ${item.company.name}`);
        const details = encodeURIComponent(`Meeting Link: ${item.meetingLink || 'Check Portal'}`);
        try {
            const startStr = `${item.date}T${item.time}`;
            const startDate = new Date(startStr).toISOString().replace(/-|:|\.\d\d\d/g, "");
            const endDate = new Date(new Date(startStr).getTime() + 3600000).toISOString().replace(/-|:|\.\d\d\d/g, "");
            return `${baseUrl}&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${encodeURIComponent(item.meetingLink || 'Office')}`;
        } catch (error) {
            return "#";
        }
    };

    // Component ke andar (return se pehle) ise add karein:
const formatDisplayDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const dateObj = new Date(dateTimeStr);
    
    // Date format: DD-MM-YYYY
    const date = dateObj.toLocaleDateString('en-GB').replace(/\//g, '-');
    
    // Time format: hh:mm AM/PM
    const time = dateObj.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    });
    
    return `${date} | ${time}`;
};

const CountdownTimer = ({ targetDate, targetTime }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            if (!targetDate || !targetTime) return;

            const now = new Date().getTime();
            
            // ⭐ DD-MM-YYYY ko YYYY-MM-DD mein convert karna taaki JS read kar sake
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

const handleViewFeedback = async (interviewId) => {
    try {
        // Employer side ki tarah hum interviewId route mein bhej rahe hain
        const res = await axios.get(`${INTERVIEW_API_END_POINT}/feedback/${interviewId}`, { withCredentials: true });
        
        if (res.data.success) {
            setSelectedFeedback(res.data.feedback);
            setFeedbackOpen(true);
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Feedback results pending");
    }
};

    return (
        <div className='max-w-5xl mx-auto my-10 px-4'>
            <h1 className='font-bold text-2xl mb-6 text-gray-800'>My Scheduled Interviews</h1>
            <div className='bg-white border rounded-2xl shadow-sm overflow-hidden'>
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead>Company</TableHead>
                            <TableHead>Job Title</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Mode</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {interviews.map((item) => (
                            <TableRow key={item._id} className="hover:bg-gray-50/50 transition">
                                <TableCell className="font-medium text-gray-900">{item.company.name}</TableCell>
                                <TableCell>{item.job.title}</TableCell>
       <TableCell>
    <div className="flex flex-col text-sm">
        <span className="font-medium text-gray-700 flex items-center gap-1">
            <Calendar size={13} className="text-orange-500"/> 
            {/* ⭐ Direct DD-MM-YYYY Display without Date Object bugs */}
            {item.date ? (() => {
                const parts = item.date.split('-');
                // Agar format YYYY-MM-DD hai (reschedule ke baad) toh use palat do
                if (parts.length === 3 && parts[0].length === 4) {
                    return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return item.date; // Agar backend se DD-MM-YYYY aa raha hai
            })() : "N/A"}
        </span>
        <span className="text-gray-500 flex items-center gap-1">
            <Clock size={13} className="text-orange-400"/> 
            {item.time}
        </span>
        <CountdownTimer targetDate={item.date} targetTime={item.time} />
    </div>
</TableCell>
                               <TableCell>
    {/* 1. Pehle check karein ki kya interview complete ho gaya hai */}
    {item.status === "completed" ? (
        // ✅ Wrap multiple elements in a fragment <> or div
        <>
            <Badge className="bg-green-100 text-green-700 border-none font-bold text-[10px] uppercase tracking-widest">
                Interview Evaluated
            </Badge>

            <div className="mt-1 flex flex-col">
                <button 
                    onClick={() => handleViewFeedback(item._id)}
                    className="text-[10px] text-purple-600 font-bold hover:underline text-left pl-1"
                >
                    View Feedback
                </button>
            </div>
        </>
    ) : 
    /* 2. Agar complete nahi hai, toh check karein ki kya time nikal gaya hai */
    new Date(`${item.date.split('T')[0]}T${item.time}`).getTime() < new Date().getTime() ? (
        <div className="flex flex-col gap-1">
            <Badge className="bg-yellow-100 text-yellow-700 border-none font-bold text-[10px] uppercase tracking-widest">
                Evaluating...
            </Badge>
            <span className="text-[9px] text-gray-400 italic">Waiting for recruiter's result</span>
        </div>
    ) : 
    /* 3. Agar future ka interview hai */
    (
        <Badge className={`${
            item.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 
            'bg-orange-100 text-orange-700'
        } border-none font-bold text-[10px] uppercase tracking-widest`}>
            {item.status}
        </Badge>
    )}
</TableCell>

                                <TableCell>
                                    <div className="flex flex-col gap-2">
                                        {item.mode === "online" && item.meetingLink ? (
                                            <a href={item.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1 font-medium text-sm">
                                                <Video size={16} /> Join Interview
                                            </a>
                                        ) : (
                                            <span className="text-gray-500 flex items-center gap-1 text-sm">
                                                <MapPin size={16} /> In-Person Office
                                            </span>
                                        )}

                                        {/* <a href={getGoogleCalendarLink(item)} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 flex items-center gap-1 text-xs font-semibold bg-green-50 w-fit px-2 py-1 rounded-md border border-green-100 transition hover:bg-green-100">
                                            <Calendar size={13} /> Add to Google Calendar
                                        </a> */}

                                        {/* ⭐ NEW: RESCHEDULE BUTTON */}
                                        <button 
                                            onClick={() => { console.log("Setting selected interview:", item); // Check karein 'item' kya hai
        setSelectedInterview(item); // 👈 Pura object pass hona chahiye
        setIsModalOpen(true); }}
                                            className="text-orange-600 hover:bg-orange-50 flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md border border-orange-100 transition mt-1 w-fit"
                                        >
                                            <Clock size={13} /> Request Reschedule
                                        </button>
                                    </div>
                                </TableCell>
                               
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {interviews.length === 0 && (
                    <div className='text-center py-16 text-gray-400'>No interviews scheduled yet.</div>
                )}
            </div>

  {/* --- ⭐ RESCHEDULE MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-200">
                        <div className="p-8">
                            <h2 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tighter">Reschedule Request</h2>
                            <p className="text-gray-500 text-sm mb-8">Suggest a new time and date for your interview.</p>

                            <div className="space-y-6">
                                {/* 📅 DATE INPUT (Aapne yahan pucha tha) */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase tracking-widest">Select New Date</label>
                                    <div className="relative group">
                                        <input 
                                            type="date"
                                            value={rescheduleData.preferredDate}
                                           onChange={handleDateChange}
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all appearance-none"
                                        />
                                        <Calendar className="absolute right-4 top-4 text-gray-400 pointer-events-none group-focus-within:text-orange-500" size={18}/>
                                    </div>
                                </div>

                                {/* ⏰ TIME SELECT */}
                               {/* JobseekerInterviews.jsx ke Reschedule Modal ke andar Time Slot section ko update karein */}
<div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">
        Select Preferred Time Slot
    </label>
   {/* Modal ke andar Time Slot mapping */}
<div className="grid grid-cols-3 gap-2">
    {WORKING_SLOTS.map((slot) => {
        // Check karein ki ye slot booked hai ya nahi
        const isBooked = bookedSlots.includes(slot);
        const isSelected = rescheduleData.preferredTime === slot;

        return (
            <button
                key={slot}
                type="button" // Form submit hone se rokne ke liye
                disabled={isBooked} // Sirf booked slots disable honge
                onClick={() => setRescheduleData({ ...rescheduleData, preferredTime: slot })}
                className={`py-3 rounded-2xl text-[10px] font-bold transition-all border
                    ${isBooked 
                        ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' // Booked slot: Light color
                        : isSelected
                            ? 'bg-orange-600 text-white border-orange-600 shadow-lg' // Selected slot
                            : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:bg-orange-50' // Available slot
                    }`}
            >
                {slot}
                {isBooked && <span className="block text-[8px] opacity-50">BOOKED</span>}
            </button>
        );
    })}
</div>
    {rescheduleData.preferredDate && availableSlots.length === 0 && (
        <p className="text-[10px] text-red-500 font-medium text-center mt-2">
            No slots available for this date.
        </p>
    )}
</div>

                                {/* 💬 REASON TEXTAREA */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase tracking-widest">Reason for Rescheduling</label>
                                    <textarea 
                                        rows="3"
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all resize-none"
                                        placeholder="Briefly explain why..."
                                        value={rescheduleData.reason}
                                        onChange={(e) => setRescheduleData({...rescheduleData, reason: e.target.value})}
                                    />
                                </div>

                                {/* BUTTONS */}
                                <div className="flex gap-3 pt-4">
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 bg-gray-100 text-gray-500 text-xs font-black rounded-2xl hover:bg-gray-200 transition-all uppercase"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleRescheduleSubmit}
                                        className="flex-[2] py-4 bg-orange-600 text-white text-xs font-black rounded-2xl hover:bg-orange-700 shadow-xl shadow-orange-200 transition-all uppercase"
                                    >
                                        Submit Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ViewFeedbackModal 
            open={feedbackOpen} 
            setOpen={setFeedbackOpen} 
            feedback={selectedFeedback} 
        />
        </div>

    );
};

export default JobseekerInterviews;