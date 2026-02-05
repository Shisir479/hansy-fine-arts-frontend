"use client";

import { useListFinerworksImagesQuery } from "@/lib/redux/api/finerworksApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

interface ProductType {
    name: string;
    price?: number;
}

interface ImageType {
    guid: string;
    title: string;
    description: string;
    public_preview_uri: string;
    products?: ProductType[];
}

export default function GalleryPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const PER_PAGE = 10;

    // Library config
    const library = {
        name: "inventory",
        session_id: "123456789",
        account_key: "dc9e5410-0107-441a-92eb-6a4fd1c34c79",
        site_id: 2,
    };

    const { data, isLoading } = useListFinerworksImagesQuery({
        library,
        page: page,
        list_products: true,
    });

    const artworks = (data?.images as ImageType[]) || [];
    const totalItems = data?.count || 0;
    const totalPages = Math.ceil(totalItems / PER_PAGE);

    const handleNavigate = (guid: string) => {
        router.push(`/product-detail/${guid}`);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Calculate pricing display
    const getPriceDisplay = (work: ImageType) => {
        if (!work.products || work.products.length === 0) return null;
        const prices = work.products
            .map((p) => p.price)
            .filter((p) => p !== undefined) as number[];
        if (prices.length === 0) return null;
        return Math.min(...prices).toFixed(2);
    };

    return (
        <div className="min-h-screen bg-[#F0F0F0] dark:bg-zinc-950 pt-24 md:pt-32 pb-24 font-sans transition-colors duration-500">
            <div className="container mx-auto px-4 md:px-8">

                {/* Gallery Header - Minimal & Elegant */}
                <div className="flex flex-col items-center justify-center mb-20 space-y-4 text-center">
                    <span className="h-px w-20 bg-zinc-400 mb-4 inline-block"></span>
                    <p className="text-xs font-bold tracking-[0.4em] uppercase text-zinc-500 dark:text-zinc-400">Explore the</p>
                    <h1 className="text-5xl md:text-7xl font-serif text-zinc-900 dark:text-zinc-50 font-medium tracking-tight">
                        Art <span className="italic font-light text-zinc-500 dark:text-zinc-400">Collection</span>
                    </h1>
                </div>

                {/* Masonry Layout */}
                <div className="min-h-[600px]">
                    {isLoading ? (
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="break-inside-avoid mb-8">
                                    <div className="aspect-[3/4] bg-zinc-200 dark:bg-zinc-900 animate-pulse rounded-sm w-full" />
                                </div>
                            ))}
                        </div>
                    ) : artworks.length > 0 ? (
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 xl:gap-12 space-y-8 xl:space-y-12 items-start">
                            {artworks.map((work) => {
                                const price = getPriceDisplay(work);
                                return (
                                    <div
                                        key={work.guid}
                                        className="break-inside-avoid relative group cursor-pointer mb-8 xl:mb-12"
                                        onClick={() => handleNavigate(work.guid)}
                                    >
                                        {/* Museum Frame Card */}
                                        <div className="relative bg-white dark:bg-zinc-900 p-4 md:p-6 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out">

                                            {/* Image Canvas */}
                                            <div className="relative overflow-hidden w-full bg-zinc-50 dark:bg-black/20">
                                                <img
                                                    src={work.public_preview_uri}
                                                    alt={work.title}
                                                    className="w-full h-auto object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 will-change-transform"
                                                />

                                                {/* Overlay with details */}
                                                <div className="absolute inset-0 bg-white/90 dark:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-6 space-y-4 backdrop-blur-[2px]">

                                                    <h3 className="font-serif text-2xl text-zinc-900 dark:text-white italic translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 max-w-[80%]">
                                                        {work.title || "Untitled"}
                                                    </h3>

                                                    <div className="w-10 h-px bg-zinc-300 dark:bg-zinc-700 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" />

                                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium tracking-wide translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                                                        {price ? `Starting from $${price}` : ""}
                                                    </p>

                                                    <button className="mt-4 px-6 py-2 border border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 translate-y-4 group-hover:translate-y-0 delay-200 flex items-center gap-2">
                                                        Purchase<ArrowUpRight className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Shadow base / Reflection hint */}
                                        <div className="absolute -bottom-4 left-4 right-4 h-4 bg-black/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
                            <p>No artworks found.</p>
                        </div>
                    )}
                </div>

                {/* Pagination - Minimal */}
                {!isLoading && totalPages > 1 && (
                    <div className="mt-32 flex items-center justify-center gap-8 font-serif">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30 transition-colors group"
                        >
                            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            <span className="italic">Previous</span>
                        </button>

                        <div className="text-zinc-900 dark:text-white text-lg italic">
                            <span className="not-italic font-sans text-xs font-bold mr-2 text-zinc-300">PAGE</span>
                            {page} / {totalPages}
                        </div>

                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30 transition-colors group"
                        >
                            <span className="italic">Next</span>
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
