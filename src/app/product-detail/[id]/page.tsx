"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useListFinerworksImagesQuery } from "@/lib/redux/api/finerworksApi";
import {
  useGetPrintfulProductsQuery,
  useGetPrintfulCategoriesQuery,
  useCreatePrintfulMockupTaskMutation,
  useGetPrintfulMockupTaskResultQuery,
  useGetPrintfulProductQuery,
  useGetPrintfulLayoutTemplatesQuery
} from "@/lib/redux/api/printfulApi";

import { useAppDispatch } from "@/lib/redux/hooks";
import { addToCart } from "@/lib/redux/slices/cartSlice";
import { useCartSidebar } from "@/hooks/use-cart-sidebar";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  ImageIcon,
  Box,
  ShieldCheck,
  RotateCcw,
  Smartphone,
  Mail,
  Heart
} from "lucide-react";
import OrderForm from "@/components/features/OrderForm";
import LivePreviewARModal from "@/components/preview/LivePreviewARModal";
import WallPreviewTool from "@/components/preview/RoomPreview";
import GlassMagnifier from "@/components/ui/glass-magnifier";

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
  const dispatch = useAppDispatch();
  const { openSidebar } = useCartSidebar();

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

  // --- Printful Integration State ---
  const [printfulSelections, setPrintfulSelections] = useState({
    categoryId: "",
    productId: "",
    variantId: "",
  });

  const [printfulMockup, setPrintfulMockup] = useState<string | null>(null);
  const [mockupTaskKey, setMockupTaskKey] = useState<string | null>(null);
  const [manualLoading, setManualLoading] = useState(false); // New state to cover gap before task key

  // ⭐ NEW: Reference to track current request and abort controller
  const currentRequestRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { data: printfulCategories } = useGetPrintfulCategoriesQuery(undefined, {
    skip: selections.type !== "Other"
  });

  const { data: printfulProducts } = useGetPrintfulProductsQuery(printfulSelections.categoryId, {
    skip: !printfulSelections.categoryId || selections.type !== "Other"
  });

  const { data: printfulProductDetails } = useGetPrintfulProductQuery(printfulSelections.productId, {
    skip: !printfulSelections.productId || selections.type !== "Other"
  });

  const { data: printfulTemplates } = useGetPrintfulLayoutTemplatesQuery(printfulSelections.productId, {
    skip: !printfulSelections.productId || selections.type !== "Other"
  });

  // ⭐ DEBUG: Log Printful Data when it arrives
  React.useEffect(() => {
    if (selections.type === "Other") {
      console.log("🔍 [DEBUG] Printful Selections:", printfulSelections);

      if (printfulProductDetails) {
        console.log("📦 [DEBUG] Printful Product Details Response:", printfulProductDetails);
        const result = printfulProductDetails?.data?.result || printfulProductDetails?.result;
        console.log("   👉 Extracted Result:", result);

        if (result) {
          const variants = result.variants || result.product?.variants || [];
          const selectedVariant = variants.find((v: any) => v.id === parseInt(printfulSelections.variantId));
          console.log("   🎯 Selected Variant for Price:", selectedVariant);
          if (selectedVariant) {
            console.log("   💲 Price found:", selectedVariant.retail_price || selectedVariant.price);
          }
        }
      } else {
        console.log("⏳ [DEBUG] Waiting for Product Details...");
      }
    }
  }, [printfulProductDetails, printfulSelections, selections.type]);

  const [createMockupTask, { isLoading: isMockupLoading }] = useCreatePrintfulMockupTaskMutation();

  // ⭐ FIXED: Handle Printful Changes - Clear everything on any change
  const handlePrintfulChange = useCallback((field: string, value: string) => {
    // Cancel any ongoing polling
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Clear previous mockup and task immediately
    setPrintfulMockup(null);
    setMockupTaskKey(null);
    currentRequestRef.current = null;

    setPrintfulSelections(prev => {
      const newSel = { ...prev, [field]: value };
      if (field === "categoryId") {
        return { ...newSel, productId: "", variantId: "" };
      }
      if (field === "productId") {
        return { ...newSel, variantId: "" };
      }
      return newSel;
    });
  }, []);

  // ⭐ FIXED: Manual polling with proper cleanup and request tracking
  React.useEffect(() => {
    if (!mockupTaskKey) {
      console.log("⏸️ No task key, polling stopped");
      return;
    }

    // Create new abort controller for this polling session
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Capture current values at the start of this effect
    const capturedTaskKey = mockupTaskKey;
    const capturedProductId = printfulSelections.productId;
    const capturedVariantId = printfulSelections.variantId;
    const capturedRequestId = currentRequestRef.current;

    console.log("⚙️ Setting up manual polling for task:", capturedTaskKey);
    console.log("   Product ID:", capturedProductId);
    console.log("   Variant ID:", capturedVariantId);
    console.log("   Request ID:", capturedRequestId);

    let pollCount = 0;
    const maxPolls = 30;
    let isActive = true;

    const checkMockupStatus = async () => {
      // Check if polling should stop
      if (!isActive || abortController.signal.aborted) {
        console.log("🛑 Polling stopped - inactive or aborted");
        return;
      }

      // ⭐ CRITICAL: Check if the request is still current
      if (currentRequestRef.current !== capturedRequestId) {
        console.log("🛑 Request ID changed, stopping old poll");
        console.log("   Old:", capturedRequestId);
        console.log("   New:", currentRequestRef.current);
        isActive = false;
        return;
      }

      try {
        pollCount++;
        console.log(`🔄 Manual poll #${pollCount}/${maxPolls} for task: ${capturedTaskKey}`);

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/printful/mockup-generator/task?task_key=${capturedTaskKey}`;

        const response = await fetch(apiUrl, {
          signal: abortController.signal
        });

        if (!response.ok) {
          console.error("❌ Polling request failed:", response.status, response.statusText);
          return;
        }

        const data = await response.json();
        console.log("📦 Manual Poll Response:", data);

        const result = data?.data?.result || data?.result;
        const status = result?.status;

        console.log("   📊 Status:", status);

        if (status === "completed") {
          const mockups = result?.mockups;
          console.log("   ✅ COMPLETED! Mockups:", mockups);

          if (mockups && mockups.length > 0) {
            const mockupUrl = mockups[0].mockup_url;
            console.log("🎉 MANUAL POLL SUCCESS! Mockup URL:", mockupUrl);

            // ⭐ Final check before updating state
            if (isActive && currentRequestRef.current === capturedRequestId && !abortController.signal.aborted) {
              setPrintfulMockup(mockupUrl);
              setMockupTaskKey(null);
              isActive = false;
            } else {
              console.log("⚠️ Ignoring result - request is no longer current");
            }
          } else {
            console.error("⚠️ Completed but no mockups array!");
          }
        } else if (status === "failed") {
          console.error("❌ Mockup generation failed:", result);
          if (isActive && currentRequestRef.current === capturedRequestId) {
            setMockupTaskKey(null);
            isActive = false;
            toast.error("Failed to generate preview");
          }
        } else if (status === "pending") {
          console.log("   ⏳ Still pending, will retry in 2s...");
        }

        if (pollCount >= maxPolls && isActive) {
          console.log("⏱️ Max polling attempts reached");
          isActive = false;
          if (currentRequestRef.current === capturedRequestId) {
            toast.error("Mockup generation timeout");
            setMockupTaskKey(null);
          }
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log("🛑 Fetch aborted");
          isActive = false;
          return;
        }
        console.error("❌ Manual poll error:", error);
        if (pollCount >= maxPolls) {
          isActive = false;
          if (currentRequestRef.current === capturedRequestId) {
            setMockupTaskKey(null);
          }
        }
      }
    };

    // Start immediately
    console.log("🚀 Starting immediate poll...");
    checkMockupStatus();

    // Set up interval for subsequent polls
    const intervalId = setInterval(() => {
      if (isActive && !abortController.signal.aborted) {
        checkMockupStatus();
      } else {
        clearInterval(intervalId);
      }
    }, 2000);

    // Cleanup function
    return () => {
      console.log("🛑 Cleaning up manual polling for task:", capturedTaskKey);
      isActive = false;
      abortController.abort();
      clearInterval(intervalId);
    };
  }, [mockupTaskKey]);

  // ⭐ FIXED: Mockup Generation Effect with proper request tracking
  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      // 1. Initial Checks
      if (
        !printfulSelections.productId ||
        !printfulSelections.variantId ||
        !image?.public_preview_uri ||
        selections.type !== "Other"
      ) {
        return;
      }

      // 2. Wait for Data
      if (!printfulTemplates?.data?.result?.templates?.length || !printfulProductDetails?.data?.result) {
        return;
      }

      const variantIdInt = parseInt(printfulSelections.variantId);
      if (isNaN(variantIdInt)) return;

      // ⭐ Create unique request ID
      const requestId = `${printfulSelections.productId}-${printfulSelections.variantId}-${Date.now()}`;
      console.log("🆔 New Request ID:", requestId);

      // 3. Get Templates and Product Files to determine valid placements
      const templates = printfulTemplates.data.result.templates;
      const productResult = printfulProductDetails.data.result;
      const productFiles = productResult.product?.files || productResult.files || [];

      // Find template that supports this variant
      let selectedTemplate = templates.find((t: any) =>
        t.variant_ids && t.variant_ids.includes(variantIdInt)
      );

      // Fallback: Use first available template
      if (!selectedTemplate) {
        selectedTemplate = templates[0];
      }

      if (!selectedTemplate) {
        console.error("❌ No template found for variant");
        return;
      }

      console.log(`✅ Selected Template:`, selectedTemplate);
      console.log(`📦 Product Files:`, productFiles);

      // 4. CRITICAL: Determine the correct placement
      let placement = selectedTemplate.placement;

      console.log("🔍 Detecting Placement...");
      console.log("   Template placement:", placement);
      console.log("   Product files:", productFiles.map((f: any) => ({ id: f.id, type: f.type })));

      if (!placement && productFiles.length > 0) {
        const hasOnlyDefaultFiles = productFiles.every((f: any) =>
          ['default', 'label_inside', 'mockup', 'preview'].includes(f.type)
        );

        if (hasOnlyDefaultFiles) {
          placement = undefined;
          console.log(`   ℹ️  Poster/Print product detected - placement will be omitted`);
        } else {
          const validPlacements = ['front', 'back', 'embroidery_front', 'embroidery_back',
            'embroidery_chest_left', 'embroidery_chest_center'];

          for (const validPlacement of validPlacements) {
            const file = productFiles.find((f: any) =>
              f.type === validPlacement || f.id === validPlacement
            );
            if (file) {
              placement = file.type || file.id;
              console.log(`   ✅ Found valid placement: "${placement}"`);
              break;
            }
          }

          if (!placement) {
            const firstFile = productFiles.find((f: any) =>
              f.type !== 'default' && f.type !== 'mockup' && f.type !== 'preview'
            );
            if (firstFile) {
              placement = firstFile.type || firstFile.id;
            } else {
              placement = 'front';
            }
            console.log(`   ⚠️  Using fallback placement: "${placement}"`);
          }
        }
      }

      console.log(`📍 Final Placement:`, placement || "(none - will be omitted)");

      // 5. Position Data
      const positionData = {
        area_width: selectedTemplate.print_area_width,
        area_height: selectedTemplate.print_area_height,
        width: selectedTemplate.print_area_width,
        height: selectedTemplate.print_area_height,
        top: 0,
        left: 0,
      };

      // 6. Build Payload
      const fileConfig: any = {
        image_url: image.public_preview_uri,
        position: positionData
      };

      if (placement) {
        fileConfig.placement = placement;
      } else {
        fileConfig.type = 'default';
      }

      const payload = {
        productId: printfulSelections.productId,
        mockupData: {
          variant_ids: [variantIdInt],
          format: "jpg",
          files: [fileConfig]
        }
      };

      console.log("📤 Final Payload:", JSON.stringify(payload, null, 2));

      // 7. Generate Mockup
      const generate = async () => {
        try {
          // ⭐ Cancel any previous request
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }

          // ⭐ Clear previous state and set new request ID
          setPrintfulMockup(null);
          setMockupTaskKey(null);
          currentRequestRef.current = requestId;

          console.log("🚀 Sending mockup generation request...", requestId);
          const res = await createMockupTask(payload).unwrap();

          // ⭐ Check if this request is still current AFTER the await
          if (currentRequestRef.current !== requestId) {
            console.log("⚠️ Request is no longer current, ignoring result");
            console.log("   Expected:", requestId);
            console.log("   Current:", currentRequestRef.current);
            return;
          }

          console.log("📥 Response received:", res);

          const taskKey = res?.task_key || res?.result?.task_key || res?.data?.result?.task_key;

          if (taskKey) {
            console.log("✅ Task Created:", taskKey);
            console.log("⏰ Setting task key for polling...");
            setMockupTaskKey(taskKey);
          } else {
            console.error("⚠️ No task_key found in response:", res);
          }
        } catch (err: any) {
          if (err?.name === 'AbortError') {
            console.log("⏸️ Request aborted");
            return;
          }

          // ⭐ Only show error if this request is still current
          if (currentRequestRef.current !== requestId) {
            console.log("⚠️ Error for old request, ignoring");
            return;
          }

          console.error("❌ Mockup Failed:", err);

          if (err?.data?.error) {
            console.error("Error Details:", err.data.error);
            console.log("💡 Available placements from product:", productFiles.map((f: any) => f.type || f.id));
            toast.error(`Mockup Error: ${err.data.error.message || 'Unknown error'}`);
          }
        }
      };

      console.log("🎬 Calling generate function...");
      generate();

    }, 1000); // 1 Second Debounce

    return () => clearTimeout(debounceTimer);
  }, [
    printfulSelections.productId,
    printfulSelections.variantId,
    image,
    createMockupTask,
    selections.type,
    printfulTemplates,
    printfulProductDetails
  ]);

  // Helper to filter products
  const getFilteredProducts = (sourceProducts: Product[], criteria: Partial<typeof selections>) => {
    return sourceProducts.filter(product => {
      return Object.entries(criteria).every(([key, value]) => {
        if (!value) return true;
        const labelKey = key === "baseMat" ? "base mat" : key;
        return product.labels.some(label => label.key === labelKey && label.value === value);
      });
    });
  };

  // --- Cascading Product Pools ---
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

  const productsAfterBaseMat = useMemo(() =>
    selections.baseMat ? getFilteredProducts(productsAfterFrame, { baseMat: selections.baseMat }) : [],
    [productsAfterFrame, selections.baseMat]);

  const filteredProducts = useMemo(() => {
    if (!image?.products) return [];
    return getFilteredProducts(image.products, selections);
  }, [image, selections]);

  // --- Dynamic Options ---
  const allTypes = useMemo(() => {
    const types = getUniqueValues("type", allProducts);
    return [...types, "Other"];
  }, [allProducts]);
  const allMedia = useMemo(() => getUniqueValues("media", productsAfterType), [productsAfterType]);
  const allStyles = useMemo(() => getUniqueValues("style", productsAfterMedia), [productsAfterMedia]);
  const allCollections = useMemo(() => getUniqueValues("collection", productsAfterStyle), [productsAfterStyle]);
  const allFrames = useMemo(() => getUniqueValues("frame", productsAfterCollection), [productsAfterCollection]);
  const allBaseMats = useMemo(() => getUniqueValues("base mat", productsAfterFrame), [productsAfterFrame]);
  const allGlazings = useMemo(() => getUniqueValues("glazing", productsAfterBaseMat), [productsAfterBaseMat]);

  const handleDropdownChange = useCallback((field: string, value: string) => {
    // ⭐ Clear Printful mockup when changing type
    if (field === "type") {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setPrintfulMockup(null);
      setMockupTaskKey(null);
      currentRequestRef.current = null;
    }

    setSelections((prev) => {
      const newSelections = { ...prev, [field]: value };
      if (field === "type" && value === "Other") {
        return { ...prev, type: "Other", media: "", style: "", collection: "", frame: "", baseMat: "", glazing: "" };
      }
      if (field === "type") return { ...newSelections, media: "", style: "", collection: "", frame: "", baseMat: "", glazing: "" };
      if (field === "media") return { ...newSelections, style: "", collection: "", frame: "", baseMat: "", glazing: "" };
      if (field === "style") return { ...newSelections, collection: "", frame: "", baseMat: "", glazing: "" };
      if (field === "collection") return { ...newSelections, frame: "", baseMat: "", glazing: "" };
      if (field === "frame") return { ...newSelections, baseMat: "", glazing: "" };
      if (field === "baseMat") return { ...newSelections, glazing: "" };
      return newSelections;
    });

    if (field === "type" && value !== "Other") {
      setPrintfulSelections({ categoryId: "", productId: "", variantId: "" });
    }
    setOrderForm(false);
  }, []);

  // --- FINAL PRODUCT CALCULATION ---
  const finalProduct = useMemo(() => {
    // 1. Check for Printful ("Other") FIRST
    if (selections.type === "Other") {
      if (!printfulSelections.productId || !printfulSelections.variantId) return null;

      const pProduct = printfulProducts?.data?.result?.find((p: any) => p.id === parseInt(printfulSelections.productId));

      let dynamicPrice = 50;
      let variantName = "Standard";
      // Try to get title from the specific product details first, fallback to the list find
      let productTitle = printfulProductDetails?.data?.result?.product?.title ||
        printfulProductDetails?.data?.result?.product?.name ||
        pProduct?.title ||
        "Custom Print";

      const result = printfulProductDetails?.data?.result;

      if (result) {
        // Variants can be in result.variants or result.product.variants depending on endpoint
        const variants = result.variants || result.product?.variants || [];

        // Find the specific variant
        const pVariant = variants.find((v: any) => v.id === parseInt(printfulSelections.variantId));

        if (pVariant) {
          // Construct a rich variant name if properties exist
          // Priority: Full Name > Color + Size > Size > "Standard"
          if (pVariant.name) {
            variantName = pVariant.name;
          } else if (pVariant.color && pVariant.size) {
            variantName = `${pVariant.color} / ${pVariant.size}`;
          } else if (pVariant.size) {
            variantName = `Size: ${pVariant.size}`;
          } else {
            variantName = "Standard Option";
          }

          if (pVariant.retail_price) {
            dynamicPrice = parseFloat(pVariant.retail_price);
          } else if (pVariant.price) {
            dynamicPrice = parseFloat(pVariant.price);
          }
        }
      }

      // Final fallback if variantName is still empty/Standard check
      if (!variantName || variantName === "Standard") {
        variantName = "Standard Option";
      }

      // If API failed to give a price, fallback to 50 ONLY if strictly necessary
      if (dynamicPrice === 0) dynamicPrice = 50;
      console.log("dynamicPrice", dynamicPrice);

      return {
        sku: `PF-${printfulSelections.productId}-${printfulSelections.variantId}`,
        name: productTitle,
        description_short: "Custom Print on Demand Product",
        labels: [
          { key: "type", value: "Other" },
          { key: "printful_product", value: productTitle },
          { key: "printful_variant", value: variantName }
        ],
        image_url_1: printfulMockup || image?.public_preview_uri,
        total_price: dynamicPrice,
        per_item_price: dynamicPrice,
        product_size: { width: 0, height: 0 }
      } as Product;
    }

    // 2. Check for Finerworks
    if (filteredProducts.length === 0) return null;

    if (allTypes.length > 0 && !selections.type) return null;
    if (allMedia.length > 0 && !selections.media) return null;
    if (allStyles.length > 0 && !selections.style) return null;
    if (allCollections.length > 0 && !selections.collection) return null;

    return filteredProducts[0];
  }, [
    filteredProducts,
    selections,
    allTypes,
    allMedia,
    allStyles,
    allCollections,
    printfulSelections,
    printfulProducts,
    printfulProductDetails,
    printfulMockup,
    image
  ]);

  const selectedImage = useMemo(() => {
    if (!image) return "";
    if (finalProduct && finalProduct.image_url_1) return finalProduct.image_url_1;
    if (selections.type === "Other") return printfulMockup || image.public_preview_uri;
    return image.public_preview_uri;
  }, [finalProduct, image, selections.type, printfulMockup]);

  const isGeneratingMockup = isMockupLoading || (mockupTaskKey !== null && !printfulMockup);

  const handleAddToCart = () => {
    if (!finalProduct || !image) return;

    // Custom Data Logic for Printful vs Standard
    let variantDetails = [];

    if (selections.type === "Other") {
      // PRINTFUL DATA MAPPING
      variantDetails = [
        {
          label: "Product",
          value: finalProduct.labels.find(l => l.key === "printful_product")?.value || "Custom Print"
        },
        {
          label: "Variant",
          value: finalProduct.labels.find(l => l.key === "printful_variant")?.value || "Standard"
        }
      ];
    } else {
      // STANDARD FINE ART DATA MAPPING
      variantDetails = [
        {
          label: "Medium",
          value: finalProduct.labels.find(l => l.key === "media")?.value || selections.media || "Standard"
        },
        {
          label: "Size",
          value: finalProduct.product_size
            ? `${finalProduct.product_size.width}x${finalProduct.product_size.height}`
            : (finalProduct.labels.find(l => l.key === "collection")?.value || selections.collection || "Standard")
        },
        {
          label: "Finishing",
          value: (() => {
            const frame = finalProduct.labels.find(l => l.key === "frame")?.value;
            const mat = finalProduct.labels.find(l => l.key === "base mat")?.value;
            if (frame) {
              return frame + (mat ? ` + ${mat}` : "");
            }
            return "Just The Print";
          })()
        }
      ];
    }

    const cartProduct = {
      _id: finalProduct.sku,
      productTitle: image.title,
      name: finalProduct.name,
      price: finalProduct.total_price,
      category: "Art",
      image: selectedImage,
      sku: finalProduct.sku,
      productType: selections.type === "Other" ? "printful" : "finerworks",
      variantDetails: variantDetails,
      // Add Printful Data
      selectedOptions: selections.type === "Other" ? {
        variant_id: parseInt(printfulSelections.variantId),
        files: [
          {
            type: "default",
            url: image.public_preview_uri
          }
        ]
      } : undefined
    };

    dispatch(addToCart(cartProduct));
    toast.success("Added to cart!");
    openSidebar();
  };

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
            <div className="relative w-full max-w-[500px] py-5 transition-colors duration-300">
              <div
                className="relative w-full flex items-center justify-center aspect-square md:h-[500px]"
              >
                {/* Loading Overlay */}
                {isGeneratingMockup && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm transition-all duration-300">
                    <Loader2 className="w-10 h-10 animate-spin text-black dark:text-white" />
                    <p className="text-sm font-medium mt-2 text-gray-700 dark:text-gray-300">Generating Mockup...</p>
                  </div>
                )}

                {selectedImage ? (
                  <GlassMagnifier
                    src={selectedImage}
                    alt={image.title}
                    className="w-full h-full flex items-center justify-center cursor-zoom-in"
                    imageClassName="max-h-full max-w-full object-contain bg-gray-50 dark:bg-zinc-800"
                    magnifierWidth={200}
                    magnifierHeight={200}
                    zoomLevel={2.5}
                    onClick={() => setIsZoomOpen(true)}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-300 dark:text-zinc-600 bg-gray-50 dark:bg-zinc-900">
                    No Image Available
                  </div>
                )}
              </div>
            </div>

            {/* Visual Tools Bar */}
            <div className="flex items-center justify-center md:gap-10 gap-5 w-full mt-8 px-2 md:px-6">
              <button
                onClick={() => setIsAROpen(true)}
                disabled={selections.type === "Other"}
                className={`flex flex-col items-center gap-3 group ${selections.type === "Other" ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                <div className={`p-2 border border-gray-300 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 ${selections.type !== "Other" ? "group-hover:border-black dark:group-hover:border-white group-hover:text-black dark:group-hover:text-white" : ""} transition-all duration-300`}>
                  <Smartphone size={22} strokeWidth={1.5} />
                </div>
                <span className={`text-xs uppercase tracking-wide text-gray-500 dark:text-zinc-400 ${selections.type !== "Other" ? "group-hover:text-black dark:group-hover:text-white" : ""} transition-colors duration-300 font-medium`}>
                  Live AR
                </span>
              </button>
              <button
                onClick={() => setIsWallViewOpen(true)}
                disabled={selections.type === "Other"}
                className={`flex flex-col items-center gap-3 group ${selections.type === "Other" ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                <div className={`p-2 border border-gray-300 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 ${selections.type !== "Other" ? "group-hover:border-black dark:group-hover:border-white group-hover:text-black dark:group-hover:text-white" : ""} transition-all duration-300`}>
                  <ImageIcon size={22} strokeWidth={1.5} />
                </div>
                <span className={`text-xs uppercase tracking-wide text-gray-500 dark:text-zinc-400 ${selections.type !== "Other" ? "group-hover:text-black dark:group-hover:text-white" : ""} transition-colors duration-300 font-medium`}>
                  Wall View
                </span>
              </button>
              <button className="flex flex-col items-center gap-3 group">
                <div className="p-2  border border-gray-300 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 group-hover:border-black dark:group-hover:border-white group-hover:text-black dark:group-hover:text-white transition-all duration-300">
                  <Heart size={22} strokeWidth={1.5} />
                </div>
                <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-300 font-medium">
                  Favorites
                </span>
              </button>
              <button
                onClick={() => {
                  const subject = encodeURIComponent(`Check out this artwork: ${image?.title || "Fine Art"}`);
                  const body = encodeURIComponent(`I thought you might like this: ${window.location.href}`);
                  window.location.href = `mailto:?subject=${subject}&body=${body}`;
                }}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="p-2 border border-gray-300 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 group-hover:border-black dark:group-hover:border-white group-hover:text-black dark:group-hover:text-white transition-all duration-300">
                  <Mail size={22} strokeWidth={1.5} />
                </div>
                <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-300 font-medium">
                  Email a Friend
                </span>
              </button>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Details & Config --- */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="mb-4">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">{image.title}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                {image.description}
              </p>
            </div>

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
                <div className="space-y-4">

                  {/* Product Type & Printful Selections */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {allTypes.length > 0 && (
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Product Type</Label>
                        <Select
                          value={selections.type}
                          onValueChange={(value) => handleDropdownChange("type", value)}
                        >
                          <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {allTypes.map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {selections.type === "Other" && (
                      <>
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Category</Label>
                          <Select
                            value={printfulSelections.categoryId}
                            onValueChange={(value) => handlePrintfulChange("categoryId", value)}
                          >
                            <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {printfulCategories?.data?.result?.categories?.map((c: any) => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                  {c.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {printfulSelections.categoryId && (
                          <div className="space-y-1.5">
                            <Label className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Product</Label>
                            <Select
                              value={printfulSelections.productId}
                              onValueChange={(value) => handlePrintfulChange("productId", value)}
                            >
                              <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                <SelectValue placeholder="Select Product" />
                              </SelectTrigger>
                              <SelectContent>
                                {printfulProducts?.data?.result?.map((p: any) => (
                                  <SelectItem key={p.id} value={String(p.id)}>
                                    {p.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {printfulSelections.productId && (
                          <div className="space-y-1.5">
                            <Label className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Variant/Size</Label>
                            <Select
                              value={printfulSelections.variantId}
                              onValueChange={(value) => handlePrintfulChange("variantId", value)}
                            >
                              <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                <SelectValue placeholder="Select Variant" />
                              </SelectTrigger>
                              <SelectContent>
                                {(printfulProductDetails?.data?.result?.product?.variants ||
                                  printfulProductDetails?.data?.result?.variants)?.map((v: any) => (
                                    <SelectItem key={v.id} value={String(v.id)}>
                                      {v.name || v.size || `Variant ${v.id}`}
                                    </SelectItem>
                                  ))
                                }
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </>
                    )}

                    {selections.type !== "Other" && selections.type && allMedia.length > 0 && (
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Media / Material</Label>
                        <Select
                          value={selections.media}
                          onValueChange={(value) => handleDropdownChange("media", value)}
                        >
                          <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                            <SelectValue placeholder="Select Material" />
                          </SelectTrigger>
                          <SelectContent>
                            {allMedia.map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Secondary Selections for Finerworks */}
                  {selections.type !== "Other" && (allStyles.length > 0 || allCollections.length > 0) && (
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

                  {/* Framing Options for Finerworks */}
                  {selections.type !== "Other" && (
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
                  )}
                </div>

                <div className="pt-6 mt-4">
                  <button
                    className="w-full md:h-14 h-12 md:text-lg font-bold uppercase tracking-wide bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={!finalProduct || isGeneratingMockup || (selections.type === "Other" && !printfulMockup)}
                    onClick={handleAddToCart}
                  >
                    {isGeneratingMockup && <Loader2 className="animate-spin w-5 h-5" />}
                    {isGeneratingMockup
                      ? "Generating Preview..."
                      : (finalProduct && !(selections.type === "Other" && !printfulMockup)
                        ? `Add to Cart - $${finalProduct.total_price.toFixed(2)}`
                        : "Select Options")
                    }
                  </button>

                  {!finalProduct && (
                    <p className="text-center text-xs text-red-400 mt-2">
                      Please finish selecting all options above
                    </p>
                  )}
                </div>

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