import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Briefcase, Trash2, Pencil, MapPin, Building2, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [employer, setEmployer] = useState("");
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get("/admin/jobs", {
        params: {
          company: company || undefined,
          location: location || undefined,
          employer: employer || undefined,
        },
      });
      setJobs(res.data.jobs || []);
    } catch {
      toast.error("Failed to load jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [company, location, employer]);

  const deleteJob = async (id) => {
    if (!confirm("Delete this job?")) return;
    try {
      await axiosInstance.delete(`/admin/jobs/${id}`);
      toast.success("Job deleted");
      fetchJobs();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/admin/jobs/${id}/status`, { status: newStatus });
      toast.success(`Job ${newStatus}`);
      fetchJobs();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-[1.5rem] bg-sky-100 p-4 text-sky-700 shadow-sm">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-sky-500">Admin Control</p>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Jobs</h1>
              <p className="mt-2 text-sm text-slate-500">Review posted roles, approve listings, and keep the catalog clean.</p>
            </div>
          </div>
          <Button className="rounded-2xl bg-sky-600 px-5 py-6 font-black shadow-sm hover:bg-sky-700" onClick={() => navigate("/admin/jobs/create")}>
            + Post Job
          </Button>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Search by company" value={company} onChange={(e) => setCompany(e.target.value)} className="h-12 rounded-2xl border-slate-200 bg-slate-50" />
            <Input placeholder="Search by location" value={location} onChange={(e) => setLocation(e.target.value)} className="h-12 rounded-2xl border-slate-200 bg-slate-50" />
            <Input placeholder="Search by employer" value={employer} onChange={(e) => setEmployer(e.target.value)} className="h-12 rounded-2xl border-slate-200 bg-slate-50" />
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          {jobs.length === 0 ? (
            <p className="py-16 text-center text-slate-500">No jobs found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-slate-50">
                  <tr className="text-left text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                    <th className="px-6 py-5">Role</th>
                    <th className="px-6 py-5">Company</th>
                    <th className="px-6 py-5">Location</th>
                    <th className="px-6 py-5">Posted By</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr key={job._id} className="transition hover:bg-sky-50/40">
                      <td className="px-6 py-5">
                        <p className="font-bold text-slate-900">{job.title}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="inline-flex items-center gap-2 font-semibold text-slate-700">
                          <Building2 size={14} className="text-sky-500" />
                          {job.company?.name || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="inline-flex items-center gap-2 text-slate-600">
                          <MapPin size={14} className="text-sky-500" />
                          {job.location || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="inline-flex items-center gap-2 text-slate-600">
                          <UserRound size={14} className="text-sky-500" />
                          {job.created_by?.fullname || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider ${
                          job.status === "approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : job.status === "rejected"
                              ? "bg-rose-50 text-rose-700"
                              : job.status === "closed"
                                ? "bg-slate-100 text-slate-700"
                              : "bg-amber-50 text-amber-700"
                        }`}>
                          {job.status || "pending"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          {job.status === "pending" && (
                            <>
                              <Button size="sm" className="rounded-xl bg-emerald-600 text-xs font-black uppercase tracking-wider hover:bg-emerald-700" onClick={() => handleStatusUpdate(job._id, "approved")}>
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" className="rounded-xl text-xs font-black uppercase tracking-wider" onClick={() => handleStatusUpdate(job._id, "rejected")}>
                                Reject
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline" className="h-9 w-9 rounded-xl p-0" onClick={() => navigate(`/admin/jobs/update/${job._id}`)}>
                            <Pencil size={14} />
                          </Button>
                          <Button size="sm" variant="destructive" className="h-9 w-9 rounded-xl p-0" onClick={() => deleteJob(job._id)}>
                            <Trash2 size={14} />
                          </Button>
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

export default ManageJobs;
