import React from "react";
import HeroSection from "./HeroSection";
import CategoryCarousal from "./CategoryCarousal";
import FeaturedJobs from "./FeaturedJobs";
import LatestJobs from "./LatestJobs";
import useGetHomeJobs from "./hooks/useGetHomeJobs";
import { useSelector } from "react-redux";
import RecommendedJobs from "./RecommendedJobs";
import Testimonials from "./Testimonials";
import CompanyLogos from "./CompanyLogos";

function Home() {
  useGetHomeJobs();
  const { user } = useSelector((store) => store.auth);

  return (
    <div>
      <HeroSection />
      <CategoryCarousal />
      <FeaturedJobs />
      {user && <RecommendedJobs />}
      <LatestJobs />
      <Testimonials />
      <CompanyLogos />
    </div>
  );
}

export default Home;
