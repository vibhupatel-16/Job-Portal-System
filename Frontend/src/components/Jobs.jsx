import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "../components/Job";
import Pagination from "../components/Pagination"; // <-- Add this
import usePaginatedJobs from "./hooks/usePaginatedJobs"; // <-- Add hook

const Jobs = () => {
  const [page, setPage] = useState(1);
  const limit = 6; // 3 columns × 2 rows

  // ⭐ Using your reusable API hook
  const { jobs, totalPages, loading } = usePaginatedJobs(page, limit);

  return (
    <div>
      {/* <Navbar /> */}

      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          {/* Sidebar Filters */}
          <div className="w-[20%]">
            <FilterCard />
          </div>

          {/* Jobs List */}
          <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
            {loading ? (
              <p className="text-center text-lg mt-10">Loading Jobs...</p>
            ) : jobs.length === 0 ? (
              <span className="text-center block mt-10 text-gray-500">
                Jobs Not Found
              </span>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {jobs.map((job) => (
                  <Job key={job?._id} job={job} />
                ))}
              </div>
            )}

            {/* ⭐ Pagination Component */}
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
