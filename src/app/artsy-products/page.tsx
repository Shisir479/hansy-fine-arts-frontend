"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useGetAllArtsyProductsQuery } from "@/lib/redux/api/artsyProductApi";
import { TbFidgetSpinner } from "react-icons/tb";
import { ShoppingCart, Search, Heart, X, Minus, Plus, Facebook, Twitter, Linkedin, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { addToCart } from "@/lib/redux/slices/cartSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useCartSidebar } from "@/hooks/use-cart-sidebar";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// --- Colors changed to Black/White ---
const THEME_GREEN = "bg-zinc-900"; // Black for buttons/badges
const TEXT_GREEN = "text-zinc-900";
const HOVER_GREEN = "hover:bg-zinc-800";

// --- Custom Grid Icons ---
const Grid2x2Icon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={`cursor-pointer transition-colors ${active ? "text-zinc-900" : "text-zinc-300 hover:text-zinc-500"}`}>
    <rect x="2" y="2" width="7" height="7" fill="currentColor" />
    <rect x="11" y="2" width="7" height="7" fill="currentColor" />
    <rect x="2" y="11" width="7" height="7" fill="currentColor" />
    <rect x="11" y="11" width="7" height="7" fill="currentColor" />
  </svg>
);

const Grid3x3Icon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={`cursor-pointer transition-colors ${active ? "text-zinc-900" : "text-zinc-300 hover:text-zinc-500"}`}>
    <rect x="2" y="2" width="4" height="4" fill="currentColor" />
    <rect x="8" y="2" width="4" height="4" fill="currentColor" />
    <rect x="14" y="2" width="4" height="4" fill="currentColor" />
    <rect x="2" y="8" width="4" height="4" fill="currentColor" />
    <rect x="8" y="8" width="4" height="4" fill="currentColor" />
    <rect x="14" y="8" width="4" height="4" fill="currentColor" />
    <rect x="2" y="14" width="4" height="4" fill="currentColor" />
    <rect x="8" y="14" width="4" height="4" fill="currentColor" />
    <rect x="14" y="14" width="4" height="4" fill="currentColor" />
  </svg>
);

const Grid4x4Icon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={`cursor-pointer transition-colors ${active ? "text-zinc-900" : "text-zinc-300 hover:text-zinc-500"}`}>
    <rect x="1" y="1" width="3.5" height="3.5" fill="currentColor" />
    <rect x="6.5" y="1" width="3.5" height="3.5" fill="currentColor" />
    <rect x="12" y="1" width="3.5" height="3.5" fill="currentColor" />
    <rect x="17.5" y="1" width="3.5" height="3.5" fill="currentColor" />

    <rect x="1" y="6.5" width="3.5" height="3.5" fill="currentColor" />
    <rect x="6.5" y="6.5" width="3.5" height="3.5" fill="currentColor" />
    <rect x="12" y="6.5" width="3.5" height="3.5" fill="currentColor" />
    <rect x="17.5" y="6.5" width="3.5" height="3.5" fill="currentColor" />

    <rect x="1" y="12" width="3.5" height="3.5" fill="currentColor" />
    <rect x="6.5" y="12" width="3.5" height="3.5" fill="currentColor" />
    <rect x="12" y="12" width="3.5" height="3.5" fill="currentColor" />
    <rect x="17.5" y="12" width="3.5" height="3.5" fill="currentColor" />

    <rect x="1" y="17.5" width="3.5" height="3.5" fill="currentColor" />
    <rect x="6.5" y="17.5" width="3.5" height="3.5" fill="currentColor" />
    <rect x="12" y="17.5" width="3.5" height="3.5" fill="currentColor" />
    <rect x="17.5" y="17.5" width="3.5" height="3.5" fill="currentColor" />
  </svg>
);


// --- Quick View Modal ---
interface QuickViewModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: any, quantity: number) => void;
}

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }: QuickViewModalProps) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Dynamic Discount Logic
  const originalPrice = product.price || product.sellingPrice;
  const hasDiscount = originalPrice > product.sellingPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - product.sellingPrice) / originalPrice) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-white dark:bg-zinc-950 shadow-2xl  border-none">

        <div className="relative grid grid-cols-1 md:grid-cols-2 h-full max-h-[90vh] overflow-y-auto md:overflow-visible">
          <DialogClose className="absolute right-4 top-4 z-50 p-2 text-zinc-500 hover:text-black transition-colors bg-white/50 md:bg-transparent cursor-pointer">
            <X className="w-5 h-5" />
          </DialogClose>

          {/* Left: Image */}
          <div className="relative bg-white flex items-center justify-center p-8 border-r border-zinc-100 min-h-[300px]">
            {hasDiscount && (
              <div className={`absolute top-6 left-6 ${THEME_GREEN} text-white text-xs font-bold px-3 py-1.5  z-10`}>
                -{discountPercentage}%
              </div>
            )}
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="max-h-[50vh] w-auto object-contain drop-shadow-md"
              />
            ) : (
              <div className="text-zinc-300 font-sans text-xl">No Image</div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col p-8 lg:p-10 gap-6">
            <div>
              {/* Replaced h2 with DialogTitle for accessibility */}
              <DialogTitle className="text-2xl md:text-3xl font-medium text-zinc-900 dark:text-zinc-50 mb-3 leading-tight">
                {product.title}
              </DialogTitle>
              <div className="flex items-center gap-4 mb-2">
                {hasDiscount && (
                  <span className="text-zinc-400 line-through text-lg">${originalPrice}</span>
                )}
                <span className={`${TEXT_GREEN} text-2xl font-bold`}>${product.sellingPrice}</span>
              </div>
              <div className="text-sm text-zinc-500 font-medium">
                {typeof product.category === "object" ? product.category?.name : product.category}
              </div>
            </div>

            {/* Wrapped description in DialogDescription */}
            <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-b border-zinc-100 pb-6">
              {product.description || "No description available."}
            </DialogDescription>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-zinc-300 ">
                  <button onClick={handleDecrement} className="px-3 py-2.5 hover:bg-zinc-100 transition-colors text-zinc-600 border-r border-zinc-200">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-zinc-800">{quantity}</span>
                  <button onClick={handleIncrement} className="px-3 py-2.5 hover:bg-zinc-100 transition-colors text-zinc-600 border-l border-zinc-200">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Buttons */}
                <Button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className={`${THEME_GREEN} ${HOVER_GREEN} text-white h-11 px-8 text-xs font-bold uppercase tracking-wider            flex-1`}
                >
                  Add to Cart
                </Button>
                <Button
                  className={`${THEME_GREEN} ${HOVER_GREEN} text-white h-11 px-8 text-xs font-bold uppercase tracking-wider  flex-1`}
                  onClick={() => toast.success("Proceeding to checkout...")} // Mock checkout
                >
                  Buy Now
                </Button>
              </div>

              <div className="space-y-3 pt-2 text-sm text-zinc-500">
                <div className="flex gap-2">
                  <span className="font-bold text-zinc-800">Category:</span>
                  <span>{typeof product.category === "object" ? product.category?.name : product.category}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-bold text-zinc-800">Share:</span>
                  <div className="flex gap-3 text-zinc-400 ml-1">
                    <Facebook className="w-4 h-4 hover:text-[#1877F2] cursor-pointer transition-colors" />
                    <Twitter className="w-4 h-4 hover:text-[#1DA1F2] cursor-pointer transition-colors" />
                    <Linkedin className="w-4 h-4 hover:text-[#0A66C2] cursor-pointer transition-colors" />
                    <Share2 className="w-4 h-4 hover:text-zinc-800 cursor-pointer transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default function ArtsyProductsPage() {
  const { data: productsData, isLoading, isError, error } = useGetAllArtsyProductsQuery({});
  const dispatch = useAppDispatch();
  const { openSidebar } = useCartSidebar();

  // -- View State: 2, 3, or 4 columns --
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);

  // -- Filter & Pagination States --
  const [activeCategory, setActiveCategory] = useState("All");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  // -- Quick View State --
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const products = useMemo(() => productsData?.data || [], [productsData]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(
      products.map((p: any) =>
        typeof p.category === "object" ? p.category?.name : p.category
      )
    );
    return ["All", ...Array.from(cats)].filter(Boolean) as string[];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product: any) => {
      const categoryName =
        typeof product.category === "object" ? product.category?.name : product.category;
      return activeCategory === "All" || categoryName === activeCategory;
    });
  }, [products, activeCategory]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAddToCart = (product: any, qty: number = 1) => {
    const cartItem = {
      _id: product._id,
      productTitle: product.title,
      name: product.title,
      price: product.sellingPrice,
      image: product.image,
      category: typeof product.category === "object" ? product.category?.name : product.category,
      description: product.description,
      productType: "artsy",
      sku: product.sku,
      quantity: qty,
    };
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
    openSidebar();
  };

  const handleQuickView = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); // Stop Link navigation
    e.stopPropagation();
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success("Added to Wishlist");
  }

  const handleAddToCartClick = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCart(product);
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <TbFidgetSpinner className="h-10 w-10 animate-spin text-zinc-300" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center px-4">
        <p className="text-red-500">Unable to load products. Please try again.</p>
      </div>
    );
  }

  // Helper to determine grid class
  const getGridClass = () => {
    switch (gridCols) {
      case 2: return "grid-cols-1 sm:grid-cols-2";
      case 3: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case 4: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans py-10">

      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={quickViewProduct}
        onAddToCart={handleAddToCart}
      />

      {/* Header / Breadcrumb Area */}
      <div className="container mx-auto px-4 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4 border-b border-zinc-100">
          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-900 font-bold">Artsy Products</span>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-6 text-sm flex-wrap">
            <div className="flex items-center gap-3 bg-zinc-50 px-3 py-1.5 ">
              <span className="text-zinc-800 font-medium">Show :</span>
              {[9, 12, 18, 24].map(n => (
                <button
                  key={n}
                  onClick={() => {
                    setItemsPerPage(n);
                    setCurrentPage(1); // Reset to first page
                  }}
                  className={`hover:text-black transition-colors ${itemsPerPage === n ? "text-zinc-900 font-bold border-b border-zinc-900 leading-none" : "text-zinc-400"}`}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Dynamic Grid Controls */}
            <div className="flex items-center gap-2 text-zinc-400 border-l border-zinc-200 pl-6 h-8">
              <div onClick={() => setGridCols(2)} title="2 Columns" className="h-full flex items-center">
                <Grid2x2Icon active={gridCols === 2} />
              </div>
              <div onClick={() => setGridCols(3)} title="3 Columns" className="h-full flex items-center">
                <Grid3x3Icon active={gridCols === 3} />
              </div>
              <div onClick={() => setGridCols(4)} title="4 Columns" className="h-full flex items-center">
                <Grid4x4Icon active={gridCols === 4} />
              </div>
            </div>

            {/* Simple Dropdown Stub */}
            <div className="relative border-l border-zinc-200 pl-6">
              <select className="appearance-none bg-transparent py-1 pr-8 text-zinc-800 font-bold focus:outline-none cursor-pointer text-right">
                <option>Random Products</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Tabs */}
        {categories.length > 1 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentPage(1); // Reset
                }}
                className={`px-5 py-2  text-sm font-medium transition-all ${activeCategory === cat
                  ? "bg-zinc-900 text-white shadow-md border border-zinc-900"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-32 text-zinc-400 italic">No products found for this category.</div>
        ) : (
          <div className={`grid gap-8 ${getGridClass()}`}>
            {paginatedProducts.map((product: any) => {
              // Dynamic Discount Calculation
              const originalPrice = product.price || product.sellingPrice;
              const hasDiscount = originalPrice > product.sellingPrice;
              const discountPercentage = hasDiscount
                ? Math.round(((originalPrice - product.sellingPrice) / originalPrice) * 100)
                : 0;

              return (
                <div key={product._id} className="group relative border border-zinc-100 bg-white transition-all duration-300 h-full flex flex-col">

                  {/* Discount Badge - Dynamic */}
                  {hasDiscount && (
                    <div className={`absolute top-4 left-4 z-20 ${THEME_GREEN} text-white text-[11px] font-bold h-11 w-11 flex items-center justify-center shadow-md`}>
                      -{discountPercentage}%
                    </div>
                  )}

                  {/* Image Area */}
                  <Link href={`/artsy-products/${product._id}`} className="block relative h-[280px] w-full p-6 overflow-hidden bg-white">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain transition-transform duration-500 ease-in-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-50 text-zinc-300 italic">No Image</div>
                    )}

                    {/* Hover Icons Strip */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500 z-30">
                      <div className="bg-white p-1.5  shadow-lg border border-zinc-100 flex gap-2">
                        <button
                          onClick={(e) => handleAddToCartClick(e, product)}
                          className="p-2.5  hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                        <div className="w-[1px] bg-zinc-200 h-6 get-centered self-center"></div>
                        <button
                          onClick={(e) => handleQuickView(e, product)}
                          className="p-2.5  hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors"
                          title="Quick View"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                        <div className="w-[1px] bg-zinc-200 h-6 get-centered self-center"></div>
                        <button
                          onClick={handleWishlist}
                          className="p-2.5  hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors"
                          title="Wishlist"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="px-4 pb-6 pt-2 text-center flex-1 flex flex-col justify-end">
                    <h3 className="text-[15px] font-medium text-zinc-800 mb-1.5 line-clamp-2 min-h-[44px] leading-snug group-hover:text-[#1f4d25] transition-colors">
                      <Link href={`/artsy-products/${product._id}`}>
                        {product.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-zinc-400 mb-3 uppercase tracking-wide">
                      {typeof product.category === "object" ? product.category?.name : product.category || "Art Material"}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      {hasDiscount && (
                        <span className="text-sm text-zinc-400 line-through font-light">${originalPrice}</span>
                      )}
                      <span className={`${TEXT_GREEN} font-bold text-lg`}>${product.sellingPrice}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16 mb-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center border border-zinc-200  text-zinc-500 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx + 1)}
                className={`w-10 h-10 flex items-center justify-center border text-sm font-bold transition-all  ${currentPage === idx + 1
                  ? "bg-zinc-900 border-zinc-900 text-white"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
                  }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center border border-zinc-200  text-zinc-500 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
