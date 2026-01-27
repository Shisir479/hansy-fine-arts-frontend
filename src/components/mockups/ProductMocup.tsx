"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Maximize2,
  X,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Check,
  Info,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import LivePreviewARModal from "../preview/LivePreviewARModal";
import WallPreviewTool from "../preview/RoomPreview";

// --- CONFIGURATION ---
const BASE_IMG_URL = "https://finerworks.com";
const API_URL = "http://localhost:5000/api/v1/finerworks";

// FALLBACK DATA
const FALLBACK_MEDIA = [
  {
    name: "Fine Art Paper",
    code: "GICLEE-ARCHIVAL-MATTE",
    description: "Archival Matte Paper",
  },
  {
    name:  "Canvas Satin",
    code: "CANVAS-SATIN-MUSEUM",
    description: "Premium Satin Canvas",
  },
];

export default function ProductMockup({
  product,
}:  {
  product: {
    image: string;
    title?:  string;
    price?: number;
    _id?: string;
    sku?: string;
  };
}) {
  const { add } = useCart();

  const [loadingOptions, setLoadingOptions] = useState(false);
  const [isPricingLoading, setIsPricingLoading] = useState(false);

  // Data State
  const [mediaOptions, setMediaOptions] = useState<any[]>(FALLBACK_MEDIA);
  const [items, setItems] = useState<any[]>([]);
  const [mats, setMats] = useState<any[]>([]);
  const [glazing, setGlazing] = useState<any[]>([]);

  // Selection State
  const [selectedMedia, setSelectedMedia] = useState<any>(FALLBACK_MEDIA[0]);
  const [selectedFrame, setSelectedFrame] = useState<any>(null);
  const [selectedMat, setSelectedMat] = useState<any>(null);
  const [selectedGlazing, setSelectedGlazing] = useState<any>(null);

  // Config State
  const [printWidth] = useState<number>(12);
  const [printHeight] = useState<number>(18);
  const [matWidth, setMatWidth] = useState<number>(2.0);
  const [quantity, setQuantity] = useState(1);

  // Pricing State
  const [printCost, setPrintCost] = useState<number>(0);
  const [frameCost, setFrameCost] = useState<number>(0);
  const [matCost, setMatCost] = useState<number>(0);
  const [glazingCost, setGlazingCost] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [pricingMethod, setPricingMethod] = useState<string>("");

  // UI State
  const [viewState, setViewState] = useState<"collections" | "frames">("collections");
  const [cachedCollections, setCachedCollections] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>("media");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);
  const [isWallViewOpen, setIsWallViewOpen] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // 🔥 NEW: Track image dimensions
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // 🔥 Load image dimensions
  useEffect(() => {
    const img = new window.Image();
    img.src = product.image;
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
  }, [product.image]);

  // --- INITIAL LOAD ---
  useEffect(() => {
    const fetchAllData = async () => {
      setLoadingOptions(true);
      try {
        try {
          const mediaRes = await fetch(`${API_URL}/prints/product-types`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: [1, 2, 3, 4, 8] }),
          });

          if (mediaRes.ok) {
            const mediaData = await mediaRes.json();
            let list =
              mediaData.product_types ||
              mediaData.data?.product_types ||
              mediaData;

            if (Array.isArray(list) && list.length > 0) {
              setMediaOptions(list);
              setSelectedMedia(list[0]);
            }
          }
        } catch (e) {
          console.warn("Media fetch failed, using fallback");
        }

        const [frameRes, matRes, glazeRes] = await Promise.allSettled([
          fetch(`${API_URL}/framing/collections`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          }),
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

        const getJson = async (res: any) =>
          res.status === "fulfilled" && res.value.ok
            ? await res.value.json()
            : {};
        const frameData = await getJson(frameRes);
        const matData = await getJson(matRes);
        const glazeData = await getJson(glazeRes);

        let cols = frameData.data?.collections || frameData.collections || [];
        const mappedCollections = cols.map((c: any) => ({
          ... c,
          displayImage: c.icon_url_1 || c.image_1,
          type: "folder",
        }));
        setItems(mappedCollections);
        setCachedCollections(mappedCollections);

        if (matData.data?. mats) setMats(matData.data. mats);
        if (glazeData.data?.glazing) setGlazing(glazeData.data.glazing);
      } catch (error) {
        toast.error("Some options couldn't load");
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchAllData();
  }, []);

  const calculatePrice = useCallback(async () => {
    if (!printWidth || !printHeight || !selectedMedia) {
      setTotalPrice(product.price || 0);
      return;
    }

    setIsPricingLoading(true);
    setPrintCost(0);
    setFrameCost(0);
    setMatCost(0);
    setGlazingCost(0);

    try {
      const artworkPrice = product.price || 0;
      let printPrice = 0;
      let framePrice = 0;
      let matPrice = 0;
      let glazePrice = 0;

      try {
        const printPayload = {
          products: [
            {
              product_qty: 1,
              product_sku: `${selectedMedia.code}-${printWidth}X${printHeight}`,
            },
          ],
        };

        const printRes = await fetch(`${API_URL}/prints/prices`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(printPayload),
        });

        if (printRes.ok) {
          const printData = await printRes.json();
          if (printData.data?.products?.[0]?.unit_price) {
            printPrice = printData.data.products[0]. unit_price;
            setPrintCost(printPrice);
          }
        }
      } catch (err) {
        console.warn("⚠️ Print price fetch failed");
        printPrice = printWidth * printHeight * 0.5 + 10;
        setPrintCost(printPrice);
      }

      if (selectedFrame || selectedMat || selectedGlazing) {
        try {
          const totalWidth = printWidth + (selectedMat ?  matWidth * 2 : 0);
          const totalHeight = printHeight + (selectedMat ? matWidth * 2 : 0);

          const framePayload:  any = {
            product_code: null,
            config:  {
              frame_id: selectedFrame?.id || 0,
              width: totalWidth,
              height:  totalHeight,
              units: 0,
            },
            render:  {
              content_type: 0,
              render_size: 500,
              squared: false,
              shadow_inner: false,
              prompt_image: false,
              frame_image_to_display_url: null,
            },
          };

          if (selectedMat) {
            framePayload.config.mats = [
              {
                id: selectedMat.id,
                windows: [
                  {
                    width: printWidth,
                    height: printHeight,
                    window_x: 0,
                    window_y: 0,
                    mat_image_to_display_url: null,
                  },
                ],
              },
            ];
          }

          if (selectedGlazing) {
            framePayload.config.glazing = { id: selectedGlazing.id };
          }

          const frameRes = await fetch(`${API_URL}/prints/frame-builder`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(framePayload),
          });

          if (frameRes.ok) {
            const frameData = await frameRes.json();
            const data = frameData.data || frameData;

            if (data.frame?. starting_price) {
              framePrice = data.frame.starting_price;
            }

            if (selectedMat) {
              const apiMat = Array.isArray(data.mats)
                ? data.mats. find((m: any) => m.id === selectedMat.id)
                : null;

              const baseMat =
                apiMat && apiMat.starting_price > 0
                  ? apiMat
                  : mats.find((m: any) => m.id === selectedMat.id);

              if (baseMat?. starting_price) {
                matPrice = baseMat.starting_price;
              }
            }

            if (selectedGlazing) {
              const apiGlaze = data.glazing;
              let baseGlaze:  any = apiGlaze;

              if (! baseGlaze || baseGlaze.starting_price === 0) {
                baseGlaze = glazing.find((g: any) => g.id === selectedGlazing.id);
              }

              if (baseGlaze?.starting_price) {
                glazePrice = baseGlaze.starting_price;
              }
            }

            setFrameCost(framePrice);
            setMatCost(matPrice);
            setGlazingCost(glazePrice);
            setPricingMethod("frame_builder");
          }
        } catch (err:  any) {
          console.warn("⚠️ Frame Builder failed");
          setPricingMethod("estimated");
        }
      }

      const finerworksTotal = printPrice + framePrice + matPrice + glazePrice;
      const grandTotal = artworkPrice + finerworksTotal;
      setTotalPrice(grandTotal);
    } catch (error) {
      console.error("❌ Pricing Error:", error);
      setTotalPrice(product.price || 0);
    } finally {
      setIsPricingLoading(false);
    }
  }, [
    printWidth,
    printHeight,
    selectedMedia,
    selectedFrame,
    selectedMat,
    selectedGlazing,
    matWidth,
    product.price,
    mats,
    glazing,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => calculatePrice(), 600);
    return () => clearTimeout(timer);
  }, [calculatePrice]);

  const handleItemClick = async (item: any) => {
    if (viewState === "collections") {
      setLoadingOptions(true);
      try {
        const res = await fetch(`${API_URL}/framing/collections`, {
          method: "POST",
          headers:  { "Content-Type": "application/json" },
          body:  JSON.stringify({ id: item.id }),
        });
        const data = await res.json();

        let targetFrames:  any[] = [];
        if (data.frames && Array.isArray(data.frames))
          targetFrames = data. frames;
        else if (data.collections?.[0]?.frames)
          targetFrames = data.collections[0].frames;
        else if (data.data?.collections?.[0]?.frames)
          targetFrames = data.data.collections[0].frames;

        if (targetFrames. length > 0) {
          const frameList = targetFrames.map((f: any) => ({
            ... f,
            displayImage: f.sample_image_url_1 || f.image_url || f.segment_url,
            type: "frame",
          }));
          setItems(frameList);
          setViewState("frames");
        } else {
          toast.error("No frames found");
        }
      } catch (err) {
        toast.error("Could not load frames");
      } finally {
        setLoadingOptions(false);
      }
    } else {
      setSelectedFrame(item);
    }
  };

  const handleBackToFolders = () => {
    setItems(cachedCollections);
    setViewState("collections");
    setSelectedFrame(null);
  };

  const getFullImageUrl = (url: string | null) => {
    if (!url) return "/placeholder.png";
    return url.startsWith("http") ? url : `${BASE_IMG_URL}${url}`;
  };

  const getFrameStyle = () => {
    if (! selectedFrame) return {};

    const frameWidth = 40;
    const segmentUrl = getFullImageUrl(
      selectedFrame.segment_url || selectedFrame.image_url
    );

    return {
      borderStyle: "solid" as const,
      borderWidth:  `${frameWidth}px`,
      borderImageSource: `url(${segmentUrl})`,
      borderImageSlice: "30 fill",
      boxSizing: "border-box" as const,
      boxShadow: 
        "inset 0 0 20px rgba(0,0,0,0.25), 0 10px 30px rgba(0,0,0,0.5)",
    };
  };

  const handleAddToCart = () => {
    if (totalPrice === 0) {
      toast.error("Waiting for price.. .");
      return;
    }
    add({
      _id: product._id || Date.now().toString(),
      productTitle: product.title || "Custom Framed Art",
      price: totalPrice,
      category: "art",
      image: product.image,
      quantity,
    });
    toast.success("Added to Cart!");
  };

  const finerworksCost = printCost + frameCost + matCost + glazingCost;
  const artworkPrice = product.price || 0;

  // 🔥 UPDATED: Calculate responsive image size (SMALLER)
  const getResponsiveImageStyle = () => {
    if (imageDimensions.width === 0 || imageDimensions.height === 0) {
      return { width: "auto", height: "auto" };
    }

    const aspectRatio = imageDimensions. width / imageDimensions.height;
    const isPortrait = aspectRatio < 1;
    const isLandscape = aspectRatio > 1.3;

    // 🔥 REDUCED SIZE: Mobile max 75vw, Desktop max 400px
    const maxWidth = typeof window !== 'undefined' && window.innerWidth < 768 ? '75vw' : '400px';
    const maxHeight = typeof window !== 'undefined' && window.innerWidth < 768 ? '60vh' : '500px';
    
    if (isPortrait) {
      return {
        width: "auto",
        maxWidth:  maxWidth,
        height: "auto",
        maxHeight: maxHeight,
      };
    } else if (isLandscape) {
      return {
        width: "100%",
        maxWidth: maxWidth,
        height: "auto",
        maxHeight: maxHeight,
      };
    } else {
      return {
        width: "auto",
        maxWidth: maxWidth,
        height:  "auto",
        maxHeight:  maxHeight,
        aspectRatio: `${imageDimensions.width} / ${imageDimensions.height}`,
      };
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <Image
            src={product.image}
            alt="Zoom"
            width={1200}
            height={1200}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT:  BIG PREVIEW */}
          <div className="lg:sticky lg:top-4 lg:h-fit">
            {/* 🔥 IMAGE CONTAINER */}
            <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center min-h-[400px] lg:min-h-[600px] relative p-6 lg:p-10">
              <div className="relative flex items-center justify-center">
                {/* FRAME */}
                {selectedFrame ?  (
                  <div style={getFrameStyle()}>
                    {/* MAT */}
                    <div
                      style={{
                        backgroundColor: selectedMat ? selectedMat.color : "transparent",
                        padding: selectedMat ? `${matWidth * 10}px` : "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* ARTWORK */}
                      <div className="relative bg-white shadow-2xl">
                        <img
                          src={product.image}
                          alt="Art Preview"
                          className="block"
                          style={getResponsiveImageStyle()}
                        />
                        {selectedGlazing && (
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: 
                                "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)",
                              mixBlendMode: "overlay",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // NO FRAME
                  <div>
                    <div
                      style={{
                        backgroundColor: selectedMat ? selectedMat.color : "transparent",
                        padding: selectedMat ? `${matWidth * 10}px` : "0",
                        boxShadow: selectedMat ?  "0 10px 30px rgba(0,0,0,0.3)" : "none",
                      }}
                    >
                      <div className="relative bg-white shadow-2xl">
                        <img
                          src={product.image}
                          alt="Art Preview"
                          className="block"
                          style={getResponsiveImageStyle()}
                        />
                        {selectedGlazing && (
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: 
                                "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)",
                              mixBlendMode: "overlay",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 🔥 BUTTONS OUTSIDE IMAGE (BELOW) */}
            <div className="flex gap-3 justify-center mt-4 bg-white px-6 py-3 shadow-md border border-gray-200">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide hover:text-blue-600 transition-colors"
              >
                <Maximize2 size={16} /> Zoom
              </button>
              <div className="w-px bg-gray-300"></div>
              <button
                onClick={() => setIsWallViewOpen(true)}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide hover:text-blue-600 transition-colors"
              >
                <ImageIcon size={16} /> Wall View
              </button>
            </div>
          </div>

          {/* RIGHT: OPTIONS - KEEP YOUR EXISTING CODE */}
          <div className="flex flex-col">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h1 className="text-xl lg:text-2xl font-normal mb-3 text-gray-900">
                {product.title || "Custom Framed Art"}
              </h1>

              <div className="mb-5">
                {isPricingLoading ? (
                  <div className="flex items-center gap-3 text-gray-500">
                    <Loader2 className="animate-spin" size={18} />
                    <span className="text-sm">Calculating price...</span>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl lg:text-3xl font-normal text-gray-900 mb-1">
                      ${(totalPrice * quantity).toFixed(2)}
                    </div>
                    {quantity > 1 && (
                      <div className="text-xs text-gray-500">
                        ${totalPrice. toFixed(2)} each
                      </div>
                    )}
                    {pricingMethod === "estimated" && finerworksCost > 0 && (
                      <div className="flex items-center gap-1. 5 mt-1 text-amber-600">
                        <Info size={12} />
                        <span className="text-xs">Estimated pricing</span>
                      </div>
                    )}
                  </div>
                )}

                {finerworksCost > 0 && ! isPricingLoading && (
                  <button
                    onClick={() => setShowBreakdown(! showBreakdown)}
                    className="text-xs text-blue-600 hover: underline mt-2 flex items-center gap-1"
                  >
                    {showBreakdown ? (
                      <ChevronUp size={12} />
                    ) : (
                      <ChevronDown size={12} />
                    )}
                    {showBreakdown ? "Hide" : "Show"} price breakdown
                  </button>
                )}

                {showBreakdown && finerworksCost > 0 && (
                  <div className="mt-3 bg-gray-50 border border-gray-200 p-3 space-y-1. 5 text-xs">
                    <div className="flex justify-between font-semibold pb-1.5 border-b text-sm">
                      <span>Price Breakdown</span>
                      <span className="text-[10px] text-gray-500 uppercase">
                        {pricingMethod === "frame_builder"
                          ? "Live API"
                          : "Estimated"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Artwork (Digital)</span>
                      <span>${artworkPrice.toFixed(2)}</span>
                    </div>
                    {printCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Print ({printWidth}&quot;×{printHeight}&quot;{" "}
                          {selectedMedia?. name})
                        </span>
                        <span>${printCost.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedFrame && frameCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Frame ({selectedFrame.name})
                        </span>
                        <span>${frameCost.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedMat && matCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Mat Board ({matWidth}&quot; {selectedMat.name})
                        </span>
                        <span>${matCost.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedGlazing && glazingCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Glazing ({selectedGlazing.name})
                        </span>
                        <span>${glazingCost.toFixed(2)}</span>
                      </div>
                    )}
                    {quantity > 1 && (
                      <div className="flex justify-between text-gray-500">
                        <span>Quantity</span>
                        <span>×{quantity}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-1.5 border-t font-bold text-sm">
                      <span>Total</span>
                      <span>${(totalPrice * quantity).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <label className="absolute -top-2 left-2 bg-white px-1 text-[9px] font-semibold text-gray-500 uppercase">
                    QTY
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 h-11 border-2 border-gray-300 text-center text-base font-semibold focus:border-black focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isPricingLoading || totalPrice === 0}
                  className="flex-1 bg-black text-white h-11 font-bold text-sm uppercase tracking-wider hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isPricingLoading ?  "Calculating..." : "Add to Cart"}
                </button>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-gray-500 mt-3">
                <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                <p>
                  Production time: 2-3 business days.  Arrives ready to hang.
                </p>
              </div>
            </div>
            {/* OPTIONS - KEEPING YOUR EXISTING CODE */}
            <div className="space-y-3">
              {/* 1. MATERIAL */}
              <div className="border border-gray-300">
                <button
                  onClick={() =>
                    setActiveSection(
                      activeSection === "media" ? null : "media"
                    )
                  }
                  className="w-full flex justify-between items-center p-3 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs uppercase tracking-wide">
                      1. Select Material
                    </span>
                    {selectedMedia && (
                      <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5">
                        {selectedMedia.name}
                      </span>
                    )}
                  </div>
                  {activeSection === "media" ?  (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {activeSection === "media" && (
                  <div className="p-3 bg-white border-t border-gray-200 space-y-2">
                    {mediaOptions.map((media, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedMedia(media)}
                        className={`p-2.5 border-2 cursor-pointer flex justify-between items-center transition-all ${
                          selectedMedia?. code === media.code
                            ?  "border-black bg-gray-50"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-xs">
                            {media.name}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {media.description}
                          </div>
                        </div>
                        {selectedMedia?.code === media. code && (
                          <Check size={16} className="text-black" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. FRAME */}
              <div className="border border-gray-300">
                <button
                  onClick={() =>
                    setActiveSection(
                      activeSection === "frame" ? null : "frame"
                    )
                  }
                  className="w-full flex justify-between items-center p-3 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs uppercase tracking-wide">
                      2. Select Frame
                    </span>
                    {selectedFrame && (
                      <span className="text-[10px] bg-black text-white px-2 py-0.5">
                        {selectedFrame.name}
                      </span>
                    )}
                  </div>
                  {activeSection === "frame" ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {activeSection === "frame" && (
                  <div className="p-3 bg-white border-t border-gray-200">
                    {viewState === "frames" && (
                      <button
                        onClick={handleBackToFolders}
                        className="text-[10px] font-semibold text-blue-600 mb-3 hover:underline uppercase"
                      >
                        ← Back to Collections
                      </button>
                    )}
                    {loadingOptions ?  (
                      <div className="h-32 flex items-center justify-center text-gray-400">
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Loading... 
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2 max-h-72 overflow-y-auto">
                        {viewState === "frames" && (
                          <div
                            onClick={() => setSelectedFrame(null)}
                            className={`aspect-square border-2 flex items-center justify-center cursor-pointer text-center ${
                              ! selectedFrame
                                ? "border-black bg-gray-50"
                                : "border-gray-200 hover:border-gray-400"
                            }`}
                          >
                            <span className="text-[9px] font-bold text-gray-400 px-1">
                              NO FRAME
                            </span>
                          </div>
                        )}
                        {items.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={`aspect-square border-2 p-1 cursor-pointer ${
                              selectedFrame?.id === item.id
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200 hover:border-gray-400"
                            }`}
                          >
                            <div className="h-2/3 mb-0.5">
                              <img
                                src={getFullImageUrl(item.displayImage)}
                                className="w-full h-full object-contain"
                                alt={item. name}
                              />
                            </div>
                            <p className="text-[8px] text-center font-medium leading-tight truncate px-0.5">
                              {item.name}
                            </p>
                            {item.starting_price && viewState === "frames" && (
                              <p className="text-[7px] text-center text-gray-500 mt-0.5">
                                from ${item.starting_price.toFixed(2)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 3. MAT */}
              <div className="border border-gray-300">
                <button
                  onClick={() =>
                    setActiveSection(activeSection === "mat" ? null :  "mat")
                  }
                  className="w-full flex justify-between items-center p-3 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs uppercase tracking-wide">
                      3. Mat Board
                    </span>
                    {selectedMat && (
                      <span className="text-[10px] bg-gray-300 text-black px-2 py-0.5">
                        {matWidth}&quot; {selectedMat.name}
                      </span>
                    )}
                  </div>
                  {activeSection === "mat" ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {activeSection === "mat" && (
                  <div className="p-3 bg-white border-t border-gray-200">
                    <div className="flex justify-between items-center mb-3 pb-3 border-b">
                      <button
                        onClick={() => setSelectedMat(null)}
                        className={`text-[10px] border-2 px-3 py-1.5 font-bold uppercase ${
                          !selectedMat
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                      >
                        No Mat
                      </button>
                    </div>
                    <div className="grid grid-cols-6 gap-1. 5 max-h-52 overflow-y-auto">
                      {mats.map((mat) => (
                        <div
                          key={mat.id}
                          onClick={() => setSelectedMat(mat)}
                          className={`cursor-pointer border-2 p-0.5 ${
                            selectedMat?.id === mat.id
                              ?  "border-blue-600"
                              : "border-transparent hover:border-gray-300"
                          }`}
                        >
                          <div
                            className="w-full h-8 border border-gray-200"
                            style={{ backgroundColor: mat.color }}
                          ></div>
                          <p className="text-[8px] text-center mt-0.5 truncate">
                            {mat. name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. GLAZING */}
              <div className="border border-gray-300">
                <button
                  onClick={() =>
                    setActiveSection(
                      activeSection === "glaze" ? null : "glaze"
                    )
                  }
                  className="w-full flex justify-between items-center p-3 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs uppercase tracking-wide">
                      4. Glazing
                    </span>
                    {selectedGlazing && (
                      <span className="text-[10px] bg-gray-300 text-black px-2 py-0.5">
                        {selectedGlazing.name}
                      </span>
                    )}
                  </div>
                  {activeSection === "glaze" ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {activeSection === "glaze" && (
                  <div className="p-3 bg-white border-t border-gray-200 space-y-2">
                    <div
                      onClick={() => setSelectedGlazing(null)}
                      className={`p-2.5 border-2 cursor-pointer font-semibold text-xs ${
                        !selectedGlazing
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      None
                    </div>
                    {glazing.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => setSelectedGlazing(g)}
                        className={`p-2.5 border-2 cursor-pointer ${
                          selectedGlazing?. id === g.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="font-semibold text-xs">{g.name}</div>
                        <div className="text-[10px] text-gray-500">
                          {g. description}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}