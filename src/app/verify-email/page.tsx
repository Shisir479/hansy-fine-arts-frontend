"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyEmailMutation, useResendOtpMutation } from "@/lib/redux/api/authApi";
import { toast } from "react-hot-toast";
import { Loader2, Mail } from "lucide-react";

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const [otp, setOtp] = useState("");
    const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
    const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Email is missing. Please register again.");
            return;
        }
        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            const response = await verifyEmail({ email, otp }).unwrap();
            if (response.success) {
                toast.success("Email verified successfully! Please login.");
                router.push("/login");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Verification failed. Invalid OTP.");
        }
    };

    const handleResendOtp = async () => {
        if (!email) return;
        try {
            await resendOtp({ email }).unwrap();
            toast.success("OTP sent again!");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to resend OTP.");
        }
    };

    if (!email) {
        return (
            <div className="text-center p-10">
                <p>Invalid Request. Missing email.</p>
            </div>
        );
    }

    return (
        <div className="max-w-md w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-8 shadow-xl">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-zinc-600 dark:text-zinc-400" />
                </div>
                <h1 className="text-2xl font-serif mb-2">Verify your Email</h1>
                <p className="text-sm text-zinc-500">
                    We&apos;ve sent a 6-digit code to <span className="font-bold text-black dark:text-white">{email}</span>.
                    Please enter it below to verify your account.
                </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-zinc-500 text-center">Enter OTP Code</label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 py-3 text-center text-3xl tracking-[0.5em] font-mono focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-zinc-200 dark:placeholder:text-zinc-800"
                        placeholder="000000"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isVerifying || otp.length !== 6}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Account"}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="text-xs text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                >
                    {isResending ? "Sending..." : "Didn't receive the code? Resend OTP"}
                </button>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-24">
            <Suspense fallback={<div>Loading...</div>}>
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
