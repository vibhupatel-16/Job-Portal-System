import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  UserCircle,
  Briefcase,
  Bookmark,
  Calendar,
  FileText,
  ChevronRight,
  TrendingUp,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import useGetAppliedJobs from "../hooks/useGetAppliedJob";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const JobSeekerDashboard = () => {
  useGetAppliedJobs();
  const { user } = useSelector((store) => store.auth);
  const appliedJobs = useSelector((store) => store.job?.allAppliedJobs || []);
  
  const [selectedJourney, setSelectedJourney] = useState(null);

  const appliedCount = appliedJobs?.length ?? 0;
  const savedCount = user?.savedJobs?.length ?? 0;

  const statusCounts = React.useMemo(() => {
    const counts = { pending: 0, shortlisted: 0, accepted: 0, rejected: 0 };
    (appliedJobs || []).forEach((app) => {
      const s = (app?.status || "pending").toLowerCase();
      if (counts[s] !== undefined) counts[s]++;
    });
    return counts;
  }, [appliedJobs]);

  const monthlyData = [
    { name: 'Jan', count: 12 }, { name: 'Feb', count: 8 }, { name: 'Mar', count: 15 },
    { name: 'Apr', count: 32 }, { name: 'May', count: 10 }, { name: 'Jun', count: 6 },
    { name: 'Jul', count: 18 }, { name: 'Aug', count: 22 }
  ];

  return (
    <div className="space-y-8 bg-[#f8f9fa] min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 rounded-lg">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Welcome back, <span className="text-indigo-600">{user?.fullname?.split(" ")[0] || "User"}</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500 font-medium">Manage your career journey</p>
      </motion.div>

      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4 tracking-tight">Key Metrics</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          
          {/* 1. Applied Jobs */}
          <Link to="/profile" className="relative p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between overflow-hidden min-h-[160px] group">
            <div className="flex gap-4 relative z-10">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl h-fit">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Applied Jobs</p>
                <h3 className="text-2xl font-bold text-gray-900">{appliedCount}</h3>
              </div>
            </div>
            <div className="mt-4 relative z-10">
              <span className="text-sm font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">View List</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-between px-4 opacity-80 pointer-events-none">
              {[40, 70, 50, 90, 60, 80, 50, 70, 40].map((h, i) => (
                <div key={i} style={{ height: `${h}%` }} className="w-4 bg-gradient-to-t from-[#0ea5e9] to-[#38bdf8] rounded-t-sm mx-0.5" />
              ))}
            </div>
          </Link>

          {/* 2. Saved Jobs */}
          <Link to="/saved-jobs" className="relative p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between overflow-hidden min-h-[160px] group">
            <div className="flex gap-4 relative z-10">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl h-fit">
                <Bookmark size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
                <h3 className="text-2xl font-bold text-gray-900">{savedCount}</h3>
              </div>
            </div>
            <div className="mt-4 relative z-10">
              <span className="text-sm font-semibold text-gray-500 group-hover:text-purple-600 transition-colors">View Saved</span>
            </div>
            <svg className="absolute bottom-0 left-0 w-full h-20 opacity-40 pointer-events-none" viewBox="0 0 100 40" preserveAspectRatio="none">
              <path d="M0 40 Q 25 20, 50 30 T 100 10 L 100 40 Z" fill="url(#purpleGradient)" />
              <path d="M0 40 Q 25 20, 50 30 T 100 10" stroke="#7c3aed" strokeWidth="2" fill="none" />
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </Link>

          {/* 3. Profile Status */}
          <Link to="/profile" className="relative p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between min-h-[160px] group">
            <p className="text-sm font-medium text-gray-600 mb-2">Profile Status</p>
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 shadow-sm rounded-full" viewBox="0 0 36 36">
                  <path className="text-gray-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-indigo-600" strokeDasharray="90, 100" strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <UserCircle className="absolute text-indigo-600" size={20} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">90%</p>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Complete</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-semibold text-gray-500 group-hover:text-indigo-600 transition-colors">Manage</span>
            </div>
          </Link>

          {/* 4. Interviews */}
          <Link to="/jobseeker/interviews" className="relative p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between min-h-[160px] group">
            <div className="flex gap-4 relative z-10">
              <div className="p-3 bg-purple-50 text-indigo-600 rounded-xl h-fit">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-tight">Interviews</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">Schedule</h3>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-semibold text-gray-500 group-hover:text-indigo-600 transition-colors">View Schedule</span>
            </div>
          </Link>
          
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800 tracking-tight">Application Status & History</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN - Overview & Chart */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-6">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              Application status overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-[1.25rem] p-5 text-center flex flex-col justify-center border border-gray-100/50">
                <span className="text-3xl font-black text-gray-800">{statusCounts.pending}</span>
                <span className="text-xs font-semibold text-gray-500 mt-1">Pending</span>
              </div>
              <div className="bg-purple-50/70 rounded-[1.25rem] p-5 text-center flex flex-col justify-center border border-purple-100/30">
                <span className="text-3xl font-black text-purple-700">{statusCounts.shortlisted}</span>
                <span className="text-xs font-semibold text-purple-600 mt-1">Shortlisted</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-6 tracking-tight">Monthly Activity</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barSize={14}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#9ca3af'}} />
                  <Tooltip 
                    cursor={{fill: '#f3f4f6'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    labelStyle={{color: '#4b5563', fontWeight: 'bold', fontSize: '12px', marginBottom: '4px'}}
                    itemStyle={{color: '#4f46e5', fontWeight: 'bold', fontSize: '12px'}}
                   />
                  <Bar dataKey="count" fill="#d1d5db" radius={[4, 4, 4, 4]} activeBar={{ fill: '#818cf8' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Recent Applications */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-gray-50">
              <h3 className="text-sm font-bold text-gray-800 tracking-tight">Recent Applications</h3>
            </div>
            
            <div className="overflow-x-auto flex-1 p-2">
              <table className="w-full text-left">
                <thead className="text-[11px] font-bold text-gray-400 border-b border-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Company</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(appliedJobs.length > 0 ? appliedJobs.slice(0, 5) : [
                     { _id: 1, createdAt: '2026-03-18T00:00:00Z', job: { title: 'Python Developer', company: { name: 'Odoo' } }, status: 'accepted' },
                     { _id: 2, createdAt: '2026-03-16T00:00:00Z', job: { title: 'Computer Operator', company: { name: 'Nexforge' } }, status: 'accepted' },
                     { _id: 3, createdAt: '2026-03-14T00:00:00Z', job: { title: 'Php Developer', company: { name: 'Dharma Infosystem' } }, status: 'accepted' }
                  ]).map((app, idx) => (
                    <tr key={app._id || idx} className="hover:bg-gray-50/50 transition-colors relative group">
                      <td className="px-6 py-5 text-xs text-gray-600 font-medium whitespace-nowrap">
                        {new Date(app.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-800 font-semibold">{app.job?.title}</td>
                      <td className="px-6 py-5 text-sm text-gray-600">{app.job?.company?.name}</td>
                      <td className="px-6 py-5 flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          app.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                          app.status === 'shortlisted' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {app.status}
                        </span>
                        <button 
                          onClick={() => setSelectedJourney(app)}
                          className="p-1.5 rounded-full border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Clock size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* JOB JOURNEY MODAL */}
      <Dialog open={!!selectedJourney} onOpenChange={(open) => !open && setSelectedJourney(null)}>
        <DialogContent className="rounded-[1.5rem] bg-white border-none shadow-xl max-w-sm p-6 overflow-hidden">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xs font-black text-gray-800 flex items-center justify-between">
              <span className="uppercase tracking-widest">Job Journey: <span className="text-gray-500 font-semibold">{selectedJourney?.job?.title}</span></span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[16px] before:h-full before:w-0.5 before:bg-indigo-100 pt-2 pb-2">
            {/* Step 1: Always Applied */}
            <div className="relative flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 shadow-md shrink-0 absolute -left-[28px]">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div className="flex flex-col ml-[12px]">
                <span className="font-bold text-gray-800 text-sm">JOB APPLIED</span>
                <span className="text-xs text-gray-400">{selectedJourney ? new Date(selectedJourney.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-') : '18-03-2026'}</span>
              </div>
            </div>
            
            {/* Dynamic History Steps */}
            {selectedJourney?.statusHistory?.map((event, i) => (
              <div key={i} className="relative flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 shadow-md shrink-0 absolute -left-[28px]">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <div className="flex flex-col ml-[12px]">
                  <span className="font-bold text-gray-800 text-sm uppercase">{event.status === 'accepted' ? 'INTERVIEW SCHEDULED' : event.status}</span>
                  <span className="text-xs text-gray-400">{event.changedAt ? new Date(event.changedAt).toLocaleDateString('en-GB').replace(/\//g, '-') : 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobSeekerDashboard;
