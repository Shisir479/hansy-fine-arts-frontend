"use client";

import { Eye, Heart } from "lucide-react";
import { ArtType } from "../gallery/ContemporaryArtGallery";

export default function ArtCard({ art }: { art: ArtType }) {
  const { _id, title, image, category } = art;

  return (
    <a href={`/product-detail/${_id}`} className="group block">
      <div className="relative overflow-visible bg-white">
        {/* Subtle shadow on hover */}
        <div className="absolute -inset-1 bg-black/0 group-hover:bg-black/5 blur-xl transition-all duration-700"></div>

        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 grayscale-[10%] group-hover:grayscale-0"
          />
          {/* Minimal overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-700"></div>

          {/* Simple category tag */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 shadow-sm">
            <span className="text-neutral-800 text-[10px] tracking-[0.3em] uppercase font-medium">
              {category}
            </span>
          </div>
        </div>

        {/* Title section */}
        <div className="relative p-6 bg-white border-t border-neutral-100">
          {/* Subtle accent line */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-neutral-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

          <h3 className="text-lg font-light text-neutral-900 tracking-wide relative">
            {title}
          </h3>

          {/* Minimal underline */}
          <div className="mt-3 w-8 h-[1px] bg-neutral-300 group-hover:w-16 group-hover:bg-neutral-900 transition-all duration-500"></div>
        </div>

        {/* Minimal corner accents */}
        <div className="absolute top-3 left-3 w-6 h-6 border-l border-t border-neutral-200 group-hover:border-neutral-400 transition-all duration-500"></div>
        <div className="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-neutral-200 group-hover:border-neutral-400 transition-all duration-500"></div>
      </div>
    </a>
  );
}
