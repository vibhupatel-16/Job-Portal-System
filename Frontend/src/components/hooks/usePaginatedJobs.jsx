import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { JOB_API_END_POINT } from "../../utils/constant";

const usePaginatedJobs = (page = 1, limit = 6) => {
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // ⭐ Get Redux Filters
  const { searchedQuery, filter } = useSelector((store) => store.job);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${JOB_API_END_POINT}/get`, {
          params: {
            page,
            limit,
            // Map Redux to backend expected query params
            keyword: searchedQuery || undefined,
            location: filter?.location || undefined,
            title: filter?.title || undefined, // Used in backend query.$or typically if it matches keyword, but wait... Redux `filter` has `title` mapped to Industry in FilterCard
            salary: filter?.salary || undefined,
          },
        });

        setJobs(res.data.jobs || []);
        setTotalPages(res.data.totalPages || 1);

      } catch (err) {
        console.log("JOBS API ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [page, limit, searchedQuery, filter]);

  return { jobs, totalPages, loading };
};

export default usePaginatedJobs;
