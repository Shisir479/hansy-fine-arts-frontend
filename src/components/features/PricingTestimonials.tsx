"use client"
import { Card, CardContent } from '@/components/ui/card';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

const testimonials = [
  {
    name: 'Emily Johnson',
    role: 'Art Collector',
    location: 'New York',
    rating: 5,
    text: 'The artwork I purchased exceeded my expectations. The quality is outstanding and the customer service was exceptional.',
  },
  {
    name: 'Michael Chen',
    role: 'Interior Designer',
    location: 'Los Angeles',
    rating: 5,
    text: 'I commissioned a custom portrait and the artist captured everything perfectly. Highly recommend!',
  },
  {
    name: 'Sarah Williams',
    role: 'Gallery Owner',
    location: 'London',
    rating: 5,
    text: 'The AR preview feature helped me visualize the artwork in my space before buying. Such an innovative approach!',
  },
  {
    name: 'James Morrison',
    role: 'Creative Director',
    location: 'Paris',
    rating: 5,
    text: 'Exceptional craftsmanship and attention to detail. Every piece tells a unique story.',
  },
];

export default function PricingTestimonials() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, []);

  const getCardStyle = (index: number) => {
    const diff = (index - current + testimonials.length) % testimonials.length;

    if (diff === 0) {
      return {
        transform: 'translateX(0%) translateZ(100px) scale(1.05) rotateY(0deg)',
        opacity: 1,
        zIndex: 30,
        filter: 'blur(0px)',
      };
    } else if (diff === 1 || diff === -3) {
      return {
        transform: 'translateX(50%) translateZ(-50px) scale(0.8) rotateY(-35deg)',
        opacity: 0.4,
        zIndex: 20,
        filter: 'blur(1px)',
      };
    } else if (diff === testimonials.length - 1 || diff === -1) {
      return {
        transform: 'translateX(-50%) translateZ(-50px) scale(0.8) rotateY(35deg)',
        opacity: 0.4,
        zIndex: 20,
        filter: 'blur(1px)',
      };
    } else {
      return {
        transform: 'translateX(0%) translateZ(-100px) scale(0.6) rotateY(0deg)',
        opacity: 0,
        zIndex: 10,
        filter: 'blur(2px)',
      };
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-black relative overflow-hidden transition-colors duration-300">
      {/* Premium background pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" className="stroke-black dark:stroke-white/20" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Elegant top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-black dark:bg-white"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-black dark:bg-white"></div>
              <p className="text-zinc-800 dark:text-zinc-200 uppercase tracking-[0.4em] text-[10px] font-medium">Client Testimonials</p>
              <div className="w-12 h-[1px] bg-black dark:bg-white"></div>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extralight text-black dark:text-white mb-3 tracking-tighter leading-[0.95]">
            Trusted by
          </h2>
          <h2 className="text-4xl md:text-5xl font-light text-black dark:text-white tracking-tighter leading-[0.95] italic">
            Collectors Worldwide
          </h2>
        </div>

        {/* Ultra Premium 3D Carousel */}
        <div className="relative max-w-4xl mx-auto h-[450px] flex items-center justify-center perspective-[2500px]">
          <div className="relative w-full h-full flex items-center justify-center">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="absolute w-full max-w-2xl transition-all duration-700 ease-out preserve-3d"
                style={getCardStyle(index)}
              >
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-12 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative group hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)] transition-all duration-500">
                  {/* Decorative corner elements */}
                  <div className="absolute top-0 left-0 w-10 h-10 border-t border-l border-black dark:border-white opacity-20"></div>
                  <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-black dark:border-white opacity-20"></div>
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-black dark:border-white opacity-20"></div>
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-black dark:border-white opacity-20"></div>

                  {/* Quote icon */}
                  <div className="flex justify-center mb-6">
                    <Quote className="h-8 w-8 text-black dark:text-white opacity-15" strokeWidth={1} />
                  </div>

                  {/* Quote text */}
                  <blockquote className="text-zinc-800 dark:text-zinc-100 text-lg md:text-xl leading-relaxed mb-10 font-light text-center min-h-[120px] flex items-center justify-center tracking-tight">
                    {testimonial.text}
                  </blockquote>

                  {/* Rating */}
                  <div className="flex gap-1.5 mb-8 justify-center">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-black dark:fill-white text-black dark:text-white" strokeWidth={1} />
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="w-16 h-[1px] bg-zinc-300 dark:bg-zinc-700 mx-auto mb-8"></div>

                  {/* Author info */}
                  <div className="text-center">
                    <p className="text-black dark:text-white font-normal text-lg tracking-wide mb-2 uppercase" style={{ letterSpacing: '0.1em' }}>
                      {testimonial.name}
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-[0.3em] mb-1">
                      {testimonial.role}
                    </p>
                    <p className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-[0.4em]">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Minimalist Navigation */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-black hover:bg-black dark:hover:bg-white border border-black dark:border-white text-black dark:text-white hover:text-white dark:hover:text-black md:w-14 w-11 h-11 md:h-14 transition-all duration-300 group flex items-center justify-center"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="md:h-5 md:w-5 h-4 w-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={1.5} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-black hover:bg-black dark:hover:bg-white border border-black dark:border-white text-black dark:text-white hover:text-white dark:hover:text-black md:w-14 w-11 h-11 md:h-14 transition-all duration-300 group flex items-center justify-center"
            aria-label="Next testimonial"
          >
            <ChevronRight className="md:h-5 md:w-5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
          </button>
        </div>

        {/* Premium Progress Indicator */}
        <div className="mt-16">
          <div className="flex justify-center items-center gap-6">
            <div className="text-zinc-400 text-sm font-light tracking-wider">
              {String(current + 1).padStart(2, '0')}
            </div>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true);
                      setCurrent(index);
                      setTimeout(() => setIsAnimating(false), 700);
                    }
                  }}
                  className={`h-[1px] transition-all duration-700 ${index === current ? 'w-16 bg-black dark:bg-white' : 'w-8 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-500'
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <div className="text-zinc-400 text-sm font-light tracking-wider">
              {String(testimonials.length).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-2500 {
          perspective: 2500px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  );
}