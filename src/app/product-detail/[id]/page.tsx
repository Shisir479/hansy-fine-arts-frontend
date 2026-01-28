"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useListFinerworksImagesQuery } from "@/lib/redux/api/finerworksApi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Maximize2,
  ImageIcon,
  Box,
  ShieldCheck,
  RotateCcw,
  Smartphone
} from "lucide-react";
import OrderForm from "@/components/features/OrderForm";
import LivePreviewARModal from "@/components/preview/LivePreviewARModal";
import WallPreviewTool from "@/components/preview/RoomPreview";

// --- Types ---
interface LabelType {
  key: string;
  value: string;
}

interface ProductSize {
  width: number;
  height: number;
}

interface Product {
  sku: string;
  name: string;
  description_short?: string;
  labels: LabelType[];
  product_size?: ProductSize;
  image_url_1?: string;
  total_price: number;
  per_item_price: number;
}

interface PageImage {
  guid: string;
  title: string;
  description: string;
  public_preview_uri: string;
  public_thumbnail_uri: string;
  products: Product[];
}

// Helper Function
const getUniqueValues = (key: string, products: Product[]): string[] => {
  const values = new Set<string>();
  products.forEach((product) => {
    product.labels.forEach((label) => {
      if (label.key === key) values.add(label.value);
    });
  });
  return Array.from(values);
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // State for Preview Tools
  const [isAROpen, setIsAROpen] = useState(false);
  const [isWallViewOpen, setIsWallViewOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Data Loading
  const library = {
    name: "inventory",
    session_id: "1234567890",
    account_key: "dc9e5410-0107-441a-92eb-6a4fd1c34c79",
    site_id: 2,
  };

  const { data, isLoading, isError } = useListFinerworksImagesQuery({
    library,
    page: 1,
    list_products: true,
  });

  const images: any[] = data?.images ?? [];

  // Find the specific image by ID (GUID)
  const image: PageImage | null = useMemo(() => {
    if (!id || images.length === 0) return null;
    const found = images.find((item) => item.guid === id);
    if (!found) return null;
    return {
      guid: found.guid,
      title: found.title,
      description: found.description,
      public_preview_uri: found.public_preview_uri,
      public_thumbnail_uri: found.public_thumbnail_uri,
      products: found.products || [],
    };
  }, [id, images]);

  // --- Product Selection Logic ---
  const [selections, setSelections] = useState({
    type: "",
    media: "",
    style: "",
    collection: "",
    frame: "",
    baseMat: "",
    glazing: "",
  });

  const [orderForm, setOrderForm] = useState<boolean>(false);

  // Helper to filter products based on specific keys
  const getFilteredProducts = (sourceProducts: Product[], criteria: Partial<typeof selections>) => {
    return sourceProducts.filter(product => {
      return Object.entries(criteria).every(([key, value]) => {
        if (!value) return true;
        // Map state keys to label keys
        const labelKey = key === "baseMat" ? "base mat" : key;
        return product.labels.some(label => label.key === labelKey && label.value === value);
      });
    });
  };

  // --- Cascading Product Pools (Fixes "Disappearing Options" bug) ---
  const allProducts = useMemo(() => image?.products || [], [image]);

  const productsAfterType = useMemo(() =>
    selections.type ? getFilteredProducts(allProducts, { type: selections.type }) : [],
    [allProducts, selections.type]);

  const productsAfterMedia = useMemo(() =>
    selections.media ? getFilteredProducts(productsAfterType, { media: selections.media }) : [],
    [productsAfterType, selections.media]);

  const productsAfterStyle = useMemo(() =>
    selections.style ? getFilteredProducts(productsAfterMedia, { style: selections.style }) : [],
    [productsAfterMedia, selections.style]);

  const productsAfterCollection = useMemo(() =>
    selections.collection ? getFilteredProducts(productsAfterStyle, { collection: selections.collection }) : [],
    [productsAfterStyle, selections.collection]);

  const productsAfterFrame = useMemo(() =>
    selections.frame ? getFilteredProducts(productsAfterCollection, { frame: selections.frame }) : [],
    [productsAfterCollection, selections.frame]);

  // Filtered by ... + Base Mat -> determines available Glazings
  const productsAfterBaseMat = useMemo(() =>
    selections.baseMat ? getFilteredProducts(productsAfterFrame, { baseMat: selections.baseMat }) : [],
    [productsAfterFrame, selections.baseMat]);

  // Final specific product (filtered by everything)
  const filteredProducts = useMemo(() => {
    if (!image?.products) return [];
    return getFilteredProducts(image.products, selections);
  }, [image, selections]);



  // --- Auto-Select Default (First) Product on Load ---
  // REMOVED based on user feedback (price showing before size selection)


  // --- Dynamic Options (Derived from Cascading Pools) ---
  const allTypes = useMemo(() => getUniqueValues("type", allProducts), [allProducts]);
  const allMedia = useMemo(() => getUniqueValues("media", productsAfterType), [productsAfterType]);
  const allStyles = useMemo(() => getUniqueValues("style", productsAfterMedia), [productsAfterMedia]);
  const allCollections = useMemo(() => getUniqueValues("collection", productsAfterStyle), [productsAfterStyle]);
  const allFrames = useMemo(() => getUniqueValues("frame", productsAfterCollection), [productsAfterCollection]);
  const allBaseMats = useMemo(() => getUniqueValues("base mat", productsAfterFrame), [productsAfterFrame]);
  const allGlazings = useMemo(() => getUniqueValues("glazing", productsAfterBaseMat), [productsAfterBaseMat]);

  const handleDropdownChange = useCallback((field: string, value: string) => {
    setSelections((prev) => {
      const newSelections = { ...prev, [field]: value };
      // Reset logic
      if (field === "type") return { ...newSelections, media: "", style: "", collection: "", frame: "", baseMat: "", glazing: "" };
      if (field === "media") return { ...newSelections, style: "", collection: "", frame: "", baseMat: "", glazing: "" };
      if (field === "style") return { ...newSelections, collection: "", frame: "", baseMat: "", glazing: "" };
      if (field === "collection") return { ...newSelections, frame: "", baseMat: "", glazing: "" };
      if (field === "frame") return { ...newSelections, baseMat: "", glazing: "" };
      if (field === "baseMat") return { ...newSelections, glazing: "" };
      return newSelections;
    });
    setOrderForm(false);
  }, []);

  const finalProduct = useMemo(() => {
    if (filteredProducts.length === 0) return null;

    // Only require selection if options are actually available
    if (allTypes.length > 0 && !selections.type) return null;
    if (allMedia.length > 0 && !selections.media) return null;
    if (allStyles.length > 0 && !selections.style) return null;
    if (allCollections.length > 0 && !selections.collection) return null;

    // Note: Frame/Mat/Glazing are considered optional add-ons for now 
    // to ensure base price shows up easily. 

    return filteredProducts[0];
  }, [filteredProducts, selections, allTypes, allMedia, allStyles, allCollections]);

  const selectedImage = useMemo(() => {
    if (!image) return "";

    // Check if configuration is complete enough to show a specific product image
    if (finalProduct && finalProduct.image_url_1) {
      return finalProduct.image_url_1;
    }

    // Default to main artwork until fully selected
    return image.public_preview_uri;
  }, [finalProduct, image]);

  const shouldShowOrderButton = useMemo(() => {
    return !!finalProduct;
  }, [finalProduct]);


  if (isLoading) return <div className="h-screen flex items-center justify-center bg-white dark:bg-black"><Loader2 className="animate-spin w-10 h-10 text-gray-900 dark:text-white" /></div>;
  if (isError || !image) return <div className="h-screen flex items-center justify-center bg-white dark:bg-black text-red-500">Product not found</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white py-12 px-4 md:px-8 transition-colors duration-300">

      {/* Modals */}
      <LivePreviewARModal isOpen={isAROpen} onClose={() => setIsAROpen(false)} imageSrc={selectedImage} />
      <WallPreviewTool isOpen={isWallViewOpen} onClose={() => setIsWallViewOpen(false)} productImage={selectedImage} />
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 cursor-zoom-out" onClick={() => setIsZoomOpen(false)}>
          <Image src={selectedImage} alt="Zoom" width={1400} height={1400} className="max-w-full max-h-[95vh] object-contain" />
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10">

          {/* --- LEFT COLUMN: Image & Tools (7/12 cols) --- */}
          <div className="lg:col-span-6 flex flex-col items-center justify-start h-full">
            {/* Main Image Display - Mimicking a framed look */}
            <div className="relative w-full max-w-[500px] bg-gray-50 dark:bg-zinc-900 py-5 transition-colors duration-300">
              <div
                className="relative w-full flex items-center justify-center overflow-hidden aspect-square md:h-[500px] cursor-zoom-in"
                onClick={() => setIsZoomOpen(true)}
              >
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt={image.title}
                    fill // এটি কন্টেইনারের পুরো জায়গা নিয়ে নেবে
                    className="object-contain" // p-4 দেওয়া হয়েছে যাতে একদম বর্ডারে না লেগে থাকে
                  />
                ) : (
                  <div className="text-gray-300 dark:text-zinc-600">No Image Available</div>
                )}
              </div>
            </div>

            {/* Visual Tools Bar - Under the image */}
            <div className="flex flex-wrap md:gap-4 gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsAROpen(true)} className="flex gap-2 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white">
                <Smartphone size={18} /> Live AR
              </Button>
              <Button variant="outline" onClick={() => setIsWallViewOpen(true)} className="flex gap-2 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white">
                <ImageIcon size={18} /> Wall View
              </Button>
              <Button variant="outline" onClick={() => setIsZoomOpen(true)} className="flex gap-2 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white">
                <Maximize2 size={18} /> Zoom
              </Button>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Details & Config (5/12 cols) --- */}
          <div className="lg:col-span-5 flex flex-col h-full">

            {/* Title Section */}
            <div className="mb-4">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">{image.title}</h1>
              {/* If you had artist name it would go here, for now using description snippet or collection if available */}
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                {image.description}
              </p>
            </div>

            {/* Price & Rating Placeholder */}
            <div className="flex items-end gap-3 mb-8 border-b border-gray-100 dark:border-zinc-800 pb-6">
              {finalProduct ? (
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${finalProduct.total_price.toFixed(2)}
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">In Stock • Ready to Ship</span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-400 dark:text-zinc-600">Configure to see price</span>
              )}
            </div>

            {/* Configuration Form */}
            {orderForm && finalProduct ? (
              <div className="bg-gray-50 dark:bg-zinc-900 p-6 rounded-lg border dark:border-zinc-800">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold dark:text-white">Checkout</h2>
                  <Button variant="ghost" size="sm" onClick={() => setOrderForm(false)} className="dark:text-white dark:hover:bg-zinc-800">Back</Button>
                </div>
                <OrderForm
                  productSKU={finalProduct.sku}
                  Price={finalProduct.total_price}
                  productTitle={finalProduct.name}
                  onCancel={() => setOrderForm(false)}
                />
              </div>
            ) : (
              <div className="space-y-6 flex-grow">
                {/* Visual grouping of Selects to look like the form options */}
                <div className="space-y-4">

                  {/* Primary Selection Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {allTypes.length > 0 && (
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Product Type</Label>
                        <select
                          value={selections.type}
                          onChange={(e) => handleDropdownChange("type", e.target.value)}
                          className="w-full h-10 px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white dark:text-white"
                        >
                          <option value="" disabled>Select Type</option>
                          {allTypes.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    )}

                    {selections.type && allMedia.length > 0 && (
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Media / Material</Label>
                        <select
                          value={selections.media}
                          onChange={(e) => handleDropdownChange("media", e.target.value)}
                          className="w-full h-10 px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white dark:text-white"
                        >
                          <option value="" disabled>Select Material</option>
                          {allMedia.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Secondary Selections (Style, Collection) */}
                  {(allStyles.length > 0 || allCollections.length > 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selections.media && allStyles.length > 0 && (
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Style</Label>
                          <select
                            value={selections.style}
                            onChange={(e) => handleDropdownChange("style", e.target.value)}
                            className="w-full h-10 px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white dark:text-white"
                          >
                            <option value="" disabled>Style</option>
                            {allStyles.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      )}
                      {selections.style && allCollections.length > 0 && (
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Size / Collection</Label>
                          <select
                            value={selections.collection}
                            onChange={(e) => handleDropdownChange("collection", e.target.value)}
                            className="w-full h-10 px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white dark:text-white"
                          >
                            <option value="" disabled>Select Size</option>
                            {allCollections.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  <Separator />

                  {/* Framing Options */}
                  <div className="space-y-4">
                    {allFrames.length > 0 && (
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Frame</Label>
                        <select
                          value={selections.frame}
                          onChange={(e) => handleDropdownChange("frame", e.target.value)}
                          className="w-full h-12 px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white dark:text-white"
                        >
                          <option value="" disabled>Choose Frame</option>
                          {allFrames.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {allBaseMats.length > 0 && (
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Matting</Label>
                          <select
                            value={selections.baseMat}
                            onChange={(e) => handleDropdownChange("baseMat", e.target.value)}
                            className="w-full h-10 px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white dark:text-white"
                          >
                            <option value="" disabled>None</option>
                            {allBaseMats.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      )}
                      {allGlazings.length > 0 && (
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Glazing</Label>
                          <select
                            value={selections.glazing}
                            onChange={(e) => handleDropdownChange("glazing", e.target.value)}
                            className="w-full h-10 px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white dark:text-white"
                          >
                            <option value="" disabled>None</option>
                            {allGlazings.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Final Details & Button */}
                <div className="pt-6 mt-4">
                  <button

                    className="w-full md:h-14 h-12 md:text-lg font-bold uppercase tracking-wide bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-white transition-all"
                    disabled={!finalProduct}
                    onClick={() => setOrderForm(true)}
                  >
                    {finalProduct ? `Add to Cart - $${finalProduct.total_price.toFixed(0)}` : "Select Options"}
                  </button>

                  {!finalProduct && (
                    <p className="text-center text-xs text-red-400 mt-2">
                      Please finish selecting all options above
                    </p>
                  )}
                </div>

                {/* Trust Badges (Mimicking the icons at bottom of reference) */}
                <div className="grid grid-cols-3 gap-2 mt-8 py-6 border-t border-gray-100 dark:border-zinc-800 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Box className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                    <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase">Fast Shipping</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                    <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase">Premium Quality</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <RotateCcw className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                    <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase">Easy Returns</span>
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