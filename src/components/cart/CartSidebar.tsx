"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { removeFromCart, updateQuantity } from "@/lib/redux/slices/cartSlice";
import { useCheckoutSidebar } from "@/hooks/use-checkout-sidebar";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const cart = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const { openCheckout } = useCheckoutSidebar();

  const totalItems = cart.reduce((t, i) => t + i.quantity, 0);
  const totalPrice = cart
    .reduce((t, i) => t + i.quantity * i.price, 0)
    .toFixed(2);

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
    toast.success("Removed");
  };

  const handleQuantityChange = (id: string, delta: number) => {
    const item = cart.find((i) => i._id === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    dispatch(updateQuantity({ id, quantity: newQty }));
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white dark:bg-black text-black dark:text-white border-l border-black dark:border-white font-light">
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-7 border-b border-black dark:border-white">
                      <div className="flex items-center gap-5 tracking-widest">
                        <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
                        <h2 className="text-lg uppercase">
                          Cart{" "}
                          <span className="opacity-60">({totalItems})</span>
                        </h2>
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                      >
                        <X className="h-5 w-5" strokeWidth={1.5} />
                      </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-8 py-10">
                      {cart.length === 0 ? (
                        <div className="text-center py-32">
                          <ShoppingBag
                            className="mx-auto h-14 w-14 text-black/30 dark:text-white/30 mb-8"
                            strokeWidth={1}
                          />
                          <p className="text-2xl tracking-wider mb-3">
                            Your cart is empty
                          </p>
                          <p className="text-sm text-black/50 dark:text-white/50 tracking-wide">
                            Start collecting artworks
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {cart.map((item) => (
                            <div
                              key={item._id}
                              className="flex gap-4 pb-6 border-b border-black/20 dark:border-white/20 last:border-0 last:pb-0"
                            >
                              {/* ইমেজ এখন পুরোপুরি কালারে থাকবে */}
                              <div className="w-24 h-24 border   overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.jpg"}
                                  alt={
                                    item.productTitle || item.name || "Artwork"
                                  }
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="flex-1">
                                <h3 className="text-sm font-medium tracking-wide leading-relaxed">
                                  {item.productTitle || item.name}
                                </h3>
                                <p className="text-xs text-black/50 dark:text-white/50 mt-1">
                                  ${item.price}
                                </p>

                                <div className="flex items-center gap-3 mt-4">
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(item._id, -1)
                                    }
                                    className="w-7 h-7 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black flex items-center justify-center text-sm transition-colors"
                                  >
                                    −
                                  </button>
                                  <span className="w-8 text-center tracking-wide text-sm font-medium">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(item._id, +1)
                                    }
                                    className="w-7 h-7 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black flex items-center justify-center text-sm transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="text-right mt-1">
                                <button
                                  onClick={() => handleRemove(item._id)}
                                  className="block mb-4 opacity-40 hover:opacity-100 transition-opacity"
                                >
                                  <Trash2
                                    className="h-5 w-5"
                                    strokeWidth={1.5}
                                  />
                                </button>
                                <div className="text-sm font-semibold">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                      <div className="border-t border-black dark:border-white px-8 py-10">
                        <div className="flex justify-between items-baseline mb-10 tracking-widest">
                          <span className="text-sm uppercase">Total</span>
                          <span className="text-2xl">${totalPrice}</span>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            openCheckout();
                          }}
                          className="relative w-full h-12 bg-black dark:bg-white text-white dark:text-black text-sm uppercase tracking-wide font-medium group transition-all duration-500 hover:bg-black/80 dark:hover:bg-white/80 before:absolute before:inset-0 before:bg-white/10 dark:before:bg-black/10 before:transform before:scale-x-0 before:origin-left hover:before:scale-x-100 before:transition-transform before:duration-300"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            <span className="group-hover:tracking-widest transition-all duration-300">
                              Checkout
                            </span>
                          </span>

                          {/* Pulse rings */}
                          <span className="absolute inset-0 border border-white/20 dark:border-black/20 group-hover:animate-ping"></span>
                          <span className="absolute inset-0 border border-white/10 dark:border-black/10 group-hover:animate-pulse"></span>
                        </button>

                        <button
                          onClick={onClose}
                          className="w-full block mt-4 text-center text-xs uppercase tracking-wide text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white py-2 transition-colors"
                        >
                          Continue shopping
                        </button>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
