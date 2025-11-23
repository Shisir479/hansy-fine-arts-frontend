'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutSidebar } from '@/hooks/use-checkout-sidebar';

export default function CheckoutPage() {
  const router = useRouter();
  const { openCheckout } = useCheckoutSidebar();

  useEffect(() => {
    openCheckout();
    router.push('/');
  }, [openCheckout, router]);

  return null;
}