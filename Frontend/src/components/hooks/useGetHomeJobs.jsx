import { setHomeJobs } from "@/redux/jobSlice";
import axiosInstance from "@/utils/axiosInstance";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const useGetHomeJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosInstance.get(`/job/get`, {
          params: { page: 1, limit: 50 },
        });
        dispatch(setHomeJobs(res.data.jobs || []));
      } catch (error) {
        console.log("Failed to fetch home jobs", error);
        dispatch(setHomeJobs([]));
      }
    };

    fetchJobs();
  }, [dispatch]);
};

export default useGetHomeJobs;
