"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { api, setupInterceptors } from "@/lib/api";

/**
 * AuthProvider Component
 * 
 * Responsibilities:
 * 1. Setup axios interceptors once
 * 2. Attempt to refresh token on app load
 * 3. Handle refresh success/failure gracefully
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isInitialized, markInitialized } = useAuthStore();

  // Setup interceptors ONCE on mount
  useEffect(() => {
    setupInterceptors();
  }, []);

  // Attempt refresh on mount
  useEffect(() => {
    if (isInitialized) return;

    const tryRefresh = async () => {
      try {
        // Try to get new tokens using httpOnly cookie
        const response = await api.post("/auth/refresh", {}, {
          withCredentials: true,
        });

        const { access_token, user } = response.data.data;

        // Success → update store
        useAuthStore.setState({
          access_token,
          user,
          isInitialized: true,
        });

        console.log("🔄 Session restored from cookie");
      } catch (error) {
        // No valid cookie or refresh failed → stay logged out
        console.log("ℹ️ No active session");
        markInitialized();
      }
    };

    tryRefresh();
  }, [isInitialized, markInitialized]);

  // Don't render children until initialization check is complete
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent mx-auto mb-4" />
          <p className="text-dark-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}