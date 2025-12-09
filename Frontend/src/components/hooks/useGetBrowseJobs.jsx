import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { JOB_API_END_POINT } from "../../utils/constant";

const useBrowseJobs = (page = 1, limit = 6) => {
  const { searchedQuery, filters } = useSelector((state) => state.job);

  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilteredJobs = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${JOB_API_END_POINT}/get`, {
          params: {
            keyword: searchedQuery || "",
            location: filters.location || "",
            industry: filters.industry || "",
            salary: filters.salary || "",
            page,
            limit,
          },
        });

        setJobs(response.data.jobs || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.log("Browse API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredJobs();
  }, [page, limit, searchedQuery, filters]);

  return { jobs, totalPages, loading };
};

export default useBrowseJobs;
