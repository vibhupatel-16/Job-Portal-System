import { setAllAppliedJobs } from "@/redux/jobSlice";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axiosInstance.get(`/application/get`);
        if (res.data.success) {
          dispatch(setAllAppliedJobs(res.data.application || []));
        }
      } catch (error) {
        console.log(error);
        dispatch(setAllAppliedJobs([]));
      }
    };

    fetchAppliedJobs();
  }, [dispatch]);
};

export default useGetAppliedJobs;