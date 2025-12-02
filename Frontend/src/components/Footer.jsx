import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-8">

        {/* Column 1: Branding + Desc */}
        <div className="col-span-1 space-y-3">
          <h2 className="text-3xl font-bold text-white">JobPortal</h2>
          <p className="text-gray-400 text-sm">
            Connecting talent with opportunity across India and beyond. Create your profile, explore jobs, and find the right fit easily.
          </p>
        </div>

        {/* Column 2: Job Seekers */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">For Job Seekers</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="/signup" className="hover:text-white transition-colors duration-300">Create Account</a></li>
            <li><a href="/search-jobs" className="hover:text-white transition-colors duration-300">Search Jobs</a></li>
            <li><a href="/job-alerts" className="hover:text-white transition-colors duration-300">Job Alerts</a></li>
            <li><a href="/resume-tips" className="hover:text-white transition-colors duration-300">Resume Tips</a></li>
          </ul>
        </div>

        {/* Column 3: Employers / Companies */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">For Employers</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="/post-job" className="hover:text-white transition-colors duration-300">Post a Job</a></li>
            <li><a href="/pricing" className="hover:text-white transition-colors duration-300">Pricing & Plans</a></li>
            <li><a href="/search-candidates" className="hover:text-white transition-colors duration-300">Search Candidates</a></li>
            <li><a href="/employer-login" class className="hover:text-white transition-colors duration-300">Employer Login</a></li>
          </ul>
        </div>

        {/* Column 4: Support & Resources */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Resources</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="/about" className="hover:text-white transition-colors duration-300">About Us</a></li>
            <li><a href="/faq" className="hover:text-white transition-colors duration-300">FAQ</a></li>
            <li><a href="/blog" className="hover:text-white transition-colors duration-300">Career Advice</a></li>
            <li><a href="/contact" className="hover:text-white transition-colors duration-300">Contact Us</a></li>
            <li><a href="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-white transition-colors duration-300">Terms of Service</a></li>
          </ul>
        </div>

        {/* Column 5: Contact + Social */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">Connect With Us</h3>
          <div className="flex space-x-4 text-2xl">
            <a href="https://facebook.com" className="hover:text-blue-500 transition transform hover:scale-110"><FaFacebook /></a>
            <a href="https://twitter.com" className="hover:text-sky-400 transition transform hover:scale-110"><FaTwitter /></a>
            <a href="https://instagram.com" className="hover:text-pink-500 transition transform hover:scale-110"><FaInstagram /></a>
            <a href="https://linkedin.com" className="hover:text-blue-400 transition transform hover:scale-110"><FaLinkedin /></a>
            <a href="#" className="hover:text-red-500 transition transform hover:scale-110"><FaYoutube /></a>
          </div>
          <div className="text-gray-400 text-sm space-y-1">
            <p className="flex items-center"><FaPhone className="mr-2" />1800‑123‑4567</p>
            <p className="flex items-center"><FaEnvelope className="mr-2" />support@jobportal.com</p>
          </div>
        </div>

      </div>

      {/* Bottom / Footer bar */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
        <p>Designed with ❤️ to help you land your dream job.</p>
      </div>

    </footer>
  );
};

export default Footer;
