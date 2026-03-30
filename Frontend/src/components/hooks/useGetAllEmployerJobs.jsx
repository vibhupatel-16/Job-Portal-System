
import { setAllEmployerJob } from '@/redux/jobSlice'
import axiosInstance from '@/utils/axiosInstance'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllEmployerJobs = () => {
   const dispatch = useDispatch()
     useEffect(()=>{
        const fetchAllEmployerJobs = async ()=>{
         try{
            const res = await axiosInstance.get(`/job/getadminjobs`, );
            if(res.data.success) {
               dispatch(setAllEmployerJob(res.data.jobs));
            }
         }catch(error){
            console.log(error)
         }
        }
        fetchAllEmployerJobs()
     },[])
}

export default useGetAllEmployerJobs
