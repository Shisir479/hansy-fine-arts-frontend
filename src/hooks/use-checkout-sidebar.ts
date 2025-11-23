import { create } from 'zustand';

interface CheckoutSidebarStore {
  isOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
}

export const useCheckoutSidebar = create<CheckoutSidebarStore>((set) => ({
  isOpen: false,
  openCheckout: () => set({ isOpen: true }),
  closeCheckout: () => set({ isOpen: false }),
}));