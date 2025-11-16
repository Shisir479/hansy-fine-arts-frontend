'use client';

import { useState, useEffect } from 'react';
import Categories from '@/components/shop/Categories';
import Spinner from '@/components/shared/Spinner';

interface ShopLayoutProps {
  children: React.ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch products to extract categories
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/products`);
        if (response.ok) {
          const products = await response.json();
          const uniqueCategories = [...new Set(products.map((product: any) => product.category))];
          setCategories(uniqueCategories as string[]);
        } else {
          // Fallback to default categories if API fails
          setCategories(['Abstract', 'Contemporary', 'Design', 'Landscape']);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories
        setCategories(['Abstract', 'Contemporary', 'Design', 'Landscape']);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="my-12">
      <h1 className="text-3xl font-semibold text-center my-6">
        Explore the Order Your Beautiful Watercolor Art
      </h1>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 md:grid-cols-12 grid-cols-1 gap-10">
        {/* Toggle Button for Mobile */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden block bg-purple-500 text-white px-4 py-2 rounded-md mx-auto md:absolute md:top-4 md:left-1/2 md:transform md:-translate-x-1/2"
        >
          {isSidebarOpen ? 'Hide Categories' : 'Show Categories'}
        </button>

        {/* Categories Sidebar */}
        <div
          className={`lg:col-span-3 transition-all duration-300 bg-gray-100 shadow-xl p-4 ${
            isSidebarOpen ? 'block' : 'hidden'
          } lg:block`}
        >
          <Categories categories={categories} />
        </div>

        {/* Product List Section */}
        <div className="lg:col-span-9 md:col-span-9 grid-cols-1 flex justify-center items-center h-full md:h-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
