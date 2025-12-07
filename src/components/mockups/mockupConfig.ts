// components/mockups/mockupConfig.ts

export type ProductConfig = {
  id: string;
  label: string;
  type: "apparel" | "phone" | "mug" | "pillow" | "tote" | "puzzle" | "ornament";
  base?: string | null; // হুডি/টিশার্টের মেইন বডি ইমেজ
  mask?: string | null; // ফোন বা মগের হ্যান্ডেল (যার মাঝখান বা পাশ ট্রান্সপারেন্ট)
  overlay?: string | null; // শ্যাডো, ভাজ বা গ্লস
  width?: number;
  height?: number;
  fullCover: boolean; // True = ছবি নিচে (ফোন), False = ছবি উপরে (জামা)
  // জামার জন্য প্রিন্ট এরিয়া (শতাংশে)
  printArea?: {
    top: number;
    left: number;
    width: number;
    height: number;
  } | null;
};
// 📱 PHONE MODELS LIST (iPhone 14 - 16)
export const PHONE_MODELS: Record<string, { mask: string; overlay: string; width?: number; height?: number }> = {
  // iPhone 16 Series
  iphone16: {
    mask: "/Iphone_16_Snap_Mask.png",
    overlay: "/Iphone_16_Overlay.png",
  },
  iphone16plus: {
    mask: "/Iphone_16_Snap_Mask.png", // Plus এর মাস্ক আলাদা হতে পারে, চেক করে নিয়েন
    overlay: "/Iphone_16_Plus_Snap_Overlay.png",
  },
  iphone16pro: {
    mask: "/Iphone_16_Snap_Mask.png",
    overlay: "/Iphone_16_Pro_Snap_Overlay.png",
  },
  iphone16promax: {
    mask: "/Iphone_16_Snap_Mask.png",
    overlay: "/Iphone_16_Pro_Max_Snap_Overlay.png",
  },

  // iPhone 15 Series
  iphone15: {
    mask: "/iPhone_15_Pro_Snap_Mask.png",
    overlay: "/iPhone_15_Snap_Overlay.png",
  },
  iphone15plus: {
    mask: "/iPhone_15_Pro_Snap_Mask.png",
    overlay: "/iPhone_15_Plus_Snap_Overlay.png",
  },
  iphone15pro: {
    mask: "/iPhone_15_Pro_Snap_Mask.png",
    overlay: "/iPhone_15_Pro_Snap_Overlay.png",
  },
  iphone15promax: {
    mask: "/iPhone_15_Pro_Snap_Mask.png",
    overlay: "/iPhone_15_Pro_Max_Snap_Overlay.png",
  },
  // iPhone 14 Series
  iphone14: {
    mask: "/iPhone_14_Pro_Snap_Mask.png",
    overlay: "/iPhone_14_Snap_Overlay.png",
  },
  iphone14plus: {
    mask: "/iPhone_14_Pro_Snap_Mask.png",
    overlay: "/iPhone_14_Plus_Snap_Overlay.png",
  },
  iphone14pro: {
    mask: "/iPhone_14_Pro_Snap_Mask.png",
    overlay: "/iPhone_14_Pro_Snap_Overlay.png",
  },
  iphone14promax: {
    mask: "/iPhone_14_Pro_Snap_Mask.png",
    overlay: "/iPhone_14_Pro_Max_Snap_Overlay.png",
  },
};

export const DEFAULT_PRODUCTS: Record<string, ProductConfig> = {
  // 📱 PHONE (Default)
  phone: {
    id: "phone",
    label: "Phone Case",
    type: "phone",
    base: null,
    mask: PHONE_MODELS["iphone16"].mask, // ডিফল্ট মাস্ক
    overlay: PHONE_MODELS["iphone16"].overlay,
    width: 380,
    fullCover: true, // ছবি নিচে থাকবে
    printArea: null,
  },

  // 👕 HOODIE
  hoodie: {
    id: "hoodie",
    label: "Hoodie",
    type: "apparel",
    base: "/t-shirt.png", // সাদা হুডি
    mask: null,
    overlay: "", // কাপড়ের ভাজ
    width: 600,
    height: 700,
    fullCover: false, // ছবি জামার উপরে বসবে
    printArea: { top: 25, left: 30, width: 40, height: 35 },
  },

  // 👔 T-SHIRT
  tshirt: {
    id: "tshirt",
    label: "T-Shirt",
    type: "apparel",
    base: "/mockups/tshirt/base.png",
    mask: null,
    overlay: "/mockups/tshirt/wrinkles.png",
    width: 600,
    height: 700,
    fullCover: false,
    printArea: { top: 20, left: 28, width: 44, height: 50 },
  },

  // 🎽 TANK TOP
  tank: {
    id: "tank",
    label: "Tank Top",
    type: "apparel",
    base: "/mockups/tank/base.png",
    mask: null,
    overlay: "/mockups/tank/overlay.png",
    width: 600,
    height: 700,
    fullCover: false,
    printArea: { top: 22, left: 32, width: 36, height: 45 },
  },

  // 👜 TOTE BAG (Full Print or Spot - usually Spot)
  tote: {
    id: "tote",
    label: "Tote Bag",
    type: "tote",
    base: "/mockups/tote/base.png",
    mask: null,
    overlay: "/mockups/tote/overlay.png",
    width: 600,
    height: 600,
    fullCover: false,
    printArea: { top: 30, left: 25, width: 50, height: 40 },
  },

  // 🛋️ PILLOW (Full Cover like Phone)
  pillow: {
    id: "pillow",
    label: "Throw Pillow",
    type: "pillow",
    base: null,
    mask: "/mockups/pillow/mask.png", // বালিশের শেপ (মাঝখান ফাঁকা)
    overlay: "/mockups/pillow/overlay.png",
    width: 500,
    height: 500,
    fullCover: true, // ছবি নিচে থাকবে
    printArea: null,
  },

  // ☕ MUG (Spot Print with Handle Mask)
  mug: {
    id: "mug",
    label: "Mug",
    type: "mug",
    base: "/mockups/mug/base.png",
    mask: "/mockups/mug/handle_mask.png", // হ্যান্ডেলটা যাতে ছবির উপরে থাকে
    overlay: "/mockups/mug/overlay.png",
    width: 600,
    height: 500,
    fullCover: false,
    printArea: { top: 20, left: 20, width: 60, height: 60 },
  },

  // 🧩 PUZZLE (Full Cover)
  puzzle: {
    id: "puzzle",
    label: "Puzzle",
    type: "puzzle",
    base: null,
    mask: "/mockups/puzzle/mask.png", // পাজল কাটআউট
    overlay: "/mockups/puzzle/overlay.png",
    width: 600,
    height: 600,
    fullCover: true,
    printArea: null,
  },

  // 🎄 ORNAMENT
  ornament: {
    id: "ornament",
    label: "Ornament",
    type: "ornament",
    base: "/mockups/ornament/base.png",
    mask: "/mockups/ornament/mask.png",
    overlay: "/mockups/ornament/overlay.png",
    width: 400,
    height: 400,
    fullCover: true,
    printArea: null,
  },
};
