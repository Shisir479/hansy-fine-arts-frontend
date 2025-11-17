"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { FiHeart } from "react-icons/fi";
import { IoMdStarHalf } from "react-icons/io";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { useCart } from "@/hooks/use-cart";

interface ProductType {
  _id: string;
  name?: string;
  title?: string;
  image: string;
  description?: string;
  stockList?: string[] | string;
  price?: number;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { add } = useCart();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const resolvedParams = await params;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/arts/${resolvedParams.id}`,
          { cache: "no-store" }
        );

        const data = await res.json();
        setProduct(data.data ?? data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params]);

  if (loading)
    return <p className="text-center py-20 text-lg font-semibold">Loading...</p>;

  if (!product)
    return <p className="text-center py-20 text-red-600">Product not found.</p>;

  const { name, title, image, description, stockList, price } = product;
  const displayName = name ?? title ?? "Product";

  // Handle Add To Cart
  const handleAddToCart = () => {
    const cartProduct = {
      ...product,
      productTitle: displayName,
      category: "art",
      price: price || 0,
    };
    add(cartProduct);

    Swal.fire({
      title: "Added to Cart!",
      text: `${displayName} has been added to your cart.`,
      icon: "success",
      confirmButtonText: "Go to Cart",
    }).then((result) => {
      if (result.isConfirmed) router.push("/cart");
    });
  };

  const handleAddToWishlist = () => {
    Swal.fire({
      title: "Added to Wishlist!",
      text: `${displayName} has been added to your wishlist.`,
      icon: "success",
    });
  };

  return (
    <div>
      {/* HEADER */}
      <div className="w-full h-[463px] bg-[#9538E2] text-center text-white space-y-3 py-10">
        <h2 className="text-3xl font-bold">Product Details</h2>
        <p className="max-w-[796px] mx-auto">
          Explore the Elegant Watercolor Art different types categories and design.
        </p>
      </div>

      {/* MAIN PRODUCT SECTION */}
      <div className="hero max-w-[1020px] bg-base-200 mx-auto rounded-xl relative -top-[200px]">
        <div className="hero-content flex-col lg:flex-row gap-6">

          {/* IMAGE */}
          <img
            src={image}
            alt={displayName}
            className="max-w-[424px] max-h-[503px] rounded-2xl object-cover"
          />

          {/* DETAILS */}
          <div className="space-y-3">
            <h3 className="text-3xl semi-bold">{displayName}</h3>

            <p className="text-lg text-gray-600">Price: ${price}</p>

            <span className="badge bg-[rgba(47,156,8,0.1)] p-3 font-bold">
              {Array.isArray(stockList)
                ? stockList.join(", ")
                : stockList ?? "Out of Stock"}
            </span>

            <p className="text-2xl md:text-lg">{description}</p>

            {/* RATING */}
            <h4 className="text-xl font-bold flex gap-2 items-center">
              Public Rating: 4.9
              <span className="text-yellow-400 flex gap-2">
                <MdOutlineStarPurple500 />
                <MdOutlineStarPurple500 />
                <MdOutlineStarPurple500 />
                <MdOutlineStarPurple500 />
                <IoMdStarHalf />
              </span>
            </h4>

            <button
              onClick={handleAddToCart}
              className="btn bg-[#9538E2] text-white"
            >
              Add To Cart
              <i className="fa-solid fa-cart-shopping text-2xl ml-2"></i>
            </button>

            <button onClick={handleAddToWishlist} className="btn">
              <FiHeart className="text-4xl bg-zinc-200 p-2 rounded-full" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
