import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter,
  FaApple, FaGooglePlay, FaArrowRight, FaMapMarkerAlt,
  FaEnvelope, FaPhoneAlt, FaGlobe,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#05070A] text-gray-400 py-20 mt-20 font-sans selection:bg-orange-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 pb-20">
          
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-900/20 rotate-3">
                <span className="text-white font-black text-2xl tracking-tighter">J</span>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter leading-none">
                  JOB<span className="text-orange-500">PORTAL</span>
                </h2>
                <span className="text-[10px] text-gray-600 font-bold tracking-[0.3em] uppercase">Next-Gen Hiring</span>
              </div>
            </div>
            
            <p className="text-sm leading-relaxed text-gray-500 font-medium max-w-xs">
              Empowering careers through intelligent matching. Join 2M+ professionals finding their dream roles daily.
            </p>

            <div className="flex gap-3">
              {[
                { Icon: FaLinkedinIn, link: "#", color: "hover:bg-blue-700" },
                { Icon: FaTwitter, link: "#", color: "hover:bg-sky-500" },
                { Icon: FaInstagram, link: "#", color: "hover:bg-pink-600" },
                { Icon: FaFacebookF, link: "#", color: "hover:bg-blue-600" }
              ].map((item, idx) => (
                <a key={idx} href={item.link} className={`w-10 h-10 rounded-xl bg-gray-900/50 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 border border-gray-800/50 ${item.color}`}>
                  <item.Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] border-l-2 border-orange-500 pl-3">Platform</h4>
            <ul className="space-y-4 text-sm font-semibold">
              <li><Link to="/browse" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><FaArrowRight size={10} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all"/> Browse Jobs</Link></li>
              <li><Link to="/browse" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><FaArrowRight size={10} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all"/> Top Companies</Link></li>
              <li><Link to="/jobseeker/interviews" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><FaArrowRight size={10} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all"/> For Candidates</Link></li>
              <li><Link to="/faq" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><FaArrowRight size={10} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all"/> FAQ</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] border-l-2 border-orange-500 pl-3">Contact Support</h4>
            <div className="space-y-5 text-sm font-medium">
              <div className="flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform"><FaMapMarkerAlt size={14}/></div>
                <span className="text-gray-500">Titanium Square, S.G. Highway,<br/>Surat, Gujarat - 395009</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform"><FaEnvelope size={14}/></div>
                <a href="mailto:hello@jobportal.com" className="text-gray-500 hover:text-white transition-colors">hello@jobportal.com</a>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform"><FaPhoneAlt size={14}/></div>
                <span className="text-gray-500">+91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Column 4: App Download */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] border-l-2 border-orange-500 pl-3">Mobile Ecosystem</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">Experience seamless job hunting on the go. Download our official apps.</p>
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-4 bg-gray-900/50 border border-gray-800 p-3 rounded-2xl hover:bg-orange-600 hover:border-orange-600 group transition-all duration-500">
                <FaApple size={28} className="text-white" />
                <div className="text-left">
                  <p className="text-[9px] uppercase font-bold text-gray-500 group-hover:text-orange-100">Coming soon on</p>
                  <p className="text-sm font-black text-white">App Store</p>
                </div>
              </button>
              <button className="flex items-center gap-4 bg-gray-900/50 border border-gray-800 p-3 rounded-2xl hover:bg-orange-600 hover:border-orange-600 group transition-all duration-500">
                <FaGooglePlay size={24} className="text-white" />
                <div className="text-left">
                  <p className="text-[9px] uppercase font-bold text-gray-500 group-hover:text-orange-100">Download for</p>
                  <p className="text-sm font-black text-white">Google Play</p>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">System Live</span>
            </div>
            <p className="text-[11px] font-bold text-gray-600">© {currentYear} JOBPORTAL INDIA</p>
          </div>

          <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
            <div className="flex items-center gap-2 text-gray-700">
              <FaGlobe />
              <span>EN-IN</span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;