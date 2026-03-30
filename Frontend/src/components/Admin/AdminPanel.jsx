import React, { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  Building2,
  FileText,
  UserCheck,
  UserX,
  ChevronRight,
  Eye, Folder, Check, X, Star
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

  const [recentApps, setRecentApps] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);


  // 🔹 LOAD ADMIN STATS
  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, appsRes, jobsRes] = await Promise.all([
           axiosInstance.get(ADMIN_STATS_URL, ),
           axiosInstance.get("/admin/applications", ),
           axiosInstance.get("/admin/jobs", )
        ]);

        const fetchedStats = statsRes.data.stats;
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

        const apps = appsRes.data.applications || [];
        setRecentApps(apps.slice(0, 4));

        const jobs = jobsRes.data.jobs || [];
        setPendingJobs(jobs.filter(j => j.status === 'pending').slice(0, 4));

      } catch (error) {
        console.log("Admin load error:", error);
      }
    };

    loadData();
  
  }, []);

  return (
    <div className="bg-[#f8f9fa] min-h-screen px-4 sm:px-8 py-8">
      
      {/* 🔹 TITLE */}
      <h1 className="text-2xl font-bold text-gray-800 tracking-tight mb-8">Admin Panel</h1>

      {/* 🔹 TOP STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Stat
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={22} />}
          iconColor="text-indigo-600"
        />
        <Stat
          title="Employers"
          value={stats.totalEmployers}
          icon={<Building2 size={22} />}
          iconColor="text-blue-500"
        />
        <Stat
          title="Jobseekers"
          value={stats.totalJobseekers}
          icon={<Users size={22} />}
          iconColor="text-pink-500"
        />
        <Stat
          title="Total Jobs"
          value={stats.totalJobs}
          icon={<Briefcase size={22} />}
          iconColor="text-purple-500"
        />
        <Stat
          title="Companies"
          value={stats.totalCompanies}
          icon={<Building2 size={22} />}
          iconColor="text-emerald-500"
        />
        <Stat
          title="Applications"
          value={stats.totalApplications}
          icon={<FileText size={22} />}
          iconColor="text-yellow-500"
        />
      </div>

      {/* 🔥 CHARTS SECTION */}
      <AdminDashboardCharts stats={stats} />

      {/* 🔥 RECENT ACTIVITY TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Table 1 */}
        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Recent Job Registrations</h2>
            <button className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors">View All &rarr;</button>
          </div>
          <div className="overflow-x-auto flex-1 p-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100">
                  <th className="pb-4 pt-2">Applicant</th>
                  <th className="pb-4 pt-2">Applied For</th>
                  <th className="pb-4 pt-2">Status</th>
                  <th className="pb-4 pt-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.length > 0 ? recentApps.map((row, i) => (
                  <tr key={row._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0 bg-indigo-50 rounded-full border border-indigo-100 flex items-center justify-center text-indigo-400">
                          <Users size={12} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">{row.applicant?.fullname || "Unknown"}</p>
                          <p className="text-[11px] text-gray-400 truncate max-w-[120px]">{row.applicant?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1">{row.job?.title || "N/A"}</p>
                      <p className="text-[11px] text-gray-400">{row.job?.company?.name || "N/A"}</p>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        row.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        row.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {row.status || 'pending'}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => navigate("/admin/applications")} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors border rounded-lg border-gray-200"><Eye size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )) : <tr><td colSpan="4" className="text-center py-8 text-gray-400 text-sm">No recent applications</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-50 flex justify-between items-center text-xs text-indigo-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate("/admin/applications")}>
            View full application list &rarr;
          </div>
        </div>

        {/* Table 2 */}
        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Pending Job Listings <span className="text-gray-400 text-sm font-normal">(Approval Needed)</span></h2>
            <button onClick={() => navigate("/admin/jobs")} className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors">Manage &rarr;</button>
          </div>
          <div className="overflow-x-auto flex-1 p-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100">
                  <th className="pb-4 pt-2">Company</th>
                  <th className="pb-4 pt-2">Role</th>
                  <th className="pb-4 pt-2">Status</th>
                  <th className="pb-4 pt-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingJobs.length > 0 ? pendingJobs.map((row, i) => (
                  <tr key={row._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 text-sm font-semibold text-gray-800 w-1/3 line-clamp-2">{row.company?.name || "Unknown"}</td>
                    <td className="py-4 text-sm font-medium text-gray-600">{row.title}</td>
                    <td className="py-4">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">PENDING</span>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => navigate("/admin/jobs")} className="px-3 py-1 bg-indigo-50 text-indigo-600 font-semibold text-xs rounded-lg hover:bg-indigo-100 transition-colors">Review</button>
                      </div>
                    </td>
                  </tr>
                )) : <tr><td colSpan="4" className="text-center py-8 text-gray-400 text-sm">No pending jobs</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-50 flex justify-between items-center text-xs text-indigo-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate("/admin/jobs")}>
            Go to Jobs Management &rarr;
          </div>
        </div>
      </div>

      {/* 🔹 MANAGE SECTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

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

const Stat = ({ title, value, icon, iconColor }) => (
  <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col justify-between h-[130px] hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <p className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase">{title}</p>
      <div className={iconColor}>
        {icon}
      </div>
    </div>
    <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
  </div>
);

const ManageBox = ({ title, desc, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 hover:border-indigo-100 hover:shadow-md cursor-pointer transition-all duration-200 min-h-[140px] flex flex-col justify-between"
  >
    <div>
      <h2 className="text-[15px] font-bold text-gray-800 tracking-tight mb-1">{title}</h2>
      <p className="text-[13px] text-gray-500 leading-snug">{desc}</p>
    </div>
    <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 mt-4">
      Open <ChevronRight size={14} />
    </span>
  </div>
);
