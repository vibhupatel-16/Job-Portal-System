import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1 */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">JobPortal</h2>
          <p className="text-sm">
            Connecting talent with opportunity. Find your dream job or your next
            great hire here.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/jobs" className="hover:text-white">Jobs</a></li>
            <li><a href="/companies" className="hover:text-white">Companies</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/faq" className="hover:text-white">FAQ</a></li>
            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="https://facebook.com" className="hover:text-blue-500"><FaFacebook /></a>
            <a href="https://twitter.com" className="hover:text-sky-400"><FaTwitter /></a>
            <a href="https://instagram.com" className="hover:text-pink-500"><FaInstagram /></a>
            <a href="https://linkedin.com" className="hover:text-blue-400"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      <div className="text-center border-t border-gray-700 mt-10 pt-5 text-sm text-gray-400">
        © {new Date().getFullYear()} JobPortal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
