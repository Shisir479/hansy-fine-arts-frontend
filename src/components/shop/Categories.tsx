'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface CategoriesProps {
  categories: string[];
}

const Categories = ({ categories }: CategoriesProps) => {
  const pathname = usePathname();

  return (
    <div className="grid lg:grid-cols-1 grid-flow-row gap-5 lg:p-10 p-5">
      {/* "All Products" Button */}
      <Link
        href="/shop"
        className={`font-bold btn rounded-full ${
          pathname === '/shop'
            ? 'text-black bg-[#d8dfd8]'
            : 'hover:text-black'
        }`}
      >
        All Products
      </Link>

      {/* Category Buttons */}
      {categories.map((category) => (
        <Link
          key={category}
          href={`/shop/${category.toLowerCase()}`}
          className={`font-bold btn rounded-full ${
            pathname === `/shop/${category.toLowerCase()}`
              ? 'text-black bg-[#d8dfd8]'
              : 'hover:text-zinc-500'
          }`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
};

export default Categories;
