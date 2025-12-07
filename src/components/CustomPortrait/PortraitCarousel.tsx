"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Art {
  _id: string;
  image: string;
  category: string;
  title?: string;
}

const PortraitCarousel: React.FC = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [arts, setArts] = useState<Art[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchArts = async () => {
      if (!API_URL) {
        setError(new Error("NEXT_PUBLIC_API_URL is not defined."));
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/arts`);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        const data: Art[] = await response.json();
        setArts(data);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchArts();
  }, [API_URL]);

  const portraitImages = arts ? arts.filter((art) => art.category === "portrait") : [];

  const goToSlide = (index: number) => setCurrentIndex(index);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % portraitImages.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + portraitImages.length) % portraitImages.length);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || portraitImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-700 text-xl">No portraits available</p>
          {error && <p className="text-gray-500 text-sm mt-2">{error.message}</p>}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-5 px-4 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="text-3xl md:text-4xl font-light tracking-widest text-gray-900 uppercase">
              Portrait Gallery
            </h2>
            <div className="w-20 h-px bg-gray-800 mx-auto mt-3"></div>
          </div>

          {/* Main Image */}
          <div className="relative mb-8 bg-black">
            <img
              src={portraitImages[currentIndex].image}
              alt={portraitImages[currentIndex].title || "Portrait"}
              className="w-full h-auto max-h-screen object-contain cursor-pointer transition-opacity duration-300 hover:opacity-95"
              onClick={() => setIsLightboxOpen(true)}
            />

            {/* Navigation Arrows */}
            {portraitImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 transition"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-7 h-7 text-gray-900" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 transition"
                  aria-label="Next"
                >
                  <ChevronRight className="w-7 h-7 text-gray-900" />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1.5 text-sm font-light">
              {currentIndex + 1} / {portraitImages.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {portraitImages.length > 1 && (
            <div className="overflow-x-auto py-4 -mx-4 px-4">
              <div className="flex gap-3 justify-center min-w-max">
                {portraitImages.map((art, i) => (
                  <button
                    key={art._id}
                    onClick={() => goToSlide(i)}
                    className={`relative w-20 h-28 flex-shrink-0 border-2 transition-all duration-200 ${
                      currentIndex === i
                        ? "border-gray-900 shadow-lg scale-105"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <img
                      src={art.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {currentIndex === i && (
                      <div className="absolute inset-0 bg-black/20"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 p-3 transition"
          >
            <X className="w-8 h-8 text-white" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-5 transition"
          >
            <ChevronLeft className="w-10 h-10 text-white" />
          </button>

          <div className="max-w-6xl max-h-full text-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={portraitImages[currentIndex].image}
              alt={portraitImages[currentIndex].title || "Portrait"}
              className="max-w-full max-h-screen object-contain"
            />
            <p className="text-white text-2xl mt-6 font-light">
              {portraitImages[currentIndex].title || "Untitled"}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {currentIndex + 1} of {portraitImages.length}
            </p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-5 transition"
          >
            <ChevronRight className="w-10 h-10 text-white" />
          </button>
        </div>
      )}
    </>
  );
};

export default PortraitCarousel;