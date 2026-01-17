import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, User, Briefcase, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const ScheduledInterviews = () => {
    const [interviews, setInterviews] = useState([]);

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
            toast.error("Error cancelling interview");
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
                                            <Calendar size={13}/> {item.date}
                                        </span>
                                        <span className="text-gray-500 flex items-center gap-1">
                                            <Clock size={13}/> {item.time}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Badge className={item.mode === 'online' ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}>
                                        {item.mode.toUpperCase()}
                                    </Badge>
                                </TableCell>

                                {/* Action Column mein jahan Approve button hai */}
<TableCell className="text-center">
    <div className="flex items-center justify-center gap-2">
        
        {/* ⭐ FIX: Status ke saath yeh bhi check karein ki kya login user hi scheduler hai? */}
        {(item.status === 'reschedule_requested' && item.scheduledByRole === 'employer') ? (
            <button 
                onClick={() => handleApproveReschedule(item._id, item.suggestedDate, item.suggestedTime)}
                className="flex items-center gap-1 p-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-all shadow-sm"
            >
                <CheckCircle2 size={18} />
                <span className="text-[10px] font-bold">APPROVE</span>
            </button>
        ) : item.status === 'reschedule_requested' ? (
            // Agar Admin ne schedule kiya hai, toh Employer ko sirf Badge dikhega
            <Badge className="bg-orange-100 text-orange-600 border-none text-[10px]">
                WAITING FOR ADMIN
            </Badge>
        ) : null}

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
        </div>
    );
};

export default ScheduledInterviews;