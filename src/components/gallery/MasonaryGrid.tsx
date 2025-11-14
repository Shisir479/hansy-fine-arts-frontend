'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';

const MasonaryGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/arts`
      );
      setProducts(data.slice(0, 12)); // Limit to first 12 products
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-[1140px] mx-auto mt-10 px-4">
        <h2 className="text-3xl font-bold dark:text-white">Works of Artists</h2>
      </div>
      <div className="max-w-[1140px] columns-1 sm:columns-2 lg:columns-3 py-10 md:py-20 gap-4 mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px] col-span-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          products.map((product) => (
            <Link
              href={`/product/${product._id}`}
              key={product._id}
              className="mb-4 break-inside-avoid block transition hover:scale-105 shadow-xl rounded-lg overflow-hidden"
            >
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src={product.image || '/placeholder.jpg'}
                  alt={product.productTitle || 'Product'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
};

export default MasonaryGrid;
