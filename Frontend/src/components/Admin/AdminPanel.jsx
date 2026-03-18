import React, { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  Building2,
  ClipboardList,
  UserCheck,
  UserX,
  ChevronRight,
  CheckCircle, XCircle, MessageSquare, Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import AdminDashboardCharts from "./AdminDashboardCharts";

const ADMIN_STATS_URL = "/admin/stats";

const AdminPanel = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEmployers: 0,
    totalJobseekers: 0,
    totalJobs: 0,
    totalCompanies: 0,
    totalApplications: 0,
  });
  const [pendingTestimonials, setPendingTestimonials] = useState([]);

  // 🔹 LOAD ADMIN STATS
  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await axiosInstance.get(ADMIN_STATS_URL, {
          withCredentials: true,
        });

        const fetchedStats = res.data.stats;

        if (fetchedStats) {
          setStats({
            totalUsers: fetchedStats.totalUsers || 0,
            totalEmployers: fetchedStats.totalEmployers || 0,
            totalJobseekers: fetchedStats.totalJobseekers || 0,
            totalJobs: fetchedStats.totalJobs || 0,
            totalCompanies: fetchedStats.totalCompanies || 0,
            totalApplications: fetchedStats.totalApplications || 0,
          
          });
        }
      } catch (error) {
        console.log("Admin stats load error:", error);
      }
    };

    loadStats();
    loadPendingTestimonials();
  }, []);
  const loadPendingTestimonials = async () => {
    try {
        const res = await axiosInstance.get("/testimonials/pending");
        if (res.data.success) {
            setPendingTestimonials(res.data.testimonials);
        }
    } catch (error) {
        console.error("Error loading testimonials", error);
    }
};

useEffect(() => {
    loadPendingTestimonials();
}, []);

  const handleApprove = async (id) => {
    try {
      const res = await axiosInstance.delete(`/testimonials/delete/${id}`);
      setPendingTestimonials(prev => prev.filter(item => item._id !== id));
      // Aap toast.success yahan add kar sakte hain
    } catch (err) { alert("Error approving"); }
  };
  return (
    <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-indigo-50 min-h-screen px-6 py-10">
      
      {/* 🔹 TITLE */}
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      {/* 🔹 TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">

        <Stat
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={34} className="text-indigo-600" />}
        />

        <Stat
          title="Employers"
          value={stats.totalEmployers}
          icon={<UserCheck size={34} className="text-blue-600" />}
        />

        <Stat
          title="Jobseekers"
          value={stats.totalJobseekers}
          icon={<UserX size={34} className="text-pink-600" />}
        />

        <Stat
          title="Total Jobs"
          value={stats.totalJobs}
          icon={<Briefcase size={34} className="text-purple-600" />}
        />

        <Stat
          title="Companies"
          value={stats.totalCompanies}
          icon={<Building2 size={34} className="text-green-600" />}
        />

        <Stat
          title="Applications"
          value={stats.totalApplications}
          icon={<ClipboardList size={34} className="text-yellow-600" />}
        />

      </div>

      {/* 🔥 CHARTS SECTION */}
      <AdminDashboardCharts stats={stats} />

    <div className="max-w-7xl mx-auto p-6">
        {/* Aapke existing Stats aur ManageBox cards yahan honge... */}

        {/* NAYA SECTION: Pending Approval */}
        <div className="mt-12 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
                <MessageSquare className="text-purple-600" /> Pending Testimonials
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingTestimonials && pendingTestimonials.length > 0 ? (
                    pendingTestimonials.map((t) => (
                        <div key={t._id} className="p-6 border rounded-3xl bg-gray-50 flex flex-col justify-between hover:shadow-md transition-all">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="font-bold text-gray-800">{t.user?.name || "User"}</p>
                                        <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">{t.role}</p>
                                    </div>
                                    <div className="flex text-amber-400">
                                        {Array.from({ length: t.rating }).map((_, i) => (
                                            <Star key={i} size={14} fill="currentColor" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 italic text-sm">"{t.content}"</p>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button 
                                    onClick={() => handleApprove(t._id)}
                                    className="flex-1 bg-green-500 text-white py-2 rounded-xl font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                    <CheckCircle size={16} /> Approve
                                </button>
                                <button 
                                    onClick={() => handleDelete(t._id)}
                                    className="flex-1 bg-white text-red-500 border border-red-100 py-2 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                    <XCircle size={16} /> Reject
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-gray-400 font-medium">
                        No pending testimonials at the moment.
                    </div>
                )}
            </div>
        </div>
    </div>


      {/* 🔹 MANAGE SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        <ManageBox
          title="Manage Users"
          desc="View and control all users"
          onClick={() => navigate("/admin/users")}
        />

        <ManageBox
          title="Manage Jobs"
          desc="View all job postings"
          onClick={() => navigate("/admin/jobs")}
        />

        <ManageBox
          title="Manage Companies"
          desc="View all registered companies"
          onClick={() => navigate("/admin/companies")}
        />

        <ManageBox
          title="Manage Applications"
          desc="Track all applications"
          onClick={() => navigate("/admin/applications")}
        />

      </div>
    </div>
  );
};

export default AdminPanel;

/* =======================
   🔹 REUSABLE COMPONENTS
======================= */

const Stat = ({ title, value, icon }) => (
  <div
    className="
      bg-white p-6 rounded-2xl shadow-md border
      hover:shadow-xl hover:-translate-y-1
      transition-all duration-300
      flex items-center justify-between
    "
  >
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
    {icon}
  </div>
);

const ManageBox = ({ title, desc, onClick }) => (
  <div
    onClick={onClick}
    className="
      bg-white p-8 border rounded-2xl shadow
      hover:shadow-lg hover:-translate-y-1
      cursor-pointer transition-all duration-300
    "
  >
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <p className="text-gray-500 text-sm mb-4">{desc}</p>
    <span className="text-indigo-600 font-medium flex items-center gap-1">
      Open <ChevronRight size={18} />
    </span>
  </div>
);
