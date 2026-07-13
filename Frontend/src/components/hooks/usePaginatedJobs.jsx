import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";

const usePaginatedJobs = (page = 1, limit = 5) => {
  const { searchedQuery, filters } = useSelector((state) => state.job);
  const location = useLocation();
  const isJobsPage = location.pathname === "/jobs";
  const keyword = isJobsPage ? "" : searchedQuery || "";

  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get(`/job/get`, {
          params: {
            keyword,
            location: filters.location || "",
            category: filters.category || "",
            jobType: filters.jobType || "",
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
  }, [page, limit, keyword, filters]);

  return { jobs, totalPages, loading };
};

export default usePaginatedJobs;
