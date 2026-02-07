"use client";

import { useListFinerworksImagesQuery } from "@/lib/redux/api/finerworksApi";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

interface ImageType {
  guid: string;
  title: string;
  description: string;
  public_preview_uri: string;
  products?: any[];
}

export default function FileImageFormFineWork() {
  const router = useRouter();

  // Library config
  const library = {
    name: "inventory",
    session_id: "123456789",
    account_key: "dc9e5410-0107-441a-92eb-6a4fd1c34c79",
    site_id: 2,
  };

  const { data, isLoading, isError } = useListFinerworksImagesQuery({
    library,
    page: 1,
    list_products: true,
  });

  const latestworks = ((data?.images as ImageType[]) || []).slice(0, 3);

  const handleNavigate = (guid: string) => {
    router.push(`/product-detail/${guid}`);
  };

  // Create skeleton items array
  const skeletons = Array(3).fill(null);

  // If error and not loading, don't show anything (as per original logic)
  if (isError && !isLoading) return null;
  // If no data and not loading, don't show anything
  if (!isLoading && latestworks.length === 0) return null;

  return (
    <section
      className="py-24 md:py-32 bg-[#FDFBF7] dark:bg-zinc-950 transition-colors duration-500 overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.4em] text-zinc-400 uppercase mb-4 ml-1">Curated Selection</p>
            <h2 className="md:text-5xl text-4xl font-serif font-thin text-zinc-900 dark:text-zinc-50">
              Latest <span className="italic font-normal">Arrivals</span>
            </h2>
          </div>

          <button
            onClick={() => router.push("/gallery")}
            className="hidden md:flex items-center gap-3 group text-xl font-bold tracking-widest uppercase pb-2 hover:opacity-70 transition-opacity"
          >
            View Gallery
            <ArrowUpRight className="w-6 h-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {isLoading ? (
            // SKELETON GRID
            skeletons.map((_, i) => (
              <div key={i} className={`flex flex-col gap-6 ${i === 1 ? 'md:translate-y-12' : ''}`}>
                <div className="w-full aspect-[4/5] bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-sm" />
                <div className="space-y-3 px-2">
                  <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
              </div>
            ))
          ) : (
            // REAL DATA GRID
            latestworks.map((work, index) => (
              <div
                key={work.guid}
                className={`group cursor-pointer flex flex-col gap-6 ${index === 1 ? 'md:translate-y-12' : ''}`}
                onClick={() => handleNavigate(work.guid)}
              >
                {/* Image Canvas */}
                <div className="relative w-full aspect-[4/5] bg-white dark:bg-zinc-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-6 md:p-8 flex items-center justify-center transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                  <img
                    src={work.public_preview_uri}
                    alt={work.title}
                    className="max-h-full max-w-full object-contain drop-shadow-md"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-white/0 dark:bg-black/0 group-hover:bg-white/10 dark:group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Info */}
                <div className="text-center md:text-left space-y-2 px-2">
                  <div className="flex justify-between items-baseline border-t border-zinc-200 dark:border-zinc-800 pt-4">
                    <h3 className="font-serif text-2xl text-zinc-900 dark:text-white group-hover:italic transition-all duration-300">
                      {work.title || "Untitled"}
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-400">0{index + 1}</span>
                  </div>
                  <p className="text-xs tracking-wide text-zinc-500 line-clamp-2 leading-relaxed">
                    {work.description || "Fine Art Print Collection"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Mobile View More */}
        <div className="md:hidden mt-12 text-center">
          <button
            onClick={() => router.push("/gallery")}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest border-b border-zinc-900 dark:border-white pb-1"
          >
            View Full Gallery
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}