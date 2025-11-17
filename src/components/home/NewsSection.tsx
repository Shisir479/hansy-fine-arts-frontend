"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";

interface NewsItem {
  title: string;
  date: string;
  category: string;
  imageUrl: string;
}

const newsData: NewsItem[] = [
  {
    title: "10 Steps: How to Create a Successful Business From Your Art",
    date: "December 07, 2018",
    category: "Business",
    imageUrl: "/cuadro-vertical-1_1.jpg",
  },
  {
    title: "Google Launched Virtual Tours of 50 Museums",
    date: "December 07, 2018",
    category: "Technology",
    imageUrl: "/cuadro-vertical-2.jpg",
  },
  {
    title: "10 Facts From the Life of the Most Expensive Artist of Our Time",
    date: "December 07, 2018",
    category: "Profile",
    imageUrl: "/cuadro-vertical-3.jpg",
  },
  {
    title: "The Evolution of Contemporary Digital Art",
    date: "December 15, 2018",
    category: "Trends",
    imageUrl: "/cuadro-vertical-1_1.jpg",
  },
];

// Duplicate for seamless loop
const extendedNews = [...newsData, ...newsData];

const NewsSection = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused) return;

    let animationFrame: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const scroll = () => {
      scrollPosition += scrollSpeed;

      // Reset when we've scrolled through the first set
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused]);

  return (
    <section className=" bg-white relative overflow-hidden">
      {/* Header */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-[1px] bg-black"></div>
              <p className="text-zinc-800 uppercase tracking-[0.4em] text-[10px] font-medium">
                Latest Updates
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-extralight text-black tracking-tighter">
              News &
            </h2>
            <h2 className="text-4xl md:text-5xl font-light text-black tracking-tighter italic">
              Insights
            </h2>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 border border-black px-6 py-3 hover:bg-black hover:text-white transition-all duration-300 group"
            aria-label={isPaused ? "Play marquee" : "Pause marquee"}
          >
            {isPaused ? (
              <Play className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Pause className="h-4 w-4" strokeWidth={1.5} />
            )}
            <span className="text-xs uppercase tracking-[0.2em] font-medium">
              {isPaused ? "Play" : "Pause"}
            </span>
          </button>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-hidden"
          style={{ scrollBehavior: "auto" }}
        >
          {extendedNews.map((news, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[380px] group cursor-pointer"
              onMouseEnter={() => {
                setHoveredIndex(index);
                setIsPaused(true);
              }}
              onMouseLeave={() => {
                setHoveredIndex(null);
                setIsPaused(false);
              }}
            >
              {/* Image Container */}
              <div
                className="relative w-full 
  h-[250px]       /* mobile */
  sm:h-[280px] 
  md:h-[320px]    /* tablet */
  lg:h-[380px]    /* desktop */
  xl:h-[420px]    /* large desktop */
  overflow-hidden bg-zinc-100 mb-5"
>
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

                {/* Category badge */}
                <div className="absolute top-5 left-5">
                  <span className="bg-white text-black px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] font-medium">
                    {news.category}
                  </span>
                </div>

                {/* Read more button */}
                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <button className="bg-white text-black p-3 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-2">
                <h3 className="text-lg font-light text-black mb-2 leading-tight tracking-tight group-hover:text-zinc-600 transition-colors duration-300">
                  {news.title}
                </h3>

                <div className="flex items-center gap-4">
                  <time className="text-zinc-500 text-xs uppercase tracking-[0.2em]">
                    {news.date}
                  </time>
                  <div className="w-8 h-[1px] bg-zinc-300 group-hover:w-12 group-hover:bg-black transition-all duration-500"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>

      {/* Bottom decorative line */}
      <div className="container mx-auto px-4 mt-16">
        <div className="w-full h-[1px] bg-zinc-200"></div>
      </div>
    </section>
  );
};

export default NewsSection;
