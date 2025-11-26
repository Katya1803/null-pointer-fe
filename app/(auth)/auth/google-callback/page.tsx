"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { googleAuthService } from "@/lib/services/google-auth.service";
import { useAuthStore } from "@/lib/store/auth-store";
import { getErrorMessage } from "@/lib/utils/error.utils";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError("Google authentication was cancelled or failed");
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      if (!code) {
        setError("No authorization code received from Google");
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      try {
        const response = await googleAuthService.handleGoogleCallback(code);
        
        setAuth(response.data.access_token, response.data.user);
        
        router.push("/");
      } catch (err: any) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <div className="w-full max-w-md p-8">
        {error ? (
          <div className="text-center">
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
              {error}
            </div>
            <p className="text-dark-muted text-sm">
              Redirecting to login page...
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-dark-text mb-2">
              Signing you in...
            </h2>
            <p className="text-dark-muted">
              Please wait while we complete your Google authentication
            </p>
          </div>
        )}
      </div>
    </div>
  );
}