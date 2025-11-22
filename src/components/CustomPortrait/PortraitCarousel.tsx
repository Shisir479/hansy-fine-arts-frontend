"use client"
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Define the expected structure of a single art object
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
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchArts = async () => {
      if (!API_URL) {
        setError(new Error("NEXT_PUBLIC_API_URL is not defined."));
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/arts`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch images. Status: ${response.status}`);
        }
        
        const data: Art[] = await response.json();
        setArts(data);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("An unknown error occurred"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchArts();
  }, [API_URL]);

  const portraitImages = arts ? arts.filter((art) => art.category === "portrait") : [];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(portraitImages.length / 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(portraitImages.length / 3)) % Math.ceil(portraitImages.length / 3));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % portraitImages.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev - 1 + portraitImages.length) % portraitImages.length);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24 bg-gradient-to-br from-amber-50 via-white to-stone-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-light tracking-wide">Loading Portfolio...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-24 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg border border-red-100">
          <p className="text-red-600 text-lg">Unable to load gallery</p>
          <p className="text-gray-500 text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  if (portraitImages.length === 0) {
    return (
      <div className="text-center py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <p className="text-gray-600 text-lg font-light">No portraits available at the moment</p>
          <p className="text-gray-400 text-sm mt-2">Check back soon for new artwork</p>
        </div>
      </div>
    );
  }

  const visibleImages = portraitImages.slice(currentIndex * 3, currentIndex * 3 + 3);

  return (
    <>
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-stone-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-serif text-gray-900 mb-4 tracking-tight">
              Portrait Gallery
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-800 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
              Capturing the essence of personality through timeless portraiture
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {visibleImages.map((art, index) => (
                <div
                  key={art._id}
                  className="group relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white"
                  onClick={() => openLightbox(currentIndex * 3 + index)}
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={art.image}
                      alt={art.title || "Portrait"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                    <div className="p-6 w-full">
                      <p className="text-white text-xl font-serif">
                        {art.title || "Untitled Portrait"}
                      </p>
                      <p className="text-amber-200 text-sm font-light mt-1">Click to view full size</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {portraitImages.length > 3 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800 group-hover:text-amber-600 transition-colors" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800 group-hover:text-amber-600 transition-colors" />
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {portraitImages.length > 3 && (
            <div className="flex justify-center gap-3 mt-8">
              {Array.from({ length: Math.ceil(portraitImages.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentIndex === index
                      ? "w-12 h-3 bg-amber-600"
                      : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={prevLightboxImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all duration-300"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          <div className="max-w-5xl max-h-[90vh] flex flex-col items-center">
            <img
              src={portraitImages[lightboxIndex].image}
              alt={portraitImages[lightboxIndex].title || "Portrait"}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <p className="text-white text-2xl font-serif mt-6">
              {portraitImages[lightboxIndex].title || "Untitled Portrait"}
            </p>
            <p className="text-amber-200 text-sm mt-2">
              {lightboxIndex + 1} of {portraitImages.length}
            </p>
          </div>

          <button
            onClick={nextLightboxImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all duration-300"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </div>
      )}
    </>
  );
};

export default PortraitCarousel;