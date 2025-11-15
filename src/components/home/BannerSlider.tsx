"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ArtCarousel = () => {
  const images = [
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1600&h=600&fit=crop"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('next');

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setDirection('next');
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, images.length]);

  const goToPrevious = useCallback(() => {
    if (isAnimating) return;
    setDirection('prev');
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, images.length]);

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  const currentImage = images[currentIndex];

  return (
    <div className="w-full bg-white">
      {/* Carousel Container */}
      <div className="relative w-full">
        {/* Main Image Area */}
        <div className="relative w-full aspect-[16/6] overflow-hidden bg-gray-900">
          <div
            className={`absolute inset-0 transition-all duration-500 ease-out ${
              isAnimating
                ? direction === 'next'
                  ? 'translate-x-full opacity-0'
                  : '-translate-x-full opacity-0'
                : 'translate-x-0 opacity-100'
            }`}
          >
            <Image
              src={currentImage}
              alt={`Banner ${currentIndex + 1}`}
              fill
              priority={currentIndex === 0}
            />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            disabled={isAnimating}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="md:w-6 md:h-6 w-4 h-4" />
          </button>

          <button
            onClick={goToNext}
            disabled={isAnimating}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="md:w-6 md:h-6 w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtCarousel;