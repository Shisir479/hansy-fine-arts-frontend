"use client";

import { useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { clearCart } from "@/lib/redux/slices/cartSlice";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const token = searchParams.get("token");

    // We only clear cart once
    const hasCleared = useRef(false);

    useEffect(() => {
        if (!hasCleared.current) {
            hasCleared.current = true;
            dispatch(clearCart());
        }
    }, [dispatch]);

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <p>Order ID Missing (but payment might be successful)</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="max-w-md w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-8 text-center shadow-2xl">
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
                        <Link href="/gallery" className="block w-full bg-black dark:bg-white text-white dark:text-black py-3 text-sm font-medium tracking-wide hover:opacity-90 transition-opacity">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
