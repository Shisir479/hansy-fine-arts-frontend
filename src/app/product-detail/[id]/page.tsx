"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { CiImageOn } from "react-icons/ci";
import { useCart } from "@/hooks/use-cart";
import TShirtMockup from "@/components/mockups/TShirtMockup";
import PhoneCaseMockup from "@/components/mockups/PhoneCaseMockup";

interface ProductType {
  _id: string;
  title: string;
  image: string;
  price: number;
  description?: string;
}

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { add } = useCart(); // redux addToCart()

  const [product, setProduct] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch product from API
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

  const { _id, title, image, price, description } = product;

  // Add to cart
  const handleAddToCart = () => {
    add({
      ...product,
      quantity,
      productTitle: product.title,
      category: "art", // Replace "art" with the correct category if needed
    });

    Swal.fire({
      title: "Added to Cart!",
      text: `${title} has been added to your cart.`,
      icon: "success",
      confirmButtonText: "Go to Cart",
    }).then((result) => {
      if (result.isConfirmed) router.push("/cart");
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 lg:my-20 my-10 bg-gray-100">

      {/* ---------- PRODUCT TOP SECTION ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT SIDE - PRODUCT IMAGE + CONTROLS */}
        <div className="relative">
          <div className="group">
            <img
              src={image}
              alt="Product"
              className="rounded-lg w-[90%] object-cover transition duration-300 transform group-hover:scale-110"
            />
          </div>

          {/* Buttons below image */}
          <div className="flex items-center gap-10 mt-5">
            <button
              className="btn"
              onClick={() =>
                (document.getElementById("my_modal_5") as HTMLDialogElement)?.showModal()
              }
            >
              Show Full Image
            </button>

            {/* ROOM PREVIEW */}
            <a href={`/roompreview/${_id}`}>
              <CiImageOn className="text-5xl border-2 border-dotted bg-white p-2" />
            </a>

            {/* AR Live Preview */}
            {/* <ARLivePreview image={image} /> */}
          </div>
        </div>

        {/* RIGHT SIDE - DETAILS */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-xl text-gray-600 font-semibold mb-4">${price}</p>

          {/* QUANTITY */}
          <div className="flex items-center mt-4">
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 border rounded p-2"
            />
          </div>

          {/* CART BUTTONS */}
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-6 py-3 rounded uppercase hover:bg-gray-800"
            >
              Add to Cart
            </button>

            <button className="bg-gray-800 text-white px-6 py-3 rounded uppercase hover:bg-gray-900">
              Instant Checkout
            </button>
          </div>

          {/* MOCKUPS */}
          <div className="mt-8">
            <TShirtMockup image={image} />
            <PhoneCaseMockup image={image} />
          </div>

          {/* MEDIUM OPTIONS */}
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-2">Medium</h2>
            <div className="grid grid-cols-4 gap-2">
              <button className="border p-4 rounded hover:bg-gray-200">
                Watercolor Fine Art Paper
              </button>
              <button className="border p-4 rounded hover:bg-gray-200">
                Canvas
              </button>
              <button className="border p-4 rounded hover:bg-gray-200">
                Metal - White Gloss
              </button>
              <button className="border p-4 rounded hover:bg-gray-200">
                Wood
              </button>
            </div>
          </div>

          {/* SIZE */}
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Size</h2>
            <select className="border rounded p-2 w-full">
              <option>12 x 18</option>
              <option>16 x 20</option>
              <option>20 x 30</option>
            </select>
          </div>

          {/* STYLE */}
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Styles</h2>
            <select className="border rounded p-2 w-full">
              <option>Just the Print - 1 Border</option>
              <option>Framed Print</option>
            </select>
          </div>
        </div>
      </div>

      {/* ---------- FULL IMAGE MODAL ---------- */}
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <div className="flex justify-center">
            <img className="w-full h-auto" src={image} alt="" />
          </div>

          <div className="modal-action justify-center">
            <form method="dialog">
              <button className="btn text-xl font-bold text-white bg-[#9538E2]">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>

    </div>
  );
}
