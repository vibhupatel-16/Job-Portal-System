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
  ListChecks
} from "lucide-react";
import axios from "axios";
import {
  JOB_API_END_POINT,
  APPLICATION_API_END_POINT,
  COMPANY_API_END_POINT,
  INTERVIEW_API_END_POINT
} from "@/utils/constant";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    mode: "online",
    meetingLink: ""
  });

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

  const updateStatus = async (appId, status) => {
    try {
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${appId}/update`, { status }, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        setApplications(prev => prev.map(app => app._id === appId ? { ...app, status } : app));
      }
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  const scheduleInterview = async () => {
    try {
      if (!interviewData.date || !interviewData.time) {
        return toast.error("Please fill all details");
      }
      const res = await axios.post(`${INTERVIEW_API_END_POINT}/interviews`, {
        applicationId: selectedApp._id,
        ...interviewData
      }, { withCredentials: true });

      if (res.data.success) {
        toast.success("Interview scheduled and notification sent!");
        setOpenInterview(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Scheduling failed");
    }
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
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-5">Applicant</th>
                  <th className="px-8 py-5">Applied For</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(showAllApplicants ? applications : applications.slice(0, 6)).map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="font-bold text-gray-800">{app.applicant?.fullname}</div>
                      <div className="text-xs text-gray-400">{app.applicant?.email}</div>
                    </td>
                    <td className="px-8 py-5 text-sm font-semibold text-gray-600">{app.job?.title}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        app.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                        app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center gap-3">
                        <Button size="icon" variant="outline" className="rounded-xl border-gray-200" onClick={() => { setSelectedApp(app); setShowViewModal(true); }}>
                          <Eye size={16} />
                        </Button>
                        <Button size="icon" className="bg-green-600 hover:bg-green-700 rounded-xl" onClick={() => updateStatus(app._id, "accepted")}>
                          <CheckCircle size={16} />
                        </Button>
                        <Button size="icon" variant="destructive" className="rounded-xl" onClick={() => updateStatus(app._id, "rejected")}>
                          <XCircle size={16} />
                        </Button>
                        {app.status === "accepted" && (
                          <Button size="icon" variant="secondary" className="bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-xl border-none" onClick={() => { setSelectedApp(app); setOpenInterview(true); }}>
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
              
              <div className="pt-4 border-t border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-3 tracking-widest">Resume Attachment</p>
                {selectedApp.applicant?.profile?.resume ? (
                  <div className="border border-gray-100 rounded-3xl overflow-hidden bg-gray-50 shadow-inner">
                    {selectedApp.applicant.profile.resume.endsWith(".pdf") ? (
                      <iframe src={selectedApp.applicant.profile.resume} title="Resume" className="w-full h-[400px]" />
                    ) : (
                      <img src={selectedApp.applicant.profile.resume} alt="Resume" className="w-full max-h-[400px] object-contain" />
                    )}
                  </div>
                ) : <p className="text-gray-400 italic bg-gray-50 p-4 rounded-2xl text-center">Candidate hasn't uploaded a resume.</p>}
              </div>
              <Button className="w-full rounded-2xl h-14 bg-gray-900 font-bold mt-4" onClick={() => setShowViewModal(false)}>Close Window</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* INTERVIEW MODAL (AS PER YOUR ORIGINAL LOGIC) */}
      {openInterview && selectedApp && (
        <Dialog open onOpenChange={() => setOpenInterview(false)}>
          <DialogContent className="rounded-[2rem] border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Calendar size={20} className="text-purple-600" /> Schedule Interview
              </DialogTitle>
              <p className="text-xs text-gray-400">Scheduling for: {selectedApp.applicant?.fullname}</p>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Date</label>
                  <input type="date" className="border border-gray-200 p-3 rounded-2xl w-full focus:ring-2 focus:ring-purple-200 outline-none" onChange={e => setInterviewData({...interviewData, date: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Time</label>
                  <input type="time" className="border border-gray-200 p-3 rounded-2xl w-full focus:ring-2 focus:ring-purple-200 outline-none" onChange={e => setInterviewData({...interviewData, time: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Mode</label>
                <select className="border border-gray-200 p-3 rounded-2xl w-full focus:ring-2 focus:ring-purple-200 outline-none" value={interviewData.mode} onChange={e => setInterviewData({...interviewData, mode: e.target.value})}>
                  <option value="online">Online (Google Meet)</option>
                  <option value="offline">Offline (In-Person)</option>
                </select>
              </div>

              {interviewData.mode === "online" ? (
                <div className="bg-purple-50 p-4 rounded-2xl text-[11px] text-purple-700 border border-purple-100 leading-relaxed italic">
                  ✨ Google Meet link will be generated automatically and sent to the candidate's notification bell.
                </div>
              ) : (
                <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Office Address</label>
                   <textarea placeholder="Enter full address..." className="border border-gray-200 p-3 rounded-2xl w-full h-24 focus:ring-2 focus:ring-purple-200 outline-none" onChange={e => setInterviewData({...interviewData, meetingLink: e.target.value})} />
                </div>
              )}
              
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 rounded-2xl h-12 border-gray-200" onClick={() => setOpenInterview(false)}>Cancel</Button>
                <Button className="flex-1 rounded-2xl h-12 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200" onClick={scheduleInterview}>Schedule Now</Button>
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