'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface Product {
  _id: string;
  productTitle: string;
  image: string;
  category?: string;
  price?: number;
}

interface CardProps {
  product: Product;
  handleRemove?: (id: string) => void;
}

const Card: React.FC<CardProps> = ({ product, handleRemove }) => {
  const pathname = usePathname();
  const { _id, productTitle, image, price } = product || {};

  return (
    <div className="flex relative">
      <Link href={`/product/${_id}`}>
        <div className="transition hover:scale-105 shadow-xl rounded-xl overflow-hidden cursor-pointer">
          <figure className="w-[282px] h-[300px] overflow-hidden relative">
            <Image 
              src={image} 
              alt={productTitle} 
              fill
              className="object-cover"
            />
          </figure>
          <div className="p-4">
            <h1 className="text-2xl font-bold">{productTitle}</h1>
            {price && <p className="text-xl font-bold">Price: ${price}</p>}
          </div>
        </div>
      </Link>

      {pathname === '/cart' && handleRemove && (
        <div
          onClick={() => handleRemove(_id)}
          className="absolute p-3 rounded-full cursor-pointer bg-red-100 hover:bg-red-200 -top-5 -right-5"
        >
          <i className="fa-solid fa-trash text-red-600"></i>
        </div>
      )}
    </div>
  );
};

export default Card;
