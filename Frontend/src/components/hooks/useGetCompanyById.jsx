import { setSingleCompany } from '@/redux/companySlice'
import axiosInstance from '@/utils/axiosInstance'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetCompanyById = (companyId) => {
   const dispatch = useDispatch()
     useEffect(()=>{
        const fetchSingleCompany = async ()=>{
         try{
            const res = await axiosInstance.get(`/company/get/${companyId}`, );
            if(res.data.success) {
               dispatch(setSingleCompany(res.data.company));
            }
         }catch(error){
            console.log(error)
         }
        }
        fetchSingleCompany()
     },[companyId, dispatch])
}

export default useGetCompanyById
