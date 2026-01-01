import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Briefcase, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);

  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [employer, setEmployer] = useState("");

  const navigate = useNavigate();

  // ================= FETCH JOBS =================
  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get("/admin/jobs", {
        params: {
          company: company || undefined,
          location: location || undefined,
          employer: employer || undefined
        }
      });

      setJobs(res.data.jobs || []);
    } catch {
      toast.error("Failed to load jobs");
    }
  };

  // 🔥 AUTO FILTER (NO SEARCH BUTTON)
  useEffect(() => {
    fetchJobs();
  }, [company, location, employer]);

  // ================= DELETE =================
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

  return (
    <div className="p-6">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3 items-center">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Briefcase className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Manage Jobs</h1>
            <p className="text-sm text-gray-500">
              Admin can manage all posted jobs
            </p>
          </div>
        </div>

        <Button
          className="bg-indigo-600 hover:bg-indigo-700 rounded-xl"
          onClick={() => navigate("/admin/jobs/create")}
        >
          + Post Job
        </Button>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white p-5 rounded-2xl shadow grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <Input
          placeholder="Search by company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <Input
          placeholder="Search by location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <Input
          placeholder="Search by employer"
          value={employer}
          onChange={(e) => setEmployer(e.target.value)}
        />

      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-gray-600 text-sm">
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
              <tr key={job._id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{job.title}</td>
                <td className="p-4">{job.company?.name || "-"}</td>
                <td className="p-4">{job.location || "-"}</td>
                <td className="p-4">{job.created_by?.fullname || "-"}</td>

                <td className="p-4 text-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate(`/admin/jobs/update/${job._id}`)
                    }
                  >
                    <Pencil size={14} />
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteJob(job._id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {jobs.length === 0 && (
          <p className="text-center py-10 text-gray-500">
            No jobs found
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;
