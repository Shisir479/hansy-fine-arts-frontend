"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCapturePayPalOrderMutation } from "@/lib/redux/api/paymentApi";
import { useAppDispatch } from "@/lib/redux/hooks";
import { clearCart } from "@/lib/redux/slices/cartSlice";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const token = searchParams.get("token"); // PayPal passes order ID as 'token' usually
    const PayerID = searchParams.get("PayerID"); // Also passed, but token is main ID

    const [captureOrder, { isLoading, isSuccess, isError }] = useCapturePayPalOrderMutation();
    const hasCaptured = useRef(false);

    useEffect(() => {
        if (token && !hasCaptured.current) {
            hasCaptured.current = true;
            captureOrder(token)
                .unwrap()
                .then(() => {
                    dispatch(clearCart());
                })
                .catch((err) => {
                    console.error("Capture failed:", err);
                });
        }
    }, [token, captureOrder, dispatch]);

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <p>Invalid Order ID</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="max-w-md w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-8 text-center shadow-2xl">
                {isLoading && (
                    <div className="space-y-4">
                        <div className="animate-spin w-12 h-12 border-t-2 border-black dark:border-white rounded-full mx-auto"></div>
                        <h2 className="text-xl font-semibold">Processing Payment...</h2>
                        <p className="text-zinc-500">Please wait while we confirm your order.</p>
                    </div>
                )}

                {isSuccess && (
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif mb-2">Payment Successful!</h2>
                            <p className="text-zinc-500 text-sm">Thank you for your purchase. Your order has been confirmed.</p>
                        </div>
                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <p className="text-xs text-zinc-400 mb-6">Transaction ID: {token}</p>
                            <Link href="/" className="block w-full bg-black dark:bg-white text-white dark:text-black py-3 text-sm font-medium tracking-wide hover:opacity-90 transition-opacity">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}

                {isError && (
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto">
                            <XCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Payment Failed</h2>
                            <p className="text-zinc-500 text-sm">Something went wrong while capturing your payment. Please contact support.</p>
                        </div>
                        <Link href="/checkout" className="block w-full border border-black dark:border-white text-black dark:text-white py-3 text-sm font-medium tracking-wide hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                            Try Again
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
