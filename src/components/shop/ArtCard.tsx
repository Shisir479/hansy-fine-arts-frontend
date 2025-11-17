"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArtType } from "@/components/gallery/ContemporaryArtGallery";

export default function ArtCard({ art }: { art: ArtType }) {
  const { _id, title, image, category } = art;

  return (
    <Link href={`/product-detail/${_id}`} className="group">
      <Card className="overflow-hidden cursor-pointer">
        <div className="relative aspect-square bg-muted overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition flex items-center justify-center text-white">
            <h3 className="text-xl font-bold">{category}</h3>
          </div>
        </div>
      </Card>
    </Link>
  );
}
