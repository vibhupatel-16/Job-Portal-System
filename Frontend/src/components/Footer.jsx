import React from "react";
import { 
  FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube, 
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaArrowRight 
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0a0f1a] text-gray-400 py-16 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section: Branding & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-12 border-b border-gray-800/50">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Job<span className="text-blue-500">Portal</span>
            </h2>
            <p className="max-w-xs leading-relaxed text-sm">
              Connecting India's top talent with world-class opportunities. Your dream career is just one click away.
            </p>
          </div>
          
          {/* Newsletter - Industry Level Touch */}
          <div className="lg:col-span-2 flex flex-col md:flex-row items-center gap-4 bg-[#111827] p-6 rounded-2xl border border-gray-800">
            <div className="flex-1">
              <h4 className="text-white font-semibold">Join our Job Alert Newsletter</h4>
              <p className="text-xs">Get latest job updates directly in your inbox.</p>
            </div>
            <div className="flex w-full md:w-auto bg-gray-900 rounded-lg p-1 border border-gray-700 focus-within:border-blue-500 transition-all">
              <input 
                type="email" 
                placeholder="Enter email address" 
                className="bg-transparent px-4 py-2 outline-none text-sm w-full md:w-64 text-white"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2">
                Subscribe <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-10 py-12">
          
          {/* For Job Seekers */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">For Candidates</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="/search-jobs" className="hover:text-blue-400 transition-all flex items-center group"><span className="w-0 group-hover:w-2 h-[1px] bg-blue-400 mr-0 group-hover:mr-2 transition-all"></span>Browse Jobs</a></li>
              <li><a href="/job-alerts" className="hover:text-blue-400 transition-all">Job Alerts</a></li>
              <li><a href="/resume-tips" className="hover:text-blue-400 transition-all">Resume Builder</a></li>
              <li><a href="/faq" className="hover:text-blue-400 transition-all font-medium text-blue-500">Candidate FAQ</a></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">For Employers</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="/post-job" className="hover:text-blue-400 transition-all flex items-center group"><span className="w-0 group-hover:w-2 h-[1px] bg-blue-400 mr-0 group-hover:mr-2 transition-all"></span>Post a Job</a></li>
              <li><a href="/pricing" className="hover:text-blue-400 transition-all">Hiring Solutions</a></li>
              <li><a href="/search-candidates" className="hover:text-blue-400 transition-all">Search Talent</a></li>
              <li><a href="/faq" className="hover:text-blue-400 transition-all font-medium text-blue-500">Employer FAQ</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Company</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="/about" className="hover:text-blue-400 transition-all">Our Story</a></li>
              <li><a href="/contact" className="hover:text-blue-400 transition-all">Contact Support</a></li>
              <li><a href="/privacy" className="hover:text-blue-400 transition-all">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-blue-400 transition-all">Terms of Service</a></li>
            </ul>
          </div>

          {/* Reach Us */}
          <div className="space-y-6">
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Get In Touch</h3>
            <div className="space-y-4 text-sm">
              <p className="flex items-start gap-3"><FaMapMarkerAlt className="text-blue-500 mt-1" /> Cyber Hub, DLF Phase 3, Gurgaon, India</p>
              <p className="flex items-center gap-3"><FaPhoneAlt className="text-blue-500" /> 1800-123-4567</p>
              <p className="flex items-center gap-3"><FaEnvelope className="text-blue-500" /> help@jobportal.com</p>
            </div>
            
            {/* Social Icons with Tooltips effect */}
            <div className="flex gap-4 pt-2">
              {[
                { icon: <FaFacebookF />, color: "hover:bg-blue-600" },
                { icon: <FaTwitter />, color: "hover:bg-sky-500" },
                { icon: <FaInstagram />, color: "hover:bg-pink-600" },
                { icon: <FaLinkedinIn />, color: "hover:bg-blue-700" }
              ].map((social, index) => (
                <a key={index} href="#" className={`w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white transition-all duration-300 ${social.color} hover:-translate-y-1`}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-wide">
          <p>© {new Date().getFullYear()} JobPortal Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 italic">
            Built with <span className="text-red-500 text-lg">♥</span> for the future of work.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;