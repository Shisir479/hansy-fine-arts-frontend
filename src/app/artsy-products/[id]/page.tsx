"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleArtsyProductQuery } from "@/lib/redux/api/artsyProductApi";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addToCart } from "@/lib/redux/slices/cartSlice";
import { toast } from "react-hot-toast";
import { TbFidgetSpinner } from "react-icons/tb";
import { Minus, Plus, Facebook, Twitter, Linkedin, Share2, Star } from "lucide-react"; // Import Icons
import Link from "next/link";
import { useCartSidebar } from "@/hooks/use-cart-sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Colors to match Listing Page ---
const THEME_GREEN = "bg-zinc-900";
const TEXT_GREEN = "text-zinc-900";
const HOVER_GREEN = "hover:bg-zinc-800";
const BORDER_GREEN = "border-zinc-900";

export default function ArtsyProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { openSidebar } = useCartSidebar();

    const { data: productData, isLoading, isError } = useGetSingleArtsyProductQuery(id);
    const product = productData?.data;

    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");

    const handleIncrement = () => setQuantity((prev) => prev + 1);
    const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        if (!product) return;

        const cartItem = {
            _id: product._id,
            productTitle: product.title,
            name: product.title,
            price: product.sellingPrice,
            image: product.image,
            category: typeof product.category === 'object' ? product.category?.name : product.category,
            description: product.description,
            productType: "artsy",
            sku: product.sku,
            quantity: quantity,
        };

        dispatch(addToCart(cartItem));
        toast.success("Added to cart");
        openSidebar();
    };

    const handleBuyNow = () => {
        handleAddToCart();
        // create checkout session
        router.push("/checkout");
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <TbFidgetSpinner className="h-10 w-10 animate-spin text-zinc-300" />
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="flex h-screen flex-col items-center justify-center space-y-4 bg-white text-center">
                <h2 className="text-xl text-zinc-800">Product not found</h2>
                <Link
                    href="/artsy-products"
                    className="text-sm font-bold underline hover:text-[#1f4d25]"
                >
                    Back to Collection
                </Link>
            </div>
        );
    }

    // Dynamic Discount Logic
    const originalPrice = product.price || product.sellingPrice;
    const hasDiscount = originalPrice > product.sellingPrice;
    const discountPercentage = hasDiscount
        ? Math.round(((originalPrice - product.sellingPrice) / originalPrice) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans pt-24 pb-20">

            {/* Header / Breadcrumb */}
            <div className="container mx-auto px-4 lg:px-8 mb-8 border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/artsy-products" className="hover:text-zinc-900 transition-colors">Artsy Products</Link>
                    <span>/</span>
                    <span className="text-zinc-900 font-bold truncate max-w-[200px]">{product.title}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                    {/* --- Left: Image --- */}
                    <div className="relative">
                        {/* Discount Badge */}
                        {hasDiscount && (
                            <div className={`absolute top-4 left-4 z-10 ${THEME_GREEN} text-white text-xs font-bold w-12 h-12 flex items-center justify-center rounded-full shadow-md`}>
                                -{discountPercentage}%
                            </div>
                        )}
                        <div className="border border-zinc-200 bg-white p-6 md:p-10 flex items-center justify-center h-[500px]">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <div className="text-zinc-300 italic text-xl">No Image Available</div>
                            )}
                        </div>
                    </div>

                    {/* --- Right: Details --- */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-medium text-zinc-900 mb-2 leading-tight">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-1 mb-4 text-xs text-zinc-500 font-medium">
                            <div className="flex text-amber-500">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                            </div>
                            <span className="ml-2 py-0.5 px-2 bg-zinc-100 rounded text-zinc-600">IN STOCK</span>
                        </div>

                        <div className="flex items-center gap-4 mb-6 border-b border-zinc-100 pb-6">
                            {hasDiscount && (
                                <span className="text-zinc-400 line-through text-2xl font-light">${originalPrice}</span>
                            )}
                            <span className={`${TEXT_GREEN} text-3xl font-bold`}>${product.sellingPrice}</span>
                        </div>

                        <div className="prose prose-sm text-zinc-600 mb-8 leading-relaxed line-clamp-4">
                            <p>{product.description || "No description provided."}</p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-6 mb-8 border-b border-zinc-100 pb-8">
                            <div className="flex flex-wrap items-center gap-4">
                                {/* Quantity */}
                                <div className="flex items-center border border-zinc-300 h-12 w-32">
                                    <button onClick={handleDecrement} className="px-4 h-full flex items-center justify-center hover:bg-zinc-50 transition-colors text-zinc-600 border-r border-zinc-200">
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            setQuantity(isNaN(val) || val < 1 ? 1 : val);
                                        }}
                                        className="flex-1 w-full text-center font-bold text-zinc-800 focus:outline-none h-full bg-transparent appearance-none"
                                    />
                                    <button onClick={handleIncrement} className="px-4 h-full flex items-center justify-center hover:bg-zinc-50 transition-colors text-zinc-600 border-l border-zinc-200">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4 flex-1 min-w-[300px]">
                                    <Button
                                        onClick={handleAddToCart}
                                        className={`${THEME_GREEN} ${HOVER_GREEN} text-white h-12 w-full text-sm font-bold uppercase tracking-widest   shadow-sm`}
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        onClick={handleBuyNow}
                                        className={`${THEME_GREEN} ${HOVER_GREEN} text-white h-12 w-full text-sm font-bold uppercase tracking-widest   shadow-sm`}
                                    >
                                        Buy Now
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="space-y-3 text-sm text-zinc-500">
                            <div className="flex gap-2">
                                <span className="font-bold text-zinc-800">SKU:</span>
                                <span>{product.sku || "N/A"}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-bold text-zinc-800">Category:</span>
                                <span className="capitalize">{typeof product.category === "object" ? product.category?.name : product.category}</span>
                            </div>
                            <div className="flex gap-2 items-center mt-4">
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

                {/* --- Tabs Section --- */}
                <div className="mt-20">
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="w-full justify-start border-b border-zinc-200 bg-transparent h-auto p-0 rounded-none gap-8 mb-8">
                            <TabsTrigger
                                value="description"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-zinc-900 data-[state=active]:text-zinc-900 rounded-none px-0 py-4 text-zinc-500 font-bold uppercase tracking-wide text-sm hover:text-zinc-800 transition-colors"
                            >
                                Description
                            </TabsTrigger>
                            <TabsTrigger
                                value="reviews"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-zinc-900 data-[state=active]:text-zinc-900 rounded-none px-0 py-4 text-zinc-500 font-bold uppercase tracking-wide text-sm hover:text-zinc-800 transition-colors"
                            >
                                Reviews (0)
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="text-zinc-600 leading-relaxed text-sm max-w-4xl">
                            <p className="mb-4 text-lg font-medium text-zinc-800">Product Details</p>
                            <p>{product.description || "No specific description available."}</p>
                            <p className="mt-4">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </TabsContent>

                        <TabsContent value="reviews">
                            <div className="bg-zinc-50 p-8   border border-zinc-100 text-center">
                                <p className="text-zinc-500 mb-2">No reviews yet.</p>
                                <Button className="bg-zinc-900 text-white   text-xs font-bold uppercase tracking-wider">
                                    Be the first to review
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* --- Related Products (Mock) --- */}
                <div className="mt-20 mb-10">
                    <h3 className="text-xl font-bold text-zinc-900 mb-8 uppercase tracking-wide border-l-4 border-zinc-900 pl-4">
                        Related Products
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 opacity-60 pointer-events-none grayscale">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="border border-zinc-100 bg-white h-64 flex items-center justify-center">
                                <span className="text-zinc-300">Product Placeholder {i}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
