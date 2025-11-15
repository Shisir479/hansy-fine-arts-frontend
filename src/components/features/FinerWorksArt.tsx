'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import Spinner from '@/components/shared/Spinner';

interface FinerWorksProduct {
  sku: string;
  name: string;
  per_item_price: number;
  image_url_1?: string;
}

const FinerWorksArt: React.FC = () => {
  const [products, setProducts] = useState<FinerWorksProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleProductClick = (product: FinerWorksProduct) => {
    console.log(product);
    router.push(`/product/finerworks/${product.sku}`);
  };

  const handleMakeOrderClick = (product: FinerWorksProduct) => {
    // Navigate with state - in Next.js we'll use query params instead
    router.push(
      `/checkout?productTitle=${encodeURIComponent(product.name)}&productSKU=${product.sku}&price=${product.per_item_price}`
    );
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      const url = '/api/products';
      try {
        const finerarts = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/finerarts`
        );
        const res = await axios.post(url, finerarts.data);
        setProducts(res.data.product_list);
        console.log(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 my-10">
      {loading && <Spinner />}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              className="border rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleProductClick(product)}
              key={index}
            >
              <div className="relative w-full h-64">
                <Image
                  src={product.image_url_1 || 'https://via.placeholder.com/150'}
                  alt={product.name || 'Product Image'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">
                  {product.name || 'Finerworks Art for Printing'}
                </h3>
                <div className="mt-4">
                  <p className="text-blue-600 font-bold">
                    Price: ${product.per_item_price}
                  </p>
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMakeOrderClick(product);
                  }}
                  className="mt-4 w-full bg-slate-800 text-white px-6 py-3 rounded uppercase hover:bg-slate-900 transition-colors"
                >
                  Make an Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinerWorksArt;
