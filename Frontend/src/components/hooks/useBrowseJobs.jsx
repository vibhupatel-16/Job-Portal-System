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
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${JOB_API_END_POINT}/get`, {
          params: {
            keyword: searchedQuery || "",
            location: filters.location || "",
            salary: filters.salary || "",
            experience: filters.experience || "",
            page,
            limit,
          },
        });

        setJobs(response.data.jobs || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.log("Browse API Error:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page, limit, searchedQuery, JSON.stringify(filters)]); // nested change detect karne ke liye

  return { jobs, totalPages, loading };
};

export default useBrowseJobs;
