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
  const currentYear = new Date().getFullYear();
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
      {label: "View Applications", path: "/admin/applications"},
      { label: "Interviews", path: "/admin/interview-list" },
      { label: "Support & FAQ", path: "/faq" },
    ];
  };

  const dynamicLinks = getDynamicLinks();

  return (
    <footer className="bg-gradient-to-b from-[#1a1f2e] via-[#232b3a] to-[#1a1f2e] text-gray-400 py-16 mt-20 font-sans selection:bg-orange-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/8 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-600/8 blur-[120px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-8">
          
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white leading-snug">
                <span className="text-[#7C3AED]">Nex</span>
                <span className="bg-gradient-to-r from-[#FDE68A] via-[#FB923C] to-[#F97316] bg-clip-text text-transparent">Forge</span>
              </h2>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">NEXT-GEN HIRING PLATFORM</p>
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
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Location</p>
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
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Email</p>
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
        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Call Us</p>
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
            <div className="flex items-center gap-2 bg-gray-900/40 px-4 py-2 rounded-full border border-gray-800/40 hover:border-green-500/30 transition-all duration-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">System Live</span>
            </div>
            <p className="text-xs font-semibold text-gray-600">© {currentYear} Nexforge. All Rights Reserved.</p>
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