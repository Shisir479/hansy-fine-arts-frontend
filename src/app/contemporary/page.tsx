"use client";

import Image from "next/image";
import banner from "/public/gallery-banner.jpg"; 
import ContemporaryArtGallery from "@/components/gallery/ContemporaryArtGallery";

const Contemporary = () => {
  return (
    <>
      <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={banner}
            alt="Background"
            fill
            className="object-cover opacity-50"
            priority
          />
        </div>

        {/* Text Section */}
        <div className="relative z-10 text-white text-center py-10">
          <h1 className="text-4xl font-bold tracking-widest">
            HANS YAEGGY FINE ART
          </h1>
          <p className="text-lg italic mt-2">Contemporary</p>
        </div>
      </div>

      <ContemporaryArtGallery />
    </>
  );
};

export default Contemporary;
