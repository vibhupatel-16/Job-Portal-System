import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "sonner";
import {
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  const [selectedApp, setSelectedApp] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    mode: "online",
    meetingLink: "",
  });

  // ================= FETCH DATA =================
  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get("/admin/applications", {
        params: {
          status: statusFilter || undefined,
          companyId: companyFilter || undefined,
        },
      });
      setApplications(res.data.applications || []);
    } catch {
      toast.error("Failed to load applications");
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axiosInstance.get("/admin/companies");
      setCompanies(res.data.companies || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, companyFilter]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  // ================= ACTIONS =================
  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/admin/applications/${id}/status`, { status });
      toast.success(`Application ${status}`);
      fetchApplications();
    } catch {
      toast.error("Status update failed");
    }
  };

  const deleteApplication = async (id) => {
    if (!confirm("Delete this application?")) return;
    try {
      await axiosInstance.delete(`/admin/applications/${id}`);
      toast.success("Application deleted");
      fetchApplications();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ✅ FIXED INTERVIEW API
  const scheduleInterview = async () => {
    try {
      await axiosInstance.post("/admin/interviews", {
        applicationId: selectedApp._id,
        date: interviewData.date,
        time: interviewData.time,
        mode: interviewData.mode,
        meetingLink:
          interviewData.mode === "online" ? interviewData.meetingLink : "",
      });

      toast.success("Interview Scheduled & Email Sent");
      setShowInterviewModal(false);
      setSelectedApp(null);
      setInterviewData({
        date: "",
        time: "",
        mode: "online",
        meetingLink: "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Interview scheduling failed");
    }
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.applicant?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      app.applicant?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Manage Applications
        </h1>

        {/* FILTER BAR */}
        <div className="bg-white p-6 rounded-3xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-xl p-3"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="border rounded-xl p-3"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          >
            <option value="">All Companies</option>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <Button onClick={fetchApplications}>Refresh</Button>
        </div>

        <Link to="/admin/interview-list">
    <button className="flex items-center gap-2 mb-8 bg-indigo-400 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg">
        <CalendarDays size={20} />
        <span className="font-semibold">All Scheduled Interviews</span>
    </button>
</Link>

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Applicant</th>
                <th className="p-4">Job</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app._id} className="border-t">
                  <td className="p-4">
                    <div className="font-bold">
                      {app.applicant?.fullname}
                    </div>
                    <div className="text-sm text-gray-500">
                      {app.applicant?.email}
                    </div>
                  </td>

                  <td className="p-4">
                    {app.job?.title}
                    <div className="text-xs text-blue-600">
                      {app.job?.company?.name}
                    </div>
                  </td>

                  <td className="p-4 uppercase font-bold">{app.status}</td>

                  <td className="p-4 flex justify-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setSelectedApp(app);
                        setShowViewModal(true);
                      }}
                    >
                      <Eye size={16} />
                    </Button>

                    <Button
                      size="icon"
                      className="bg-green-600"
                      onClick={() => updateStatus(app._id, "accepted")}
                    >
                      <CheckCircle size={16} />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => updateStatus(app._id, "rejected")}
                    >
                      <XCircle size={16} />
                    </Button>

                    {app.status === "accepted" && (
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => {
                          setSelectedApp(app);
                          setShowInterviewModal(true);
                        }}
                      >
                        <Calendar size={16} />
                      </Button>
                    )}

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteApplication(app._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= INTERVIEW MODAL (UNCHANGED UI) ================= */}
      {showInterviewModal && (
        <Dialog open onOpenChange={() => setShowInterviewModal(false)}>
          <DialogContent
            className="rounded-3xl"
            aria-describedby="interview-desc"
          >
            <p id="interview-desc" className="sr-only">
              Schedule interview
            </p>

            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                📅 Schedule Interview
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={interviewData.date}
                  onChange={(e) =>
                    setInterviewData({
                      ...interviewData,
                      date: e.target.value,
                    })
                  }
                />
                <Input
                  type="time"
                  value={interviewData.time}
                  onChange={(e) =>
                    setInterviewData({
                      ...interviewData,
                      time: e.target.value,
                    })
                  }
                />
              </div>

              <select
                className="border rounded-xl p-3 w-full"
                value={interviewData.mode}
                onChange={(e) =>
                  setInterviewData({
                    ...interviewData,
                    mode: e.target.value,
                  })
                }
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>

              {interviewData.mode === "online" && (
                <Input
                  placeholder="Meeting link"
                  value={interviewData.meetingLink}
                  onChange={(e) =>
                    setInterviewData({
                      ...interviewData,
                      meetingLink: e.target.value,
                    })
                  }
                />
              )}

              <Button
                onClick={scheduleInterview}
                className="w-full bg-blue-600"
              >
                Schedule Interview
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ManageApplications;
