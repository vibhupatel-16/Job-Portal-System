import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { toast } from 'sonner';

const JobDescription = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [isApplied, setIsApplied] = useState(false);

  // ----------- APPLY JOB ---------------
  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);

        const updatedJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user._id }],
        };

        dispatch(setSingleJob(updatedJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  // ----------- FETCH JOB -----------------
  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/get/${jobId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));

          const applied = res.data.job.applications.some(
            (app) => app.applicant === user?._id
          );
          setIsApplied(applied);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className='max-w-6xl mx-auto my-10 p-6 bg-white rounded-xl shadow-md'>
      
      {/* ------------ HEADER SECTION ------------- */}
      <div className='flex justify-between items-start'>
        <div>
          <h1 className='font-bold text-3xl text-gray-900'>{singleJob?.title}</h1>

          <div className='flex items-center gap-3 mt-4'>
            <Badge className='text-blue-700 font-semibold px-3 py-1' variant="secondary">
              {singleJob?.position} Position
            </Badge>

            <Badge className='text-[#F83002] font-semibold px-3 py-1' variant="secondary">
              {singleJob?.jobType}
            </Badge>

            <Badge className='text-[#7209b7] font-semibold px-3 py-1' variant="secondary">
              {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>

        {/* ------------ APPLY BUTTON ------------- */}
        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied}
          className={`rounded-lg px-6 py-3 text-lg ${
            isApplied
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-[#7209b7] hover:bg-[#5f32ad]'
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      <div className='border-b mt-6 mb-6'></div>

      {/* ------------ MAIN JOB DETAILS ------------- */}
      <div className='space-y-6 text-gray-900'>

        <div className='grid grid-cols-2 gap-6'>
          <h1 className='font-bold text-lg'>
            Role:
            <span className='pl-2 font-normal text-gray-700'>{singleJob?.title}</span>
          </h1>

          <h1 className='font-bold text-lg'>
            Location:
            <span className='pl-2 font-normal text-gray-700'>{singleJob?.location}</span>
          </h1>
        </div>

        {/* Description */}
        <div>
          <h1 className='font-bold text-xl mb-2 text-[#7209b7]'>Job Description</h1>
          <div
            className='pl-3 text-gray-800 rich-text-content leading-7'
            dangerouslySetInnerHTML={{ __html: singleJob?.description }}
          />
        </div>

        {/* Requirements */}
        <div>
          <h1 className='font-bold text-xl mb-2 text-[#7209b7]'>Requirements</h1>
          <div
            className='pl-3 text-gray-800 rich-text-content leading-7'
            dangerouslySetInnerHTML={{ __html: singleJob?.requirements }}
          />
        </div>

        <div className='grid grid-cols-2 gap-6'>
          <h1 className='font-bold text-lg'>
            Experience:
            <span className='pl-2 font-normal text-gray-700'>{singleJob?.experienceLevel} Years</span>
          </h1>

          <h1 className='font-bold text-lg'>
            Salary:
            <span className='pl-2 font-normal text-gray-700'>{singleJob?.salary} LPA</span>
          </h1>

          <h1 className='font-bold text-lg'>
            Total Applicants:
            <span className='pl-2 font-normal text-gray-700'>{singleJob?.applications?.length}</span>
          </h1>

          <h1 className='font-bold text-lg'>
            Posted Date:
            <span className='pl-2 font-normal text-gray-700'>
              {singleJob?.createdAt?.split("T")[0]}
            </span>
          </h1>
        </div>

      </div>
    </div>
  );
};

export default JobDescription;
