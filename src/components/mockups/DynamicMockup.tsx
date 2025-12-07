"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { DEFAULT_PRODUCTS, PHONE_MODELS } from "./mockupConfig";

export default function DynamicMockup({
  artwork,
  productType,
  phoneModelId,
  scale = 1,
  rotate = 0,
}: {
  artwork: string;
  productType: string;
  phoneModelId?: string;
  scale?: number;
  rotate?: number;
}) {
  // ১. কনফিগ লোড ও মকআপের সাইজ নির্ধারণ
  let config = DEFAULT_PRODUCTS[productType] || DEFAULT_PRODUCTS["hoodie"];

  // ফোন মডেল সিলেকশন লজিক
  if (productType === "phone" && phoneModelId && PHONE_MODELS[phoneModelId]) {
    config = {
      ...config,
      mask: PHONE_MODELS[phoneModelId].mask,
      overlay: PHONE_MODELS[phoneModelId].overlay,
      // ফোন মডেলের ডাইনামিক সাইজও কনফিগারে যোগ করা হলো
      width: PHONE_MODELS[phoneModelId].width || config.width,
      height: PHONE_MODELS[phoneModelId].height || config.height,
    };
  }

  const isFullCover = config.fullCover;

  // 📐 রেসপনসিভ লজিক: মকআপ কন্টেইনারের আকৃতির অনুপাত (Aspect Ratio) গণনা
  // এটি কন্টেইনারের স্থির উচ্চতা ঠিক না করে, প্রস্থের সাপেক্ষে উচ্চতা নির্ধারণ করবে
  const aspectRatio = useMemo(() => {
    // উচ্চতা / প্রস্থ * 100
    const w = config.width || 320;
    const h = config.height || 650;
    return `${(h / w) * 100}%`; // % এ রূপান্তর
  }, [config.width, config.height]);

  // ২. ড্র্যাগিং লজিক (অপরিবর্তিত)
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const handlePointerUp = () => {
    dragging.current = false;
  };

  // রিসেট (অপরিবর্তিত)
  useEffect(() => {
    setOffset({ x: 0, y: 0 });
  }, [productType, phoneModelId]);

  // ৩. ইমেজের পজিশন স্টাইল (অপরিবর্তিত)
  const getImageStyle = (): React.CSSProperties => {
    const transform = `translate(${offset.x}px, ${offset.y}px) rotate(${rotate}deg) scale(${scale})`;

    if (isFullCover) {
      // 📱 PHONE STYLE (আপনার লজিক: ছবি থাকবে নিচে, মাস্ক থাকবে উপরে)
      return {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        zIndex: 0, // সবার নিচে
        transform,
        transformOrigin: "center",
      };
    } else {
      // 👕 HOODIE STYLE (ছবি থাকবে বেস ইমেজের উপরে)
      const area = config.printArea || {
        top: 20,
        left: 20,
        width: 50,
        height: 50,
      };
      return {
        position: "absolute",
        top: `${area.top}%`,
        left: `${area.left}%`,
        width: `${area.width}%`,
        height: `${area.height}%`,
        objectFit: "contain",
        zIndex: 10, // বেসের উপরে
        transform,
        transformOrigin: "center",
      };
    }
  };

  return (
    // 🌐 বাইরের কন্টেইনার: সর্বোচ্চ প্রস্থ সেট করে
    <div className="flex justify-center items-center w-full max-w-lg mx-auto p-4">
      {/* 🖼️ মকআপ কন্টেইনার: রেসপনসিভ Aspect Ratio সহ */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          // Padding-Bottom Hack for Aspect Ratio
          paddingTop: aspectRatio, 
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* 🎨 ইনার কন্টেইনার: absolute পজিশনিং করে সব লেয়ারকে ধারণ করবে */}
        <div className="absolute inset-0 w-full h-full">
            
          {/* LAYER 0: BASE IMAGE (শুধুমাত্র হুডি/টিশার্টের জন্য) */}
          {!isFullCover && config.base && (
            <img
              src={config.base}
              alt="Base"
              className="absolute inset-0 w-full h-full object-contain z-0 pointer-events-none "
            />
          )}

          {/* LAYER 1: ARTWORK (আপনার ডিজাইন) */}
          <div style={getImageStyle()} className="pointer-events-auto">
            <img
              src={artwork}
              alt="Artwork"
              onPointerDown={handlePointerDown}
              className="w-full h-full cursor-move"
              draggable={false}
              style={{ objectFit: isFullCover ? "cover" : "contain" }}
            />
          </div>

          {/* LAYER 2: MASK (শুধুমাত্র ফোনের জন্য) */}
          {isFullCover && config.mask && (
            <img
              src={config.mask}
              alt="Mask"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none"
              style={{ zIndex: 10 }}
            />
          )}

          {/* LAYER 3: OVERLAY (শ্যাডো/গ্লস) */}
          {config.overlay && (
            <img
              src={config.overlay}
              alt="Overlay"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none"
              style={{ zIndex: 20 }}
            />
          )}
        </div>
      </div>
    </div>
  );
}