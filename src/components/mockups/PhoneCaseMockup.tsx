"use client";

import { useState } from "react";

interface PhoneCaseMapping {
  case: string;
  overlay: string;
}

const phoneCaseData: Record<string, PhoneCaseMapping> = {
  "iPhone 16": {
    case: "/Iphone_16_Snap_Mask.png",
    overlay: "/Iphone_16_Overlay.png",
  },
  "iPhone 16 Plus": {
    case: "/Iphone_16_Snap_Mask.png",
    overlay: "/Iphone_16_Plus_Snap_Overlay.png",
  },
  "iPhone 16 Pro": {
    case: "/Iphone_16_Snap_Mask.png",
    overlay: "/Iphone_16_Pro_Snap_Overlay.png",
  },
  "iPhone 16 Pro Max": {
    case: "/Iphone_16_Snap_Mask.png",
    overlay: "/Iphone_16_Pro_Max_Snap_Overlay.png",
  },
  "iPhone 15": {
    case: "/iPhone_15_Pro_Snap_Mask.png",
    overlay: "/iPhone_15_Snap_Overlay.png",
  },
  "iPhone 15 Plus": {
    case: "/iPhone_15_Pro_Snap_Mask.png",
    overlay: "/iPhone_15_Plus_Snap_Overlay.png",
  },
  "iPhone 15 Pro": {
    case: "/iPhone_15_Pro_Snap_Mask.png",
    overlay: "/iPhone_15_Pro_Snap_Overlay.png",
  },
  "iPhone 15 Pro Max": {
    case: "/iPhone_15_Pro_Snap_Mask.png",
    overlay: "/iPhone_15_Pro_Max_Snap_Overlay.png",
  },
  "iPhone 14": {
    case: "/iPhone_14_Pro_Snap_Mask.png",
    overlay: "/iPhone_14_Snap_Overlay.png",
  },
  "iPhone 14 Plus": {
    case: "/iPhone_14_Pro_Snap_Mask.png",
    overlay: "/iPhone_14_Plus_Snap_Overlay.png",
  },
  "iPhone 14 Pro": {
    case: "/iPhone_14_Pro_Snap_Mask.png",
    overlay: "/iPhone_14_Pro_Snap_Overlay.png",
  },
  "iPhone 14 Pro Max": {
    case: "/iPhone_14_Pro_Snap_Mask.png",
    overlay: "/iPhone_14_Pro_Max_Snap_Overlay.png",
  },
};

interface PhoneCaseMockupProps {
  image: string;
}

export default function PhoneCaseMockup({ image }: PhoneCaseMockupProps) {
  const [showMockup, setShowMockup] = useState(false);
  const [imageSize, setImageSize] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [phoneModel, setPhoneModel] = useState<string>("iPhone 16");

  const selectedCase = phoneCaseData[phoneModel];

  return (
    <div className="flex flex-col items-center p-5">
      {/* Show Button */}
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setShowMockup(true)}
      >
        Show Phone Case
      </button>

      {/* Mockup Preview */}
      {showMockup && (
        <div className="relative w-[300px] h-[600px] overflow-hidden">
          {/* Custom Design */}
          <img
            src={image}
            className="absolute w-full h-full object-cover"
            alt="Custom Design"
            style={{
              transform: `rotate(${rotation}deg) scale(${imageSize / 100})`,
            }}
          />

          {/* Case Mask */}
          <img
            src={selectedCase?.case}
            className="absolute w-full h-full"
            alt="Phone Case"
          />

          {/* Overlay */}
          <img
            src={selectedCase?.overlay}
            className="absolute w-full h-full"
            alt="Overlay"
          />
        </div>
      )}

      {/* Controls */}
      <div className="mt-4 space-y-2 w-full px-5">
        {/* Size Slider */}
        <div>
          <label className="block text-sm mb-1">Size</label>
          <input
            type="range"
            min="50"
            max="150"
            value={imageSize}
            onChange={(e) => setImageSize(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Rotation Slider */}
        <label className="block mb-1">Rotate</label>
        <input
          type="range"
          min="0"
          max="360"
          value={rotation}
          onChange={(e) => setRotation(Number(e.target.value))}
          className="w-full"
        />

        {/* Phone Model Dropdown */}
        <label className="block mb-1">Phone Model</label>
        <select
          className="p-2 border w-full"
          value={phoneModel}
          onChange={(e) => setPhoneModel(e.target.value)}
        >
          {Object.keys(phoneCaseData).map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
