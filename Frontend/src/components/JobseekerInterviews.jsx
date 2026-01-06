import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Video, MapPin, Calendar, Clock } from "lucide-react";

const JobseekerInterviews = () => {
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        const fetchMyInterviews = async () => {
            try {
                // Ye endpoint aapke interview.controller.js ke getJobseekerInterviews ko call karega
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

    return (
        <div className='max-w-5xl mx-auto my-10 px-4'>
            <h1 className='font-bold text-2xl mb-6 text-gray-800'>My Scheduled Interviews</h1>
            <div className='bg-white border rounded-2xl shadow-sm overflow-hidden'>
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead>Company</TableHead>
                            <TableHead>Job Role</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Mode</TableHead>
                            <TableHead>Interview Link / Info</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {interviews.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell className="font-bold text-blue-600">
                                    {item.job?.company?.name}
                                </TableCell>
                                <TableCell>{item.job?.title}</TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <div className="font-medium flex items-center gap-1">
                                            <Calendar size={14}/> {item.date}
                                        </div>
                                        <div className="text-gray-500 flex items-center gap-1">
                                            <Clock size={14}/> {item.time}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={item.mode === 'online' ? 'default' : 'secondary'} className="capitalize">
                                        {item.mode}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {item.mode === "online" && item.meetingLink ? (
                                        <a 
                                            href={item.meetingLink} 
                                            target="_blank" 
                                            className="text-blue-500 hover:underline flex items-center gap-1 font-medium"
                                        >
                                            <Video size={16} /> Join Interview
                                        </a>
                                    ) : (
                                        <span className="text-gray-500 flex items-center gap-1">
                                            <MapPin size={16} /> In-Person Office
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {interviews.length === 0 && (
                    <div className='text-center py-16 text-gray-400'>
                        No interviews scheduled yet. Keep applying!
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobseekerInterviews;