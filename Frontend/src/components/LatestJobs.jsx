import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';

const LatestJobs = () => {
  const homeJobs = useSelector(store => store.job?.homeJobs || []);

  return (
    <div className='max-w-7xl mx-auto'>
      <h1 className='text-4xl font-bold'>
        <span className='text-[#6A38C2]'>Latest & Top </span>Job Openings
      </h1>
       
      <div className='grid grid-cols-3 gap-4 my-5'>
        {
          homeJobs.length <= 0 
            ? <span>No Job Available</span> 
            : homeJobs.slice(0,6).map((job) => (
                <LatestJobCards key={job._id} job={job}/>
              ))
        }
      </div>
    </div>
  )
}

export default LatestJobs
