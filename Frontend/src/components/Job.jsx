import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/authSlice'; // Redux update ke liye

const getShortText = (html, maxLength = 150) => {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  const text = div.textContent || div.innerText || "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [saved, setSaved] = useState(false);

  // ================= SYNC SAVED STATUS =================
  useEffect(() => {
    if (user && user.savedJobs) {
      // Check agar current job user ki savedJobs list mein hai
      const isAlreadySaved = user.savedJobs.some(id => 
        (typeof id === 'string' ? id === job?._id : id?._id === job?._id)
      );
      setSaved(isAlreadySaved);
    }
  }, [user, job?._id]);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const diff = currentTime - createdAt;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

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
          toast.success("Job removed from bookmarks");
          
          // Redux update: Filter out the removed job ID
          const updatedSavedJobs = user.savedJobs.filter(id => 
            (typeof id === 'string' ? id !== job?._id : id?._id !== job?._id)
          );
          dispatch(setUser({ ...user, savedJobs: updatedSavedJobs }));
        }
      } else {
        // 2. SAVE LOGIC
        const res = await axiosInstance.post("/user/save-job", { jobId: job?._id });
        if (res.data.success) {
          setSaved(true);
          toast.success("Job saved successfully");

          // Redux update: Add the new job ID
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
      onClick={() => navigate(`/description/${job?._id}`)}
      className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-md hover:shadow-2xl hover:scale-[1.015] transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>

        {/* Bookmark Icon Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleToggleSave}
          className={`rounded-full transition-colors ${saved ? "bg-purple-100" : "hover:bg-gray-100"}`}
        >
          <Bookmark 
            size={20} 
            className={saved ? "text-[#6A38C2] fill-[#6A38C2]" : "text-gray-400"} 
          />
        </Button>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <Avatar className="h-12 w-12 shadow-md border">
          <AvatarImage src={job?.company?.logo} alt="logo" />
        </Avatar>
        <div>
          <h1 className="font-bold text-lg text-gray-900">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>

      <div className="mt-5">
        <h1 className="text-xl font-bold text-[#6A38C2] leading-tight">{job?.title}</h1>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{getShortText(job?.description)}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 shadow">{job?.position} Positions</Badge>
        <Badge className="bg-red-50 text-red-600 border-red-200 shadow">{job?.jobType}</Badge>
        <Badge className="bg-purple-50 text-purple-700 border-purple-200 shadow">{job?.salary} LPA</Badge>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/description/${job?._id}`);
          }}
          variant="outline"
          className="flex-1 hover:border-purple-500 hover:text-purple-600 transition"
        >
          Details
        </Button>

        {/* Industry Style Toggle Button */}
        <Button
          onClick={handleToggleSave}
          className={`flex-1 shadow-md transition-all ${
            saved 
            ? "bg-gray-100 text-[#6A38C2] border border-[#6A38C2]" 
            : "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
          }`}
        >
          {saved ? "Saved" : "Save for Later"}
        </Button>
      </div>
    </div>
  );
};

export default Job;