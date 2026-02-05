"use client";

import React from "react";
import Link from "next/link";
import { useGetAllArtsyProductsQuery } from "@/lib/redux/api/artsyProductApi";
import { TbFidgetSpinner } from "react-icons/tb";
import { ShoppingBag, ArrowRight } from "lucide-react";

import { addToCart } from "@/lib/redux/slices/cartSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useCartSidebar } from "@/hooks/use-cart-sidebar";
import { toast } from "react-hot-toast";

export default function ArtsyProductsPage() {
  const { data: productsData, isLoading, isError, error } = useGetAllArtsyProductsQuery({});
  const dispatch = useAppDispatch();
  const { openSidebar } = useCartSidebar();

  // Safely access the array. The backend usually returns { success: true, data: [...] }
  const products = productsData?.data || [];

  const handleAddToCart = (product: any) => {
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
      quantity: 1,
    };
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
    openSidebar();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <TbFidgetSpinner className="h-8 w-8 animate-spin text-zinc-900 dark:text-zinc-50" />
      </div>
    );
  }

  if (isError) {
    const errorMsg = (error as any)?.data?.message || (error as any)?.error || "Please try again later.";
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4 bg-zinc-50 dark:bg-zinc-950 text-center">
        <h2 className="text-xl font-serif text-zinc-900 dark:text-zinc-50">Unable to load collection</h2>
        <p className="text-sm text-red-500">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black px-4 py-24 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-7xl mb-20 text-center">
        <h1 className="mb-6 text-4xl font-serif text-zinc-900 dark:text-zinc-50 md:text-6xl tracking-tight">
          Artsy Collection
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
          Curated Masterpieces
        </p>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl">
        {products.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 italic">No artworks available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 gap-y-16 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-12">
            {products.map((product: any) => (
              <div key={product._id} className="group flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <Link href={`/artsy-products/${product._id}`} className="block h-full w-full">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-400">No Image</div>
                    )}
                  </Link>

                  {/* Overlay / Quick Actions */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0 bg-white/90 dark:bg-black/90 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-800">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/artsy-products/${product._id}`}
                        className="flex items-center justify-center py-3 text-[10px] font-bold uppercase tracking-widest text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-black dark:border-white transition-all transform hover:-translate-y-0.5"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex items-center justify-center py-3 text-[10px] font-bold uppercase tracking-widest text-white bg-black dark:text-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all transform hover:-translate-y-0.5 shadow-lg"
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-5 text-center">
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1 font-serif">
                    <Link href={`/artsy-products/${product._id}`} className="hover:underline underline-offset-4 decoration-zinc-400">
                      {product.title}
                    </Link>
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-zinc-500">
                    <span>{typeof product.category === 'object' ? product.category?.name : (product.category || "Fine Art")}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-300">${product.sellingPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
