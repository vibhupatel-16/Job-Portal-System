import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  Building2,
  ChevronRight,
  CheckCircle,
  XCircle,
  Calendar, 
  Video
} from "lucide-react";
import axios from "axios";
import {
  JOB_API_END_POINT,
  APPLICATION_API_END_POINT,
  COMPANY_API_END_POINT,
  INTERVIEW_API_END_POINT
} from "@/utils/constant";

import { Link } from "react-router-dom"; 
import { ListChecks } from "lucide-react"; 
import { toast } from "sonner";


const EmployerDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    totalCompanies: 0
  });

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [showAllJobs, setShowAllJobs] = useState(false);
  const [showAllApplicants, setShowAllApplicants] = useState(false);

  // Interview modal
  const [openInterview, setOpenInterview] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    mode: "online",
    meetingLink: ""
  });

  


  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const jobsRes = await axios.get(
          `${JOB_API_END_POINT}/getadminjobs`,
          { withCredentials: true }
        );

        const jobsData = jobsRes.data.jobs || jobsRes.data || [];
        setJobs(jobsData);

        const applicantReq = jobsData.map(job =>
          axios.get(
            `${APPLICATION_API_END_POINT}/${job._id}/applicants`,
            { withCredentials: true }
          )
        );

        const applicantRes = await Promise.all(applicantReq);
        const apps = applicantRes.flatMap(
          res => res.data.job.applications || []
        );

        setApplications(apps);

        const compRes = await axios.get(
          `${COMPANY_API_END_POINT}/get`,
          { withCredentials: true }
        );

        const companies = compRes.data.companies || [];

        setStats({
          totalJobs: jobsData.length,
          totalApplicants: apps.length,
          totalCompanies: companies.length
        });
      } catch (error) {
        console.log("Dashboard error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  /* ================= UPDATE APPLICATION STATUS ================= */
  const updateStatus = async (appId, status) => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${appId}/update`,
        { status },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        setApplications(prev =>
          prev.map(app =>
            app._id === appId ? { ...app, status } : app
          )
        );
      }
    } catch (error) {
      console.log("Status update error:", error);
    }
  };

  /* ================= INTERVIEW SCHEDULE (FIXED) ================= */
  const scheduleInterview = async () => {
    try {
      await axios.post(
        `${INTERVIEW_API_END_POINT}/interviews`,
        {
          applicationId: selectedApplication._id,
          date: interviewData.date,
          time: interviewData.time,
          mode: interviewData.mode,
      meetingLink: interviewData.mode === "online" ? "" : interviewData.meetingLink
      },
        { withCredentials: true }
      );

      toast.success("Interview scheduled successfully");

      setOpenInterview(false);
      setSelectedApplication(null);
      setInterviewData({
        date: "",
        time: "",
        mode: "online",
        meetingLink: ""
      });
    } catch (error) {
      console.log(error);
      alert("Interview scheduling failed");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Employer Dashboard</h1>
      <div className="flex gap-3">
      {/* ⭐ ADD THIS BUTTON */}
      <button 
        onClick={async () => {
          const res = await axios.get(`${INTERVIEW_API_END_POINT}/google/auth`, { withCredentials: true });
          if(res.data.url) window.location.href = res.data.url;
        }}
        className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 transition"
      >
        <Video size={18} /> Connect Google Meet
      </button>
      </div>
      <Link 
          to="/employer/interview-list" 
          className="flex items-center gap-2 mb-8 bg-purple-400 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-all shadow-md"
        >
          <ListChecks size={20} />
          <span className="font-medium">View Scheduled Interviews</span>
        </Link>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Jobs" value={stats.totalJobs} icon={<Briefcase />} />
        <StatCard title="Applicants" value={stats.totalApplicants} icon={<Users />} />
        <StatCard title="Companies" value={stats.totalCompanies} icon={<Building2 />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= JOBS ================= */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8">
          <Header
            title="Posted Jobs"
            action={() => setShowAllJobs(!showAllJobs)}
            label={showAllJobs ? "Show Less" : "View All"}
          />

          {(showAllJobs ? jobs : jobs.slice(0, 4)).map(job => (
            <div key={job._id} className="border-b py-4">
              <h3 className="font-bold">{job.title}</h3>
              <p className="text-sm text-gray-400">{job.company?.name}</p>
            </div>
          ))}
        </div>

        {/* ================= APPLICANTS ================= */}
        <div className="bg-white rounded-3xl p-8">
          <Header
            title="Applicants"
            action={() => setShowAllApplicants(!showAllApplicants)}
            label={showAllApplicants ? "Show Less" : "View All"}
          />

          {(showAllApplicants ? applications : applications.slice(0, 5)).map(app => (
            <div key={app._id} className="border p-4 rounded-xl mb-4">
              <p className="font-bold">{app.applicant?.fullname}</p>
              <p className="text-sm text-gray-400">{app.job?.title}</p>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => updateStatus(app._id, "accepted")}
                  className="text-green-600 flex gap-1"
                >
                  <CheckCircle size={16} /> Accept
                </button>

                <button
                  onClick={() => updateStatus(app._id, "rejected")}
                  className="text-red-600 flex gap-1"
                >
                  <XCircle size={16} /> Reject
                </button>

                {app.status === "accepted" && (
                  <button
                    onClick={() => {
                      setSelectedApplication(app);
                      setOpenInterview(true);
                    }}
                    className="text-purple-600 flex gap-1"
                  >
                    <Calendar size={16} /> Interview
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ADMIN-LIKE INTERVIEW MODAL ================= */}
      {openInterview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[420px]">
            <h2 className="text-xl font-bold mb-4">📅 Schedule Interview</h2>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                className="border p-2 rounded-lg"
                value={interviewData.date}
                onChange={e =>
                  setInterviewData({ ...interviewData, date: e.target.value })
                }
              />

              <input
                type="time"
                className="border p-2 rounded-lg"
                value={interviewData.time}
                onChange={e =>
                  setInterviewData({ ...interviewData, time: e.target.value })
                }
              />
            </div>

            {/* EmployerDashboard.jsx modal ke andar niche wala change karein */}

<select
  className="border p-2 rounded-lg w-full mt-3"
  value={interviewData.mode}
  onChange={e => setInterviewData({ ...interviewData, mode: e.target.value })}
>
  <option value="online">Online (Google Meet)</option>
  <option value="offline">Offline</option>
</select>

{/* Agar Mode ONLINE hai, toh manual link chhupa dein kyunki wo backend khud banayega */}
{interviewData.mode === "online" ? (
  <div className="mt-3 p-3 bg-purple-50 text-purple-700 rounded-lg text-xs italic border border-purple-100">
    ✨ Google Meet link will be generated automatically and sent to Candidate's Bell Icon.
  </div>
) : (
  <input
    type="text"
    placeholder="Enter Office Address"
    className="border p-2 rounded-lg w-full mt-3"
    value={interviewData.meetingLink}
    onChange={e => setInterviewData({ ...interviewData, meetingLink: e.target.value })}
  />
)}

            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setOpenInterview(false)}>Cancel</button>
              <button
                onClick={scheduleInterview}
                className="text-purple-600 font-bold"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl flex justify-between">
    <div>
      <p className="text-gray-400">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
    {icon}
  </div>
);

const Header = ({ title, action, label }) => (
  <div className="flex justify-between mb-4">
    <h2 className="font-bold text-lg">{title}</h2>
    <button onClick={action} className="text-purple-600 font-bold flex gap-1">
      {label} <ChevronRight size={16} />
    </button>
  </div>
);

export default EmployerDashboard;
