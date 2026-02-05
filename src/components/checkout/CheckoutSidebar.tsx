"use client";

import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, CreditCard, Smartphone } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { clearCart } from "@/lib/redux/slices/cartSlice";
import { useCreateOrderMutation, useCreatePayPalOrderMutation, useCreateStripePaymentMutation } from "@/lib/redux/api/paymentApi";
import { toast } from "react-hot-toast";

// Stripe Imports
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

// Initialize Stripe (Replace with your Publishable Key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_TYooMQauvdEDq54NiTphI7jx");

interface CheckoutSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ---------------------------------------------------------
// INNER FORM COMPONENT (Has access to useStripe)
// ---------------------------------------------------------
function CheckoutForm({ onClose }: { onClose: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const cart = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const orderTotal = cart.reduce((t, i) => t + i.quantity * i.price, 0);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
  });

  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [createPayPalOrder, { isLoading: isPayPalLoading }] = useCreatePayPalOrderMutation();
  const [createStripePayment, { isLoading: isStripeLoading }] = useCreateStripePaymentMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // 1. Create Order
      const orderItems = cart.map((item: any) => ({
        productId: item._id,
        productType: item.productType || "artsy",
        name: item.productTitle || item.name || "Product",
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        specifications: item.selectedOptions || {},
      }));

      // Determine Order Type (Mixed Logic)
      const uniqueTypes = new Set(orderItems.map((item: any) => item.productType || "artsy"));
      const orderType = uniqueTypes.size > 1 ? "mixed" : (orderItems.length > 0 ? (orderItems[0].productType || "artsy") : "artsy");

      const orderPayload = {
        orderType,
        items: orderItems,
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          addressLine1: formData.address,
          city: "New York", // Hardcoded for simplified checkouts, ideally from form
          state: "NY",
          postalCode: "10001",
          country: "USA",
          phone: "+1234567890",
        },
      };

      const orderResponse = await createOrder(orderPayload).unwrap();
      const { orderId } = orderResponse.data;

      // 2. Process Payment
      if (paymentMethod === "paypal") {
        const response = await createPayPalOrder({ orderId }).unwrap();
        const approveLink = response.data.links.find((link: any) => link.rel === "approve" || link.rel === "payer-action");
        if (approveLink) window.location.href = approveLink.href;
      } else {
        // Stripe Logic
        if (!stripe || !elements) return;

        // Get Client Secret
        const paymentResponse = await createStripePayment({ orderId }).unwrap();
        const { clientSecret } = paymentResponse.data;

        // Confirm Card Payment
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              address: { line1: formData.address },
            },
          },
        });

        if (result.error) {
          toast.error(result.error.message || "Payment Failed");
          console.error("Payment Error:", result.error);
        } else if (result.paymentIntent.status === "succeeded") {
          toast.success("Payment Successful & Order Placed!");
          // dispatch(clearCart());
          onClose();
          router.push(`/checkout/success?token=${result.paymentIntent.id}`);
        }
      }
    } catch (error: any) {
      console.error("Order Error:", error);
      toast.error(error?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="flex h-full flex-col bg-white shadow-2xl">
      <div className="flex-1 overflow-y-auto px-6 py-8 min-h-[400px]">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-6 mb-8">
          <Dialog.Title className="text-xl font-serif text-zinc-900 tracking-wide">
            Checkout
          </Dialog.Title>
          <button
            type="button"
            className="text-zinc-400 hover:text-zinc-900 transition-colors"
            onClick={onClose}
          >
            <span className="sr-only">Close panel</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-10">

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Payment Method</h3>
            <div className="grid grid-cols-2 gap-px bg-zinc-200 border border-zinc-200">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex items-center justify-center gap-3 py-4 transition-colors ${paymentMethod === "card"
                  ? "bg-white text-zinc-900"
                  : "bg-zinc-50 text-zinc-500 hover:bg-white hover:text-zinc-900"
                  }`}
              >
                <CreditCard className="h-4 w-4" />
                <span className="text-sm font-bold tracking-wider uppercase">Card</span>
              </button>
              <button
                onClick={() => setPaymentMethod("paypal")}
                className={`flex items-center justify-center gap-3 py-4 transition-colors ${paymentMethod === "paypal"
                  ? "bg-[#0070BA] text-white"
                  : "bg-zinc-50 text-zinc-500 hover:bg-white hover:text-[#0070BA]"
                  }`}
              >
                <Smartphone className="h-4 w-4" />
                <span className="text-sm font-bold tracking-wider uppercase">PayPal</span>
              </button>
            </div>
          </div>

          {/* Shipping Details Form */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Shipping Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="group">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border-b border-zinc-200 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none transition-colors bg-transparent rounded-none"
                  placeholder="First Name"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border-b border-zinc-200 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none transition-colors bg-transparent rounded-none"
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border-b border-zinc-200 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none transition-colors bg-transparent rounded-none"
                placeholder="Email Address"
              />
            </div>
            <div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border-b border-zinc-200 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none transition-colors bg-transparent rounded-none"
                placeholder="Shipping Address"
              />
            </div>
          </div>

          {/* Payment Details */}
          {paymentMethod === "card" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Card Details</h3>
              <div className="border-b border-zinc-200 pb-2">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "14px",
                        color: "#18181b",
                        fontFamily: "ui-sans-serif, system-ui, sans-serif",
                        "::placeholder": { color: "#a1a1aa" },
                        iconColor: "#18181b",
                      },
                      invalid: { color: "#ef4444" },
                    },
                    hidePostalCode: true,
                  }}
                />
              </div>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">PayPal Info</h3>
              <div className="p-4 bg-zinc-50 text-zinc-600 text-sm border-l-2 border-[#0070BA]">
                You will be redirected to PayPal to securely complete your payment.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Total */}
      <div className="border-t border-zinc-100 px-6 py-8 bg-zinc-50/50">
        <div className="flex justify-between items-end mb-2">
          <p className="text-sm font-medium text-zinc-500">Total</p>
          <p className="text-2xl font-serif text-zinc-900">${orderTotal.toFixed(2)}</p>
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          Shipping and taxes calculated at checkout.
        </p>

        <button
          onClick={handlePlaceOrder}
          disabled={isCreatingOrder || isPayPalLoading || isStripeLoading}
          className="w-full bg-zinc-900 text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-black disabled:bg-zinc-400 transition-colors rounded-none"
        >
          {isCreatingOrder
            ? "Creating Order..."
            : isPayPalLoading || isStripeLoading
              ? "Processing..."
              : "Complete Purchase"}
        </button>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
            onClick={onClose}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// MAIN EXPORT (Wrapper)
// ---------------------------------------------------------
export default function CheckoutSidebar({ isOpen, onClose }: CheckoutSidebarProps) {
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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 md:pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="pointer-events-auto w-screen max-w-md">
                  {/* Stripe Elements Provider Wrapper */}
                  <Elements stripe={stripePromise}>
                    <CheckoutForm onClose={onClose} />
                  </Elements>
                </div>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
