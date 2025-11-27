import React, { useEffect } from 'react'
import Job from './Job'
import Navbar from './shared/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import useGetAllJobs from './hooks/useGetAllJobs';
import { setSearchedQuery } from '@/redux/jobSlice';

const Browse = () => {
  useGetAllJobs()
  const { allJobs } = useSelector((store => store.job));
  const dispatch = useDispatch();
  useEffect(()=>{
    return()=>{
      dispatch(setSearchedQuery(""));
    }
  })
  return (
    <div>
      {/* <Navbar /> */}

      <div className='max-w-7xl mx-auto my-10'>
        <h1 className='font-bold text-xl my-10'>
          Search Results ({allJobs?.length || 0})
        </h1>

        <div className='grid grid-cols-3 gap-4 mt-5'>
          {
            allJobs && allJobs.length > 0 ? (
              allJobs.map((job) => (
                <Job key={job._id} job={job} />
              ))
            ) : (
              <p>No Jobs Found</p>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Browse
