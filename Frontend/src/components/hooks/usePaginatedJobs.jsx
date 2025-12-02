import { useEffect, useState } from "react";
import axios from "axios";
import { JOB_API_END_POINT } from "../../utils/constant.js";

const usePaginatedJobs = (page = 1, limit = 5, keyword = "") => {
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${JOB_API_END_POINT}/get?keyword=${keyword}&page=${page}&limit=${limit}`
        );

        setJobs(response.data.jobs);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page, limit, keyword]);

  return { jobs, totalPages, loading };
};

export default usePaginatedJobs;
