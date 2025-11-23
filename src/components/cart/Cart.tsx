'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartSidebar } from '@/hooks/use-cart-sidebar';

export default function Cart() {
  const router = useRouter();
  const { openSidebar } = useCartSidebar();

  useEffect(() => {
    // Open sidebar and redirect to home
    openSidebar();
    router.replace('/');
  }, [openSidebar, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">Opening cart...</p>
      </div>
    </div>
  );
}