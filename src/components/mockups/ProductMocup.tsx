"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Heart,
  Mail,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Video,
  Maximize2,
  Box,
  X,
  Smartphone,
  Image as ImageIcon,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import DynamicMockup from "./DynamicMockup";
import { PHONE_MODELS } from "./mockupConfig";
import LivePreviewARModal from "../preview/LivePreviewARModal";
import WallPreviewTool from "../preview/RoomPreview";
import { IoFlash } from "react-icons/io5";

export default function ProductMockup({
  product,
}: {
  product: { image: string; title?: string; price?: number; _id?: string };
}) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<string>("default");
  const [activeSection, setActiveSection] = useState<string | null>("product");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // AR MODAL STATE
  const [isAROpen, setIsAROpen] = useState(false);
  // WALL PREVIEW STATE (NEW)
  const [isWallViewOpen, setIsWallViewOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("ash");
  const [placement, setPlacement] = useState<string>("Center Front");
  const [imageScale, setImageScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [selectedPhoneModel, setSelectedPhoneModel] =
    useState<string>("iphone16");

  const mockupActive = selectedProduct !== "default";

  const productOptions = [
    {
      id: "hoodie",
      name: "Hoodies",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 20V10l4-3 2 2 2-2 4 3v10H6z" />
          <path d="M10 7V5a2 2 0 1 1 4 0v2" />
        </svg>
      ),
    },
    {
      id: "tshirt",
      name: "T-Shirts",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 7l4-2 4 2 4-2 4 2-2 13H6L4 7z" />
        </svg>
      ),
    },
    {
      id: "tank",
      name: "Tank Tops",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M8 4h2l1 4h2l1-4h2l2 16H6L8 4z" />
        </svg>
      ),
    },
    {
      id: "tote",
      name: "Tote Bags",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="4" y="9" width="16" height="12" rx="2" />
          <path d="M8 9V7a4 4 0 0 1 8 0v2" />
        </svg>
      ),
    },
    {
      id: "pillow",
      name: "Throw Pillows",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="5" y="6" width="14" height="12" rx="3" />
        </svg>
      ),
    },
    {
      id: "phone",
      name: "Phone Cases",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="8" y="4" width="8" height="16" rx="2" />
        </svg>
      ),
    },
    {
      id: "mug",
      name: "Mugs",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="4" y="7" width="10" height="10" rx="2" />
          <path d="M14 9h2a2 2 0 0 1 0 4h-2" />
        </svg>
      ),
    },
    {
      id: "puzzle",
      name: "Puzzles",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M9 4a2 2 0 0 1 4 0v2h3v3h2a2 2 0 1 1 0 4h-2v3h-3v2a2 2 0 1 1-4 0v-2H6v-3H4a2 2 0 1 1 0-4h2V6h3V4z" />
        </svg>
      ),
    },
    {
      id: "ornament",
      name: "Ornaments",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 20s-6-4-6-8a4 4 0 0 1 8 0 4 4 0 0 1 8 0c0 4-6 8-6 8z" />
        </svg>
      ),
    },
  ];

  const placements = [
    "Center Front",
    "Center Back",
    "Left Chest",
    "Right Chest",
  ];

  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  const handleProductSelect = (id: string) => {
    setSelectedProduct(id);
    setImageScale(1);
    setRotation(0);
  };

  const handleAddToCart = () => {
    const cartProduct = {
      _id: product._id || Date.now().toString(),
      title: product.title || "Product",
      productTitle: product.title || "Product",
      image: product.image,
      price: product.price || 0,
      category: "art",
      quantity: 1
    };
    
    for (let i = 0; i < quantity; i++) {
      add(cartProduct);
    }
    
    toast.success(`Added ${quantity} item(s) to cart!`);
  };
  return (
    <div className="min-h-screen bg-white">
      {/* AR MODAL COMPONENT */}
      <LivePreviewARModal
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
        imageSrc={product.image}
      />
      {/* WALL PREVIEW TOOL (NEW) */}
      <WallPreviewTool
        isOpen={isWallViewOpen}
        onClose={() => setIsWallViewOpen(false)}
        productImage={product.image}
      />
      {/* CLICK TO ENLARGE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-5 right-5 text-white hover:text-gray-300"
          >
            <X size={40} />
          </button>
          <Image
            src={product.image}
            alt="Enlarged Product"
            width={800}
            height={800}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* LEFT SIDE : PREVIEW */}
          {/* Sticky only on medium screens and up (md:sticky). Relative on mobile to fix overlap issue. */}
          <div className="relative md:sticky md:top-4 flex flex-col items-center w-full z-10">
            {/* REMOVED GlassMagnifier & Adjusted Styles for Mobile Full View */}
            <div className="w-full relative mb-2 flex items-center justify-center rounded-lg bg-white">
              {!mockupActive && (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Standard Image Tag - Responsive */}
                  <Image
                    src={product?.image}
                    alt="Product"
                    width={600}
                    height={600}
                    className="w-full h-auto object-contain max-h-[500px] md:max-h-[600px]"
                  />
                </div>
              )}

              {mockupActive && (
                // Constrain the container of DynamicMockup
                <div className="w-full h-full flex items-center justify-center max-w-full">
                  <DynamicMockup
                    artwork={product.image}
                    productType={selectedProduct}
                    phoneModelId={selectedPhoneModel}
                    scale={imageScale}
                    rotate={rotation}
                  />
                </div>
              )}
            </div>

            {/* Click to Enlarge Text */}
            {!mockupActive && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs text-gray-500 underline hover:text-black mb-6 flex items-center gap-1"
              >
                click to enlarge <Maximize2 size={10} />
              </button>
            )}

            {/* Action Icons */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 w-full border-t border-gray-200 pt-6 bg-white pb-2">
              {!mockupActive && (
                <button
                  onClick={() => setIsAROpen(true)}
                  className="flex flex-col items-center gap-2 text-gray-500 hover:text-black transition group"
                >
                  <Video
                    className="w-5 h-5 md:w-7 md:h-7 group-hover:scale-110 transition-transform"
                    strokeWidth={1.5}
                  />
                  <span className="text-[10px] md:text-[11px] uppercase tracking-wide">
                    Live AR
                  </span>
                </button>
              )}

              {!mockupActive && (
                <button
                  onClick={() => setIsWallViewOpen(true)} // TRIGGER WALL PREVIEW
                  className="flex flex-col items-center gap-2 text-gray-500 hover:text-black transition group"
                >
                  <ImageIcon
                    className="w-5 h-5 md:w-7 md:h-7 group-hover:scale-110 transition-transform"
                    strokeWidth={1.5}
                  />
                  <span className="text-[10px] md:text-[11px] uppercase tracking-wide">
                    Wall View
                  </span>
                </button>
              )}
              <button className="flex flex-col items-center gap-2 text-gray-500 hover:text-black transition group">
                <Heart
                  className="w-5 h-5 md:w-7 md:h-7 group-hover:scale-110 transition-transform"
                  strokeWidth={1.5}
                />
                <span className="text-[10px] md:text-[11px] uppercase tracking-wide">
                  Save
                </span>
              </button>

              <button className="flex flex-col items-center gap-2 text-gray-500 hover:text-black transition group">
                <Mail
                  className="w-5 h-5 md:w-7 md:h-7 group-hover:scale-110 transition-transform"
                  strokeWidth={1.5}
                />
                <span className="text-[10px] md:text-[11px] uppercase tracking-wide">
                  Email a Friend
                </span>
              </button>
            </div>
          </div>
          {/* End of Left Wrapper */}

          {/* RIGHT SIDE : CONTROLS */}
          <div className="relative z-0">
            <h1 className="text-2xl md:text-3xl font-light tracking-wider mb-4">
              {product.title ?? "Product Title"}
            </h1>
            <div className="mb-6">
              <div className="md:text-3xl text-xl font-semibold mb-2">
                ${product.price}
              </div>
            </div>

            {/* QUANTITY + ADD TO CART (Stacked Layout) */}
            <div className="md:flex gap-4 mb-8">
              <div>
                <input
                  type="number"
                  defaultValue={1}
                  min={1}
                  // ADDED the class to hide the spin buttons
                  className="w-full md:w-14 px-4 py-2 border text-center no-spin-buttons"
                />
              </div>
              <div className="flex gap-4 md:gap-5 w-full mt-4 md:mt-0">
                {/* Button 1: Add to Cart (Default: Black, Hover: White) */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white py-2 border border-black transition uppercase tracking-widest text-[12px] font-medium
                   hover:bg-white hover:text-black"
                >
                  Add to Cart
                </button>

                {/* Button 2: Instant checkout (Default: Black, Hover: White, Flash Icon) */}
                <button
                  className="w-full bg-black text-white py-2 border border-black transition uppercase tracking-widest text-[12px] font-medium 
                   flex items-center justify-center gap-2 
                   hover:bg-white hover:text-black"
                >
                  ⚡ Instant checkout
                </button>
              </div>
            </div>

            {/* SECTION 1: PRODUCT SELECTOR */}
            <div className="border border-gray-300 mb-4 overflow-hidden">
              <button
                onClick={() => toggleSection("product")}
                className={`w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition ${
                  activeSection === "product"
                    ? "font-bold text-black"
                    : "text-gray-600"
                }`}
              >
                <span className="flex items-center gap-2">
                  1. Select Product
                  {mockupActive && activeSection !== "product" && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </span>
                {activeSection === "product" ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  activeSection === "product"
                    ? "max-h-[600px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-4 border-t border-gray-200">
                  <select
                    className="w-full p-3 border mb-3 text-sm"
                    value={selectedProduct}
                    onChange={(e) => handleProductSelect(e.target.value)}
                  >
                    <option value="default">Select a Product…</option>
                    {productOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-3">
                    {productOptions.map((po) => (
                      <button
                        key={po.id}
                        onClick={() => handleProductSelect(po.id)}
                        className={`p-2 border text-center text-xs rounded flex flex-col items-center justify-center gap-1 transition-colors ${
                          selectedProduct === po.id
                            ? "border-black bg-gray-100 ring-1 ring-black"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="text-xl">{po.icon}</div>
                        <span className="truncate w-full">{po.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: CUSTOMIZE IT */}
            {mockupActive && (
              <div className="border border-gray-300  overflow-hidden transition-all duration-500">
                <button
                  onClick={() => toggleSection("customize")}
                  className={`w-full flex justify-between items-center p-3 transition ${
                    activeSection === "customize"
                      ? "bg-gray-50 font-bold text-black"
                      : "bg-white hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    2. Customize It
                    {activeSection !== "customize" && (
                      <span className="text-xs font-normal text-gray-500 ml-2">
                        (Click to expand)
                      </span>
                    )}
                  </span>
                  {activeSection === "customize" ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    activeSection === "customize"
                      ? "max-h-[600px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-4 border-t border-gray-200">
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Image Size
                      </label>
                      <input
                        type="range"
                        min={0.2}
                        max={2}
                        step={0.01}
                        value={imageScale}
                        onChange={(e) => setImageScale(Number(e.target.value))}
                        className="w-full accent-black"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Rotate
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={360}
                        value={rotation}
                        onChange={(e) => setRotation(Number(e.target.value))}
                        className="w-full accent-black"
                      />
                    </div>

                    {selectedProduct === "phone" && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                          Phone Model
                        </label>
                        <select
                          className="w-full p-2 border rounded"
                          value={selectedPhoneModel}
                          onChange={(e) =>
                            setSelectedPhoneModel(e.target.value)
                          }
                        >
                          {Object.keys(PHONE_MODELS).map((key) => (
                            <option key={key} value={key}>
                              {key.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {selectedProduct !== "phone" && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Placement
                          </label>
                          <select
                            className="w-full p-2 border rounded"
                            value={placement}
                            onChange={(e) => setPlacement(e.target.value)}
                          >
                            {placements.map((p) => (
                              <option key={p}>{p}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Color
                          </label>
                          <select
                            className="w-full p-2 border rounded"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                          >
                            <option value="black">Black</option>
                            <option value="white">White</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
