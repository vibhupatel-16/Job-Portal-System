import React from 'react';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

// Function to strip HTML and get short text
const getShortText = (html, maxLength = 150) => {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  const text = div.textContent || div.innerText || "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

function LatestJobCards({ job }) {
  const navigate = useNavigate();
  return (
    <div onClick={()=>{navigate(`/description/${job._id}`)}} className='p-5 rounded-md shadow-md bg-white border-gray-100 cursor-pointer hover:shadow-lg transition'>
      
      {/* Company Name */}
      <div>
        <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
        <p className='text-sm text-gray-500'>India</p>
      </div>

      {/* Title */}
      <div>
        <h1 className='font-bold text-lg my-2'>{job?.title}</h1>

        {/* Shortened Description */}
        <p className='text-sm text-gray-600'>
          {getShortText(job?.description)}
        </p>

        {/* Shortened Requirements */}
        <p className='text-sm text-gray-600 mt-1'>
          {getShortText(job?.requirements)}
        </p>
      </div>

      {/* Badges */}
      <div className='flex items-center gap-2 mt-4'>
        <Badge className='text-blue-700 font-bold' variant="ghost">{job?.position}Postion</Badge>
        <Badge className='text-[#292929] font-bold' variant="ghost">{job?.jobType}</Badge>
        <Badge className='text-[#7209b7] font-bold' variant="ghost">{job?.salary} LPA</Badge>
      </div>
    </div>
  );
}

export default LatestJobCards;
