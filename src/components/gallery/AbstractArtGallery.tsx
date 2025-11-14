'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryCard from '@/components/shop/CategoryCard';
import Spinner from '@/components/shared/Spinner';
import { Product } from '@/types/product';

const AbstractArtGallery = () => {
  const [arts, setArts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArts();
  }, []);

  const fetchArts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/arts`
      );
      setArts(data);
    } catch (err) {
      setError('Error loading data');
      console.error('Error fetching arts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const abstractArts = arts.filter((art) => art.category === 'abstract');

  return (
    <div className="max-w-7xl grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 mx-auto px-4">
      {abstractArts.length > 0 ? (
        abstractArts.map((art) => <CategoryCard key={art._id} product={art} />)
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No abstract artworks available.
        </p>
      )}
    </div>
  );
};

export default AbstractArtGallery;
