'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface Art {
  _id: string;
  image: string;
  title?: string;
  category?: string;
}

const PortraitCarousel: React.FC = () => {
  const [arts, setArts] = useState<Art[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/arts`);
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        setArts(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchArts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filter only portrait images
  const portraitImages = arts.filter((art) => art.category === 'portrait');

  return (
    <div className="w-full">
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent>
          {portraitImages.map((art) => (
            <CarouselItem key={art._id}>
              <div className="relative w-full max-h-[500px]">
                <Image
                  src={art.image}
                  alt={art.title || 'Portrait Art'}
                  width={800}
                  height={500}
                  className="w-full h-auto object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default PortraitCarousel;
