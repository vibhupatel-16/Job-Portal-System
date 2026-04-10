import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setSingleJob } from '@/redux/jobSlice'; // Redux update ke liye
import { setUser } from "@/redux/authSlice";
import { motion } from "framer-motion";
import { Bookmark, Building2, MapPin, Briefcase, ExternalLink, Trash2, Send } from "lucide-react";

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
        const res = await axiosInstance.delete(`/user/saved-jobs/${jobId}`);
        
        if (res.data.success) {
            setJobs((prev) => prev.filter((job) => job._id !== jobId));
            const updatedUser = {
                ...user,
                savedJobs: user.savedJobs.filter(id => id !== jobId)
            };
            dispatch(setUser(updatedUser));

            toast.success("Job removed successfully");
        }
    } catch (error) {
        console.error(error);
        toast.error("Remove failed");
    }
};
  // ================= QUICK APPLY (Updated Logic) =================
  const applyJob = async (jobId) => {
    if (!user?.profile?.resume) {
      toast.error("Please upload your resume in your profile before applying.");
      navigate('/profile');
      return;
    }

    try {
      const res = await axiosInstance.get(`/application/apply/${jobId}`);
      
      if (res.data.success) {
        toast.success("Applied successfully!");
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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-10 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-1/4 -right-20 w-[400px] h-[400px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4 }}
           className="mb-8"
        >
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
               <Bookmark size={24} />
             </div>
             Saved Jobs
          </h1>
          <p className="mt-2 text-gray-500 font-medium ml-1">Manage and apply to the opportunities you've bookmarked.</p>
        </motion.div>

        {jobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-16 bg-white/60 backdrop-blur-2xl border border-white/60 shadow-sm rounded-[2rem] text-center"
          >
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-300 mb-4">
               <Bookmark size={40} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">No saved jobs found</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">When you find a job you like, click the bookmark icon to save it here for later.</p>
            <button 
              onClick={() => navigate('/browse')}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-md font-bold text-sm transition-all hover:-translate-y-0.5"
            >
              Browse Jobs Now
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, idx) => {
            const isApplied = job.applications?.some(app => app.applicant === user?._id);

            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                key={job._id} 
                className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[1.5rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 flex flex-col overflow-hidden group"
              >
                {/* Header (Company info) */}
                <div className="p-6 pb-4 border-b border-gray-50 flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                     {job.company?.logo ? (
                        <img src={job.company.logo} alt="logo" className="w-full h-full object-contain p-1" />
                     ) : (
                        <Building2 className="text-gray-400" size={24} />
                     )}
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-xs font-bold text-indigo-600 tracking-widest uppercase truncate">{job.company?.name}</p>
                     <h2 className="font-bold text-lg text-gray-900 leading-tight mt-1 truncate">{job.title}</h2>
                     <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100"><MapPin size={12}/> {job.location || 'Remote'}</span>
                        {job.jobType && <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100"><Briefcase size={12}/> {job.jobType}</span>}
                     </div>
                  </div>
                </div>

                {/* Body (Description/Metrics) */}
                <div className="p-6 py-4 flex-1">
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed font-medium">
                    {job.description?.replace(/<[^>]*>?/gm, '')}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                     <span className="text-[10px] font-bold px-2 py-1 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">{job.salary || 'Salary Undisclosed'}</span>
                  </div>
                </div>

                {/* Footer (Actions) */}
                <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex gap-2">
                  <button
                    onClick={() => !isApplied && applyJob(job._id)}
                    disabled={isApplied}
                    className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                      isApplied 
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-200" 
                        : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md hover:-translate-y-0.5 border border-transparent"
                    }`}
                  >
                    <Send size={16} />
                    {isApplied ? "Applied" : "Apply"}
                  </button>

                  <button
                    onClick={() => navigate(`/description/${job._id}`)}
                    className="p-2.5 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-indigo-600 rounded-xl transition-all shadow-sm"
                    title="View Details"
                  >
                    <ExternalLink size={18} />
                  </button>
                  
                  <button
                    onClick={() => removeJob(job._id)}
                    className="p-2.5 bg-white text-gray-400 border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 rounded-xl transition-all shadow-sm group/btn"
                    title="Remove Bookmark"
                  >
                    <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;