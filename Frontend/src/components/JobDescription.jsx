import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSingleJob } from '@/redux/jobSlice';
import { toast } from 'sonner';
import { Briefcase, MapPin, IndianRupee, Users, CalendarDays } from "lucide-react";
import axiosInstance from '@/utils/axiosInstance';

const JobDescription = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [isApplied, setIsApplied] = useState(false);

  const applyJobHandler = async () => {
    try {
      const res = await axiosInstance.get(
        `/application/apply/${jobId}`,
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

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axiosInstance.get(
          `/job/get/${jobId}`,
          
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
    <div className="max-w-5xl mx-auto py-10 space-y-10">

      {/* ------------------ HEADER CARD ------------------ */}
      <div className="bg-white rounded-2xl shadow-lg border p-8 flex flex-col md:flex-row md:justify-between gap-8">

        {/* LEFT SIDE */}
        <div className="flex items-start gap-6">
          {singleJob?.company?.logo && (
            <img
              src={singleJob.company.logo}
              alt={singleJob.company.name}
              className="w-20 h-20 object-contain rounded-lg border p-2 shadow-sm"
            />
          )}

          <div>
            <h1 className="text-3xl font-bold text-gray-900">{singleJob?.title}</h1>
            <p className="text-lg text-gray-700 mt-1">{singleJob?.company?.name}</p>

            {/* ICON BADGES */}
            <div className="flex flex-wrap gap-3 mt-4">

              <span className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
                <Briefcase size={16} /> {singleJob?.experienceLevel} Years
              </span>

              <span className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
                <IndianRupee size={16} /> {singleJob?.salary}LPA
              </span>

              <span className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
                <MapPin size={16} /> {singleJob?.location}
              </span>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE (APPLY + INFO) */}
        <div className="flex flex-col md:items-end gap-4">
          <Button
            onClick={isApplied ? null : applyJobHandler}
            disabled={isApplied}
            className={`px-7 py-3 rounded-xl text-lg font-semibold shadow ${
              isApplied
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </Button>

          <div className="text-sm text-gray-600 space-y-1 text-right">

            <p className="flex items-center gap-2 justify-end">
  <CalendarDays size={14} />
  Posted: 
  <span className="font-medium">
    {singleJob?.createdAt && 
      singleJob.createdAt.split("T")[0].split("-").reverse().join("-")
    }
  </span>
</p>


            <p className="flex items-center gap-2 justify-end">
              <Users size={14} />
              Openings: <span className="font-medium">{singleJob?.position}</span>
            </p>

            <p className="flex items-center gap-2 justify-end">
              <Users size={14} />
              Applicants: <span className="font-medium">{singleJob?.applications?.length}+</span>
            </p>

          </div>
        </div>
      </div>

      {/* ------------------ HIGHLIGHTS ------------------ */}
      <div className="bg-white rounded-2xl shadow-md border p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Highlights</h2>

        <ul className="list-disc ml-6 text-gray-700 space-y-2">
          {singleJob?.highlights?.length > 0 ? (
            singleJob.highlights.map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <>
              <li>Strong communication & customer support skills</li>
              <li>Ability to troubleshoot technical issues</li>
            </>
          )}
        </ul>
      </div>

      {/* ------------------ DESCRIPTION + REQUIREMENTS ------------------ */}
      <div className="bg-white rounded-2xl shadow-md border p-8 space-y-10">

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Job Description</h2>
          <div
  className="prose prose-gray max-w-none text-gray-700 leading-7"
  dangerouslySetInnerHTML={{ __html: singleJob?.description }}
/>

        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Requirements</h2>
          <div
  className="prose prose-gray max-w-none text-gray-700 leading-7"
  dangerouslySetInnerHTML={{ __html: singleJob?.requirements }}
/>

        </section>

      </div>

    </div>
  );
};

export default JobDescription;
