import React, { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  Building2,
  ClipboardList,
  UserCheck,
  UserX,
  ChevronRight,
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";

import { useNavigate } from "react-router-dom";

// 💡 Admin Stats API ka endpoint (jo aapne backend mein define kiya hai)
// Agar aapka route /admin/stats hai, toh yeh use karein:
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

  // LOAD ALL STATS (SIMPLIFIED AND FIXED)
 useEffect(() => {
  const loadStats = async () => {
    try {
      // ------------------------------------------------
      // ❗ FIX: Only one API call for all stats
      // ------------------------------------------------
      console.log(`Fetching Admin Stats from: ${ADMIN_STATS_URL}`);
      const res = await axiosInstance.get(ADMIN_STATS_URL, { withCredentials: true });
      
      // 💡 KEY FIX: Extracting the 'stats' object from the API response
      const fetchedStats = res.data.stats; 

      if (fetchedStats) {
        console.log("Stats successfully fetched and set:", fetchedStats);
        setStats({
          // Direct mapping of API response keys to state keys
          totalUsers: fetchedStats.totalUsers || 0,
          totalEmployers: fetchedStats.totalEmployers || 0,
          totalJobseekers: fetchedStats.totalJobseekers || 0,
          totalJobs: fetchedStats.totalJobs || 0,
          totalCompanies: fetchedStats.totalCompanies || 0,
          totalApplications: fetchedStats.totalApplications || 0,
        });
      } else {
         console.error("Admin Stats API did not return expected 'stats' object.");
      }

    } catch (error) {
      // Agar yahan error aata hai, toh check karein ki ADMIN_STATS_URL sahi hai aur Admin logged in hai.
      console.log("Stats loading error (Admin Stats API failed):", error);
    }
  };

  loadStats();
}, []);


  return (
    <div className="bg-gray-100 min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">

        <Stat title="Total Users" value={stats.totalUsers} icon={<Users size={34} className="text-indigo-600" />} />
        <Stat title="Employers" value={stats.totalEmployers} icon={<UserCheck size={34} className="text-blue-600" />} />
        <Stat title="Jobseekers" value={stats.totalJobseekers} icon={<UserX size={34} className="text-pink-600" />} />
        <Stat title="Total Jobs" value={stats.totalJobs} icon={<Briefcase size={34} className="text-purple-600" />} />
        <Stat title="Companies" value={stats.totalCompanies} icon={<Building2 size={34} className="text-green-600" />} />
        <Stat title="Applications" value={stats.totalApplications} icon={<ClipboardList size={34} className="text-yellow-600" />} />

      </div>

      {/* MANAGE SECTIONS */}
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

const Stat = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border flex items-center justify-between">
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
    className="bg-white p-8 border rounded-2xl shadow hover:shadow-lg cursor-pointer transition"
  >
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <p className="text-gray-500 text-sm mb-4">{desc}</p>
    <span className="text-indigo-600 font-medium flex items-center gap-1">
      Open <ChevronRight size={18} />
    </span>
  </div>
);

export default AdminPanel;