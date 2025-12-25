import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Trash2, Briefcase } from "lucide-react";
import { toast } from "sonner";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch all jobs (Admin)
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/jobs");
      setJobs(res.data.jobs || []);
    } catch (err) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete job (Admin)
  const deleteJob = async (id) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      await axiosInstance.delete(`/admin/jobs/${id}`);
      toast.success("Job deleted successfully");
      fetchJobs();
    } catch {
      toast.error("Failed to delete job");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-100 rounded-xl">
          <Briefcase className="text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Manage Jobs</h1>
          <p className="text-gray-500 text-sm">All posted jobs on the platform</p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No jobs found</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="p-4 text-left">Job Title</th>
                <th className="p-4 text-left">Company</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Posted By</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">{job.title}</td>
                  <td className="p-4 text-gray-700">
                    {job.company?.name || "-"}
                  </td>
                  <td className="p-4 text-gray-700">{job.location}</td>
                  <td className="p-4 text-gray-700">
                    {job.created_by?.fullname || "-"}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => deleteJob(job._id)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;