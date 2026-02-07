"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { useGetPublishedBlogsQuery } from "@/lib/redux/api/blogApi";
import { useRouter } from "next/navigation";
import Link from 'next/link';

const NewsSection = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: blogData, isLoading } = useGetPublishedBlogsQuery({});


  const newsItems = useMemo(() => {
    if (!blogData?.data) return [];
    return blogData.data.map(blog => ({
      id: blog._id,
      title: String(blog.title),
      date: String(blog.createdAt),
      tags: blog.tags?.map((t: any) => {
        if (t?.tagId && typeof t.tagId === 'object' && 'name' in t.tagId) return t.tagId.name;
        if (t && typeof t === 'object' && 'name' in t) return t.name;
        if (typeof t === 'string') return t;
        return "";
      }).filter(Boolean) || [],
      imageUrl: blog.thumbnail || "/cuadro-vertical-1_1.jpg",
    }));
  }, [blogData]);


  const extendedNews = useMemo(() => {
    if (newsItems.length === 0) return [];
    // Ensure we have enough items to scroll smoothly
    const items = [...newsItems];
    while (items.length < 8) {
      items.push(...newsItems);
    }
    return items;
  }, [newsItems]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused || extendedNews.length === 0) return;

    let animationFrame: number;
    let scrollPosition = scrollContainer.scrollLeft;
    const scrollSpeed = 0.5;

    const scroll = () => {
      scrollPosition += scrollSpeed;

      // Reset when we've scrolled through half if we effectively doubled the content
      // Logic for infinite scroll alignment can be tricky with dynamic content.
      // A simple approach: if scrollLeft + clientWidth >= scrollWidth, reset to 0?
      // Or duplicate content enough times and reset when reaching the midpoint.

      if (scrollPosition >= (scrollContainer.scrollWidth - scrollContainer.clientWidth)) {
        // This is not perfect for seamless loop without exact duplication points,
        // but given the "extendedNews" logic, we usually want to reset when the first set is fully scrolled out.
        // However, calculating the exact width of the first set is better.
        // Since we don't have the exact width of one item easily accessible here without ref logic on items.
        // We will rely on the fact that we pushed enough items.
        // Let's reset when we are halfway through if we just doubled.
        // If we multiplied more, we need to be careful.
        // Let's stick to the original simple logic: reset 0 if we scrolled "enough".
        // The original logic was: if (scrollPosition >= scrollContainer.scrollWidth / 2)
        // This assumes extendedNews is exactly 2x the original content.

        // If we have dynamic data, we should probably force 2x duplication at least.
      }

      // Re-implementing original logic roughly:
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused, extendedNews]);

  if (isLoading) {
    return <div className="py-20 text-center">Loading News...</div>;
  }

  //   if (newsItems.length === 0) {
  //     return null;
  //   }

  return (
    <section className="bg-white dark:bg-black relative overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-[1px] bg-black dark:bg-white"></div>
              <p className="text-zinc-800 dark:text-zinc-200 uppercase tracking-[0.4em] text-[10px] font-medium">
                Latest Updates
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-extralight text-black dark:text-white tracking-tighter">
              News &
            </h2>
            <h2 className="text-4xl md:text-5xl font-light text-black dark:text-white tracking-tighter italic">
              Blogs
            </h2>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 border border-black dark:border-white px-6 py-3 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-black dark:text-white transition-all duration-300 group"
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
          {extendedNews.length === 0 ? (
            <div className="w-full text-center py-20 text-zinc-500 italic font-light">
              No latest updates available at the moment.
            </div>
          ) : (
            extendedNews.map((news, index) => (
              <div
                key={`${news.id}-${index}`}
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
  overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-5"
                >
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

                  {/* Tags badge */}
                  <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                    {news.tags.slice(0, 2).map((tag: string, i: number) => (
                      <span key={i} className="bg-white text-black px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>


                  {/* Read more button */}
                  <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <Link href={`/blog/${news.id}`}>
                      <button className="bg-white dark:bg-black text-black dark:text-white p-3 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 flex items-center justify-center">
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <div className="px-2">
                  <Link href={`/blog/${news.id}`}>
                    <h3 className="text-lg font-light text-black dark:text-white mb-2 leading-tight tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors duration-300">
                      {String(news.title)}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-4">
                    <time className="text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-[0.2em]">
                      {news.date}
                    </time>
                    <div className="w-8 h-[1px] bg-zinc-300 dark:bg-zinc-700 group-hover:w-12 group-hover:bg-black dark:group-hover:bg-white transition-all duration-500"></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none"></div>
      </div>

      {/* Bottom decorative line */}
      <div className="container mx-auto px-4 mt-16">
        <div className="w-full h-[1px] bg-zinc-200 dark:bg-zinc-800"></div>
      </div>
    </section>
  );
};

export default NewsSection;


