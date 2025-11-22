// components/FileImageFormFineWork.tsx (Updated)
"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ProductModal from "./ProductModal";

// Define a separate Skeleton component
const FileImageSkeleton = ({ colIdx, columnCount, isMobile }: { colIdx: number, columnCount: number, isMobile: boolean }) => {
  // Use the same height logic as the main component to maintain the masonry look
  const desktopHeights = ["h-64", "h-80", "h-96", "h-72"];
  const mobileHeights = ["h-48", "h-56", "h-60"];
  const randomHeight = isMobile
    ? mobileHeights[colIdx % mobileHeights.length]
    : desktopHeights[colIdx % desktopHeights.length];

  return (
    // Skeleton card with pulsating animation
    <div 
      className={`bg-gray-200 dark:bg-gray-800 animate-pulse ${randomHeight} overflow-hidden shadow-lg transition-shadow duration-500`}
      // Inherit the animation delay for a staggered effect
      style={{ animationDelay: `${colIdx * 0.1}s` }}
    >
      {/* Optional: Placeholder for text lines */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
        <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-8 w-1/3 bg-gray-300 dark:bg-gray-700 mt-4"></div>
      </div>
    </div>
  );
};


interface ImageType {
  guid: string;
  title: string;
  description: string;
  public_preview_uri: string;
  products?: any[];
}

// Define the number of skeleton items to display while loading
const SKELETON_ITEMS_COUNT = 9; 

const fetchFileImages = async () => {
  // ... (unchanged)
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/image-file-manager`,
    {
      library: {
        name: "inventory",
        session_id: "123456789",
        account_key: "dc9e5410-0107-441a-92eb-6a4fd1c34c79",
        site_id: 2,
      },
      search_filter: "",
      guid_filter: null,
      // Change per_page to match the skeleton count or fetch dynamically later
      page_number: 1,
      per_page: 10, // Use the original per_page for data fetch
      sort_field: "id",
      sort_direction: "DESC",
      upload_date_from: null,
      upload_date_to: null,
      list_products: true,
      active: null,
    }
  );
  return data.images;
};

export default function FileImageFormFineWork() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // responsive flags
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  const [columnCount, setColumnCount] = useState<number>(() => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  });

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      if (window.innerWidth < 640) setColumnCount(1);
      else if (window.innerWidth < 1024) setColumnCount(2);
      else setColumnCount(3);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        const data = await fetchFileImages();
        setImages(data || []);
      } catch (err) {
        setError("Failed to load images");
      } finally {
        setIsLoading(false);
      }
    };
    loadImages();
  }, []);

  // custom cursor movement (only for non-mobile)
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  const distributeToColumns = (items: ImageType[] | { guid: string }[]) => {
    const columns: ImageType[][] | { guid: string }[][] = Array.from(
      { length: columnCount },
      () => []
    );
    items.forEach((item, idx) => {
      // Use modulus operator to distribute items evenly across columns
      columns[idx % columnCount].push(item as any); 
    });
    return columns;
  };

  // --- Conditional Data/Skeleton Setup ---
  // Create an array of dummy items for the skeleton when loading
  const skeletonItems = Array.from({ length: SKELETON_ITEMS_COUNT }, (_, i) => ({
    guid: `skeleton-${i}`, // Provide a unique key for mapping
  }));
  
  // Decide which items to display: real images or skeleton placeholders
  const displayItems = isLoading ? skeletonItems : images;
  const columns = distributeToColumns(displayItems);

  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div
      className="py-8"
      onMouseEnter={() => !isMobile && setShowCursor(true)}
      onMouseLeave={() => !isMobile && setShowCursor(false)}
    >
      <div className="md:container mx-auto px-4">
        {/* Custom cursor: only render on non-mobile */}
        {!isMobile && (
          <div
            ref={cursorRef}
            className={`fixed pointer-events-none z-50 w-12 h-12 border border-gray-800 transition-opacity duration-300 ${
              showCursor && !hoveredCard ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transform: "translate(-50%, -50%)",
              willChange: "transform",
            }}
          >
            <div className="w-1 h-1 bg-gray-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        )}

        {/* Masonry Grid */}
        <div className="flex gap-6">
          {columns.map((column, colIdx) => (
            <div key={colIdx} className="flex-1 flex flex-col gap-6">
              {column.map((item, idx) => {
                // If loading, render the skeleton component
                if (isLoading) {
                  return <FileImageSkeleton key={item.guid} colIdx={colIdx + idx} columnCount={columnCount} isMobile={isMobile} />;
                }
                
                // Otherwise, render the actual image card
                const image = item as ImageType;
                const desktopHeights = ["h-64", "h-80", "h-96", "h-72"];
                const mobileHeights = ["h-48", "h-56", "h-60"]; 
                const randomHeight = isMobile
                  ? mobileHeights[(colIdx + idx) % mobileHeights.length]
                  : desktopHeights[(colIdx + idx) % desktopHeights.length];

                const isHovered = hoveredCard === image.guid;

                return (
                  <div
                    key={image.guid}
                    className="relative group"
                    onMouseEnter={() => !isMobile && setHoveredCard(image.guid)}
                    onMouseLeave={() => !isMobile && setHoveredCard(null)}
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
                    }}
                  >
                    {/* Outer frame - sharp edges (hide on mobile) */}
                    <div
                      className={`absolute -inset-1 border transition-all duration-500 hidden md:block ${
                        isHovered
                          ? "border-gray-800 opacity-100 scale-105"
                          : "border-gray-400 opacity-0 scale-100"
                      }`}
                    />

                    {/* Card - no border radius */}
                    <div
                      className={`relative ${randomHeight} overflow-hidden cursor-pointer transform transition-all duration-500 ${
                        isHovered ? "md:scale-[1.02] md:shadow-2xl" : "shadow-lg"
                      }`}
                      // only open modal on card click for non-mobile (keep mobile safe)
                      onClick={() => !isMobile && setSelectedImage(image)}
                    >
                      {/* Image with zoom effect */}
                      <img
                        src={image.public_preview_uri}
                        alt={image.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          isHovered ? "md:scale-110" : ""
                        }`}
                      />

                      {/* Simple dark overlay */}
                      <div
                        className="absolute inset-0 transition-opacity duration-700 bg-black"
                        style={{
                          opacity: isHovered ? 0.5 : isMobile ? 0.15 : 0.2,
                        }}
                      />

                      {/* Glassmorphism overlay on hover (desktop only) */}
                      <div
                        className="absolute inset-0 transition-all duration-700"
                        style={{
                          backdropFilter: isHovered ? "blur(1px)" : "blur(0px)",
                          opacity: isHovered ? 1 : 0,
                        }}
                      />

                      {/* Content */}
                      <div className="absolute inset-0 pt-5 pb-3 px-5 flex flex-col justify-end z-10">
                        {/* Title */}
                        <h2
                          className={`text-white italic ${
                            isMobile ? "text-lg font-semibold" : "text-2xl font-bold mb-2"
                          } transition-all duration-500 uppercase tracking-wider`}
                          style={{
                            opacity: isMobile ? 1 : isHovered ? 1 : 0,
                            transform:
                              isMobile || isHovered
                                ? "translateY(0) scale(1)"
                                : "translateY(30px) scale(0.9)",
                            textShadow: "2px 2px 12px rgba(0,0,0,0.9)",
                          }}
                        >
                          {image.title}
                        </h2>

                        {/* Description */}
                        <p
                          className={`text-white italic ${
                            isMobile ? "text-xs leading-relaxed" : "text-sm leading-relaxed"
                          } transition-all duration-500`}
                          style={{
                            opacity: isMobile ? 1 : isHovered ? 0.95 : 0,
                            transform:
                              isMobile || isHovered ? "translateY(0)" : "translateY(30px)",
                            transitionDelay: "150ms",
                            textShadow: "1px 1px 8px rgba(0,0,0,0.9)",
                          }}
                        >
                          {image.description}
                        </p>

                        {/* View button - preserved design; visible on mobile always, on desktop only on hover */}
                        <div
                          className="mt-4 transition-all duration-500"
                          style={{
                            opacity: isMobile ? 1 : isHovered ? 1 : 0,
                            transform:
                              isMobile || isHovered ? "translateY(0)" : "translateY(30px)",
                            transitionDelay: "250ms",
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // prevent card click (desktop handled above)
                              setSelectedImage(image);
                            }}
                            className="inline-flex items-center gap-2 md:px-4 md:py-2 px-3 py-[4px] bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-all"
                          >
                            <span>View Details</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {selectedImage && (
          <ProductModal
            image={{ ...selectedImage, products: selectedImage.products || [] }}
            onOpenChange={() => setSelectedImage(null)}
            open={!!selectedImage}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}