import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, Database, Globe, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';



const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <Eye className="text-indigo-600" size={24} />,
      title: "Information We Collect",
      content: "We collect personal data such as your name, email, and phone number during registration. For profiles, we store resumes and photos securely via Cloudinary to help match you with the right opportunities."
    },
    {
      icon: <Database className="text-blue-600" size={24} />,
      title: "How We Use Your Data",
      content: "Your data is used for account authentication (OTP), interview scheduling, and sending job alerts. We ensure that your resume is only visible to employers when you explicitly apply for a position."
    },
    {
      icon: <Lock className="text-purple-600" size={24} />,
      title: "Data Security",
      content: "Security is our priority. We use Bcrypt for password hashing and JSON Web Tokens (JWT) for secure session management. Your sensitive information is never stored in plain text."
    },
    {
      icon: <Globe className="text-teal-600" size={24} />,
      title: "Cookies & Tracking",
      content: "We use essential cookies to keep you logged in and improve your browsing experience. These are secure, HTTP-only cookies that protect your session from unauthorized access."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
    
      
      {/* Hero Section */}
      <div className="relative py-20 bg-white overflow-hidden border-b border-slate-200">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-100"
          >
            <ShieldCheck size={14} /> Trust & Safety
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            At <span className="text-indigo-600 font-bold">Nexforge</span>, we value your trust. This policy explains how we protect your personal journey on our platform.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid gap-8">
          {sections.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {item.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
    

        <div className="mt-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
          Last Updated: March 31, 2026
        </div>
      </div>

      
    </div>
  );
};

export default PrivacyPolicy;