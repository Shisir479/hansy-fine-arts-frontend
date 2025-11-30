"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthHandlers } from "@/lib/authActions";
import toast from "react-hot-toast";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authHandlers = useAuthHandlers();

  useEffect(() => {
    const handleCallback = async () => {
      const name = searchParams.get("name");
      const email = searchParams.get("email");
      const error = searchParams.get("error");

      if (error) {
        toast.error("Google login failed");
        router.push("/auth/login");
        return;
      }

      if (name && email) {
        await authHandlers.handleGoogleLogin({
          name,
          email,
          provider: "google",
        });
      } else {
        toast.error("Missing user information");
        router.push("/auth/login");
      }
    };

    handleCallback();
  }, [searchParams, authHandlers, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing Google login...</p>
      </div>
    </div>
  );
}
