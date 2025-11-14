'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

interface CategoryCardData {
  image: string;
  category: string;
  author: string;
  route: string;
}

const CategoryItem = ({ image, category, author, route }: CategoryCardData) => {
  return (
    <Link href={route}>
      <Card className="group overflow-hidden cursor-pointer hover:shadow-xl transition-shadow">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={category}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <CardContent className="p-6 text-white">
              <h2 className="text-2xl font-bold text-teal-400 mb-2">{category}</h2>
              <p className="text-sm">
                <span className="lowercase text-xl italic text-teal-300">by</span>{' '}
                {author}
              </p>
            </CardContent>
          </div>
        </div>
      </Card>
    </Link>
  );
};

const ShopArtCategory = () => {
  const cards: CategoryCardData[] = [
    {
      image: '/cuadro-horizontal-1.jpg',
      category: 'Contemporary',
      author: 'Hans Yaeggy',
      route: '/gallery/contemporary',
    },
    {
      image: '/cuadro-horizontal-2.jpg',
      category: 'Portrait',
      author: 'Hans Yaeggy',
      route: '/custom-portrait',
    },
    {
      image: '/cuadro-horizontal-3.jpg',
      category: 'Abstract & Design',
      author: 'Hans Yaeggy',
      route: '/gallery/abstract',
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="my-10 max-w-7xl mx-auto p-10">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {cards.map((card, index) => (
            <CategoryItem
              key={index}
              image={card.image}
              category={card.category}
              author={card.author}
              route={card.route}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopArtCategory;
