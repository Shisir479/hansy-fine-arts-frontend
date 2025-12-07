"use client";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "./redux/api/authApi";
import { setUser } from "./redux/slices/authSlice";
import { useAppDispatch } from "./redux/hooks";

export function useAuthHandlers() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [registerUser] = useRegisterUserMutation();

  const handleRegister = async (data: {
    name?: string;
    email: string;
    password: string;
    role: string;
    status: string;
  }) => {
    try {
      const res = await registerUser(data).unwrap();
      console.log("Registration successful, redirecting to verify-email...");
      toast.success("Registration successful! Please verify your email.");

      // Auto-redirect to verify-email page with email parameter
      router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      throw new Error(err?.data?.message || "Registration failed");
    }
  };

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const res = await loginUser(data).unwrap();

      if (res?.success) {
        dispatch(setUser(res.data));
        toast.success("Login successful");
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (error: any) {
      toast.error("Invalid credentials");
    }
  };

  const handleGoogleLogin = async (data: {
    name: string;
    email: string;
    provider: string;
  }) => {
    try {
      console.log(" handle Google Login (lib/authActions.ts)", data);
      const res = await loginUser({ email: data.email, password: "" }).unwrap();

      if (res?.success) {
        dispatch(setUser(res.data));
        toast.success("Google login successful");
        router.push("/dashboard");
      } else {
        toast.error("Google login failed");
        router.push("/auth/login");
      }
    } catch (error: any) {
      toast.error("Google login failed");
      router.push("/auth/login");
    }
  };

  return { handleRegister, handleLogin, handleGoogleLogin };
}
