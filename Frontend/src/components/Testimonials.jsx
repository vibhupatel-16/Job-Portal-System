import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer",
    company: "Tech Solutions Ltd",
    content: "Found my current role in two weeks. The application process was smooth and the job recommendations were spot-on.",
    rating: 5,
    avatar: "PS",
  },
  {
    name: "Rahul Verma",
    role: "Product Manager",
    company: "StartupXYZ",
    content: "As a recruiter, we've hired 15+ candidates through this portal. Quality of applicants is consistently high.",
    rating: 5,
    avatar: "RV",
  },
  {
    name: "Anita Patel",
    role: "Frontend Developer",
    company: "Design Studio",
    content: "Saved jobs and application tracking made my job hunt stress-free. Highly recommend to every job seeker.",
    rating: 5,
    avatar: "AP",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">What people say about us</h2>
          <p className="mt-2 text-slate-300 max-w-xl mx-auto">
            Real stories from job seekers and recruiters
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors duration-300"
            >
              <Quote className="h-8 w-8 text-indigo-300/80 mb-4" />
              <p className="text-slate-200 leading-relaxed mb-4">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-semibold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-slate-400">
                    {t.role} at {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
