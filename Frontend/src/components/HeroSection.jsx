import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery, setFilter } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function HeroSection() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    dispatch(setFilter({ location: "", category: "", jobType: "", salary: "", experience: "" }));
    setTimeout(() => navigate("/browse"), 200);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236A38C2' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6"
          >
            Find your next opportunity
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight"
          >
            Search, Apply & Get Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Dream Job
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Discover the right job for you and take the next step in your career journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 sm:mt-10 max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 shadow-xl rounded-2xl bg-white border border-gray-200/80 p-2 sm:pl-5 sm:pr-2 sm:py-2">
              <input
                type="text"
                placeholder="Job title, Location, or Company"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchJobHandler()}
                className="flex-1 outline-none border-none px-4 py-3 sm:py-2.5 text-gray-900 placeholder-gray-400 rounded-xl sm:rounded-none sm:rounded-l-full"
              />
              <Button
                onClick={searchJobHandler}
                className="rounded-xl sm:rounded-r-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 sm:py-2.5 transition-all duration-200 shadow-lg shadow-indigo-500/25"
              >
                <Search className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:inline">Search Jobs</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
