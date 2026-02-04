"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterUserMutation } from "@/lib/redux/api/authApi";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUser } from "@/lib/redux/slices/authSlice";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [registerUser, { isLoading }] = useRegisterUserMutation();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const response = await registerUser(formData).unwrap();

            // Note: Backend might return user/token immediately or require email verification.
            // Based on typical flows, if success, we log them in or ask to verify.
            // Assuming backend logs in or returns success message.

            if (response.success) {
                toast.success(response.message || "Registration successful! Please verify your email.");
                router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
            }

        } catch (error: any) {
            console.error("Register Error", error);
            const message = error?.data?.message || "Registration failed";
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-24">
            <div className="max-w-md w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-8 shadow-xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-serif mb-2">Create Account</h1>
                    <p className="text-sm text-zinc-500">Join our community of art lovers</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-zinc-500">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-2 focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-zinc-300"
                                placeholder="John"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-zinc-500">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-2 focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-zinc-300"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-zinc-500">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-2 focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-zinc-300"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-zinc-500">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-2 focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-zinc-300"
                            placeholder="••••••••"
                        />
                        <p className="text-[10px] text-zinc-400 mt-2">Must be at least 6 characters.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black dark:bg-white text-white dark:text-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Register"}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-zinc-100 dark:border-zinc-900 pt-8">
                    <p className="text-sm text-zinc-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-black dark:text-white font-medium hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
