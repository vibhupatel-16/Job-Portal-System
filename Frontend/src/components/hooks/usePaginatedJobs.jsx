import { useEffect, useState } from "react";
import axios from "axios";
import { JOB_API_END_POINT } from "../../utils/constant";

const usePaginatedJobs = (page = 1, limit = 6) => {
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${JOB_API_END_POINT}/get`, {
          params: {
            page,
            limit
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
  }, [page, limit]);

  return { jobs, totalPages, loading };
};

export default usePaginatedJobs;
