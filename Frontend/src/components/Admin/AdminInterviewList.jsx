import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Building2,
  User,
  CheckCircle2,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance";

const AdminInterviewList = () => {
  const [interviews, setInterviews] = useState([]);

  const fetchAll = async () => {
    try {
      const res = await axiosInstance.get(`/interview/admin/all-interviews`);
      if (res.data.success) {
        setInterviews(res.data.interviews || []);
      }
    } catch (error) {
      console.error("Admin fetch error", error);
      toast.error("Failed to load interview list");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleApproveReschedule = async (interviewId, newDate, newTime) => {
    try {
      const res = await axiosInstance.post(`/interview/approve-reschedule`, {
        interviewId,
        newDate,
        newTime,
      });
      if (res.data.success) {
        toast.success("Interview rescheduled successfully!");
        fetchAll();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve");
    }
  };

  const deleteInterview = async (id) => {
    if (!window.confirm("Are you sure you want to cancel and delete this interview?")) return;
    try {
      const res = await axiosInstance.delete(`/interview/interview/${id}`);
      if (res.data.success) {
        toast.success(res.data.message || "Interview deleted");
        fetchAll();
      }
    } catch (error) {
      toast.error("Error deleting interview");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-sky-500">Admin Control</p>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Interview Master List</h1>
            <p className="text-sm text-slate-500 mt-2">Monitor, approve, and manage interview schedules across the platform.</p>
          </div>
          <button
            onClick={fetchAll}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
          >
            <RefreshCw size={16} />
            Refresh List
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Total Interviews" value={interviews.length} tone="sky" />
          <StatCard label="Reschedule Requests" value={interviews.filter((item) => item.status === "reschedule_requested").length} tone="amber" />
          <StatCard label="Online Meetings" value={interviews.filter((item) => item.mode === "online").length} tone="emerald" />
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          {interviews.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-lg font-bold text-slate-700">No interviews found</p>
              <p className="mt-2 text-sm text-slate-400">Once interviews are scheduled, they will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-slate-50 text-slate-500">
                  <tr className="text-left text-[11px] font-black uppercase tracking-[0.18em]">
                    <th className="px-6 py-5">Candidate</th>
                    <th className="px-6 py-5">Job</th>
                    <th className="px-6 py-5">Schedule</th>
                    <th className="px-6 py-5">Mode</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {interviews.map((item) => (
                    <tr key={item._id} className="transition hover:bg-sky-50/40">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{item.jobseeker?.fullname || item.application?.applicant?.fullname || "N/A"}</p>
                            <p className="text-xs text-slate-500">{item.jobseeker?.email || item.application?.applicant?.email || "No email"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900">{item.job?.title || "N/A"}</p>
                          <p className="inline-flex items-center gap-2 text-xs font-semibold text-sky-700">
                            <Building2 size={12} />
                            {item.company?.name || "No company"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1 text-sm text-slate-600">
                          <p className="inline-flex items-center gap-2"><Calendar size={14} className="text-sky-500" />{item.date}</p>
                          <p className="inline-flex items-center gap-2"><Clock size={14} className="text-sky-500" />{item.time}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider ${
                          item.mode === "online" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                        }`}>
                          {item.mode === "online" ? <Video size={12} /> : <MapPin size={12} />}
                          {item.mode || "offline"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider ${
                          item.status === "reschedule_requested"
                            ? "bg-amber-50 text-amber-700"
                            : item.status === "completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-700"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          {item.status === "reschedule_requested" && (
                            <button
                              onClick={() => handleApproveReschedule(item._id, item.suggestedDate, item.suggestedTime)}
                              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-emerald-700"
                            >
                              <CheckCircle2 size={14} />
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => deleteInterview(item._id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-black uppercase tracking-wider text-rose-700 transition hover:bg-rose-100"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, tone }) => {
  const tones = {
    sky: "from-sky-500/10 to-cyan-500/10 text-sky-700",
    amber: "from-amber-500/10 to-orange-500/10 text-amber-700",
    emerald: "from-emerald-500/10 to-green-500/10 text-emerald-700",
  };

  return (
    <div className={`rounded-[1.75rem] border border-white/60 bg-gradient-to-br ${tones[tone]} p-5 shadow-sm`}>
      <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">{label}</p>
      <p className="mt-3 text-3xl font-black">{value}</p>
    </div>
  );
};

export default AdminInterviewList;
