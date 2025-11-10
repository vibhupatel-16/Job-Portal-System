import React from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousal from './CategoryCarousal'
import LatestJobs from './LatestJobs'
import Footer from './Footer'

function Home() {
  return (
    <div>
         <Navbar/>
         <HeroSection/>
         <CategoryCarousal/>
         <LatestJobs/>
         <Footer/>
    </div>
  )
}

export default Home