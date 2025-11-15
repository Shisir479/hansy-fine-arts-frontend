'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Frame {
  id: string;
  name: string;
  description: string;
  icon_url_1: string;
}

const FrameCollection: React.FC = () => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFrames = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/list`,
        {}
      );
      setFrames(response.data.collections);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFrames();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Frame Collection</h1>
      {frames.length > 0 ? (
        <ul className="list-none p-0">
          {frames.map((frame) => (
            <li key={frame.id} className="mb-5">
              <div className="relative w-[200px] h-[200px] mb-2">
                <Image
                  src={frame.icon_url_1}
                  alt={frame.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold">{frame.name}</h3>
              <p className="text-gray-600">{frame.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No frames found.</p>
      )}
    </div>
  );
};

export default FrameCollection;
