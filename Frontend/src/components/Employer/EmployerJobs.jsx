import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import EmployerJobTable from './EmployerJobTable'
import useGetAllEmployerJobs from '../hooks/useGetAllEmployerJobs'
import { setSearchJobByText } from '@/redux/jobSlice'

const EmployerJobs = () => {
   useGetAllEmployerJobs();
   const[input, setInput] = useState("")
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(setSearchJobByText(input));
    },[input])
   
  return (
    <div>
      <Navbar/>
      <div className='max-w-6xl mx-auto my-10'>
        <div className='flex justify-between items- my-5'>
        <Input
        className="w-fit"
        placeholder= "filterd by name"
        onChange={(e)=>{setInput(e.target.value)}}/>
        <Button onClick={()=>{navigate("/employer/jobs/create")}}>New Jobs</Button>
        </div>
        <EmployerJobTable/>
      </div>
    </div>
  )
}

export default EmployerJobs
