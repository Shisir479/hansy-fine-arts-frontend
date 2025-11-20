"use client";
import React, { useRef, useState, useEffect } from "react";
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
  // ১. কনফিগ লোড
  let config = DEFAULT_PRODUCTS[productType] || DEFAULT_PRODUCTS["hoodie"];

  // ফোন মডেল সিলেকশন লজিক
  if (productType === "phone" && phoneModelId && PHONE_MODELS[phoneModelId]) {
    config = {
      ...config,
      mask: PHONE_MODELS[phoneModelId].mask,
      overlay: PHONE_MODELS[phoneModelId].overlay,
    };
  }

  const isFullCover = config.fullCover;

  // ২. ড্র্যাগিং লজিক
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

  // রিসেট
  useEffect(() => {
    setOffset({ x: 0, y: 0 });
  }, [productType, phoneModelId]);

  // ৩. ইমেজের পজিশন স্টাইল
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
    <div className="flex justify-center items-center w-full">
      <div
        className="relative overflow-hidden"
        style={{
          width: config.width || 320,
          height: config.height || 650,
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* LAYER 0: BASE IMAGE (শুধুমাত্র হুডি/টিশার্টের জন্য) */}
        {!isFullCover && config.base && (
          <img
            src={config.base}
            alt="Base"
            className="absolute inset-0 w-full h-full object-contain z-0 pointer-events-none"
          />
        )}

        {/* LAYER 1: ARTWORK (আপনার ডিজাইন) */}
        <div style={getImageStyle()} className="pointer-events-auto">
          <img
            src={artwork}
            onPointerDown={handlePointerDown}
            className="w-full h-full cursor-move"
            draggable={false}
            style={{ objectFit: isFullCover ? "cover" : "contain" }}
          />
        </div>

        {/* LAYER 2: MASK (শুধুমাত্র ফোনের জন্য) */}
        {/* আপনার লজিক: এই ইমেজটা ছবির উপরে বসবে এবং মাঝখানটা ফাঁকা থাকবে */}
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
  );
}
