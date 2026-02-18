import React from "react";
import { 
  FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, 
  FaApple, FaGooglePlay 
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-[#444] py-16 mt-20 border-t border-gray-100 font-sans tracking-tight">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12">
          
          {/* Brand Identity Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <h2 className="text-2xl font-bold text-[#111] tracking-tighter">
                Job<span className="text-blue-600">Portal</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 max-w-sm">
              Discover your next career move with India’s most trusted job community. 
              We connect the right talent with the right opportunities, seamlessly.
            </p>
            <div className="space-y-3 pt-2">
              <p className="text-[13px] font-bold uppercase text-gray-400 tracking-widest">Connect with us</p>
              <div className="flex gap-3">
                {[
                  { icon: <FaFacebookF />, hover: "hover:bg-blue-600" },
                  { icon: <FaTwitter />, hover: "hover:bg-sky-500" },
                  { icon: <FaInstagram />, hover: "hover:bg-pink-600" },
                  { icon: <FaLinkedinIn />, hover: "hover:bg-blue-800" }
                ].map((social, index) => (
                  <a key={index} href="#" className={`w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 transition-all duration-300 hover:text-white ${social.hover} hover:-translate-y-1 shadow-sm`}>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links Group */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="text-[13px] font-bold text-gray-900 uppercase tracking-widest">Company</h4>
              <ul className="text-[14px] space-y-3">
                <li><a href="#" className="hover:text-blue-600 hover:pl-1 transition-all">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600 hover:pl-1 transition-all">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600 hover:pl-1 transition-all">Sitemap</a></li>
                <li><a href="#" className="hover:text-blue-600 hover:pl-1 transition-all text-blue-600 font-medium">Contact Support</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[13px] font-bold text-gray-900 uppercase tracking-widest">Resources</h4>
              <ul className="text-[14px] space-y-3">
                <li><a href="#" className="hover:text-blue-600 hover:pl-1 transition-all">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 hover:pl-1 transition-all">Fraud Alert</a></li>
                <li><a href="#" className="hover:text-blue-600 hover:pl-1 transition-all">Trust & Safety</a></li>
                <li><a href="#" className="hover:text-blue-600 hover:pl-1 transition-all">Grievances</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[13px] font-bold text-gray-900 uppercase tracking-widest">Legal</h4>
              <ul className="text-[14px] space-y-3">
                <li><a href="#" className="hover:text-blue-600 hover:pl-1 transition-all">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 hover:pl-1 transition-all">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-blue-600 hover:pl-1 transition-all">Security</a></li>
              </ul>
            </div>
          </div>

          {/* Premium CTA Section */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h4 className="text-gray-900 font-bold text-lg leading-tight">Apply on the go</h4>
              <p className="text-xs text-gray-500 mt-1 mb-6">Get real-time updates for new jobs</p>
              
              <div className="flex flex-col gap-3">
                <button className="flex items-center gap-3 bg-[#111] text-white px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-all shadow-md group">
                  <FaGooglePlay className="text-xl" />
                  <div className="text-left">
                    <p className="text-[9px] uppercase leading-none opacity-70">Get it on</p>
                    <p className="text-[13px] font-semibold leading-none">Google Play</p>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 bg-white border border-gray-300 text-[#111] px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all shadow-sm group">
                  <FaApple className="text-2xl" />
                  <div className="text-left">
                    <p className="text-[9px] uppercase leading-none opacity-70">Download on the</p>
                    <p className="text-[13px] font-semibold leading-none">App Store</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4"></div>

        {/* Bottom Bar: Copyright & Micro-Branding */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <span className="text-xl font-black text-gray-200 tracking-widest uppercase italic select-none">PORTAL.CORE</span>
            <div className="text-[11px] text-gray-400">
              <p>© {currentYear} JobPortal. Built for the future of recruitment.</p>
              <p>All trademarks and logos are properties of their respective owners.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Our Ecosystem</span>
             <div className="flex gap-4 font-bold text-sm">
               <span className="cursor-default">HireFlow</span>
               <span className="cursor-default">TalentSync</span>
               <span className="cursor-default">ResumePro</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;