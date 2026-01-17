import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setSingleJob } from '@/redux/jobSlice'; // Redux update ke liye

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  // ================= LOAD SAVED JOBS =================
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axiosInstance.get("/user/saved-jobs");
        setJobs(res.data.jobs || []);
      } catch (error) {
        toast.error("Failed to load saved jobs");
      }
    };
    fetchSavedJobs();
  }, []);

  // ================= REMOVE SAVED JOB =================
  const removeJob = async (jobId) => {
    try {
      await axiosInstance.delete(`/user/saved-jobs/${jobId}`);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      toast.success("Job removed from saved list");
    } catch {
      toast.error("Remove failed");
    }
  };

  // ================= QUICK APPLY (Updated Logic) =================
  const applyJob = async (jobId) => {
    try {
      // Endpoint ko aapke constants ke hisaab se check karein
      const res = await axiosInstance.get(`/application/apply/${jobId}`);
      
      if (res.data.success) {
        toast.success("Applied successfully!");
        
        // UI Update: Local state mein is job ko "applied" mark karein
        setJobs(prevJobs => 
          prevJobs.map(job => 
            job._id === jobId 
              ? { ...job, applications: [...(job.applications || []), { applicant: user._id }] }
              : job
          )
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Apply failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>

      {jobs.length === 0 && (
        <p className="text-gray-500">No saved jobs found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => {
          // Check if user has already applied to this job
          const isApplied = job.applications?.some(app => app.applicant === user?._id);

          return (
            <div key={job._id} className="p-4 border rounded-xl shadow bg-white">
              <h2 className="font-semibold text-lg">{job.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                {job.company?.name}
              </p>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => !isApplied && applyJob(job._id)}
                  disabled={isApplied}
                  className={`px-4 py-1 rounded transition ${
                    isApplied 
                      ? "bg-gray-400 cursor-not-allowed text-white" 
                      : "bg-[#6A38C2] hover:bg-[#5b30a6] text-white"
                  }`}
                >
                  {isApplied ? "Already Applied" : "Apply"}
                </button>

                <button
                  onClick={() => removeJob(job._id)}
                  className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-50"
                >
                  Remove
                </button>

                <button
                  onClick={() => navigate(`/description/${job._id}`)}
                  className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-50"
                >
                  View Detail
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedJobs;