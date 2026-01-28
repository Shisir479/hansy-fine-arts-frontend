"use client";

import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, CreditCard, Smartphone } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { clearCart } from "@/lib/redux/slices/cartSlice";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

interface CheckoutSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutSidebar({
  isOpen,
  onClose,
}: CheckoutSidebarProps) {
  const cart = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const orderTotal = cart.reduce((t, i) => t + i.quantity * i.price, 0);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.address
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (
      paymentMethod === "card" &&
      (!formData.cardNumber ||
        !formData.cardHolder ||
        !formData.expiry ||
        !formData.cvv)
    ) {
      toast.error("Please fill in all payment details");
      return;
    }

    Swal.fire({
      title: "Order Placed!",
      text: `Your order has been successfully placed via ${paymentMethod === "paypal" ? "PayPal" : "Credit Card"}.`,
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      dispatch(clearCart());
      onClose();
    });
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-lg">
                  <div className="flex h-full flex-col bg-white dark:bg-black shadow-2xl">
                    {/* Header */}
                    <div className="bg-white dark:bg-black px-6 py-6 border-b border-black dark:border-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-black dark:text-white">
                            Checkout
                          </h2>
                          <p className="text-sm text-black/50 dark:text-white/50 mt-1">
                            Complete your purchase
                          </p>
                        </div>
                        <button
                          onClick={onClose}
                          className="p-2 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {/* Order Summary */}
                      <div className="bg-white dark:bg-black p-4 border border-black dark:border-white">
                        <h3 className="text-lg font-medium text-black dark:text-white mb-4">
                          Order Summary
                        </h3>

                        <div className="space-y-3 max-h-40 overflow-y-auto">
                          {cart.map((item) => (
                            <div
                              key={item._id}
                              className="flex justify-between items-start"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-black dark:text-white">
                                  {item.productTitle || item.name || "Product"}
                                </p>
                                <p className="text-xs text-black/50 dark:text-white/50">
                                  Qty: {item.quantity} × ${item.price}
                                </p>
                              </div>
                              <span className="text-sm font-medium text-black dark:text-white">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-black dark:border-white pt-3 mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-black/60 dark:text-white/60">
                              Subtotal
                            </span>
                            <span className="text-black dark:text-white">
                              ${(orderTotal - 15).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-black/60 dark:text-white/60">
                              Shipping
                            </span>
                            <span className="text-black dark:text-white">
                              $10.00
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-black/60 dark:text-white/60">
                              Tax
                            </span>
                            <span className="text-black dark:text-white">
                              $5.00
                            </span>
                          </div>
                          <div className="border-t border-black dark:border-white pt-2 flex justify-between">
                            <span className="text-lg font-semibold text-black dark:text-white">
                              Total
                            </span>
                            <span className="text-lg font-semibold text-black dark:text-white">
                              ${orderTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Information */}
                      <div>
                        <h3 className="text-lg font-medium text-black dark:text-white mb-4">
                          Shipping Information
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-black dark:text-white mb-2">
                              First Name *
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black dark:text-white mb-2">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-black dark:text-white mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black dark:text-white mb-2">
                            Address *
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors"
                          />
                        </div>
                      </div>

                      {/* Payment Method Selection */}
                      <div>
                        <h3 className="text-lg font-medium text-black dark:text-white mb-4">
                          Payment Method
                        </h3>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <button
                            onClick={() => setPaymentMethod("card")}
                            className={`p-4 border-2 transition-all duration-200 ${
                              paymentMethod === "card"
                                ? "border-black bg-black/10 dark:border-white dark:bg-white/10"
                                : "border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <CreditCard className="h-5 w-5" />
                              <span className="text-sm font-medium">
                                Credit Card
                              </span>
                            </div>
                          </button>

                          <button
                            onClick={() => setPaymentMethod("paypal")}
                            className={`p-4 border-2 transition-all duration-200 ${
                              paymentMethod === "paypal"
                                ? "border-black bg-black/10 dark:border-white dark:bg-white/10"
                                : "border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-5 h-5 bg-black text-white flex items-center justify-center text-xs font-bold">
                                P
                              </div>
                              <span className="text-sm font-medium">
                                PayPal
                              </span>
                            </div>
                          </button>
                        </div>

                        {/* Credit Card Form */}
                        {paymentMethod === "card" && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                Card Number *
                              </label>
                              <input
                                type="text"
                                name="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                Cardholder Name *
                              </label>
                              <input
                                type="text"
                                name="cardHolder"
                                value={formData.cardHolder}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                  Expiry Date *
                                </label>
                                <input
                                  type="text"
                                  name="expiry"
                                  placeholder="MM/YY"
                                  value={formData.expiry}
                                  onChange={handleInputChange}
                                  className="w-full px-3 py-2 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                  CVV *
                                </label>
                                <input
                                  type="text"
                                  name="cvv"
                                  placeholder="123"
                                  value={formData.cvv}
                                  onChange={handleInputChange}
                                  className="w-full px-3 py-2 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* PayPal Info */}
                        {paymentMethod === "paypal" && (
                          <div className="bg-black/5 dark:bg-white/5 p-4 border border-black dark:border-white">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold">
                                P
                              </div>
                              <div>
                                <p className="text-sm font-medium text-black dark:text-white">
                                  Pay with PayPal
                                </p>
                                <p className="text-xs text-black/70 dark:text-white/70">
                                  You&apos;ll be redirected to PayPal to
                                  complete your payment
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-black dark:border-white p-6">
                      <button
                        onClick={handlePlaceOrder}
                        className="w-full bg-black hover:bg-black/80 dark:bg-white dark:hover:bg-white/80 text-white dark:text-black py-3 px-4 font-medium transition-colors duration-200"
                      >
                        {paymentMethod === "paypal"
                          ? "Pay with PayPal"
                          : "Complete Order"}{" "}
                        - ${orderTotal.toFixed(2)}
                      </button>

                      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-black/50 dark:text-white/50">
                        <span>🔒 Secure</span>
                        <span>🛡️ Encrypted</span>
                        <span>✅ Protected</span>
                      </div>
                    </div>
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
