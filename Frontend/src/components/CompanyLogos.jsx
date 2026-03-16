import React from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

const placeholderCompanies = [
  "TechCorp",
  "InnovateLabs",
  "DataDrive",
  "CloudNine",
  "NextGen",
  "ScaleUp",
];

const CompanyLogos = () => {
  return (
    <section className="py-12 lg:py-16 border-t border-gray-100 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-8"
        >
          Trusted by companies worldwide
        </motion.p>
        <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-14 lg:gap-18">
          {placeholderCompanies.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors duration-300"
            >
              <Building2 className="h-8 w-8" />
              <span className="text-lg font-semibold tracking-tight">{name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyLogos;
