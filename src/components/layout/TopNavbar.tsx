"use client";

import { Facebook, Instagram, Youtube } from "lucide-react";
import React from "react";
import { FaTiktok } from "react-icons/fa6";
import { IoLogoYoutube } from "react-icons/io5";
import {FaPhoneAlt } from "react-icons/fa";
const TopNavbar: React.FC = () => {
  return (
    <div className="max-w-11/2 flex justify-between items-center py-4 px-6 border-b border-gray-200 mx-auto">
      {/* Social Icons */}
      <div className="flex items-center space-x-4">
        <span className="text-lg font-bold text-slate-800">Follow Us:</span>

        <a
          href="http://www.instagram.com/@YaeggyArt"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram className="text-2xl text-[#b09f7b] hover:text-[#e9c475]" />
        </a>

        <a
          href="http://www.facebook.com/YaeggyArt"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="text-2xl text-[#b09f7b] hover:text-[#e9c475]" />
        </a>

        <a
          href="http://www.youtube.com/@YaeggyArt"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Youtube className="text-2xl text-[#b09f7b] hover:text-[#e9c475]" />
        </a>

        <a
          href="https://www.tiktok.com/@yaeggyart?_t=ZT-8sMIBRUmk2s&_r=1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTiktok className="text-2xl text-[#b09f7b] hover:text-[#e9c475]" />
        </a>
      </div>

      {/* Phone */}
      <div className="flex items-center space-x-2">
        <FaPhoneAlt className="text-2xl text-[#b09f7b] hover:text-[#e9c475]" />
        <span className="text-slate-800 font-bold">+1 (409) 987-5874</span>
      </div>
    </div>
  );
};

export default TopNavbar;
