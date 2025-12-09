import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { JOB_API_END_POINT } from "../../utils/constant.js";

const usePaginatedJobs = (page = 1, limit = 5) => {
  const { searchedQuery, filters } = useSelector((state) => state.job);

  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${JOB_API_END_POINT}/get`, {
            params: {
              keyword: searchedQuery || "",
              location: filters.location || "",
              industry: filters.industry || "",
              salary: filters.salary || "",
              page,
              limit
            },
            withCredentials: true
          }
        );

        setJobs(response.data.jobs || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.log("API Error:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page, limit, searchedQuery, filters]);

  return { jobs, totalPages, loading };
};

export default usePaginatedJobs;
