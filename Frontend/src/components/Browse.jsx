import React, { useEffect, useState } from 'react';
import Job from './Job';
import Navbar from './shared/Navbar';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import Pagination from '../components/Pagination'
import usePaginatedJobs from './hooks/usePaginatedJobs';

const Browse = () => {
  const [page, setPage] = useState(1);
  const limit = 6; // how many jobs per page

  const dispatch = useDispatch();

  // ⭐ Using pagination hook
  const { jobs, totalPages, loading } = usePaginatedJobs(page, limit);

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(''));
    }
  }, []);

  return (
    <div>
      {/* <Navbar /> */}

      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl mb-5">
          Search Results ({jobs?.length || 0})
        </h1>

        {/* Jobs Grid */}
        {loading ? (
          <p className="text-center mt-10 text-gray-600">Loading...</p>
        ) : jobs && jobs.length > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-4 mt-5">
              {jobs.map((job) => (
                <Job key={job._id} job={job} />
              ))}
            </div>

            {/* ⭐ Pagination Component */}
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </>
        ) : (
          <p>No Jobs Found</p>
        )}
      </div>
    </div>
  );
};

export default Browse;
