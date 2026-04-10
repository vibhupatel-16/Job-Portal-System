import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const EMPTY_JOBS = [];

const getShortText = (html, maxLength = 80) => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  const text = (div.textContent || div.innerText || "").trim();
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const FeaturedJobs = () => {
  const homeJobs = useSelector((store) => store.job?.homeJobs ?? EMPTY_JOBS);
  const navigate = useNavigate();
  const featured = homeJobs.slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-18">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Featured <span className="text-indigo-600">Jobs</span>
        </h2>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto">
          Hand-picked opportunities from top companies
        </p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((job, i) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            onClick={() => navigate(`/description/${job._id}`)}
            className="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-12 w-12 rounded-xl border border-gray-100 shrink-0">
                <AvatarImage src={job?.company?.logo} className="object-contain" />
              </Avatar>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                  {job?.title}
                </h3>
                <p className="text-sm text-gray-500 truncate">{job?.company?.name}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {getShortText(job?.description)}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-0">
                {job?.jobType}
              </Badge>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-0">
                {job?.salary} LPA
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-10"
      >
        <Button
          variant="outline"
          className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          onClick={() => navigate("/jobs")}
        >
          <Briefcase className="h-4 w-4 mr-2" />
          View all jobs
        </Button>
      </motion.div>
    </section>
  );
};

export default FeaturedJobs;
