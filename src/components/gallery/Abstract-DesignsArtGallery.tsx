"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../shared/LoadingSpinner";
import ArtCard from "../shop/ArtCard";

export interface ArtType {
  _id: string;
  title: string;
  image: string;
  category: string;
  // যদি আরো ফিল্ড থাকে (price, artist ইত্যাদি) পরে যোগ করতে পারো
}

export default function AbstractDesignsArtGallery() {
  const [arts, setArts] = useState<ArtType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/arts`
          // অথবা যদি category অনুযায়ী আলাদা endpoint থাকে:
          // `${process.env.NEXT_PUBLIC_API_URL}/arts?category=abstract`
        );

        setArts(response.data);
      } catch (err: any) {
        console.error("Failed to fetch arts:", err);
        setError("Failed to load artworks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArts();
  }, []);

  // Loading State
  if (loading) return <LoadingSpinner />;

  // Error State
  if (error) {
    return (
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-zinc-800 transition"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // Filter only abstract arts
  const abstractArts = arts.filter(
    (art) => art.category?.toLowerCase() === "abstract"
  );

  // Empty State
  if (abstractArts.length === 0) {
    return (
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-zinc-600 text-lg font-light">
            No abstract artworks found at the moment.
          </p>
        </div>
      </section>
    );
  }

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
            Abstract
          </h2>
          <h2 className="text-4xl md:text-5xl font-light text-black tracking-tighter italic">
            Artworks
          </h2>
          <p className="text-zinc-600 font-light mt-6 max-w-2xl mx-auto">
            Explore our curated collection of abstract pieces, each telling its own unique story
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {abstractArts.map((art) => (
            <ArtCard key={art._id} art={art} />
          ))}
        </div>

        {/* Footer Count */}
        <div className="text-center mt-20">
          <div className="w-32 h-[1px] bg-zinc-300 mx-auto mb-6" />
          <p className="text-sm text-zinc-500 uppercase tracking-[0.3em]">
            {abstractArts.length} Piece{abstractArts.length !== 1 ? "s" : ""} Available
          </p>
        </div>
      </div>
    </section>
  );
}