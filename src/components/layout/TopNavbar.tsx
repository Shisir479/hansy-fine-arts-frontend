"use client";

import { Facebook, Instagram, Youtube } from "lucide-react";
import React from "react";
import { FaTiktok } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";

const TopNavbar: React.FC = () => {
  return (
    <div className="md:max-w-11/2 flex justify-between items-center md:py-4 md:px-6 py-3 px-2 border-b border-gray-200 mx-auto">
      
      {/* Social Icons */}
      <div className="flex items-center md:space-x-4 space-x-2">
        <span className="md:text-lg text-sm font-bold text-slate-800">Follow Us:</span>

        {/* Instagram */}
        <a href="http://www.instagram.com/@YaeggyArt" target="_blank" rel="noopener noreferrer">
          <Instagram className="md:text-2xl text-xl" style={{ color: "#E4405F" }} />
        </a>

        {/* Facebook */}
        <a href="http://www.facebook.com/YaeggyArt" target="_blank" rel="noopener noreferrer">
          <Facebook className="md:text-2xl text-xl" style={{ color: "#1877F2" }} />
        </a>

        {/* YouTube */}
        <a href="http://www.youtube.com/@YaeggyArt" target="_blank" rel="noopener noreferrer">
          <Youtube className="md:text-2xl text-xl" style={{ color: "#FF0000" }} />
        </a>

        {/* TikTok */}
        <a href="https://www.tiktok.com/@yaeggyart" target="_blank" rel="noopener noreferrer">
          <FaTiktok
            className="md:text-2xl text-xl"
            style={{
              color: "#000000",
              filter: "drop-shadow(1px 1px 0px #00F2EA) drop-shadow(-1px -1px 0px #FF0050)",
            }}
          />
        </a>
      </div>

      {/* Phone */}
      <div className="flex items-center md:space-x-2 space-x-1">
        <FaPhoneAlt className="md:text-2xl text-xl" style={{ color: "#34A853" }} />
        <span className="md:text-base text-sm text-slate-800 font-bold">
          +1 (409) 987-5874
        </span>
      </div>

    </div>
  );
};

export default TopNavbar;
