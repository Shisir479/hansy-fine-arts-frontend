"use client";

import { useState } from "react";
import ArtCard from "../shop/ArtCard";
import LoadingSpinner from "../shared/LoadingSpinner";
import { useListFinerworksImagesQuery } from "@/lib/redux/api/finerworksApi";

export interface ArtType {
  _id: string;
  title: string;
  image: string;
  category?: string;
}

export default function ContemporaryArtGallery() {
  const [page, setPage] = useState(1);

  // 🔹 FinerWorks library info – real data diye replace korbi
  const library = {
    name: "inventory",
    session_id: "1234567890",
    account_key: "dc9e5410-0107-441a-92eb-6a4fd1c34c79",
    site_id: 2,
  };

  const { data, isLoading, isError, error } = useListFinerworksImagesQuery({
    library,
    page,
  });

  const images = data?.images ?? [];

  // FinerWorks docs:
  // per_page (response) = ei page e koto ta image return korse
  // count = total images in library
  const totalCount = data?.count ?? 0;      // TOTAL images
  const pageSize = 10;                     // tumi request e per_page: 10 pathaccho

  const hasPrev = page > 1;
  const hasNext = page * pageSize < totalCount;

  const totalPages =
    pageSize > 0 ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1;

  const contemporaryArts: ArtType[] = images.map((img) => ({
    _id: img.guid,
    title: img.title,
    image: img.public_preview_uri || img.public_thumbnail_uri || "",
    category: "contemporary",
  }));

  // Debug korte chaile:
  // console.log({ page, totalCount, pageSize, hasPrev, hasNext, totalPages });

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    console.error("Failed to fetch FinerWorks arts:", error);
    return (
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600 font-medium">
            Failed to load artworks. Please try again later.
          </p>
          <button
            onClick={() => location.reload()}
            className="mt-4 px-6 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-zinc-800 transition"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (contemporaryArts.length === 0) {
    return (
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-zinc-600 text-lg font-light">
            No contemporary artworks found at the moment.
          </p>
        </div>
      </section>
    );
  }

  const handlePrev = () => {
    if (hasPrev) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (hasNext) setPage((p) => p + 1);
  };

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-black" />
              <p className="text-zinc-800 uppercase tracking-[0.4em] text-[10px] font-medium">
                Collection
              </p>
              <div className="w-12 h-[1px] bg-black" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extralight text-black tracking-tighter mb-4">
            Contemporary
          </h2>
          <h2 className="text-4xl md:text-5xl font-light text-black tracking-tighter italic">
            Artworks
          </h2>
          <p className="text-zinc-600 font-light mt-6 max-w-2xl mx-auto">
            Explore our curated collection of contemporary pieces, each telling
            its own unique story
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {contemporaryArts.map((art) => (
            <ArtCard key={art._id} art={art} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={handlePrev}
            disabled={!hasPrev}
            className="px-4 py-2 border border-zinc-300 text-sm rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100"
          >
            Prev
          </button>

          <span className="text-sm text-zinc-600">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={!hasNext}
            className="px-4 py-2 border border-zinc-300 text-sm rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100"
          >
            Next
          </button>
        </div>

        {/* Footer Count */}
        <div className="text-center mt-6">
          <div className="w-32 h-[1px] bg-zinc-300 mx-auto mb-3" />
          <p className="text-xs text-zinc-500 uppercase tracking-[0.3em]">
            {totalCount} Piece{totalCount !== 1 ? "s" : ""} Total
          </p>
        </div>
      </div>
    </section>
  );
}
