import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

// Utility: Strip HTML & shorten text
const getShortText = (html, maxLength = 120) => {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  const text = div.textContent || div.innerText || "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

function LatestJobCards({ job }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="
        p-6 rounded-xl 
        shadow-md 
        bg-white/80 backdrop-blur-lg 
        border border-gray-200 
        cursor-pointer 
        hover:shadow-xl 
        hover:scale-[1.02] 
        transition-all duration-300
      "
    >
      {/* Company Name */}
      <div>
        <h1 className="font-semibold text-xl text-gray-900">{job?.company?.name}</h1>
        <p className="text-sm text-gray-500 mt-1">India</p>
      </div>

      {/* Job Title */}
      <div className="mt-4">
        <h1 className="font-bold text-lg text-[#6A38C2]">{job?.title}</h1>

        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          {getShortText(job?.description)}
        </p>

        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
          {getShortText(job?.requirements)}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-5">
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 shadow-sm">
          {job?.position} Positions
        </Badge>

        <Badge className="bg-purple-50 text-purple-700 border-purple-200 shadow-sm">
          {job?.jobType}
        </Badge>

        <Badge className="bg-green-50 text-green-700 border-green-200 shadow-sm">
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
}

export default LatestJobCards;
