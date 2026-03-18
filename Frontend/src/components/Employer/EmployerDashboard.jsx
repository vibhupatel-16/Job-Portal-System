import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  Building2,
  ChevronRight,
  CheckCircle,
  XCircle,
  Calendar,
  Video,
  Eye,
  FileText,
  ListChecks,
  Clock,
  Sparkles,
  MessageSquare
} from "lucide-react";
import axios from "axios";
import axiosInstance from "@/utils/axiosInstance";
import {
  JOB_API_END_POINT,
  APPLICATION_API_END_POINT,
  COMPANY_API_END_POINT,
  INTERVIEW_API_END_POINT,
} from "@/utils/constant";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import TestimonialFeedbackForm from "@/components/shared/TestimonialFeedbackForm";
const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalJobs: 0, totalApplicants: 0, totalCompanies: 0 });
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [showAllApplicants, setShowAllApplicants] = useState(false);

  // Modals State
  const [openInterview, setOpenInterview] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // ⭐ Slot States
  const [bookedSlots, setBookedSlots] = useState([]);
  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    mode: "online",
    meetingLink: ""
  });

  const standardSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM", 
    "02:00 PM", "03:00 PM", "04:00 PM", 
    "05:00 PM", "06:00 PM"
  ];
const [selectedIds, setSelectedIds] = useState([]); // Multiple IDs store karne ke liye
const COLORS = ['#94a3b8', '#9333ea', '#16a34a', '#dc2626']; // Pending, Shortlisted, Accepted, Rejected
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const jobsRes = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true });
      const jobsData = (jobsRes.data.jobs || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setJobs(jobsData);

      const applicantReq = jobsData.map(job =>
        axios.get(`${APPLICATION_API_END_POINT}/${job._id}/applicants`, { withCredentials: true })
      );
      const applicantRes = await Promise.all(applicantReq);
      const apps = applicantRes.flatMap(res => res.data.job.applications || [])
                               .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setApplications(apps);

      const compRes = await axios.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true });
      setStats({
        totalJobs: jobsData.length,
        totalApplicants: apps.length,
        totalCompanies: compRes.data.companies?.length || 0
      });
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  // Ek individual checkbox ko select karne ke liye
const handleSelect = (id) => {
    setSelectedIds(prev => 
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
};

// Sabko ek saath select karne ke liye
const handleSelectAll = (e) => {
    if (e.target.checked) {
        const currentIds = (showAllApplicants ? applications : applications.slice(0, 6)).map(app => app._id);
        setSelectedIds(currentIds);
    } else {
        setSelectedIds([]);
    }
};

// API Call for Bulk Update
const handleBulkUpdate = async (newStatus) => {
    try {
        const promises = selectedIds.map(id => 
            axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status: newStatus }, { withCredentials: true })
        );
        await Promise.all(promises);
        toast.success(`${selectedIds.length} Candidates updated to ${newStatus}`);
        setSelectedIds([]); // Selection clear karein
        fetchDashboardData(); // Data refresh karein
    } catch (error) {
        toast.error("Bulk update failed");
    }
};
  const updateStatus = async (appId, status) => {
    try {
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${appId}/update`, { status }, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        setApplications(prev => prev.map(app => app._id === appId ? { ...app, status } : app));
      }
    } catch (error) {
      toast.error("Status update failed", error);
    }
  };

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    setInterviewData({ ...interviewData, date: selectedDate, time: "" });

    try {
      // route.js mein path "/booked-slots" hai
      const res = await axios.get(`${INTERVIEW_API_END_POINT}/booked-slots?date=${selectedDate}`, { withCredentials: true });
      if (res.data.success) {
        setBookedSlots(res.data.bookedTimes || []);
      }
    } catch (error) {
      console.error("Error fetching slots", error);
    }
  };

  const scheduleInterview = async () => {
    try {
        // Console log karke check karein ki data mil raha hai ya nahi
        console.log("Selected App Data:", selectedApp);

        const res = await axios.post(`${INTERVIEW_API_END_POINT}/interviews`, {
            applicationId: selectedApp?._id,
            jobseekerId: selectedApp?.applicant?._id, // Ye ID zaroori hai
            date: interviewData.date,
            time: interviewData.time,
            mode: interviewData.mode,
            meetingLink: interviewData.mode === "offline" ? interviewData.meetingLink : ""
        }, { withCredentials: true });

        if (res.data.success) {
            toast.success("Interview Scheduled!");
            setOpenInterview(false);
        }
    } catch (error) {
        // Agar yahan error aa rahi hai, toh backend terminal dekhein
        console.error("Full Error Object:", error.response?.data);
        toast.error(error.response?.data?.message || "Scheduling failed");
    }
};
const handleAiScan = async (applicationId) => {
    try {
        console.log("Scanning Application ID:", applicationId);
        
        // Correct endpoint use karein
        const res = await axios.get(`${APPLICATION_API_END_POINT}/status/${applicationId}/ai-scan`, {
            withCredentials: true
        });

        if (res.data.success) {
            toast.success(res.data.message);
            fetchDashboardData(); // Correct function name
        }
    } catch (error) {
        console.error("Frontend Error:", error);
        toast.error(error.response?.data?.message || "Scan failed");
    }
};
const handleGenerateQuestions = async (applicationId) => {
  try {
    // Button par loading state dikhane ke liye aap ek loading state bhi use kar sakte hain
    toast.loading("AI is generating questions...");

    const res = await axios.get(
      `${APPLICATION_API_END_POINT}/${applicationId}/questions`, 
      { withCredentials: true }
    );

    if (res.data.success) {
      toast.success("Questions generated successfully!");
      
      // Local state update karein taaki UI par turant badlav dikhe
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app._id === applicationId 
            ? { ...app, interviewQuestions: res.data.questions } 
            : app
        )
      );
      
      // Optional: Questions dekhne ke liye modal automatically open kar sakte hain
      const updatedApp = applications.find(a => a._id === applicationId);
      if(updatedApp) setSelectedApp({...updatedApp, interviewQuestions: res.data.questions});
    }
  } catch (error) {
    console.error(error);
    const errorMsg = error.response?.data?.message || "Failed to generate questions";
    toast.error(errorMsg);
  } finally {
    toast.dismiss();
  }
};
const HiringFunnel = ({ applications }) => {
  // Status wise data calculate karna
  // EmployerDashboard.jsx ke andar HiringFunnel component mein:
const total = applications.length;
const shortlisted = applications.filter(app => app.status === 'shortlisted').length;
const interviews = applications.filter(app => app.status === 'accepted').length;

  const steps = [
    { label: "Total Applications", value: total, color: "bg-blue-600", w: "w-full" },
    { label: "Shortlisted", value: shortlisted, color: "bg-purple-600", w: "w-[80%]" },
    { label: "Interviews Ready", value: interviews, color: "bg-orange-500", w: "w-[60%]" }
  ];

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-10">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h3 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">Hiring Funnel</h3>
          <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] mt-1">Application Flow Analysis</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Efficiency</p>
          <p className="text-xl font-black text-blue-600">{total > 0 ? ((interviews/total)*100).toFixed(0) : 0}%</p>
        </div>
      </div>
      
      <div className="flex flex-col items-center space-y-3">
        {steps.map((step, idx) => (
          <div key={idx} className={`${step.w} transition-all duration-700 ease-in-out`}>
            <div className={`${step.color} h-12 rounded-2xl flex items-center justify-between px-6 shadow-sm hover:brightness-110 transition-all`}>
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{step.label}</span>
              <span className="text-sm font-bold text-white bg-black/10 px-3 py-1 rounded-lg">{step.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
  return (
    <div className="bg-gray-50 min-h-screen px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER AREA */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Employer Dashboard</h1>
          <div className="flex gap-4">
            <button 
              onClick={async () => {
                const res = await axios.get(`${INTERVIEW_API_END_POINT}/google/auth`, { withCredentials: true });
                if(res.data.url) window.location.href = res.data.url;
              }}
              className="flex items-center gap-2 bg-white text-red-600 border border-red-200 px-5 py-2.5 rounded-2xl shadow-sm hover:bg-red-50 transition-all font-semibold"
            >
              <Video size={18} /> Connect Google Meet
            </button>
            <Link to="/employer/interview-list" className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-2xl shadow-lg hover:bg-purple-700 transition-all font-semibold">
              <ListChecks size={20} /> View Scheduled Interviews
            </Link>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Jobs" value={stats.totalJobs} icon={<Briefcase className="text-blue-500" />} />
          <StatCard title="Total Applicants" value={stats.totalApplicants} icon={<Users className="text-orange-500" />} />
          <StatCard title="Companies" value={stats.totalCompanies} icon={<Building2 className="text-green-500" />} />
        </div>

       {/* 2. NEW TESTIMONIAL SECTION (Adding it here) */}
      <TestimonialFeedbackForm
        submitPath="/testimonials/submit/employer"
        placeholder="Tell us how we helped you find talent..."
      />
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 mt-10">
    
    {/* 📊 CHART 1: JOB PERFORMANCE (Bar Chart) */}
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Job Performance</h3>
                <p className="text-[10px] text-gray-300 font-bold uppercase mt-1">Applications per job</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                <Briefcase size={20} />
            </div>
        </div>
        
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobs.map(j => ({ name: j.title.substring(0,10), count: j.applications.length }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        fontSize={10} 
                        fontWeight="bold" 
                        tick={{fill: '#94a3b8'}}
                    />
                    <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} />
                    <Tooltip 
                        cursor={{fill: '#f8faff'}} 
                        contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
                    />
                    <Bar dataKey="count" fill="#7c3aed" radius={[10, 10, 0, 0]} barSize={35} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>

    {/* 🍕 CHART 2: HIRING FUNNEL (Pie Chart) */}
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Hiring Pipeline</h3>
                <p className="text-[10px] text-gray-300 font-bold uppercase mt-1">Status Distribution</p>
            </div>
            <div className="p-3 bg-green-50 rounded-2xl text-green-600">
                <Users size={20} />
            </div>
        </div>

        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={[
                            { name: 'Pending', value: applications.filter(a => a.status === 'pending').length },
                            { name: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length },
                            { name: 'Accepted', value: applications.filter(a => a.status === 'accepted').length },
                            { name: 'Rejected', value: applications.filter(a => a.status === 'rejected').length },
                        ]}
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={8}
                        dataKey="value"
                    >
                        {COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                        verticalAlign="bottom" 
                        iconType="circle" 
                        wrapperStyle={{fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', paddingTop: '20px'}} 
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
</div>

        {/* RECENTLY POSTED JOBS */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm mb-8 border border-gray-100">
          <Header title="Recently Posted Jobs" action={() => setShowAllJobs(!showAllJobs)} label={showAllJobs ? "Show Less" : "View All"} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {(showAllJobs ? jobs : jobs.slice(0, 4)).map(job => (
              <div 
                key={job._id} 
                onClick={() => navigate('/employer/jobs')}
                className="p-5 border border-gray-100 rounded-3xl hover:border-purple-300 cursor-pointer bg-gray-50/50 hover:bg-white transition-all hover:shadow-md group"
              >
                <h3 className="font-bold truncate text-gray-800 group-hover:text-purple-600 transition-colors">{job.title}</h3>
                <p className="text-xs text-blue-500 font-bold mt-1 uppercase tracking-tighter">{job.company?.name}</p>
                <div className="flex justify-between items-center mt-4">
                   <span className="text-[10px] text-gray-400">📅 {new Date(job.createdAt).toLocaleDateString()}</span>
                   <ChevronRight size={14} className="text-gray-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* APPLICANTS TABLE */}
        <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100">
          <div className="p-8 border-b border-gray-50 bg-white">
            <Header title="Manage Applicants" action={() => setShowAllApplicants(!showAllApplicants)} label={showAllApplicants ? "Show Less" : "View All"} />
          </div>
          <div className="overflow-x-auto">
            {/* 1. Bulk Action Bar (Table ke theek upar add karein) */}
{selectedIds.length > 0 && (
    <div className="bg-purple-50 p-4 rounded-2xl mb-4 flex justify-between items-center border border-purple-100">
        <span className="text-xs font-black text-purple-700 uppercase tracking-widest">
            {selectedIds.length} Selected
        </span>
        <div className="flex gap-2">
            <Button size="sm" className="bg-purple-600" onClick={() => handleBulkUpdate("shortlisted")}>
                Bulk Shortlist
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleBulkUpdate("rejected")}>
                Bulk Reject
            </Button>
        </div>
    </div>
)}
           <table className="w-full text-left">
    <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
        <tr>
            <th className="px-8 py-5">
                <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 accent-purple-600"
                    onChange={handleSelectAll}
                    checked={selectedIds.length > 0 && selectedIds.length === (showAllApplicants ? applications.length : 6)}
                />
            </th>
            <th className="px-8 py-5">Applicant</th>
      <th className="px-8 py-5">Applied For</th>
      <th className="px-8 py-5">Status</th>
      <th className="px-8 py-5 text-center">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-50">
        {(showAllApplicants ? applications : applications.slice(0, 6)).map((app) => (
            <tr key={app._id} className="hover:bg-gray-50/80 transition-colors group">
                {/* 3. Row mein Checkbox */}
                <td className="px-8 py-5">
                    <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 accent-purple-600"
                        checked={selectedIds.includes(app._id)}
                        onChange={() => handleSelect(app._id)}
                    />
                </td>
        <td className="px-8 py-5">
          <div className="font-bold text-gray-800">{app.applicant?.fullname}</div>
          <div className="text-xs text-gray-400">{app.applicant?.email}</div>
        </td>
        <td className="px-8 py-5 text-sm font-semibold text-gray-600">{app.job?.title}</td>
        <td className="px-8 py-5">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
            app.status === 'accepted' ? 'bg-green-100 text-green-700' : 
            app.status === 'shortlisted' ? 'bg-purple-100 text-purple-700' : // ⭐ Shortlisted color
            app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {app.status}
          </span>
        </td>
        <td className="px-8 py-5">
          <Button 
        size="icon" 
        className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl border-none" 
        onClick={() => handleAiScan(app._id)}
        title="AI Resume Scan"
    >
        <Sparkles size={16} />
    </Button>
          <div className="flex justify-center gap-3">
            {/* View Button hamesha dikhega */}
            <Button size="icon" variant="outline" className="rounded-xl border-gray-200" onClick={() => { setSelectedApp(app); setShowViewModal(true); }}>
              <Eye size={16} />
            </Button>
           <Button 
    size="icon" 
    variant="ghost"
    className={`rounded-xl transition-all ${app.interviewQuestions?.length > 0 ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}
    onClick={() => handleGenerateQuestions(app._id)}
    disabled={!app.matchScore} // Score ke bina disabled rahega
>
    <MessageSquare size={16} /> {/* Lucide icon */}
</Button>
            {/* CASE 1: Agar status PENDING hai -> Shortlist aur Reject dikhao */}
            {app.status === "pending" && (
              <>
                <Button 
                  size="icon" 
                  className="bg-purple-600 hover:bg-purple-700 rounded-xl text-white" 
                  onClick={() => updateStatus(app._id, "shortlisted")}
                  title="Shortlist Candidate"
                >
                  <ListChecks size={16} /> {/* ListChecks icon use karein */}
                </Button>
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="rounded-xl" 
                  onClick={() => updateStatus(app._id, "rejected")}
                >
                  <XCircle size={16} />
                </Button>
              </>
            )}

            {/* CASE 2: Agar status SHORTLISTED hai -> Accept/Schedule dikhao */}
            {app.status === "shortlisted" && (
              <>
                <Button 
                  size="icon" 
                  className="bg-green-600 hover:bg-green-700 rounded-xl" 
                  onClick={() => updateStatus(app._id, "accepted")}
                  title="Accept for Interview"
                >
                  <CheckCircle size={16} />
                </Button>
                <Button 
                    size="icon" 
                    variant="destructive" 
                    className="rounded-xl" 
                    onClick={() => updateStatus(app._id, "rejected")}
                >
                    <XCircle size={16} />
                </Button>
              </>
            )}

            {/* CASE 3: Agar status ACCEPTED hai -> Calendar dikhao Interview ke liye */}
            {app.status === "accepted" && (
              <Button 
                size="icon" 
                variant="secondary" 
                className="bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-xl border-none" 
                onClick={() => { setSelectedApp(app); setOpenInterview(true); }}
              >
                <Calendar size={16} />
              </Button>
              
            )}
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
          </div>
        </div>
      </div>

      {/* VIEW MODAL (ADMIN STYLE) */}
      {showViewModal && selectedApp && (
        <Dialog open onOpenChange={() => setShowViewModal(false)}>
          <DialogContent className="rounded-[2.5rem] max-w-lg overflow-y-auto max-h-[90vh] border-none shadow-2xl">
            <DialogHeader><DialogTitle className="text-2xl font-bold text-gray-800 px-2">Applicant Profile</DialogTitle></DialogHeader>
            <div className="space-y-5 text-sm mt-4 p-2">
              <ProfileItem label="Full Name" value={selectedApp.applicant?.fullname} />
              <ProfileItem label="Email Address" value={selectedApp.applicant?.email} />
              <ProfileItem label="Job Position" value={selectedApp.job?.title} />
             <ProfileItem label="Current Status" value={selectedApp.status} isStatus />

{/* ⭐ AI MATCH SCORE SECTION - Isse yahan add karein */}
<div className="mt-6 p-5 bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-[2rem] shadow-sm">
  <div className="flex justify-between items-center mb-4">
    <div>
      <h4 className="text-[10px] uppercase font-black text-purple-400 tracking-widest">AI Screening Result</h4>
      <p className="text-xs font-bold text-gray-600 mt-1">Candidate Suitability Score</p>
    </div>
    {/* Match Score Badge */}
    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-lg ${
      selectedApp.matchScore > 70 ? 'bg-green-500 text-white' : 'bg-purple-600 text-white'
    }`}>
      <span className="text-lg font-black leading-none">{selectedApp.matchScore || 0}%</span>
      <span className="text-[7px] font-bold uppercase mt-1">Match</span>
    </div>
  </div>

  {/* AI Insights/Feedback */}
  <div className="bg-white/60 p-3 rounded-2xl border border-white/50">
    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
      <Sparkles size={10} className="text-purple-500" /> AI Insights
    </p>
    <p className="text-xs text-gray-600 leading-relaxed font-medium italic">
      {selectedApp.aiInsights || "No scan data available. Use 'AI Scan' button in the dashboard table to analyze this profile."}
    </p>
   {selectedApp.interviewQuestions?.length > 0 && (
  <div className="mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
    <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
      <Sparkles size={14} className="text-purple-500" /> 
      AI Suggested Questions
    </h3>
    <div className="space-y-2">
      {selectedApp.interviewQuestions.map((item, index) => (
        <div key={index} className="bg-white p-3 rounded-xl text-xs text-gray-600 shadow-sm border border-gray-50">
          <span className="font-bold text-purple-600 mr-2">{index + 1}.</span> {item}
        </div>
      ))}
    </div>
  </div>
)}

  </div>
</div>
              <div className="pt-4 border-t border-gray-100">
             <p className="text-[10px] uppercase font-bold text-gray-400 mb-3 tracking-widest">
        Resume Attachment
      </p>
      
      {selectedApp.applicant?.profile?.resume ? (
        <div className="border border-gray-100 rounded-3xl overflow-hidden bg-gray-50 shadow-inner">
          {selectedApp.applicant.profile.resume.toLowerCase().endsWith(".pdf") ? (
            <iframe 
              src={selectedApp.applicant.profile.resume} 
              title="Resume" 
              className="w-full h-[400px] border-none" 
            />
          ) : (
            <img 
              src={selectedApp.applicant.profile.resume} 
              alt="Resume" 
              className="w-full max-h-[400px] object-contain" 
            />
          )}
          
          {/* ⭐ Added a download/view link just in case iframe is blocked by browser */}
          <div className="p-3 bg-white border-t border-gray-100 text-center">
            <a 
              href={selectedApp.applicant.profile.resume} 
              target="_blank" 
              rel="noreferrer"
              className="text-purple-600 font-bold text-xs hover:underline"
            >
              Open Resume in New Tab
            </a>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 italic bg-gray-50 p-4 rounded-2xl text-center">
          Candidate hasn't uploaded a resume.
        </p>
      )}
    </div>
              <Button className="w-full rounded-2xl h-14 bg-gray-900 font-bold mt-4" onClick={() => setShowViewModal(false)}>Close Window</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

{/* INTERVIEW MODAL WITH SLOTS */}
{openInterview && selectedApp && (
  <Dialog open onOpenChange={() => setOpenInterview(false)}>
    <DialogContent className="rounded-[2rem] border-none shadow-2xl bg-white max-w-md">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold flex items-center gap-2">
          <Calendar size={20} className="text-purple-600" /> Schedule Interview
        </DialogTitle>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
          For: {selectedApp.applicant?.fullname}
        </p>
      </DialogHeader>

      <div className="space-y-5 pt-4">
        {/* STEP 1: DATE PICKER */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-purple-600 ml-1">1. Select Date</label>
          <input 
            type="date" 
            className="border-2 border-gray-50 bg-gray-50 p-3 rounded-2xl w-full focus:border-purple-200 outline-none text-sm font-bold" 
            value={interviewData.date}
            onChange={handleDateChange} // Humne pehle jo function banaya tha
          />
        </div>

        {/* STEP 2: TIME SLOTS (Only show if date is selected) */}
        {interviewData.date && (
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-purple-600 ml-1">2. Available Slots</label>
            <div className="grid grid-cols-3 gap-2">
              {standardSlots.map((slot) => {
                const isBusy = bookedSlots.includes(slot);
                const isSelected = interviewData.time === slot;
                
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBusy}
                    onClick={() => setInterviewData({...interviewData, time: slot})}
                    className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
                      isBusy 
                        ? "bg-red-50 border-transparent text-red-200 cursor-not-allowed opacity-50" 
                        : isSelected 
                          ? "bg-purple-600 border-purple-600 text-white shadow-md scale-95" 
                          : "bg-white border-gray-100 text-gray-600 hover:border-purple-100"
                    }`}
                  >
                    <span className="text-[10px] font-bold">{slot}</span>
                    <span className="text-[7px] font-black uppercase tracking-tighter">
                      {isBusy ? "Booked" : "Free"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: MODE SELECTION */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-purple-600 ml-1">3. Interview Mode</label>
          <div className="flex gap-2">
             <button 
                type="button"
                onClick={() => setInterviewData({...interviewData, mode: 'online'})}
                className={`flex-1 p-3 rounded-2xl border-2 font-bold text-xs transition-all ${interviewData.mode === 'online' ? 'bg-purple-50 border-purple-600 text-purple-600' : 'bg-white border-gray-100 text-gray-400'}`}
             >
                Google Meet
             </button>
             <button 
                type="button"
                onClick={() => setInterviewData({...interviewData, mode: 'offline'})}
                className={`flex-1 p-3 rounded-2xl border-2 font-bold text-xs transition-all ${interviewData.mode === 'offline' ? 'bg-purple-50 border-purple-600 text-purple-600' : 'bg-white border-gray-100 text-gray-400'}`}
             >
                In-Person
             </button>
          </div>
        </div>

        {/* Dynamic Meeting Link / Address Area */}
        {interviewData.mode === "online" ? (
          <div className="bg-purple-50 p-4 rounded-2xl text-[11px] text-purple-700 border border-purple-100 flex items-start gap-2">
            <span className="mt-0.5">✨</span>
            <p className="leading-tight"><b>Smart Logic:</b> Google Meet link will be automatically generated and sent to the applicant after you schedule.</p>
          </div>
        ) : (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
             <label className="text-[10px] font-black uppercase text-purple-600 ml-1">Office Address</label>
             <textarea 
               placeholder="Enter interview venue address..." 
               className="border-2 border-gray-50 bg-gray-50 p-4 rounded-2xl w-full h-20 focus:border-purple-200 outline-none text-sm font-semibold" 
               value={interviewData.meetingLink}
               onChange={e => setInterviewData({...interviewData, meetingLink: e.target.value})} 
             />
          </div>
        )}
        
        {/* ACTION BUTTONS */}
        <div className="flex gap-3 pt-4 border-t border-gray-50">
          <Button variant="ghost" className="flex-1 rounded-2xl h-14 font-bold text-gray-400" onClick={() => setOpenInterview(false)}>
            Cancel
          </Button>
          <Button 
            className="flex-1 rounded-2xl h-14 bg-purple-600 hover:bg-purple-700 shadow-xl font-black uppercase text-xs tracking-widest" 
            onClick={scheduleInterview}
            disabled={!interviewData.date || !interviewData.time}
          >
            Confirm Schedule
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)}

    </div>
  );
};

// HELPERS
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm flex items-center justify-between border border-transparent hover:border-gray-100 transition-all">
    <div><p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">{title}</p><h2 className="text-4xl font-black text-gray-800">{value}</h2></div>
    <div className="p-5 bg-gray-50 rounded-3xl">{icon}</div>
  </div>
);

const Header = ({ title, action, label }) => (
  <div className="flex justify-between items-center">
    <h2 className="font-extrabold text-xl text-gray-800 tracking-tight">{title}</h2>
    <button onClick={action} className="text-purple-600 text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:bg-purple-50 px-3 py-1.5 rounded-full transition-all">
      {label} <ChevronRight size={14} />
    </button>
  </div>
);

const ProfileItem = ({ label, value, isStatus }) => (
  <div className="flex flex-col">
    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-0.5">{label}</p>
    <p className={`font-bold text-gray-800 ${isStatus ? 'text-purple-600 uppercase' : 'text-base'}`}>{value || 'Not provided'}</p>
  </div>
);

export default EmployerDashboard;