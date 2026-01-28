"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useListFinerworksImagesQuery } from "@/lib/redux/api/finerworksApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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


  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-gray-900" /></div>;
  if (isError || !image) return <div className="h-screen flex items-center justify-center text-red-500">Product not found</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-4 md:px-8">

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
            {/* Main Image Display - Mimicking a framed look */}
            <div className="relative w-[500px] bg-white">
              <div
                className="relative w-full flex items-center justify-center overflow-hidden h-[500px] cursor-zoom-in"
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
                  <div className="text-gray-300">No Image Available</div>
                )}
              </div>
            </div>

            {/* Visual Tools Bar - Under the image */}
            <div className="flex gap-4 mt-6">
              <Button variant="outline" onClick={() => setIsAROpen(true)} className="flex gap-2">
                <Smartphone size={18} /> Live AR
              </Button>
              <Button variant="outline" onClick={() => setIsWallViewOpen(true)} className="flex gap-2">
                <ImageIcon size={18} /> Wall View
              </Button>
              <Button variant="outline" onClick={() => setIsZoomOpen(true)} className="flex gap-2">
                <Maximize2 size={18} /> Zoom
              </Button>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Details & Config (5/12 cols) --- */}
          <div className="lg:col-span-5 flex flex-col h-full">

            {/* Title Section */}
            <div className="mb-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">{image.title}</h1>
              {/* If you had artist name it would go here, for now using description snippet or collection if available */}
              <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                {image.description}
              </p>
            </div>

            {/* Price & Rating Placeholder */}
            <div className="flex items-end gap-3 mb-8 border-b border-gray-100 pb-6">
              {finalProduct ? (
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-gray-900">
                    ${finalProduct.total_price.toFixed(2)}
                  </span>
                  <span className="text-xs text-green-600 font-medium">In Stock • Ready to Ship</span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-400">Configure to see price</span>
              )}
            </div>

            {/* Configuration Form */}
            {orderForm && finalProduct ? (
              <div className="bg-gray-50 p-6 rounded-lg border">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Checkout</h2>
                  <Button variant="ghost" size="sm" onClick={() => setOrderForm(false)}>Back</Button>
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
                  <div className="grid grid-cols-2 gap-4">
                    {allTypes.length > 0 && (
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase font-bold text-gray-500">Product Type</Label>
                        <Select value={selections.type} onValueChange={(v) => handleDropdownChange("type", v)}>
                          <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="Select Type" /></SelectTrigger>
                          <SelectContent>{allTypes.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    )}

                    {selections.type && allMedia.length > 0 && (
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase font-bold text-gray-500">Media / Material</Label>
                        <Select value={selections.media} onValueChange={(v) => handleDropdownChange("media", v)}>
                          <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="Select Material" /></SelectTrigger>
                          <SelectContent>{allMedia.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Secondary Selections (Style, Collection) */}
                  {(allStyles.length > 0 || allCollections.length > 0) && (
                    <div className="grid grid-cols-2 gap-4">
                      {selections.media && allStyles.length > 0 && (
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase font-bold text-gray-500">Style</Label>
                          <Select value={selections.style} onValueChange={(v) => handleDropdownChange("style", v)}>
                            <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="Style" /></SelectTrigger>
                            <SelectContent>{allStyles.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      )}
                      {selections.style && allCollections.length > 0 && (
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase font-bold text-gray-500">Size / Collection</Label>
                          <Select value={selections.collection} onValueChange={(v) => handleDropdownChange("collection", v)}>
                            <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="Select Size" /></SelectTrigger>
                            <SelectContent>{allCollections.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  )}

                  <Separator />

                  {/* Framing Options */}
                  <div className="space-y-4">
                    {allFrames.length > 0 && (
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase font-bold text-gray-500">Frame</Label>
                        <Select value={selections.frame} onValueChange={(v) => handleDropdownChange("frame", v)}>
                          <SelectTrigger className="h-12 border-gray-300"><SelectValue placeholder="Choose Frame" /></SelectTrigger>
                          <SelectContent>{allFrames.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      {allBaseMats.length > 0 && (
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase font-bold text-gray-500">Matting</Label>
                          <Select value={selections.baseMat} onValueChange={(v) => handleDropdownChange("baseMat", v)}>
                            <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="None" /></SelectTrigger>
                            <SelectContent>{allBaseMats.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      )}
                      {allGlazings.length > 0 && (
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase font-bold text-gray-500">Glazing</Label>
                          <Select value={selections.glazing} onValueChange={(v) => handleDropdownChange("glazing", v)}>
                            <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="None" /></SelectTrigger>
                            <SelectContent>{allGlazings.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Final Details & Button */}
                <div className="pt-6 mt-4">
                  <button

                    className="w-full h-14 text-lg font-bold uppercase tracking-wide bg-black hover:bg-gray-800 text-white transition-all"
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
                <div className="grid grid-cols-3 gap-2 mt-8 py-6 border-t border-gray-100 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Box className="w-6 h-6 text-gray-400" />
                    <span className="text-[10px] font-semibold text-gray-600 uppercase">Fast Shipping</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-gray-400" />
                    <span className="text-[10px] font-semibold text-gray-600 uppercase">Premium Quality</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <RotateCcw className="w-6 h-6 text-gray-400" />
                    <span className="text-[10px] font-semibold text-gray-600 uppercase">Easy Returns</span>
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