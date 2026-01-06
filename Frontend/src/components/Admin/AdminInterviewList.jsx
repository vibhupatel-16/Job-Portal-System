import React, { useEffect, useState } from "react";
import axios from "axios";
import { INTERVIEW_API_END_POINT } from "@/utils/constant";
import { Calendar, Clock, Video, MapPin, Building2, User } from "lucide-react";

const AdminInterviewList = () => {
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // Admin endpoint jahan se saara data aayega
                const res = await axios.get(`http://localhost:8000/api/v1/admin/all-interviews`, { withCredentials: true });
                if (res.data.success) {
                    setInterviews(res.data.interviews);
                }
            } catch (error) {
                console.error("Admin fetch error", error);
            }
        };
        fetchAll();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Interview Master List</h1>
                        <p className="text-gray-500">Track all scheduled interviews across the platform</p>
                    </div>
                    <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold">
                        Total: {interviews.length}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="p-4 font-semibold text-gray-600">Company & Job</th>
                                <th className="p-4 font-semibold text-gray-600">Candidate</th>
                                <th className="p-4 font-semibold text-gray-600">Date & Time</th>
                                <th className="p-4 font-semibold text-gray-600">Mode</th>
                                <th className="p-4 font-semibold text-gray-600">Meeting Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {interviews.map((item) => (
                                <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                                                <Building2 size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{item.company?.name}</p>
                                                <p className="text-sm text-gray-500">{item.job?.title}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-gray-400" />
                                            {item.application?.applicant?.fullname || "N/A"}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1 text-sm">
                                            <span className="flex items-center gap-1 font-medium"><Calendar size={14}/> {item.date}</span>
                                            <span className="flex items-center gap-1 text-gray-500"><Clock size={14}/> {item.time}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            item.mode === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            {item.mode}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {item.mode === "online" && item.meetingLink ? (
                                            <a href={item.meetingLink} target="_blank" className="flex items-center gap-1 text-blue-600 hover:underline font-medium">
                                                <Video size={16} /> Join Link
                                            </a>
                                        ) : (
                                            <span className="flex items-center gap-1 text-gray-400 italic">
                                                <MapPin size={16} /> In-Person
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {interviews.length === 0 && (
                        <div className="text-center py-20">
                            <Calendar size={48} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-gray-400 text-lg">No interviews found in the system.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminInterviewList;