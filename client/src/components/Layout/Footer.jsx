import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] text-ns-gray-1 py-12 border-t border-ns-dark-3 mt-12">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="flex gap-6 mb-8 text-white">
          <FaFacebookF className="text-xl cursor-pointer hover:text-ns-gray-1 transition-colors" />
          <FaInstagram className="text-xl cursor-pointer hover:text-ns-gray-1 transition-colors" />
          <FaTwitter className="text-xl cursor-pointer hover:text-ns-gray-1 transition-colors" />
          <FaYoutube className="text-xl cursor-pointer hover:text-ns-gray-1 transition-colors" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm">
          <div className="flex flex-col gap-3">
            <span className="hover:underline cursor-pointer">Audio Description</span>
            <span className="hover:underline cursor-pointer">Investor Relations</span>
            <span className="hover:underline cursor-pointer">Legal Notices</span>
          </div>
          <div className="flex flex-col gap-3">
            <span className="hover:underline cursor-pointer">Help Center</span>
            <span className="hover:underline cursor-pointer">Jobs</span>
            <span className="hover:underline cursor-pointer">Cookie Preferences</span>
          </div>
          <div className="flex flex-col gap-3">
            <span className="hover:underline cursor-pointer">Gift Cards</span>
            <span className="hover:underline cursor-pointer">Terms of Use</span>
            <span className="hover:underline cursor-pointer">Corporate Information</span>
          </div>
          <div className="flex flex-col gap-3">
            <span className="hover:underline cursor-pointer">Media Center</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span className="hover:underline cursor-pointer">Contact Us</span>
          </div>
        </div>
        
        <div className="mb-4">
          <button className="border border-ns-gray-1 px-3 py-1 text-sm hover:text-white transition-colors">
            Service Code
          </button>
        </div>
        
        <p className="text-xs">&copy; 2026 NetStream, Inc.</p>
      </div>
    </footer>
  );
};

export default Footer;
