"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import ProductMockup from "@/components/mockups/ProductMocup";
import { useListFinerworksImagesQuery } from "@/lib/redux/api/finerworksApi";

interface ProductType {
  _id: string;
  title: string;
  image: string;
  price: number;
  description?: string;
}

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string; // url: /product/[id] → id = guid

  // 🔹 FinerWorks library info – real value diye de
  const library = {
    name: "inventory",
    session_id: "1234567890",
    account_key: "dc9e5410-0107-441a-92eb-6a4fd1c34c79",
    site_id: 2,
  };

  // 🔥 RTK Query diye list API call
  // এখানে ধরলাম first page thekei product ta peye jachchi
  // jodi page-wise search korte hoy, alada queryFn banabo
  const {
    data,
    isLoading,
    isError,
    error,
  } = useListFinerworksImagesQuery({ library, page: 1 });

  // images array fallback
  const images = data?.images ?? [];

  // 🎯 URL er id (guid) diye image ber kore ProductType e map
  const product: ProductType | null = useMemo(() => {
    if (!id || images.length === 0) return null;

    const img = images.find((item) => item.guid === id);
    if (!img) return null;

    return {
      _id: img.guid,
      title: img.title,
      image: img.public_preview_uri || img.public_thumbnail_uri || "",
      price: 0, // jodi price info onno place theke ashe, pore replace korbi
      description: img.description,
    };
  }, [id, images]);

  // Debug chai gele:
  // console.log({ id, imagesCount: images.length, product });

  if (isLoading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (isError) {
    console.error("❌ FinerWorks list error in ProductDetail:", error);
    return (
      <div className="text-center py-20 text-red-600">
        Failed to load product.
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-red-600">
        Product not found.
      </div>
    );
  }

  return <ProductMockup product={product} />;
}
