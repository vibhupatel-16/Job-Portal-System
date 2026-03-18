import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  UserCircle,
  Briefcase,
  Bookmark,
  Calendar,
  FileText,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import useGetAppliedJobs from "../hooks/useGetAppliedJob";
import TestimonialFeedbackForm from "@/components/shared/TestimonialFeedbackForm";

const StatCard = ({ title, value, icon: Icon, path, pathLabel }) => (
  <Link
    to={path}
    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
    <span className="mt-3 sm:mt-0 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
      {pathLabel}
      <ChevronRight className="h-4 w-4" />
    </span>
  </Link>
);

const JobSeekerDashboard = () => {
  useGetAppliedJobs();
  const { user } = useSelector((store) => store.auth);
  const appliedJobs = useSelector((store) => store.job?.allAppliedJobs || []);

  const appliedCount = appliedJobs?.length ?? 0;
  const savedCount = user?.savedJobs?.length ?? 0;

  const statusCounts = React.useMemo(() => {
    const counts = { pending: 0, shortlisted: 0, accepted: 0, rejected: 0 };
    (appliedJobs || []).forEach((app) => {
      const s = (app?.status || "pending").toLowerCase();
      if (counts[s] !== undefined) counts[s]++;
    });
    return counts;
  }, [appliedJobs]);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, <span className="text-indigo-600">{user?.fullname?.split(" ")[0] || "there"}</span>
        </h1>
        <p className="mt-1 text-gray-600">Manage your profile and track applications</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Applied Jobs"
          value={appliedCount}
          icon={Briefcase}
          path="/profile"
          pathLabel="View"
        />
        <StatCard
          title="Saved Jobs"
          value={savedCount}
          icon={Bookmark}
          path="/saved-jobs"
          pathLabel="View"
        />
        <StatCard
          title="My Profile"
          value="Edit"
          icon={UserCircle}
          path="/profile"
          pathLabel="Manage"
        />
        <StatCard
          title="Interviews"
          value="Schedule"
          icon={Calendar}
          path="/jobseeker/interviews"
          pathLabel="View"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          Application status overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Pending", value: statusCounts.pending, color: "bg-slate-100 text-slate-700" },
            { label: "Shortlisted", value: statusCounts.shortlisted, color: "bg-violet-100 text-violet-700" },
            { label: "Accepted", value: statusCounts.accepted, color: "bg-emerald-100 text-emerald-700" },
            { label: "Rejected", value: statusCounts.rejected, color: "bg-red-100 text-red-700" },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl px-4 py-3 text-center ${item.color}`}
            >
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs font-medium opacity-90">{item.label}</p>
            </div>
          ))}
        </div>
        <Link
          to="/profile"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline"
        >
          <FileText className="h-4 w-4" />
          View full application history
        </Link>
      </motion.div>

      {/* Same feedback UI as Employer */}
      <TestimonialFeedbackForm
        submitPath="/testimonials/submit/jobseeker"
        placeholder="Tell us how we helped you find your dream job..."
      />
    </div>
  );
};

export default JobSeekerDashboard;
