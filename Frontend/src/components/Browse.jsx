import React, { useEffect, useState } from "react";
import Job from "./Job";
import Pagination from "../components/Pagination";
import useBrowseJobs from "./hooks/useBrowseJobs";
import { useSelector } from "react-redux";

const Browse = () => {
  const [page, setPage] = useState(1);
  const limit = 6;

  const { filters, searchedQuery } = useSelector(state => state.job);
  const { jobs, totalPages, loading } = useBrowseJobs(page, limit);

  // Filter/search change → page reset
  useEffect(() => {
    setPage(1);
  }, [filters, searchedQuery]);

  return (
    <div className="max-w-7xl mx-auto my-10">
      <h1 className="font-bold text-xl mb-5">Search Results ({jobs?.length || 0})</h1>

      {loading ? (
        <p className="text-center mt-10 text-gray-600">Loading...</p>
      ) : jobs?.length > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-4 mt-5">
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
