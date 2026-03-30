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
  ChevronDown,
  Building2,
  CalendarDays,
} from "lucide-react";
import { Link } from "react-router-dom";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    mode: "online",
    meetingLink: "",
  });

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

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/admin/applications/${id}/status`, { status });
      toast.success(`Application ${status}`);
      fetchApplications();
      setOpenActionMenuId(null);
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
      setOpenActionMenuId(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  const scheduleInterview = async () => {
    try {
      await axiosInstance.post("/admin/interviews", {
        applicationId: selectedApp._id,
        date: interviewData.date,
        time: interviewData.time,
        mode: interviewData.mode,
        meetingLink: interviewData.mode === "online" ? interviewData.meetingLink : "",
      });

      toast.success("Interview Scheduled & Email Sent");
      setShowInterviewModal(false);
      setSelectedApp(null);
      setInterviewData({ date: "", time: "", mode: "online", meetingLink: "" });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-sky-500">Admin Control</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Applications</h1>
          <p className="mt-2 text-sm text-slate-500">Review applicants, approve decisions, and schedule interviews from one place.</p>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-12 rounded-2xl border-slate-200 bg-slate-50" />

            <select className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>

            <select className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none" value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
              <option value="">All Companies</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <Button onClick={fetchApplications} className="h-12 rounded-2xl bg-sky-600 font-black hover:bg-sky-700">
              Refresh
            </Button>
          </div>
        </div>

        <Link to="/admin/interview-list" className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-sky-700">
          <CalendarDays size={18} />
          All Scheduled Interviews
        </Link>

        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-6 py-5">Applicant</th>
                  <th className="px-6 py-5">Role</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.map((app) => (
                  <tr key={app._id} className="transition hover:bg-sky-50/40">
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-bold text-slate-900">{app.applicant?.fullname}</p>
                        <p className="mt-1 text-xs text-slate-500">{app.applicant?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-800">{app.job?.title}</p>
                      <p className="mt-1 inline-flex items-center gap-2 text-xs text-sky-700">
                        <Building2 size={12} />
                        {app.job?.company?.name}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider ${
                        app.status === "accepted"
                          ? "bg-emerald-50 text-emerald-700"
                          : app.status === "rejected"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative flex items-center justify-center">
                        <button
                          onClick={() => setOpenActionMenuId((prev) => (prev === app._id ? null : app._id))}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                        >
                          More
                          <ChevronDown size={14} />
                        </button>

                        {openActionMenuId === app._id && (
                          <div className="absolute right-0 top-12 z-20 w-52 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
                            <ActionButton
                              icon={<Eye size={14} />}
                              label="View Profile"
                              onClick={() => {
                                setSelectedApp(app);
                                setShowViewModal(true);
                                setOpenActionMenuId(null);
                                axiosInstance.post(`/user/profile/view/${app.applicant._id}`, {}).catch((e) => console.log(e));
                              }}
                            />
                            <ActionButton
                              icon={<CheckCircle size={14} />}
                              label="Accept"
                              onClick={() => updateStatus(app._id, "accepted")}
                            />
                            <ActionButton
                              icon={<XCircle size={14} />}
                              label="Reject"
                              onClick={() => updateStatus(app._id, "rejected")}
                              tone="rose"
                            />
                            {app.status === "accepted" && (
                              <ActionButton
                                icon={<Calendar size={14} />}
                                label="Schedule Interview"
                                onClick={() => {
                                  setSelectedApp(app);
                                  setShowInterviewModal(true);
                                  setOpenActionMenuId(null);
                                }}
                                tone="emerald"
                              />
                            )}
                            <ActionButton
                              icon={<Trash2 size={14} />}
                              label="Delete"
                              onClick={() => deleteApplication(app._id)}
                              tone="rose"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredApplications.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-16 text-center text-slate-500">
                      No applications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showViewModal && selectedApp && (
        <Dialog open onOpenChange={() => setShowViewModal(false)}>
          <DialogContent className="rounded-[2rem] max-w-lg border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-slate-900">Applicant Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-sm">
              <InfoRow label="Name" value={selectedApp.applicant?.fullname} />
              <InfoRow label="Email" value={selectedApp.applicant?.email} />
              <InfoRow label="Job Title" value={selectedApp.job?.title} />
              <InfoRow label="Company" value={selectedApp.job?.company?.name} />
              <InfoRow label="Status" value={selectedApp.status} />

              {selectedApp?.applicant?.profile?.resume ? (
                <div className="space-y-2">
                  <p className="font-bold text-slate-800">Resume</p>
                  {selectedApp.applicant.profile.resume.endsWith(".pdf") ? (
                    <iframe src={selectedApp.applicant.profile.resume} title="Resume Preview" className="h-96 w-full rounded-2xl border" />
                  ) : selectedApp.applicant.profile.resume.match(/\.(jpg|jpeg|png)$/i) ? (
                    <img src={selectedApp.applicant.profile.resume} alt="Resume" className="max-h-96 w-full rounded-2xl border object-contain" />
                  ) : (
                    <a
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          await axiosInstance.post(`/user/profile/view/${selectedApp.applicant._id}`, {});
                        } catch (err) {
                          console.log(err);
                        }
                        window.open(selectedApp.applicant.profile.resume, "_blank", "noopener,noreferrer");
                      }}
                      href={selectedApp.applicant.profile.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-sky-700 hover:underline"
                    >
                      <FileText size={16} />
                      Open Resume
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-slate-400">No resume uploaded</p>
              )}

              <Button variant="outline" onClick={() => setShowViewModal(false)} className="rounded-2xl">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showInterviewModal && (
        <Dialog open onOpenChange={() => setShowInterviewModal(false)}>
          <DialogContent className="rounded-[2rem] border-none shadow-2xl" aria-describedby="interview-desc">
            <p id="interview-desc" className="sr-only">Schedule interview</p>
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-slate-900">Schedule Interview</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input type="date" value={interviewData.date} onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })} className="rounded-2xl" />
                <Input type="time" value={interviewData.time} onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })} className="rounded-2xl" />
              </div>

              <select className="w-full rounded-2xl border border-slate-200 p-3" value={interviewData.mode} onChange={(e) => setInterviewData({ ...interviewData, mode: e.target.value })}>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>

              {interviewData.mode === "online" && (
                <Input placeholder="Meeting link" value={interviewData.meetingLink} onChange={(e) => setInterviewData({ ...interviewData, meetingLink: e.target.value })} className="rounded-2xl" />
              )}

              <Button onClick={scheduleInterview} className="w-full rounded-2xl bg-sky-600 font-black hover:bg-sky-700">
                Schedule Interview
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const ActionButton = ({ icon, label, onClick, tone = "sky" }) => {
  const tones = {
    sky: "text-slate-700 hover:bg-sky-50 hover:text-sky-700",
    rose: "text-slate-700 hover:bg-rose-50 hover:text-rose-700",
    emerald: "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700",
  };

  return (
    <button onClick={onClick} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold uppercase tracking-wider transition ${tones[tone]}`}>
      {icon}
      {label}
    </button>
  );
};

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
    <p className="mt-1 font-semibold text-slate-800">{value || "Not provided"}</p>
  </div>
);

export default ManageApplications;
