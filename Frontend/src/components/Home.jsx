import React from 'react'
import HeroSection from './HeroSection'
import CategoryCarousal from './CategoryCarousal'
import LatestJobs from './LatestJobs'
import useGetHomeJobs from './hooks/useGetHomeJobs'
import { useSelector } from 'react-redux'
import RecommendedJobs from './RecommendedJobs'

function Home() {
  useGetHomeJobs();
  const { user } = useSelector(store => store.auth);

  return (
    <div>
      <HeroSection/>
      <CategoryCarousal/>
      <RecommendedJobs/>
      <LatestJobs/>
    </div>
  )
}

export default Home;
