import { setCompanies } from '@/redux/companySlice'
import axiosInstance from '@/utils/axiosInstance'
import  { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllCompanies = () => {
   const dispatch = useDispatch()
     useEffect(()=>{
        const fetchCompanies = async ()=>{
         try{
            const res = await axiosInstance.get(`/company/get`);
            console.log(res)
            if(res.data.success) {
               dispatch(setCompanies(res.data.companies));
            }
         }catch(error){
            console.log(error)
         }
        }
        fetchCompanies()
     },[])
}

export default useGetAllCompanies
