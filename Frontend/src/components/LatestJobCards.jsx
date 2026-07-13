import React, { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { Bookmark, Building2, MapPin } from "lucide-react"; 
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { motion } from "framer-motion";

const getShortText = (html, maxLength = 120) => {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  const text = div.textContent || div.innerText || "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const formatPostedTime = (createdAt) => {
  if (!createdAt) return "Posted recently";

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "Posted recently";

  return `Posted on ${date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
};

function LatestJobCards({ job }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [saved, setSaved] = useState(false);

  // ================= SYNC SAVED STATUS =================
  useEffect(() => {
    if (user && user.savedJobs) {
      // Check if ID exists in user's saved array
      const isAlreadySaved = user.savedJobs.some(id => id === job?._id || id?._id === job?._id);
      setSaved(isAlreadySaved);
    }
  }, [user, job?._id]);

  // ================= TOGGLE SAVE/REMOVE FUNCTION =================
  const handleToggleSave = async (e) => {
    e.stopPropagation();

    if (!user) {
      return toast.error("Please login to save jobs");
    }

    try {
      if (saved) {
        // 1. REMOVE LOGIC
        const res = await axiosInstance.delete(`/user/saved-jobs/${job?._id}`);
        if (res.data.success) {
          setSaved(false);
          toast.success("Removed from saved jobs");
          
          // Redux update: Remove ID from local user state
          const updatedSavedJobs = user.savedJobs.filter(id => id !== job?._id && id?._id !== job?._id);
          dispatch(setUser({ ...user, savedJobs: updatedSavedJobs }));
        }
      } else {
        // 2. SAVE LOGIC
        const res = await axiosInstance.post("/user/save-job", { jobId: job?._id });
        if (res.data.success) {
          setSaved(true);
          toast.success("Job saved successfully");

          // Redux update: Add ID to local user state
          const updatedSavedJobs = [...user.savedJobs, job?._id];
          dispatch(setUser({ ...user, savedJobs: updatedSavedJobs }));
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/description/${job?._id}`)}
      className="p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer flex flex-col h-[340px] relative group"
    >
      <div className="flex items-center justify-between mb-4">
        <Badge variant="secondary" className="bg-gray-100/80 text-gray-500 hover:bg-gray-200 border-none px-3 py-1 text-xs font-semibold shadow-sm">
          {formatPostedTime(job?.createdAt)}
        </Badge>
        <button
          onClick={handleToggleSave}
          className={`p-2 rounded-full transition-all group/btn ${saved ? "bg-indigo-50 shadow-sm" : "hover:bg-gray-100"}`}
        >
          <Bookmark 
            size={20} 
            className={`transition-colors ${saved ? "text-indigo-600 fill-indigo-600" : "text-gray-400 group-hover/btn:text-gray-600"}`} 
          />
        </button>
      </div>

      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm shadow-gray-100/50">
           {job?.company?.logo ? (
             <img src={job.company.logo} alt="logo" className="w-10 h-10 object-contain" />
           ) : (
             <Building2 className="text-gray-300" size={24} />
           )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-gray-900 text-lg leading-tight truncate">{job?.company?.name || 'Unknown Company'}</h1>
          <p className="text-sm font-medium text-gray-400 mt-1 flex items-center gap-1"><MapPin size={14}/> {job?.location || 'India'}</p>
        </div>
      </div>

      <div className="mb-4">
        <h1 className="text-xl font-black text-indigo-700 leading-tight line-clamp-1">{job?.title}</h1>
        <p className="text-[13px] text-gray-500 mt-2 font-medium line-clamp-2 leading-relaxed">
          {getShortText(job?.description?.replace(/<[^>]*>?/gm, ''))}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-auto pb-4">
  
  <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm font-bold text-[10px] px-2 py-1 rounded-md hover:bg-indigo-100 hover:text-indigo-800 transition-colors">
    {job?.position} Positions
  </Badge>

  
  <Badge className="bg-orange-50 text-orange-600 border border-orange-100 shadow-sm font-bold text-[10px] px-2 py-1 rounded-md hover:bg-orange-100 hover:text-orange-700 transition-colors">
    {job?.jobType}
  </Badge>

  
  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm font-bold text-[10px] px-2 py-1 rounded-md hover:bg-emerald-100 hover:text-emerald-800 transition-colors">
    {job?.salary} LPA
  </Badge>
</div>
    </motion.div>
  );
}

export default LatestJobCards;