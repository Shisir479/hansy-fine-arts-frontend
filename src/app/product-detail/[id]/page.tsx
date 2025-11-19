"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // 1. Import the hook
import ProductMockup from "@/components/mockups/ProductMocup";

interface ProductType {
  _id: string;
  title: string;
  image: string;
  price: number;
  description?: string;
}

// 2. Remove 'params' from the props here
export default function ProductDetail() {
  // 3. Get the params using the hook
  const params = useParams();
  const id = params.id as string; // Cast to string

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add a check to ensure id exists before fetching
    if (!id) return;

    const loadProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/arts/${id}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setProduct(data.data ?? data);
      } catch (err) {
        console.log("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading)
    return <div className="text-center py-20 text-xl font-semibold">Loading...</div>;

  if (!product)
    return <div className="text-center py-20 text-red-600">Product not found.</div>;

  return (
    <ProductMockup product={product} />
  );
}