'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface Image {
  guid: string;
  title: string;
  description: string;
  public_preview_uri: string;
  products?: any[];
}

const fetchFileImages = async () => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/image-file-manager`,
    {
      library: {
        name: 'inventory',
        session_id: '123456789',
        account_key: 'dc9e5410-0107-441a-92eb-6a4fd1c34c79',
        site_id: 2,
      },
      search_filter: '',
      guid_filter: null,
      page_number: 1,
      per_page: 10,
      sort_field: 'id',
      sort_direction: 'DESC',
      upload_date_from: null,
      upload_date_to: null,
      list_products: true,
      active: null,
    }
  );
  return data.images;
};

export default function FileImageFormFineWork() {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        const data = await fetchFileImages();
        setImages(data || []);
      } catch (err) {
        setError('Failed to load images');
        console.error('Error loading images:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {images?.map((image) => (
          <div
            key={image.guid}
            className="bg-white rounded-lg shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
          >
            <figure className="overflow-hidden rounded-t-lg relative h-64">
              <Image
                src={image.public_preview_uri}
                alt={image.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </figure>
            <div className="p-4">
              <h2 className="text-lg font-bold mb-2">{image.title}</h2>
              <p className="text-gray-600 text-sm">{image.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
