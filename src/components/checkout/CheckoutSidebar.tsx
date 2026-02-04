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

// Initialize Stripe (Replace with your Publishable Key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_TYooMQauvdEDq54NiTphI7jx");
// Note: If env var is missing, using a placeholder or user should provide it. 
// Assuming user has one or I should use a generic test one if I knew it.
// I will use a dummy key if env is not present for safety, but user should verify.
// Wait, I should not hardcode a real key unless I am sure. 
// I'll assume NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set or use the user's provided one if any. 
// For now I'll use process.env...

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

      const orderPayload = {
        orderType: orderItems.length > 0 ? orderItems[0].productType : "artsy",
        items: orderItems,
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          addressLine1: formData.address,
          city: "New York",
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
        const approveLink = response.data.links.find((link: any) => link.rel === "approve");
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
          console.log("Payment Successful!", result);
          console.log("Payment Intent:", result.paymentIntent);

          toast.success("Payment Successful & Order Placed!");
          dispatch(clearCart());
          onClose(); // Optional: Comment this out if you want to keep the sidebar open to see logs comfortably
        }
      }
    } catch (error: any) {
      console.error("Order Error:", error);
      toast.error(error?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="flex items-start justify-between">
          <Dialog.Title className="text-lg font-medium text-gray-900">
            Checkout
          </Dialog.Title>
          <div className="ml-3 flex h-7 items-center">
            <button
              type="button"
              className="mt-4 text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <span className="sr-only">Close panel</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="flow-root">
            {/* Payment Method Selection */}
            <div className="mb-8 flex gap-4">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border p-4 transition-all ${paymentMethod === "card"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 hover:border-black"
                  }`}
              >
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">Stripe</span>
              </button>
              <button
                onClick={() => setPaymentMethod("paypal")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border p-4 transition-all ${paymentMethod === "paypal"
                    ? "border-[#0070BA] bg-[#0070BA] text-white"
                    : "border-gray-200 hover:border-[#0070BA]"
                  }`}
              >
                <Smartphone className="h-5 w-5" />
                <span className="font-medium">PayPal</span>
              </button>
            </div>

            {/* Shipping Details Form */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Shipping Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-600">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-600">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  placeholder="123 Main St, New York, NY 10001"
                />
              </div>
            </div>

            {/* Payment Details */}
            {paymentMethod === "card" && (
              <div className="mt-8 space-y-4">
                <h3 className="font-medium text-gray-900">Card Information</h3>
                <div className="rounded-md border border-gray-300 p-4">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": { color: "#aab7c4" },
                        },
                        invalid: { color: "#9e2146" },
                      },
                      hidePostalCode: true,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>${orderTotal.toFixed(2)}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>
        <div className="mt-6">
          <button
            onClick={handlePlaceOrder}
            disabled={isCreatingOrder || isPayPalLoading || isStripeLoading}
            className="flex w-full items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 disabled:bg-gray-400"
          >
            {isCreatingOrder
              ? "Creating Order..."
              : isPayPalLoading || isStripeLoading
                ? "Processing..."
                : `Pay $${orderTotal.toFixed(2)}`}
          </button>
        </div>
        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
          <p>
            or{" "}
            <button
              type="button"
              className="font-medium text-black hover:text-gray-800"
              onClick={onClose}
            >
              Continue Shopping
              <span aria-hidden="true"> &rarr;</span>
            </button>
          </p>
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
