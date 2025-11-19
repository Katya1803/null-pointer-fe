"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { api, setupInterceptors } from "@/lib/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, user, setAuth, isInitialized, setInitialized } = useAuthStore();
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
        // If we have accessToken and user in localStorage (from persist), 
        // we can skip the refresh call and just mark as initialized
        if (accessToken && user) {
          console.log('Session restored from localStorage');
          setInitialized();
          return;
        }

        // No session in localStorage, try to refresh from cookie
        console.log('No localStorage session, trying refresh from cookie...');
        const { data } = await api.post('/auth/refresh');
        setAuth(data.data.accessToken, data.data.user);
        console.log('Session restored from refresh token');
      } catch (error) {
        // No active session - that's okay
        console.log('No active session to restore');
      } finally {
        setInitialized();
      }
    };

    if (!isInitialized) {
      restoreSession();
    }
  }, [isInitialized, accessToken, user, setAuth, setInitialized]);

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