import React from 'react'
import HeroSection from './HeroSection'
import CategoryCarousal from './CategoryCarousal'
import LatestJobs from './LatestJobs'
import useGetHomeJobs from './hooks/useGetHomeJobs'
import { useSelector } from 'react-redux'

function Home() {
  useGetHomeJobs();
  const { user } = useSelector(store => store.auth);

  return (
    <div>
      <HeroSection/>
      <CategoryCarousal/>
      <LatestJobs/>
    </div>
  )
}

export default Home;
