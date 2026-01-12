import React, { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react"; 
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice"; // User state update karne ke liye

const getShortText = (html, maxLength = 120) => {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  const text = div.textContent || div.innerText || "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
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
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="group p-6 rounded-2xl shadow-sm bg-white border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300 relative"
    >
      {/* Toggle Bookmark Icon */}
      <div 
        onClick={handleToggleSave}
        className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-200 z-10 ${
          saved 
          ? "bg-purple-50 text-[#6A38C2]" 
          : "bg-gray-50 text-gray-400 hover:text-[#6A38C2] hover:bg-purple-50"
        }`}
      >
        <Bookmark 
          size={22} 
          className={saved ? "fill-[#6A38C2]" : "fill-transparent"} 
        />
      </div>

      <div>
        <h1 className="font-bold text-lg text-gray-800">{job?.company?.name}</h1>
        <p className="text-xs text-gray-400 font-medium uppercase">India • Remote Available</p>
      </div>

      <div className="mt-4">
        <h1 className="font-extrabold text-xl text-gray-900 group-hover:text-[#6A38C2] transition-colors">
          {job?.title}
        </h1>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {getShortText(job?.description)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-5">
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-none font-bold px-3">
          {job?.position} Openings
        </Badge>
        <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-none font-bold px-3">
          {job?.jobType}
        </Badge>
        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none font-bold px-3">
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
}

export default LatestJobCards;