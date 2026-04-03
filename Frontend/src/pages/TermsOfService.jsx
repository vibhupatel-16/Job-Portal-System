import React from 'react';
import { motion } from 'framer-motion';
import { Scale, UserCheck, AlertCircle, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';


const TermsOfService = () => {
  const terms = [
    {
      icon: <UserCheck className="text-orange-600" size={24} />,
      title: "User Eligibility",
      content: "Users must be at least 18 years old to register. You agree to provide accurate, current, and complete information during the registration process on Nexforge."
    },
    {
      icon: <AlertCircle className="text-red-600" size={24} />,
      title: "Prohibited Conduct",
      content: "Users are prohibited from posting fake job openings, uploading malicious code, or attempting to scrape data. Any misuse will lead to immediate account termination."
    },
    {
      icon: <Scale className="text-indigo-600" size={24} />,
      title: "Intellectual Property",
      content: "All content, logos, and software on this portal are the property of Nexforge Technology and Dharma Infosystem. Unauthorized reproduction is strictly prohibited."
    },
    {
      icon: <FileText className="text-green-600" size={24} />,
      title: "Limitation of Liability",
      content: "While we strive for 100% accuracy, Nexforge is not liable for any discrepancies in job postings or user-generated content provided by third-party employers."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      
      <div className="relative py-20 bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-slate-600 font-medium">Please read these terms carefully before using our platform.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid gap-6">
          {terms.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 flex gap-5 items-start"
            >
              <div className="p-3 bg-slate-50 rounded-xl">{item.icon}</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default TermsOfService;