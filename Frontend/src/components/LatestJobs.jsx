import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';

const EMPTY_JOBS = [];

const LatestJobs = () => {
  const homeJobs = useSelector((store) => store.job?.homeJobs ?? EMPTY_JOBS);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
        Latest & Top <span className="text-indigo-600">Job Openings</span>
      </h2>
      <p className="mt-1 text-gray-600">Recently posted opportunities</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {
          homeJobs.length <= 0 
            ? <span>No Job Available</span> 
            : homeJobs.slice(0, 6).map((job) => (
                <LatestJobCards key={job._id} job={job} />
              ))
        }
      </div>
    </section>
  );
}

export default LatestJobs
