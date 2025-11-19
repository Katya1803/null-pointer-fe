"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { api, setupInterceptors } from "@/lib/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { _hasHydrated, markInitialized } = useAuthStore();

  // Setup interceptors only once
  useEffect(() => {
    setupInterceptors();
  }, []);

  // Refresh only once after hydration
  useEffect(() => {
    if (!_hasHydrated) return;

    let executed = false;

    const refreshAuth = async () => {
      if (executed) return;
      executed = true;

      try {
        const res = await api.post("/auth/refresh", {}, { withCredentials: true });

        useAuthStore.setState({
          accessToken: res.data.data.accessToken,
          user: res.data.data.user,
        });
      } catch {
        // Nếu không có token cũ → logout
        const token = useAuthStore.getState().accessToken;
        if (!token) useAuthStore.getState().logout();
      } finally {
        markInitialized();
      }
    };

    refreshAuth();
  }, [_hasHydrated, markInitialized]);

  return <>{children}</>;
}
