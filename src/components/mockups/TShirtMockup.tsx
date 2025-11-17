"use client";

import { useState } from "react";

interface TShirtMockupProps {
  image: string;
}

type ColorMap = Record<string, string>;
type SizeMap = Record<string, number>;
type CategoryImages = Record<string, Record<string, string>>;

const colorMap: ColorMap = {
  black: "#454545",
  army: "#4B5320",
  yellow: "#FFD700",
  orange: "#FFA500",
  babyblue: "#89CFF0",
  brown: "#8B4513",
  pink: "#FFC0CB",
  leaf: "#228B22",
  teamPurple: "#6A0DAD",
  kellyGreen: "#4CBB17",
  ash: "#B2BEB5",
  silver: "#C0C0C0",
};

const sizeMap: SizeMap = {
  XS: 80,
  S: 90,
  M: 100,
  L: 110,
  XL: 120,
  "2XL": 130,
  "3XL": 140,
};

const categoryImages: CategoryImages = {
  "T-Shirts": {
    "Center Front": "/Bella_Canvas_Front_Overlay_mask.png",
    "Center Back": "/Bella_Canvas_Back_Overlay_mask.png",
  },
  Hoodies: {
    "Center Front": "/Gildan_Pullover_Hoodie_L_Front_Mask.png",
    "Center Back": "/Gildan_Pullover_Hoodie_L_Back_Mask.png",
  },
  "Tank Tops": {
    "Center Front": "/Bella_Front_Overlay_mask.png",
    "Center Back": "/Bella_Back_Overlay_mask.png",
  },
};

export default function TShirtMockup({ image }: TShirtMockupProps) {
  const [imageSize, setImageSize] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [printPlacement, setPrintPlacement] = useState<string>("Center Front");
  const [size, setSize] = useState<string>("XS");
  const [color, setColor] = useState<string>("black");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const availableApparel = ["T-Shirts", "Hoodies", "Tank Tops"];

  const overlayImage = selectedCategory
    ? categoryImages[selectedCategory]?.[printPlacement]
    : undefined;

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Product Category Selection */}
      <div className="w-full space-y-4">
        <h2 className="text-lg font-semibold">Select Product</h2>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {[
            "T-Shirts",
            "Hoodies",
            "Tank Tops",
            "Canvas",
            "Metal - White Gloss",
            "Wood",
            '1/4" Acrylic',
            "Tote Bags",
            "Throw Pillows",
            "Phone Cases",
            "Mugs",
            "Puzzles",
            "Porcelain Ornaments",
            "Metal Ornaments",
          ].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`p-2 border rounded ${
                selectedCategory === category
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Apparel Mockup UI */}
      {availableApparel.includes(selectedCategory ?? "") && (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mockup Display */}
          <div className="relative w-80 h-96 flex items-center justify-center">
            {/* Background Color */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: colorMap[color] || "#87CEEB" }}
            />

            {/* Base Product Overlay */}
            {overlayImage && (
              <img
                src={overlayImage}
                alt={`${selectedCategory} Overlay`}
                className="absolute inset-0 w-full h-full"
                style={{ zIndex: 1 }}
              />
            )}

            {/* Design Layer */}
            <img
              src={image}
              alt="Design"
              className="absolute"
              style={{
                width: `${(sizeMap[size] || 100) * (imageSize / 100)}%`,
                transform: `rotate(${rotation}deg)`,
                zIndex: 2,
              }}
            />
          </div>

          {/* Tools Panel */}
          <div className="w-80 space-y-4">
            <h2 className="text-lg font-semibold">Customize It</h2>

            {/* Image Size */}
            <div>
              <label className="block text-sm">Image Size</label>
              <input
                type="range"
                min={50}
                max={100}
                value={imageSize}
                onChange={(e) => setImageSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Rotation */}
            <div>
              <label className="block text-sm">Rotate</label>
              <input
                type="range"
                min={0}
                max={360}
                step={10}
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Placement */}
            <div>
              <label className="block text-sm">Print Placement</label>
              <select
                value={printPlacement}
                onChange={(e) => setPrintPlacement(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Center Front">Center Front</option>
                <option value="Center Back">Center Back</option>
              </select>
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm">Size</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {Object.keys(sizeMap).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm">Color</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {Object.keys(colorMap).map((clr) => (
                  <option key={clr} value={clr}>
                    {clr.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
