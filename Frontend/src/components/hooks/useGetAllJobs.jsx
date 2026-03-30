import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "@/utils/axiosInstance";

const usePaginatedJobs = (page = 1, limit = 5) => {
  const { searchedQuery, filters } = useSelector((state) => state.job);

  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get(`/job/get`, {
          params: {
            keyword: searchedQuery || "",
            location: filters.location || "",
            title: filters.title || "",
            salary: filters.salary || "",
            experience: filters.experience || "",
            page,
            limit,
          },
        });

        setJobs(response.data.jobs || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.log("API Error:", err);
        setJobs([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page, limit, searchedQuery, filters]);

  return { jobs, totalPages, loading };
};

export default usePaginatedJobs;
