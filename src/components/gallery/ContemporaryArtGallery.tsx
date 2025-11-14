'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryCard from '@/components/shop/CategoryCard';
import Spinner from '@/components/shared/Spinner';
import { Product } from '@/types/product';

const ContemporaryArtGallery = () => {
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

  const contemporaryArts = arts.filter((art) => art.category === 'contemporary');

  return (
    <div className="max-w-7xl grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 mx-auto px-4">
      {contemporaryArts.length > 0 ? (
        contemporaryArts.map((art) => <CategoryCard key={art._id} product={art} />)
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No contemporary artworks available.
        </p>
      )}
    </div>
  );
};

export default ContemporaryArtGallery;
