"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { api, setupInterceptors } from "@/lib/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setAuth, logout, isInitialized, setInitialized } = useAuthStore();
  const hasSetupInterceptors = useRef(false);

  useEffect(() => {
    // Setup axios interceptors once
    if (!hasSetupInterceptors.current) {
      setupInterceptors(
        () => useAuthStore.getState().accessToken,
        (token) => useAuthStore.getState().setAccessToken(token),
        () => useAuthStore.getState().logout()
      );
      hasSetupInterceptors.current = true;
    }

    // Try to restore session on initial load
    const restoreSession = async () => {
      try {
        const { data } = await api.post('/auth/refresh');
        setAuth(data.data.accessToken, data.data.user);
      } catch (error) {
        // No active session - that's okay
        console.log('No active session');
      } finally {
        setInitialized();
      }
    };

    if (!isInitialized) {
      restoreSession();
    }
  }, [isInitialized, setAuth, setInitialized]);

  // Show loading on initial auth check
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}