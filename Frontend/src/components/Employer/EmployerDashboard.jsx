import React, { useEffect, useState } from "react";
import { Briefcase, Users, Building2, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { JOB_API_END_POINT, APPLICATION_API_END_POINT, COMPANY_API_END_POINT } from "@/utils/constant";

const EmployerDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    totalCompanies: 0,
  });

  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplicants, setRecentApplicants] = useState([]);

  // FETCH DASHBOARD DATA
  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      // 1️⃣ Fetch jobs posted by employer
      const jobsRes = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true });
      const jobs = jobsRes.data.jobs || jobsRes.data || [];

      // 2️⃣ Fetch applicants for each job
      const applicantsPromises = jobs.map(job =>
        axios.get(`${APPLICATION_API_END_POINT}/${job._id}/applicants`, { withCredentials: true })
      );

      const applicantsRes = await Promise.all(applicantsPromises);

      // applicantsRes = [{data: {job: {...}}}, ...]
      const applications = applicantsRes.flatMap(res => res.data.job.applications || []);

      // 3️⃣ Fetch all companies
      const compRes = await axios.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true });
      const companies = compRes.data.companies || compRes.data || [];

      // 4️⃣ Set stats
      setStats({
        totalJobs: jobs.length,
        totalApplicants: applications.length,
        totalCompanies: companies.length,
      });

      // 5️⃣ Set recent jobs (latest 4)
      setRecentJobs(jobs.slice(0, 4));

      // 6️⃣ Recent applicants (latest 5)
      const recent = applications.slice(0, 5);
      setRecentApplicants(recent);

      console.log("Jobs:", jobs);
      console.log("Applications:", applications);
      console.log("Recent Applicants:", recent);

    } catch (error) {
      console.log("Error fetching dashboard data:", error);
    }
  };

  fetchDashboardData();
}, []);


  // UPDATE APPLICATION STATUS
  const updateStatus = async (appId, status) => {
    try {
      const res = await axios.put(
        `${APPLICATION_API_END_POINT}/status/${appId}`,
        { status },
        { withCredentials: true }
      );

      if (res.data.success) {
        setRecentApplicants(prev =>
          prev.map(app => app._id === appId ? { ...app, status } : app)
        );
      }
    } catch (error) {
      console.log("Error updating status:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-10">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-8">Employer Dashboard</h1>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-md border flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Jobs</p>
            <h2 className="text-3xl font-bold">{stats.totalJobs}</h2>
          </div>
          <Briefcase size={40} className="text-purple-600" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Applicants</p>
            <h2 className="text-3xl font-bold">{stats.totalApplicants}</h2>
          </div>
          <Users size={40} className="text-blue-600" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border flex items-center justify-between">
          <div>
            <p className="text-gray-500">Companies</p>
            <h2 className="text-3xl font-bold">{stats.totalCompanies}</h2>
          </div>
          <Building2 size={40} className="text-green-600" />
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT JOBS */}
        <div className="lg:col-span-2 bg-white shadow-md border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Posted Jobs</h2>
            <button
              onClick={() => navigate("/employer/jobs")}
              className="text-sm text-purple-600 flex items-center gap-1"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>

          {recentJobs.map(job => (
            <div
              key={job._id}
              className="p-4 border-b last:border-none hover:bg-gray-50 rounded-xl flex justify-between"
            >
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-gray-500 text-sm">{job.company?.name}</p>
              </div>

              <button
                className="text-purple-600 text-sm hover:underline"
                onClick={() => navigate(`/employer/jobs/${job._id}/applicants`)}
              >
                View Applicants
              </button>
            </div>
          ))}
        </div>

        {/* RECENT APPLICANTS */}
     <div className="bg-white shadow-md border rounded-2xl p-6">
  <h2 className="text-xl font-semibold mb-4">Recent Applicants</h2>

  {recentApplicants.length > 0 ? (
    <div className="space-y-4">
      {recentApplicants.map((app) => (
        <div
          key={app._id}
          className="p-4 border rounded-xl hover:bg-gray-50"
        >
          <p className="font-semibold">{app.applicant?.fullname || "Applicant"}</p>
          <p className="text-gray-500 text-sm">{app.job?.title || "Job Title"}</p>

          <div className="flex gap-3 mt-2 items-center">
            <button
              className={`flex items-center gap-1 text-green-600 text-sm ${
                app.status === "accepted" ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={async () => {
                if (app.status === "accepted") return;
                try {
                  const res = await axios.post(
                    `${APPLICATION_API_END_POINT}/status/${app._id}/update`,
                    { status: "accepted" },
                    { withCredentials: true }
                  );
                  if (res.data.success) {
                    setRecentApplicants((prev) =>
                      prev.map((a) =>
                        a._id === app._id ? { ...a, status: "accepted" } : a
                      )
                    );
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              ✅ Accept
            </button>

            <button
              className={`flex items-center gap-1 text-red-600 text-sm ${
                app.status === "rejected" ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={async () => {
                if (app.status === "rejected") return;
                try {
                  const res = await axios.post(
                    `${APPLICATION_API_END_POINT}/status/${app._id}/update`,
                    { status: "rejected" },
                    { withCredentials: true }
                  );
                  if (res.data.success) {
                    setRecentApplicants((prev) =>
                      prev.map((a) =>
                        a._id === app._id ? { ...a, status: "rejected" } : a
                      )
                    );
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              ❌ Reject
            </button>

            <span className="ml-2 text-gray-500 text-sm">
              Status: {app.status || "pending"}
            </span>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">No recent applicants</p>
  )}
</div>

      </div>
    </div>
  );
};

export default EmployerDashboard;
