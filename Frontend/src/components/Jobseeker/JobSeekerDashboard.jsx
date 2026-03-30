import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
import useGetAppliedJobs from "../hooks/useGetAppliedJob";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axoiosInstance from "@/utils/axiosInstance";
import { setUser } from "@/redux/authSlice";
import { useMemo } from "react";
import {motion } from "framer-motion";

const EMPTY_APPLIED_JOBS = [];

const JobSeekerDashboard = () => {
  useGetAppliedJobs();
  const user = useSelector((store) => store.auth.user);
  const appliedJobs = useSelector((store) => store.job?.allAppliedJobs ?? EMPTY_APPLIED_JOBS);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const refreshUser = async () => {
      try {
        const res = await axoiosInstance.get(`/user/me`, );
        if (res.data.success && res.data.user) {
          dispatch(setUser(res.data.user));
        }
      } catch (error) {
        console.log("Failed to refresh user stats silently", error);
      }
    };
    
    // Only fetch once when component mounts
    refreshUser();
  }, [dispatch]);
  
  const [selectedJourney, setSelectedJourney] = useState(null);

  const profileProgress = React.useMemo(() => {
    if (!user) return 0;
    let score = 0;
    if (user.fullname) score += 20;
    if (user.email) score += 20;
    if (user.phoneNumber) score += 20;
    if (user.profile?.bio) score += 10;
    if (user.profile?.skills && user.profile.skills.length > 0) score += 10;
    if (user.profile?.resume) score += 10;
    if (user.profile?.profilePhoto) score += 10;
    return score;
  }, [user]);

  if (!user) return null;

  const appliedCount = appliedJobs?.length ?? 0;
  const savedCount = user?.savedJobs?.length ?? 0;

  const statusCounts = useMemo(() => {
    const counts = { pending: 0, shortlisted: 0, accepted: 0, rejected: 0 };
    (appliedJobs || []).forEach((app) => {
      const s = (app?.status || "pending").toLowerCase();
      if (counts[s] !== undefined) counts[s]++;
    });
    return counts;
  }, [appliedJobs]);

  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const data = [];
    
    // Get last 6 months up to current
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({ name: months[d.getMonth()], count: 0, month: d.getMonth(), year: d.getFullYear() });
    }

    if (appliedJobs && appliedJobs.length > 0) {
      appliedJobs.forEach((app) => {
        if (!app.createdAt) return;
        const appDate = new Date(app.createdAt);
        const match = data.find(m => m.month === appDate.getMonth() && m.year === appDate.getFullYear());
        if (match) {
          match.count += 1;
        }
      });
    }
    return data;
  }, [appliedJobs]);

  const weeklyData = React.useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = new Date();
    const data = [];
    
    // Get last 7 days up to today
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      data.push({ 
        name: days[d.getDay()], 
        applications: 0, 
        views: 0, 
        dateStr: d.toDateString() 
      });
    }

    // 1. Map genuine application dates
    if (appliedJobs && appliedJobs.length > 0) {
      appliedJobs.forEach((app) => {
        if (!app.createdAt) return;
        const appDate = new Date(app.createdAt);
        const match = data.find(d => d.dateStr === appDate.toDateString());
        if (match) match.applications += 1;
      });
    }

    // 2. Map genuine profile views (Employers clicking your resume)
    if (user?.profileViews && user.profileViews.length > 0) {
      user.profileViews.forEach((view) => {
        if (!view.viewedAt) return;
        const viewDate = new Date(view.viewedAt);
        const match = data.find(d => d.dateStr === viewDate.toDateString());
        if (match) match.views += 1;
      });
    }

    return data;
  }, [appliedJobs, user]);
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
          <Link to="/profile" className="p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between overflow-hidden min-h-[160px] group relative">
            <div className="flex gap-4 relative z-10 mb-4">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl h-fit">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Applied Jobs</p>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">{appliedCount}</h3>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-16 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 40" fill="none" preserveAspectRatio="none">
                  <path d="M0 40 L0 30 Q 25 25, 50 20 T 100 10 L100 40 Z" fill="url(#blueGradientObj)" />
                  <path d="M0 30 Q 25 25, 50 20 T 100 10" stroke="#8b5cf6" strokeWidth="1.5" fill="none" />
                  <defs>
                    <linearGradient id="blueGradientObj" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
            </div>
          </Link>

          {/* 2. Saved Jobs */}
          <Link to="/saved-jobs" className="p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col min-h-[160px] group relative">
            <div className="flex gap-4 relative z-10">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl h-fit">
                <Bookmark size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Saved Jobs</p>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">{savedCount}</h3>
              </div>
            </div>
            <div className="mt-8 relative z-10">
              <span className="text-xs font-bold text-purple-600 group-hover:text-purple-700 flex items-center gap-1 transition-colors">View Saved &rarr;</span>
            </div>
          </Link>

          {/* 3. Profile Status */}
          <Link to="/profile" className="p-6 rounded-[1.5rem] border border-transparent bg-gradient-to-br from-[#773be8] to-[#601be1] shadow-[0_4px_20px_-4px_rgba(119,59,232,0.3)] hover:shadow-xl transition-all flex flex-col justify-between min-h-[160px] group relative overflow-hidden">
            <div className="flex justify-between items-start z-10 relative">
               <div>
                  <p className="text-sm font-medium text-white/80 mb-1">Profile Status</p>
                  <p className="text-3xl font-bold text-white leading-none">{profileProgress}%</p>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-1">Complete</p>
               </div>
               <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 rounded-full" viewBox="0 0 36 36">
                  <path className="text-white/20" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-white" strokeDasharray={`${profileProgress}, 100`} strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
              </div>
            </div>
            <div className="relative z-10 mt-2">
              <span className="text-xs font-bold text-white group-hover:text-white/90 flex items-center gap-1 transition-colors">Manage &rarr;</span>
            </div>
          </Link>

          {/* 4. Interviews */}
          <Link to="/jobseeker/interviews" className="p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col min-h-[160px] group relative">
            <div className="flex gap-4 relative z-10">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl h-fit">
                <Calendar size={20} />
              </div>
              <div className="mt-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Interviews</p>
                <h3 className="text-xl font-bold text-gray-800 leading-none mt-1">Schedule</h3>
              </div>
            </div>
            <div className="mt-6 relative z-10">
              <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 transition-colors">View Schedule &rarr;</span>
            </div>
          </Link>
          
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800 tracking-tight">Application Status & History</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* LEFT COLUMN - Overview */}
        <div className="lg:col-span-5 h-full">
          <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6 flex flex-col h-full">
            <h3 className="text-sm font-bold text-gray-800 flex items-center justify-between mb-6">
              Application Status Overview
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#f0edfa] rounded-2xl p-5 flex flex-col items-center justify-center">
                <div className="w-10 h-10 bg-[#6a3cb8] rounded-full flex items-center justify-center text-white mb-2 shadow-md">
                   <Clock size={18} />
                </div>
                <span className="text-2xl font-bold text-gray-800 leading-none">{statusCounts.pending}</span>
                <span className="text-xs text-gray-500 mt-1 font-semibold">Pending</span>
              </div>
              <div className="bg-[#fdf0f5] rounded-2xl p-5 flex flex-col items-center justify-center">
                <div className="w-10 h-10 bg-[#93278f] rounded-full flex items-center justify-center text-white mb-2 shadow-md">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-2xl font-bold text-gray-800 leading-none">{appliedCount}</span>
                <span className="text-xs text-gray-500 mt-1 font-semibold">Submitted</span>
              </div>
            </div>

            <div className="flex-1 h-[200px] w-full min-h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                       <Pie
                           data={[
                               { name: 'Interview', value: statusCounts.accepted || 0 },
                               { name: 'Shortlisted', value: statusCounts.shortlisted || 0 },
                               { name: 'Pending', value: statusCounts.pending || 0 },
                               { name: 'Rejected', value: statusCounts.rejected || 0 },
                           ].filter(item => item.value > 0).length > 0 ? [
                               { name: 'Interview', value: statusCounts.accepted || 0 },
                               { name: 'Shortlisted', value: statusCounts.shortlisted || 0 },
                               { name: 'Pending', value: statusCounts.pending || 0 },
                               { name: 'Rejected', value: statusCounts.rejected || 0 },
                           ] : [{ name: 'No Data', value: 1 }]}
                           innerRadius={55}
                           outerRadius={85}
                           paddingAngle={4}
                           dataKey="value"
                       >
                           {['#10b981', '#8b5cf6', '#f59e0b', '#ef4444'].map((color, index) => (
                               <Cell key={`cell-${index}`} fill={color} stroke="none" />
                           ))}
                       </Pie>
                       <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                       <Legend verticalAlign="bottom" iconType="square" wrapperStyle={{fontSize: '11px', fontWeight: 'bold'}} />
                   </PieChart>
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
                  {appliedJobs.length > 0 ? (
                    appliedJobs.slice(0, 5).map((app, idx) => (
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-gray-400 text-sm font-medium">
                        You have not applied to any jobs yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-6 tracking-tight">Monthly Activity</h3>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barSize={24} margin={{left: -20}}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f9fafb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#9ca3af'}} />
                  <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#9ca3af'}} tickCount={5} />
                  <Tooltip 
                    cursor={{fill: '#f8faff'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    itemStyle={{color: '#8b5cf6', fontWeight: 'bold', fontSize: '12px'}}
                   />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-6 tracking-tight">Weekly Activity</h3>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData} margin={{left: -20}}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f9fafb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#9ca3af'}} />
                  <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#9ca3af'}} tickCount={5} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    itemStyle={{fontWeight: 'bold', fontSize: '12px'}}
                   />
                  <Line type="monotone" dataKey="applications" stroke="#8b5cf6" strokeWidth={3} dot={{ stroke: '#8b5cf6', strokeWidth: 3, r: 4, fill: '#fff' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="views" stroke="#c4b5fd" strokeWidth={3} dot={{ stroke: '#c4b5fd', strokeWidth: 3, r: 4, fill: '#fff' }} activeDot={{ r: 6 }} />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{fontSize: '11px', fontWeight: 'bold'}} />
                </LineChart>
              </ResponsiveContainer>
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
