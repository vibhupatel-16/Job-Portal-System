import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, User, Briefcase, Trash2 } from "lucide-react";
import { toast } from "sonner";

const ScheduledInterviews = () => {
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        const fetchList = async () => {
            try {
                // Employer ke liye filtered list fetch karna
                const res = await axios.get(`${INTERVIEW_API_END_POINT}/scheduled-list`, { withCredentials: true });
                if (res.data.success) {
                    setInterviews(res.data.interviews);
                }
            } catch (error) {
                console.error("Error fetching scheduled interviews", error);
            }
        };
        fetchList();
    }, []);

    // Interview Delete karne ka function (Optional)
    const deleteInterview = async (id) => {
        if(!window.confirm("Are you sure you want to cancel this interview?")) return;
        try {
            // Aapko backend mein delete route banana hoga iske liye
            const res = await axios.delete(`${INTERVIEW_API_END_POINT}/interview/${id}`, { withCredentials: true });
            if (res.data.success) {
                setInterviews(interviews.filter(item => item._id !== id));
                toast.success("Interview cancelled successfully");
            }
        } catch (error) {
            toast.error("Failed to delete interview");
        }
    };

    return (
        <div className='max-w-6xl mx-auto my-10 p-4'>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className='font-bold text-2xl text-gray-800'>My Scheduled Interviews</h1>
                    <p className="text-gray-500 text-sm">Manage interviews for the jobs you've posted</p>
                </div>
                <Badge variant="secondary" className="px-4 py-1">
                    {interviews.length} Total Scheduled
                </Badge>
            </div>

            <div className='bg-white border rounded-2xl shadow-sm overflow-hidden'>
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="font-semibold text-gray-700">Candidate</TableHead>
                            <TableHead className="font-semibold text-gray-700">Job Role</TableHead>
                            <TableHead className="font-semibold text-gray-700">Date & Time</TableHead>
                            <TableHead className="font-semibold text-gray-700">Mode</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {interviews.map((item) => (
                            <TableRow key={item._id} className="hover:bg-gray-50 transition-colors">
                                {/* Candidate Detail */}
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                            <User size={16} />
                                        </div>
                                        <span className="font-medium text-gray-800">
                                            {item.application?.applicant?.fullname || "Candidate Name"}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Job Role */}
                                <TableCell>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Briefcase size={16} className="text-gray-400" />
                                        {item.job?.title || "N/A"}
                                    </div>
                                </TableCell>

                                {/* Date & Time */}
                                <TableCell>
                                    <div className="flex flex-col text-sm">
                                        <span className="flex items-center gap-1 font-semibold">
                                            <Calendar size={14} className="text-purple-600" /> {item.date}
                                        </span>
                                        <span className="flex items-center gap-1 text-gray-500">
                                            <Clock size={14} /> {item.time}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Mode & Meeting Link */}
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className={`w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                            item.mode === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {item.mode}
                                        </span>
                                        {item.mode === 'online' && item.meetingLink && (
                                            <a href={item.meetingLink} target="_blank" className="text-blue-500 text-xs flex items-center gap-1 hover:underline">
                                                <Video size={12} /> Join Meeting
                                            </a>
                                        )}
                                    </div>
                                </TableCell>

                                {/* Action Buttons */}
                                <TableCell className="text-center">
                                    <button 
                                        onClick={() => deleteInterview(item._id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Cancel Interview"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {interviews.length === 0 && (
                    <div className='text-center py-20 bg-gray-50'>
                        <p className='text-gray-400'>You haven't scheduled any interviews yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScheduledInterviews;