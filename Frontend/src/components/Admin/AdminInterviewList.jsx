import React, { useEffect, useState } from "react";
import axios from "axios";
import { INTERVIEW_API_END_POINT } from "@/utils/constant";
import { Calendar, Clock, Video, MapPin, Building2, User, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner"; 

const AdminInterviewList = () => {
    const [interviews, setInterviews] = useState([]);

    // 1. Fetch all interviews
    const fetchAll = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/admin/all-interviews`, { withCredentials: true });
            if (res.data.success) {
                setInterviews(res.data.interviews);
            }
        } catch (error) {
            console.error("Admin fetch error", error);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // 2. Approve Reschedule Handler
    const handleApproveReschedule = async (interviewId, newDate, newTime) => {
        try {
            const res = await axios.post(`${INTERVIEW_API_END_POINT}/approve-reschedule`, 
                { interviewId, newDate, newTime }, 
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success("Interview rescheduled successfully!");
                fetchAll(); 
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to approve");
        }
    };

    // ⭐ 3. NEW: Delete Interview Handler
    const deleteInterview = async (id) => {
        if(!window.confirm("Are you sure you want to cancel and delete this interview?")) return;
        try {
            const res = await axios.delete(`${INTERVIEW_API_END_POINT}/interview/${id}`, { withCredentials: true });
            if(res.data.success) {
                toast.success(res.data.message || "Interview deleted");
                fetchAll(); // Refresh list after delete
            }
        } catch (error) {
            toast.error("Error deleting interview");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Interview Master List</h1>
                        <p className="text-gray-500">Manage all scheduled interviews across the platform</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="p-4 font-semibold uppercase text-xs">Candidate</th>
                                <th className="p-4 font-semibold uppercase text-xs">Job & Company</th>
                                <th className="p-4 font-semibold uppercase text-xs">Schedule</th>
                                <th className="p-4 font-semibold uppercase text-xs text-center">Mode</th>
                                <th className="p-4 font-semibold uppercase text-xs text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {interviews.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50/80 transition-colors">
                                    {/* Candidate Info */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">
                                                    {item.jobseeker?.fullname || item.application?.applicant?.fullname || "N/A"}
                                                </p>
                                                <p className="text-[10px] text-gray-500">{item.jobseeker?.email || "No Email"}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Job & Company Info */}
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-800 text-sm">
                                                <Building2 size={12} className="inline mr-1 mb-1"/>
                                                {item.company?.name || "N/A"}
                                            </span>
                                            <span className="text-xs text-gray-500">{item.job?.title || "N/A"}</span>
                                        </div>
                                    </td>

                                    {/* Date & Time */}
                                    <td className="p-4">
                                        <div className="text-xs space-y-1 text-gray-700">
                                            <p className="flex items-center gap-1 font-medium"><Calendar size={12} className="text-indigo-500"/> {item.date}</p>
                                            <p className="flex items-center gap-1"><Clock size={12} className="text-indigo-500"/> {item.time}</p>
                                        </div>
                                    </td>
                                    
                                    {/* Mode Badge */}
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            item.mode === 'online' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                                        }`}>
                                            {item.mode || "offline"}
                                        </span>
                                    </td>

                                    {/* Actions: Approve & Delete */}
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-3">
                                            {item.status === 'reschedule_requested' && (
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-[9px] font-bold text-orange-500 uppercase">New Req: {item.suggestedDate}</span>
                                                    <button 
                                                        onClick={() => handleApproveReschedule(item._id, item.suggestedDate, item.suggestedTime)}
                                                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-all shadow-sm"
                                                    >
                                                        <CheckCircle2 size={14} /> APPROVE
                                                    </button>
                                                </div>
                                            )}

                                            <button 
                                                onClick={() => deleteInterview(item._id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                title="Delete Interview"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {interviews.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 text-gray-400">
                            <p>No interviews found in the system.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminInterviewList;