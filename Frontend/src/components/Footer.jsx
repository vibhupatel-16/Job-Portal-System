import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter,
  FaApple, FaGooglePlay, FaArrowRight, FaMapMarkerAlt,
  FaEnvelope, FaPhoneAlt, FaGlobe,
} from "react-icons/fa";
import SupportModal from "./SupportModal";

const Footer = () => {
  const { user } = useSelector(store => store.auth);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Dynamic routing maps
  const getDynamicLinks = () => {
    if (!user) {
      return [
        { label: "Browse Jobs", path: "/browse" },
        { label: "Register Account", path: "/signup" },
        { label: "Employer Login", path: "/employer-login" },
        { label: "Support & FAQ", path: "/faq" },
      ];
    }
    
    if (user.role === 'employer') {
      return [
        { label: "Employer Dashboard", path: "/employer/dashboard" },
        { label: "Manage My Jobs", path: "/employer/jobs" },
        { label: "Manage Companies", path: "/employer/companies" },
        { label: "Employer FAQ", path: "/employer/faq" },
      ];
    }

    // Default to Jobseeker (student)
    return [
      { label: "Browse Jobs", path: "/jobs" },
      {label: "View Applications", path: "/profile"},
      { label: "Interviews", path: "/jobseeker/interviews" },
      { label: "Support & FAQ", path: "/faq" },
    ];
  };

  const dynamicLinks = getDynamicLinks();

  return (
    <footer className="bg-[#132138] text-gray-400 py-16 mt-20 font-sans selection:bg-orange-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-8">
          
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <Link to="/" className="inline-flex items-center rounded-2xl bg-white/95 px-5 py-2 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.45)] ring-1 ring-white/30">
                <img 
                  src="/logo.png" 
                  alt="NexForge Logo" 
                  className="block h-14 sm:h-16 md:h-18 lg:h-20 w-auto max-w-[280px] object-contain"
                />
              </Link>
              <p className="text-xs font-bold uppercase tracking-widest text-white mt-3">NEXT-GEN HIRING PLATFORM</p>
            </div>

            <p className="text-sm leading-relaxed text-gray-300 font-medium max-w-sm">
              Empowering careers through intelligent job matching. Connect with thousands of opportunities and build your future with us.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { Icon: FaLinkedinIn, link: "https://in.linkedin.com/company/nexforge-technology-pvt-ltd", color: "hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-700/50" },
                
              ].map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.link} 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className={`w-11 h-11 rounded-lg bg-gray-900/60 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 border border-gray-800/50 hover:border-gray-700 transform hover:scale-110 ${item.color}`}
                >
                  <item.Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.15em] border-l-3 border-orange-500 pl-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              {dynamicLinks.map((link, i) => (
               <li key={i}>
                 <Link 
                   to={link.path} 
                   className="text-gray-400 hover:text-orange-500 transition-all duration-300 flex items-center gap-2 group hover:translate-x-1"
                 >
                   <FaArrowRight size={11} className="opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all"/> 
                   <span>{link.label}</span>
                 </Link>
               </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.15em] border-l-3 border-orange-500 pl-4">Get In Touch</h4>
            <div className="space-y-4 text-sm">
              {/* Location */}
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-gray-900/70 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform border border-gray-800 flex-shrink-0">
                  <FaMapMarkerAlt size={16}/>
                </div>
                <div className="pt-1">
                  <p className="text-xs text-white font-semibold uppercase tracking-wide mb-1">Location</p>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Aries+Galleria+Vasna+Main+Road+Vadodara" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-orange-400 transition-colors leading-relaxed text-xs"
                  >
                    Nexforge<br/>
                    502/503 Aries Galleria<br/>
                    Near Taksh Complex, Vasna Main Road<br/>
                    Vadodara, Gujarat - 390007
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-gray-900/70 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform border border-gray-800 flex-shrink-0">
                  <FaEnvelope size={16}/>
                </div>
                <div>
                  <p className="text-xs text-white font-semibold uppercase tracking-wide mb-1">Email</p>
                  <a 
                    href="mailto:info@nexforge.tech" 
                    className="text-gray-400 hover:text-orange-400 transition-colors text-xs"
                  >
                    info@nexforge.tech
                  </a>
                </div>
              </div>

              {/* Phone Number (Newly Added) */}
    <div className="flex items-center gap-4 group">
      <div className="w-10 h-10 rounded-lg bg-gray-900/70 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform border border-gray-800 flex-shrink-0">
        <FaPhoneAlt size={14}/>
      </div>
      <div>
        <p className="text-xs text-white font-semibold uppercase tracking-wide mb-1">Call Us</p>
        <a 
          href="tel:+919876543210" 
          className="text-gray-400 hover:text-orange-400 transition-colors text-xs font-medium"
        >
          +91 9624158696
        </a>
      </div>
    </div>
            </div>
          </div>

   

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-900/50 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-6">
            <a href="https://nexforge.tech" target="_blank" rel="noopener noreferrer" className="text-m font-semibold text-gray-300 hover:text-gray-100 transition-colors">
              https://nexforge.tech
            </a>
          </div>

        <div className="flex gap-6">
  <Link to="/privacy-policy" className="hover:text-orange-400 transition-colors duration-300">Privacy Policy</Link>
  <Link to="/terms" className="hover:text-orange-400 transition-colors duration-300">Terms of Service</Link>
  <Link to="/cookies" className="hover:text-orange-400 transition-colors duration-300">Cookie Policy</Link>
  <button
    onClick={() => setIsSupportModalOpen(true)}
    className="hover:text-orange-400 transition-colors duration-300 cursor-pointer"
  >
    Contact Support
  </button>
</div>

        </div>

      </div>

      {/* Support Modal */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </footer>
  );
};

export default Footer;