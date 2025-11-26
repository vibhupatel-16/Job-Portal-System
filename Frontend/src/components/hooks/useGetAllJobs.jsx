import { setAllJob } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector(store => store.job);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        // Clear old jobs before fetching
        dispatch(setAllJob([]));

        const query = searchedQuery?.trim() || "";

        const res = await axios.get(
          `${JOB_API_END_POINT}/get?keyword=${encodeURIComponent(query)}`,
          { withCredentials: true }
        );

        if (res.data.success && res.data.jobs) {
          dispatch(setAllJob(res.data.jobs));
        } else {
          // Agar koi job nahi hai to bhi clear kar do
          dispatch(setAllJob([]));
        }

      } catch (error) {
        console.log("Error fetching jobs:", error);
        dispatch(setAllJob([])); // Error case me bhi clear kar do
      }
    };

    fetchAllJobs();
  }, [searchedQuery, dispatch]);
};


export default useGetAllJobs;
