"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export interface CategoryType {
  name: string;
  slug: string;
  imageUrl: string;
  productCount: number;
}

export default function CategoryCard({ category }: { category: CategoryType }) {
  const { name, slug, imageUrl, productCount } = category;

  return (
    <Link href={`/shop/${slug}`} className="group">
      <Card className="overflow-hidden cursor-pointer">
        <div className="relative aspect-square bg-muted">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center text-white">
            <h3 className="text-2xl font-bold mb-2">{name}</h3>
            <p className="text-sm">{productCount} Products</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
