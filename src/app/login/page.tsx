"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginUserMutation } from "@/lib/redux/api/authApi";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUser } from "@/lib/redux/slices/authSlice";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [loginUser, { isLoading }] = useLoginUserMutation();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const response = await loginUser(formData).unwrap();

            // The backend sets the cookie 'accessToken'
            // We force read it from cookies to store in Redux for the session
            const token = Cookies.get("accessToken");

            if (token) {
                dispatch(setUser({ user: response.data, token: token }));
                toast.success("Welcome back!");
                router.push("/");
            } else {
                // Even if token isn't readable (httpOnly), we set user state
                dispatch(setUser({ user: response.data, token: null }));
                toast.success("Welcome back!");
                router.push("/");
            }
        } catch (error: any) {
            console.error("Login Check", error);
            const message = error?.data?.message || error?.message || "Login failed. Please check your credentials.";
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-24">
            <div className="max-w-md w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-8 shadow-xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-serif mb-2">Welcome Back</h1>
                    <p className="text-sm text-zinc-500">Sign in to access your account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
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
                        <div className="flex justify-between mb-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Password</label>
                            <Link href="/forgot-password" className="text-xs text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                                Forgot?
                            </Link>
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-2 focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-zinc-300"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black dark:bg-white text-white dark:text-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-zinc-100 dark:border-zinc-900 pt-8">
                    <p className="text-sm text-zinc-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-black dark:text-white font-medium hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
