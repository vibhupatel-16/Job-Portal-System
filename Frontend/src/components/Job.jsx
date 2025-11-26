import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

// Function to strip HTML and shorten text
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
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  return (
    <div className='p-5 bg-white rounded-md border border-gray-100 shadow-xl hover:shadow-2xl transition'>
      
      {/* Top Row */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-500'>
          {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>

        <Button variant='outline' className="rounded-full" size="icon">
          <Bookmark />
        </Button>
      </div>

      {/* Company Section */}
      <div className='flex items-center gap-2 my-3'>
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>

        <div>
          <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
          <p className='text-sm text-gray-500'>India</p>
        </div>
      </div>

      {/* Job Title + Short Preview */}
      <div>
        <h1 className='text-lg font-bold my-2'>{job?.title}</h1>

        {/* Short Description Preview */}
        <p className='text-sm text-gray-600'>
          {getShortText(job?.description)}
        </p>

        {/* Short Requirements Preview */}
        <p className='text-sm text-gray-600 mt-1'>
          {getShortText(job?.requirements)}
        </p>
      </div>

      {/* Badges */}
      <div className='flex items-center gap-2 mt-4'>
        <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} pos</Badge>
        <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
        <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary} LPA</Badge>
      </div>

      {/* Buttons */}
      <div className='flex items-center gap-4 mt-5'>
        <Button onClick={() => navigate(`/description/${job?._id}`)} variant='outline'>
          Details
        </Button>

        <Button className="bg-[#7209b7]">
          Save For Later
        </Button>
      </div>

    </div>
  );
};

export default Job;
