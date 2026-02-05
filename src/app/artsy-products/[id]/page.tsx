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
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Navigation Bar / Breadcrumb */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-30">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <Link
                        href="/artsy-products"
                        className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Collection
                    </Link>
                    <div className="hidden sm:block text-xs font-bold uppercase tracking-widest text-zinc-400">
                        {typeof product.category === 'object' ? product.category?.name : (product.category || "Fine Art")}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 xl:gap-x-24">

                    {/* Product Image */}
                    <div className="relative mb-12 lg:mb-0">
                        <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-xl">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col justify-center">
                        <h1 className="mb-2 text-3xl font-serif text-zinc-900 dark:text-zinc-50 sm:text-4xl md:text-5xl">
                            {product.title}
                        </h1>

                        <div className="mb-8 flex items-center gap-4">
                            <span className="text-2xl font-medium text-zinc-900 dark:text-zinc-100 font-serif">
                                ${product.sellingPrice}
                            </span>
                            {product.discount > 0 && (
                                <span className="text-sm text-red-500 line-through">
                                    ${product.costPrice}
                                </span>
                            )}
                            {product.stock <= 5 && product.stock > 0 && (
                                <span className="text-xs font-bold uppercase text-amber-600 bg-amber-100 px-2 py-1">
                                    Low Stock: Only {product.stock} left
                                </span>
                            )}
                        </div>

                        <div className="mb-10 prose prose-zinc dark:prose-invert max-w-none text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                            <p>{product.description}</p>
                        </div>

                        {/* Actions */}
                        <div className="mb-10 space-y-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex w-full items-center justify-center gap-3 bg-zinc-900 dark:bg-zinc-50 px-8 py-5 text-center text-sm font-bold uppercase tracking-widest text-white dark:text-black transition-all hover:bg-black dark:hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
                            >
                                {isAdding ? (
                                    <TbFidgetSpinner className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <ShoppingBag className="w-4 h-4" />
                                        {product.stock === 0 ? "Sold Out" : "Add to Cart"}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 gap-6 border-t border-zinc-200 dark:border-zinc-800 pt-10 sm:grid-cols-2">
                            <div className="flex items-start gap-4">
                                <Truck className="h-6 w-6 text-zinc-400" />
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                                        Free Shipping
                                    </h4>
                                    <p className="mt-1 text-xs text-zinc-500">
                                        On all orders over $500
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <ShieldCheck className="h-6 w-6 text-zinc-400" />
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                                        Authenticity Guaranteed
                                    </h4>
                                    <p className="mt-1 text-xs text-zinc-500">
                                        Includes certificate of authenticity
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 cursor-pointer hover:text-black dark:hover:text-white text-zinc-400 transition-colors w-max">
                            <Share2 className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Share this piece</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
