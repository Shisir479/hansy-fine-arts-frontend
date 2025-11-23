'use client';

import { ShoppingCart } from 'lucide-react';
import { useAppSelector } from '@/lib/redux/hooks';
import { useCartSidebar } from '@/hooks/use-cart-sidebar';

export default function CartButton() {
  const cart = useAppSelector((state) => state.cart.items);
  const totalItems = cart.reduce((t, i) => t + i.quantity, 0);
  const { openSidebar } = useCartSidebar();

  return (
    <button
      onClick={openSidebar}
      className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
          {totalItems}
        </span>
      )}
    </button>
  );
}