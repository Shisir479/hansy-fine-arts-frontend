'use client';

import { useState } from 'react';
import Image from 'next/image';

const categories = {
  all: [
    {
      id: 1,
      title: 'The Contemporary',
      description:
        'This format perfectly fits in case you need only a single image for your post display...',
      image: '/cuadro-horizontal-1.jpg',
    },
    {
      id: 2,
      title: 'The Contemporary',
      description: 'This format can be used to display images as a gallery...',
      image: '/cuadro-horizontal-2.jpg',
    },
    {
      id: 3,
      title: 'The Contemporary',
      description: 'If your post contains video, please use this format...',
      image: '/cuadro-horizontal-4.jpg',
    },
    {
      id: 4,
      title: 'The Abstract',
      description:
        'If your post contains audio, then you should use this post format...',
      image: '/cuadro-horizontal-3.jpg',
    },
    {
      id: 5,
      title: 'The Abstract',
      description:
        'This product will spark your imagination. Even more, it will turn your life into adventure...',
      image: '/cuadro-horizontal-4.jpg',
    },
    {
      id: 6,
      title: 'The Design',
      description:
        'Consider this product. Is there anything really exciting to say about it...',
      image: '/cuadro-horizontal-5.jpg',
    },
  ],
  Abstract: [
    {
      id: 1,
      title: 'The Design',
      description:
        'This format perfectly fits in case you need only a single image for your post display...',
      image: '/cuadro-horizontal-6.jpg',
    },
    {
      id: 2,
      title: 'The Design',
      description: 'This format can be used to display images as a gallery...',
      image: '/cuadro-vertical-1.jpg',
    },
  ],
  Contemporary: [
    {
      id: 3,
      title: 'The Design',
      description: 'If your post contains video, please use this format...',
      image: '/cuadro-vertical-2.jpg',
    },
    {
      id: 4,
      title: 'The Contemporary',
      description:
        'If your post contains audio, then you should use this post format...',
      image: '/cuadro-vertical-3.jpg',
    },
  ],
  Design: [
    {
      id: 5,
      title: 'The Design',
      description:
        'This product will spark your imagination. Even more, it will turn your life into adventure...',
      image: '/cuadro-vertical-4.jpg',
    },
    {
      id: 6,
      title: 'The Design',
      description:
        'Consider this product. Is there anything really exciting to say about it...',
      image: '/cuadro-vertical-1.jpg',
    },
  ],
};

type CategoryKey = keyof typeof categories;

export default function NewGallery() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-center space-x-6 mb-10">
        {(Object.keys(categories) as CategoryKey[]).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`uppercase text-lg font-semibold ${
              selectedCategory === category
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {category.replace(/^\w/, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-10">
        {categories[selectedCategory].map((item) => (
          <div key={item.id} className="relative group text-center">
            <div className="relative overflow-hidden shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105 h-40">
              <div className="border-8 border-zinc-400 absolute inset-0 pointer-events-none z-10"></div>
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover border-pink-400"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out flex items-center justify-center z-20">
                <div className="text-white text-center">
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm">{selectedCategory}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
