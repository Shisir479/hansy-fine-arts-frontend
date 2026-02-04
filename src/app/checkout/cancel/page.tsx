"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="max-w-md w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-8 text-center shadow-xl">
                <div className="space-y-6">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 rounded-full flex items-center justify-center mx-auto">
                        <XCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Payment Cancelled</h2>
                        <p className="text-zinc-500 text-sm">You cancelled the payment process. No charges were made.</p>
                    </div>
                    <Link href="/" className="block w-full bg-black dark:bg-white text-white dark:text-black py-3 text-sm font-medium tracking-wide hover:opacity-90 transition-opacity">
                        Return into Shop
                    </Link>
                </div>
            </div>
        </div>
    );
}
