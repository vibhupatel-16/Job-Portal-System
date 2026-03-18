import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { Skeleton } from "@/components/ui/skeleton";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "U";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
};

const formatRole = (role) => {
  const r = (role || "").toString().toLowerCase();
  if (r === "jobseeker") return "Job Seeker";
  if (r === "employer") return "Employer";
  return "User";
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]); // Initialized as Array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        // 1. URL check karein (index.js wali spelling: testinomial)
        const res = await axiosInstance.get("/testimonials/approved");
        
        // 2. Data check karein
        if (res.data.success && Array.isArray(res.data.testimonials)) {
          setTestimonials(res.data.testimonials);
        }
      } catch (err) {
        console.error("Error fetching testimonials", err);
        setTestimonials([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);
  return (
    <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors duration-300"
              >
                <Skeleton className="h-8 w-8 rounded-full bg-white/10 mb-4" />
                <Skeleton className="h-4 w-full bg-white/10 mb-2" />
                <Skeleton className="h-4 w-5/6 bg-white/10 mb-2" />
                <Skeleton className="h-4 w-4/6 bg-white/10 mb-6" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-4 bg-white/10" />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-28 bg-white/10 mb-2" />
                    <Skeleton className="h-3 w-40 bg-white/10" />
                  </div>
                </div>
              </div>
            ))
          ) : Array.isArray(testimonials) && testimonials.length > 0 ? (
            testimonials.slice(0, 3).map((t, i) => {
              const name = t?.user?.fullname || "Anonymous";
              const initials = getInitials(name);
              const role = formatRole(t?.role || t?.user?.role);
              const rating = Math.max(1, Math.min(5, Number(t?.rating || 5)));

              return (
              <motion.div
                key={t._id || i} // Name ki jagah _id use karna better hai
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors duration-300"
              >
                <Quote className="h-8 w-8 text-indigo-300/80 mb-4" />
                <p className="text-slate-200 leading-relaxed mb-4">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-semibold uppercase">
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-slate-400">{role}</p>
                  </div>
                </div>
              </motion.div>
              );
            })
          ) : (
            <div className="col-span-3 text-center text-slate-400">
              No testimonials available yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;