import React, { useEffect, useState } from "react";
import Job from "./Job";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import Pagination from "../components/Pagination";
import useBrowseJobs from "./hooks/useGetBrowseJobs";

const Browse = () => {
  const [page, setPage] = useState(1);
  const limit = 6;

  const dispatch = useDispatch();

  const { jobs, totalPages, loading } = useBrowseJobs(page, limit);

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery("")); // clear search on unmount
    };
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl mb-5">
          Search Results ({jobs?.length || 0})
        </h1>

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
          <p>No Jobs Found</p>
        )}
      </div>
    </div>
  );
};

export default Browse;
