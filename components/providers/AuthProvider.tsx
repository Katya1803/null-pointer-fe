"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { api } from "@/lib/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAccessToken, setUser, logout } = useAuthStore();

  useEffect(() => {
    // Try to refresh token on mount
    const refreshAuth = async () => {
      try {
        const { data } = await api.post("/auth/refresh", {}, { withCredentials: true });
        setAccessToken(data.data.accessToken);
        setUser(data.data.user);
      } catch (error) {
        logout();
      }
    };

    refreshAuth();
  }, [setAccessToken, setUser, logout]);

  return <>{children}</>;
}