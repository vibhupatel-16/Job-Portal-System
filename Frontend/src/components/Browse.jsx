import React, { useEffect, useState } from "react";
import Job from "./Job";
import Pagination from "./Pagination";
import useBrowseJobs from "./hooks/useBrowseJobs";
import { useSelector } from "react-redux";
import { JobCardSkeleton } from "./JobCardSkeleton";

const Browse = () => {
  const [page, setPage] = useState(1);
  const limit = 6;

  const { filters, searchedQuery } = useSelector((state) => state.job);
  const { jobs, totalPages, loading } = useBrowseJobs(page, limit);

  useEffect(() => {
    setPage(1);
  }, [filters, searchedQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 my-10">
      <h1 className="font-bold text-xl mb-5">
        Search Results {!loading && `(${jobs?.length || 0})`}
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : jobs?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
            {jobs.map((job) => (
              <Job key={job._id} job={job} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </>
      ) : (
        <p className="text-center text-gray-500 mt-10">No Jobs Found</p>
      )}
    </div>
  );
};

export default Browse;
