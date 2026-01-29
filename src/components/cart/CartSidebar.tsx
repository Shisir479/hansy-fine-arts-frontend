"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, ShoppingBag, Trash2, Minus, Plus } from "lucide-react";
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-sm">
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

                    <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-hide">
                      {cart.length === 0 ? (
                        <div className="text-center py-32">
                          <ShoppingBag
                            className="mx-auto h-14 w-14 text-black/30 dark:text-white/30 mb-8"
                            strokeWidth={1}
                          />
                          <p className="text-2xl tracking-wider mb-3">Your cart is empty</p>
                          <p className="text-sm text-black/50 dark:text-white/50 tracking-wide">
                            Start collecting artworks
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {cart.map((item) => (
                            <div
                              key={item._id}
                              className="flex gap-6 py-3 border-b border-neutral-200 dark:border-neutral-800 last:border-0"
                            >
                              {/* 1. IMAGE: Rounded, clean, object-cover */}
                              <div className="relative h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 overflow-hidden bg-neutral-100 border border-neutral-100 dark:border-neutral-800">
                                <Image
                                  src={item.image || "/placeholder.jpg"}
                                  alt={item.productTitle || item.name || "Artwork"}
                                  fill
                                  className="object-cover"
                                />
                              </div>

                              {/* 2. CONTENT CONTAINER */}
                              <div className="flex flex-1 justify-between">
                                {/* Left Side: Title & Remove Button */}
                                <div className="flex flex-col justify-between">
                                  <div>
                                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white leading-tight mb-2">
                                      {item.productTitle || item.name}
                                    </h3>
                                    {item.variantDetails ? (
                                      <ul className="text-[11px] text-neutral-500 dark:text-neutral-400 space-y-0.5 leading-relaxed">
                                        {item.variantDetails.map((detail, idx) => (
                                          <li key={idx}>
                                            <span className="font-bold text-neutral-800 dark:text-neutral-200">{detail.label}:</span> {detail.value}
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-xs font-medium tracking-widest text-neutral-500 uppercase">
                                        {item.variant || "Original Piece"}
                                      </p>
                                    )}
                                  </div>

                                  {/* Trash Icon (Aligned bottom-left) */}
                                  <button
                                    onClick={() => handleRemove(item._id)}
                                    className="text-neutral-400 hover:text-red-600 transition-colors p-1 -ml-1 w-fit"
                                    aria-label="Remove item"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </div>

                                {/* Right Side: Price & Quantity Controls */}
                                <div className="flex flex-col justify-between items-end">
                                  <p className="font-bold text-lg text-neutral-900 dark:text-white">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </p>

                                  {/* Circular Quantity Buttons */}
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() => handleQuantityChange(item._id, -1)}
                                      disabled={item.quantity <= 1}
                                      className="flex items-center justify-center w-6 h-6 border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white disabled:opacity-30 transition-all"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>

                                    <span className="w-4 text-center font-medium text-neutral-900 dark:text-white">
                                      {item.quantity}
                                    </span>

                                    <button
                                      onClick={() => handleQuantityChange(item._id, +1)}
                                      className="flex items-center justify-center w-6 h-6  border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white transition-all"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                      <div className="border-t border-black dark:border-white px-8 py-5">
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
