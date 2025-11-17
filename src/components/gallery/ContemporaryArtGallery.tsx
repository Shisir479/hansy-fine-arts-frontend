"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../shared/LoadingSpinner";
import ArtCard from "../shop/ArtCard";   // <-- FIX

export interface ArtType {
  _id: string;
  title: string;
  image: string;
  category: string;
}

const ContemporaryArtGallery = () => {
  const [arts, setArts] = useState<ArtType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/arts`)
      .then((res) => setArts(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const filtered = arts.filter(
    (art) => art.category === "contemporary"
  );

  return (
    <div className="max-w-7xl grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 mx-auto">
      {filtered.map((art) => (
        <ArtCard key={art._id} art={art} />  
      ))}
    </div>
  );
};

export default ContemporaryArtGallery;
