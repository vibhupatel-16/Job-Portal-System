import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { Trash2, Briefcase, Plus, Pencil } from "lucide-react";
import { toast } from "sonner";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Briefcase className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Manage Jobs</h1>
            <p className="text-gray-500 text-sm">
              Admin can create, update and delete jobs
            </p>
          </div>
        </div>

        {/* ➕ Add Job Button */}
        <button
          onClick={() => navigate("/admin/jobs/create")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          <Plus size={18} /> Add Job
        </button>
      </div>

      {/* Jobs Table */}
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
                <th className="p-4 text-center">Actions</th>
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

                  {/* 🔘 Action Buttons */}
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-3">
                      {/* ✏️ Update Job */}
                      <button
                        onClick={() =>
                          navigate(`/admin/jobs/update/${job._id}`)
                        }
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                      >
                        <Pencil size={16} /> Update
                      </button>

                      {/* 🗑️ Delete Job */}
                      <button
                        onClick={() => deleteJob(job._id)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
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
