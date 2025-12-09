import React, { useEffect } from 'react'
import HeroSection from './HeroSection'
import CategoryCarousal from './CategoryCarousal'
import LatestJobs from './LatestJobs'

import { useSelector } from 'react-redux'
import useGetHomeJobs from './hooks/useGetHomeJobs'
// import { useNavigate } from 'react-router-dom'

function Home() {
  useGetHomeJobs()
  const {user} = useSelector(store=>store.auth);
  // const navigate = useNavigate();
  useEffect(()=>{
    // if(user.role === "employer"){
    //   navigate("/employer/companies");
    // }
   
  },[])
  return (
    <div>
         
         <HeroSection/>
         <CategoryCarousal/>
         <LatestJobs/>
         
    </div>
  )
}

export default Home