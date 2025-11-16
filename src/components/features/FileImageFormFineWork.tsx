"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ProductModal from "./ProductModal";

interface ImageType {
  guid: string;
  title: string;
  description: string;
  public_preview_uri: string;
  products?: any[];
}

const fetchFileImages = async () => {
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
      page_number: 1,
      per_page: 10,
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
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div
      className=" py-8"
      onMouseEnter={() => setShowCursor(true)}
      onMouseLeave={() => setShowCursor(false)}
    >
      <div className="container mx-auto">
        {/* Custom cursor */}
        <div
          className={`fixed pointer-events-none z-50 transition-opacity duration-300 ${
            showCursor && !hoveredCard ? "opacity-100" : "opacity-0"
          }`}
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-12 h-12 border border-gray-400 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
          {images?.map((image) => (
            <div
              key={image.guid}
              className="relative group"
              onMouseEnter={() => setHoveredCard(image.guid)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Outline border */}
              <div
                className={`absolute -inset-3 border border-gray-400 rounded-2xl transition-all duration-500 ${
                  hoveredCard === image.guid
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95"
                }`}
              />

              {/* Card */}
              <div
                className="relative h-96 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                {/* Image - always visible */}
                <img
                  src={image.public_preview_uri}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />

                {/* Glossy overlay - appears on hover */}
                <div
                  className="absolute inset-0 transition-all duration-500 ease-in-out"
                  style={{
                    background:
                      hoveredCard === image.guid
                        ? "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)"
                        : "transparent",
                    backdropFilter:
                      hoveredCard === image.guid ? "blur(8px)" : "blur(0px)",
                    opacity: hoveredCard === image.guid ? 1 : 0,
                  }}
                />

                {/* Content - appears on hover */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                  <h2
                    className="text-white text-2xl font-bold mb-2 transition-all duration-500 transform"
                    style={{
                      opacity: hoveredCard === image.guid ? 1 : 0,
                      transform:
                        hoveredCard === image.guid
                          ? "translateY(0)"
                          : "translateY(20px)",
                      textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
                    }}
                  >
                    {image.title}
                  </h2>
                  <p
                    className="text-white text-sm transition-all duration-500 transform"
                    style={{
                      opacity: hoveredCard === image.guid ? 0.95 : 0,
                      transform:
                        hoveredCard === image.guid
                          ? "translateY(0)"
                          : "translateY(20px)",
                      transitionDelay: "100ms",
                      textShadow: "1px 1px 6px rgba(0,0,0,0.8)",
                    }}
                  >
                    {image.description}
                  </p>
                </div>
              </div>
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
    </div>
  );
}
