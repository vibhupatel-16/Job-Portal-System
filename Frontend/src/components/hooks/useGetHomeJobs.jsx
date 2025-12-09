import { setHomeJobs } from "@/redux/jobSlice";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const useGetHomeJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get(`${JOB_API_END_POINT}/get?page=1&limit=50`);
      dispatch(setHomeJobs(res.data.jobs));
    };

    fetchJobs();
  }, []);
};

export default useGetHomeJobs;
