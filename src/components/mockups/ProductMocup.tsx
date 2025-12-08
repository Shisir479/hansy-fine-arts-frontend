"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Maximize2,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import LivePreviewARModal from "../preview/LivePreviewARModal";
import WallPreviewTool from "../preview/RoomPreview";

const BASE_IMG_URL = "https://finerworks.com";
const API_URL = "http://localhost:5000/api/v1/finerworks";

export default function ProductMockup({
  product,
}: {
  product: {
    image: string;
    title?: string;
    price?: number;
    _id?: string;
    sku?: string;
  };
}) {
  const { add } = useCart();

  const [items, setItems] = useState<any[]>([]);
  const [mats, setMats] = useState<any[]>([]);
  const [glazing, setGlazing] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [viewState, setViewState] = useState<"collections" | "frames">(
    "collections"
  );
  const [cachedCollections, setCachedCollections] = useState<any[]>([]);

  const [selectedFrame, setSelectedFrame] = useState<any>(null);
  const [selectedMat, setSelectedMat] = useState<any>(null);
  const [selectedGlazing, setSelectedGlazing] = useState<any>(null);

  const [quantity, setQuantity] = useState(1);
  const [colorCorrection, setColorCorrection] = useState(false);

  const [activeSection, setActiveSection] = useState<string | null>("selection");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);
  const [isWallViewOpen, setIsWallViewOpen] = useState(false);

  // Fetch initial data (frames, mats, glazing)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Collections
        const frameRes = await fetch(`${API_URL}/framing/collections`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const frameData = await frameRes.json();

        // Mats & Glazing
        const [matRes, glazeRes] = await Promise.all([
          fetch(`${API_URL}/framing/mats`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          }),
          fetch(`${API_URL}/framing/glazing`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          }),
        ]);
        const matData = await matRes.json();
        const glazeData = await glazeRes.json();

        // Extract collections
        let cols: any[] = [];
        if (frameData.data?.collections) cols = frameData.data.collections;
        else if (frameData.collections) cols = frameData.collections;

        const mappedCollections = cols.map((c: any) => ({
          ...c,
          displayImage: c.icon_url_1 || c.image_1,
          type: "folder",
        }));

        setItems(mappedCollections);
        setCachedCollections(mappedCollections);

        if (matData.data?.mats) setMats(matData.data.mats);
        if (glazeData.data?.glazing) setGlazing(glazeData.data.glazing);
      } catch (error) {
        console.error("❌ API Error:", error);
        toast.error("Failed to load framing options");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle frame selection / collection navigation
  const handleItemClick = async (item: any) => {
    if (viewState === "collections") {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/framing/collections`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item.id }),
        });
        const data = await res.json();

        let targetCol = data.data?.collections
          ? data.data.collections[0]
          : data.collections
          ? data.collections[0]
          : null;

        if (targetCol && targetCol.frames) {
          const frameList = targetCol.frames.map((f: any) => ({
            ...f,
            displayImage:
              f.sample_image_url_1 || f.image_url || f.segment_url,
            type: "frame",
          }));
          setItems(frameList);
          setViewState("frames");
        }
      } catch (err) {
        toast.error("Could not load frames");
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedFrame(item);
    }
  };

  const handleMatChange = (mat: any) => {
    setSelectedMat(mat);
  };

  const handleGlazingChange = (glaze: any) => {
    setSelectedGlazing(glaze);
  };

  const handleBackToFolders = () => {
    setItems(cachedCollections);
    setViewState("collections");
    setSelectedFrame(null);
  };

  const toggleColorCorrection = () => {
    setColorCorrection((prev) => !prev);
  };

  const getFullImageUrl = (url: string | null) => {
    if (!url) return "/placeholder.png";
    return url.startsWith("http") ? url : `${BASE_IMG_URL}${url}`;
  };

  const getFrameStyle = () => {
    if (!selectedFrame) return {};

    if (selectedFrame.segment_url) {
      return {
        border: "35px solid transparent",
        borderImageSource: `url(${getFullImageUrl(
          selectedFrame.segment_url
        )})`,
        borderImageSlice: "10",
        borderImageRepeat: "no-repeat",
        boxShadow:
          "inset 0 0 20px rgba(0,0,0,0.5), 10px 10px 30px rgba(0,0,0,0.4)",
      };
    }

    return {
      border: `35px ridge ${selectedFrame.color || "#333"}`,
      boxShadow:
        "inset 0 0 10px rgba(0,0,0,0.5), 10px 10px 30px rgba(0,0,0,0.4)",
    };
  };

  const handleAddToCart = () => {
    const cartItem = {
      _id: product._id || Date.now().toString(),
      productTitle: product.title || "Untitled Artwork",
      // Static price: jeita product e set kora
      price: product.price || 0,
      category: "art",
      image: product.image,
      quantity,
      framingConfig: {
        frame: selectedFrame,
        mat: selectedMat,
        glazing: selectedGlazing,
        options: {
          quantity,
          colorCorrection,
        },
        timestamp: new Date().toISOString(),
      },
    };

    add(cartItem);
    toast.success("Added to cart!");
  };

  return (
    <div className="min-h-screen bg-white">
      <LivePreviewARModal
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
        imageSrc={product.image}
      />
      <WallPreviewTool
        isOpen={isWallViewOpen}
        onClose={() => setIsWallViewOpen(false)}
        productImage={product.image}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 p-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-5 right-5 text-white"
          >
            <X size={40} />
          </button>
          <Image
            src={product.image}
            alt="Zoom"
            width={1000}
            height={1000}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          
          {/* PREVIEW AREA */}
          <div className="relative md:sticky md:top-4 flex flex-col items-center w-full z-10">
            <div className="w-full relative mb-4 flex items-center justify-center  min-h-[500px] transition-all duration-300">
              <div className="relative inline-block transition-all duration-300 ease-in-out">
                {/* 🖼️ FRAME VISUAL */}
                <div
                  style={{
                    ...getFrameStyle(),
                    display: "inline-block",
                    backgroundColor: selectedMat ? selectedMat.color : "#fff",
                  }}
                >
                  <div style={{ padding: selectedMat ? "30px" : "0px" }}>
                    <img
                      src={product?.image}
                      alt="Art"
                      className="max-h-[450px] w-auto block"
                      style={{
                        boxShadow: selectedMat
                          ? "inset 2px 2px 5px rgba(0,0,0,0.3), 1px 1px 0px rgba(255,255,255,0.2)"
                          : "none",
                        border: selectedMat
                          ? "1px solid rgba(0,0,0,0.1)"
                          : "none",
                      }}
                    />
                  </div>
                </div>

                {/* ✨ GLAZING */}
                {selectedGlazing && (
                  <div
                    className="absolute inset-0 z-20 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.1) 100%)",
                      mixBlendMode: "soft-light",
                    }}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-center gap-6 border-t border-gray-200 pt-4 w-full">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex flex-col items-center gap-1 text-gray-500 hover:text-black text-xs uppercase tracking-wide"
              >
                <Maximize2 size={20} /> Zoom
              </button>
              <button
                onClick={() => setIsWallViewOpen(true)}
                className="flex flex-col items-center gap-1 text-gray-500 hover:text-black text-xs uppercase tracking-wide"
              >
                <ImageIcon size={20} /> Wall View
              </button>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="relative z-0">
            <div className="flex flex-col gap-1 mb-4">
              <h1 className="text-3xl font-light tracking-wide text-gray-900">
                {product.title || "Untitled Artwork"}
              </h1>

              {typeof product.price === "number" && (
                <p className="text-xl font-medium text-gray-800">
                  ${product.price.toFixed(2)}
                </p>
              )}
            </div>

            {/* Color Correction Option (no price text) */}
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={colorCorrection}
                  onChange={toggleColorCorrection}
                  className="w-4 h-4 text-black focus:ring-black focus:ring-2 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-700">
                  Add Professional Color Correction
                </span>
              </label>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex gap-4 mb-8">
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-20 border border-gray-300 text-center p-3 text-lg focus:outline-none focus:border-black"
                />
                <div className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                  Qty
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white uppercase text-sm font-bold tracking-widest hover:bg-gray-800 transition py-3"
              >
                Add Framed Art To Cart
              </button>
            </div>

            {/* FRAMING PANEL */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* FRAME SELECTION */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() =>
                    setActiveSection(
                      activeSection === "selection" ? null : "selection"
                    )
                  }
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 font-bold text-sm text-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <span>1. Select Frame</span>
                  </div>
                  {activeSection === "selection" ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>

                {activeSection === "selection" && (
                  <div className="p-4 bg-white">
                    {viewState === "frames" && (
                      <button
                        onClick={handleBackToFolders}
                        className="mb-3 text-sm text-blue-600 flex items-center gap-1 hover:underline"
                      >
                        ← Back to Styles
                      </button>
                    )}

                    {loading ? (
                      <div className="py-8 text-center text-gray-400">
                        Loading...
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-1">
                        {viewState === "frames" && (
                          <div
                            onClick={() => setSelectedFrame(null)}
                            className={`cursor-pointer border-2 p-3 flex flex-col items-center justify-center min-h-[120px] ${
                              !selectedFrame
                                ? "border-black bg-gray-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="h-12 w-12 border-2 border-dashed border-gray-300 mb-2 bg-white"></div>
                            <span className="text-xs font-medium">
                              No Frame
                            </span>
                          </div>
                        )}

                        {items.map((item: any) => (
                          <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={`cursor-pointer border-2 p-2 flex flex-col items-center ${
                              selectedFrame?.id === item.id
                                ? "border-blue-600 ring-2 ring-blue-100"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="h-20 w-full relative bg-gray-100 mb-2 overflow-hidden">
                              {viewState === "collections" && (
                                <span className="absolute top-0 right-0 bg-gray-800 text-white text-[8px] px-1">
                                  Collection
                                </span>
                              )}
                              <img
                                src={getFullImageUrl(item.displayImage)}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-xs font-medium text-center truncate w-full">
                              {item.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* MAT SELECTION */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() =>
                    setActiveSection(activeSection === "mat" ? null : "mat")
                  }
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 font-bold text-sm text-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <span>2. Add Mat</span>
                  </div>
                  {activeSection === "mat" ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>

                {activeSection === "mat" && (
                  <div className="p-4 bg-white">
                    <div className="mb-3">
                      <button
                        onClick={() => handleMatChange(null)}
                        className={`px-4 py-2 text-sm border ${
                          !selectedMat
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        No Mat
                      </button>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-60 overflow-y-auto">
                      {mats.map((mat: any) => (
                        <div
                          key={mat.id}
                          onClick={() => handleMatChange(mat)}
                          className={`cursor-pointer border-2 p-1 flex flex-col items-center ${
                            selectedMat?.id === mat.id
                              ? "border-blue-600 ring-1 ring-blue-100"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className="w-full h-16 mb-1 rounded-sm"
                            style={{ backgroundColor: mat.color }}
                            title={mat.name}
                          />
                          <span className="text-[10px] text-center truncate w-full">
                            {mat.name}
                          </span>
                          {mat.thickness && (
                            <span className="text-[8px] text-gray-500">
                              {mat.thickness}/16&quot;
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* GLAZING SELECTION */}
              <div>
                <button
                  onClick={() =>
                    setActiveSection(
                      activeSection === "glaze" ? null : "glaze"
                    )
                  }
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 font-bold text-sm text-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <span>3. Glazing</span>
                  </div>
                  {activeSection === "glaze" ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>

                {activeSection === "glaze" && (
                  <div className="p-4 bg-white">
                    <div className="mb-3">
                      <button
                        onClick={() => handleGlazingChange(null)}
                        className={`px-4 py-2 text-sm border ${
                          !selectedGlazing
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        No Glazing
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {glazing.map((glaze: any) => (
                        <div
                          key={glaze.id}
                          onClick={() => handleGlazingChange(glaze)}
                          className={`cursor-pointer border-2 p-3 flex flex-col items-center justify-center ${
                            selectedGlazing?.id === glaze.id
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-medium text-sm mb-1">
                              {glaze.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {glaze.description || "Protective covering"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Konfig summary / size / price breakdown kichui nai */}
          </div>
        </div>
      </div>
    </div>
  );
}
