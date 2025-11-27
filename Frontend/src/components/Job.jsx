import React from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

// Strip HTML → Short Text
const getShortText = (html, maxLength = 150) => {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  const text = div.textContent || div.innerText || "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const Job = ({ job }) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const diff = currentTime - createdAt;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div
      onClick={() => navigate(`/description/${job?._id}`)}
      className="
        p-6 rounded-2xl 
        bg-white/80 backdrop-blur-xl 
        border border-gray-200 
        shadow-md 
        hover:shadow-2xl hover:scale-[1.015]
        transition-all duration-300 cursor-pointer
      "
    >

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>

        {/* Stop click from navigating */}
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => e.stopPropagation()}
          className="rounded-full hover:bg-purple-100"
        >
          <Bookmark className="text-purple-700" />
        </Button>
      </div>

      {/* Company Area */}
      <div className="flex items-center gap-3 mt-4">
        <Avatar className="h-12 w-12 shadow-md border">
          <AvatarImage src={job?.company?.logo} alt="logo" />
        </Avatar>

        <div>
          <h1 className="font-bold text-lg text-gray-900">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>

      {/* Job Title + Preview */}
      <div className="mt-5">
        <h1 className="text-xl font-bold text-[#6A38C2] leading-tight">
          {job?.title}
        </h1>

        <p className="text-sm text-gray-600 mt-2">
          {getShortText(job?.description)}
        </p>

        <p className="text-sm text-gray-600 mt-1">
          {getShortText(job?.requirements)}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 shadow">
          {job?.position} Positions
        </Badge>

        <Badge className="bg-red-50 text-red-600 border-red-200 shadow">
          {job?.jobType}
        </Badge>

        <Badge className="bg-purple-50 text-purple-700 border-purple-200 shadow">
          {job?.salary} LPA
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mt-6">

        {/* Stop click from opening card */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/description/${job?._id}`);
          }}
          variant="outline"
          className="hover:border-purple-500 hover:text-purple-600 transition"
        >
          View Details
        </Button>

        <Button
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-r from-purple-600 to-purple-800 hover:opacity-90 shadow-md"
        >
          Save for Later
        </Button>
      </div>
    </div>
  );
};

export default Job;
