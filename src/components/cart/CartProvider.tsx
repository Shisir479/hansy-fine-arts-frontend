'use client';

import { useCartSidebar } from '@/hooks/use-cart-sidebar';
import { useCheckoutSidebar } from '@/hooks/use-checkout-sidebar';
import CartSidebar from './CartSidebar';
import CheckoutSidebar from '../checkout/CheckoutSidebar';

interface CartProviderProps {
  children: React.ReactNode;
}

export default function CartProvider({ children }: CartProviderProps) {
  const { isOpen, closeSidebar } = useCartSidebar();
  const { isOpen: isCheckoutOpen, closeCheckout } = useCheckoutSidebar();

  return (
    <>
      {children}
      <CartSidebar isOpen={isOpen} onClose={closeSidebar} />
      <CheckoutSidebar isOpen={isCheckoutOpen} onClose={closeCheckout} />
    </>
  );
}