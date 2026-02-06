"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleArtsyProductQuery } from "@/lib/redux/api/artsyProductApi";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addToCart } from "@/lib/redux/slices/cartSlice"; // Use existing cart slice
import { toast } from "react-hot-toast";
import { TbFidgetSpinner } from "react-icons/tb";
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Share2 } from "lucide-react";
import Link from "next/link";

import { useCartSidebar } from "@/hooks/use-cart-sidebar";

export default function ArtsyProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { openSidebar } = useCartSidebar();

    const { data: productData, isLoading, isError } = useGetSingleArtsyProductQuery(id);
    const product = productData?.data;

    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        if (!product) return;

        setIsAdding(true);

        // Map ArtsyProduct to Cart Product Shape
        const cartItem = {
            _id: product._id,
            productTitle: product.title,
            name: product.title, // Fallback
            price: product.sellingPrice,
            image: product.image,
            category: typeof product.category === 'object' ? product.category?.name : product.category,
            description: product.description,
            productType: "artsy", // Identifier for checkout
            sku: product.sku,
            quantity: 1, // Default add quantity
        };

        dispatch(addToCart(cartItem));
        toast.success("Added to cart");
        setIsAdding(false);
        openSidebar();
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <TbFidgetSpinner className="h-8 w-8 animate-spin text-zinc-900 dark:text-zinc-50" />
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="flex h-screen flex-col items-center justify-center space-y-4 bg-zinc-50 dark:bg-zinc-950 text-center">
                <h2 className="text-xl font-serif text-zinc-900 dark:text-zinc-50">Product not found</h2>
                <Link
                    href="/artsy-products"
                    className="text-sm font-medium underline underline-offset-4 hover:text-zinc-600"
                >
                    Back to Collection
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white py-12 px-4 md:px-8 transition-colors duration-300">
            {/* Header / Breadcrumb - Hidden for cleaner look or consistent styling */}

            <div className="max-w-7xl mx-auto">
                <Link
                    href="/artsy-products"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Collection
                </Link>

                <div className="grid lg:grid-cols-12 gap-10">

                    {/* --- LEFT COLUMN: Image (7/12 cols) --- */}
                    <div className="lg:col-span-6 flex flex-col items-center justify-start h-full">
                        <div className="relative w-full max-w-[500px] py-5 transition-colors duration-300">
                            <div className="relative w-full aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 shadow-sm overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="h-full w-full object-cover object-center"
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: Details & Actions (5/12 cols) --- */}
                    <div className="lg:col-span-5 flex flex-col h-full">
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-2 py-1">
                                    {typeof product.category === 'object' ? product.category?.name : (product.category || "Fine Art")}
                                </span>
                                {product.stock <= 5 && product.stock > 0 && (
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 bg-amber-50 px-2 py-1">
                                        Low Stock
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4 leading-tight">
                                {product.title}
                            </h1>
                            <div className="prose prose-sm dark:prose-invert text-gray-500 dark:text-gray-400 line-clamp-4 leading-relaxed">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        <div className="flex items-end gap-3 mb-8 border-b border-gray-100 dark:border-zinc-800 pb-6">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                    ${product.sellingPrice}
                                </span>
                                <span className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">In Stock • Ready to Ship</span>
                            </div>
                        </div>

                        {/* Add to Cart Section */}
                        <div className="space-y-6 flex-grow">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="w-full md:h-14 h-12 md:text-lg font-bold uppercase tracking-wide bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isAdding ? (
                                    <TbFidgetSpinner className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {product.stock === 0 ? "Sold Out" : "Add to Cart"}
                                    </>
                                )}
                            </button>

                            <div className="grid grid-cols-3 gap-2 mt-8 py-6 border-t border-gray-100 dark:border-zinc-800 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <Truck className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                                    <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase">Fast Shipping</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <ShieldCheck className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                                    <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase">Authentic</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <Share2 className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                                    <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase">Share</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
