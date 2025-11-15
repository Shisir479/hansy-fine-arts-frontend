'use client';

import Link from 'next/link';
import Image from 'next/image';

interface SwiperCardProps {
  _id: string;
  image: string;
  productTitle?: string;
  className?: string;
}

const SwiperCard: React.FC<SwiperCardProps> = ({ _id, image, productTitle, className }) => {
  return (
    <Link href={`/product/${_id}`}>
      <div className={`transition hover:scale-105 shadow-xl rounded-xl overflow-hidden ${className || ''}`}>
        <figure className="w-[282px] h-[300px] overflow-hidden relative">
          <Image 
            src={image} 
            alt={productTitle || 'Product'} 
            fill
            className="object-cover"
          />
        </figure>
        {productTitle && (
          <div className="p-4">
            <h1 className="text-2xl font-bold">{productTitle}</h1>
          </div>
        )}
      </div>
    </Link>
  );
};

export default SwiperCard;
