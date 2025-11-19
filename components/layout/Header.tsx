"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { api } from "@/lib/api";

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Try to logout on backend
      const token = useAuthStore.getState().access_token;
      console.log("TOKEN BEFORE LOGOUT:", token);

      console.log("IS INTERCEPTOR ABOUT TO ADD THIS TOKEN?");

      await api.post("/auth/logout");
      console.log("✅ Backend logout successful");
    } catch (error: any) {
      // Backend logout failed (token expired, network error, etc.)
      // Continue with local logout anyway
      console.warn("⚠️ Backend logout failed:", error?.response?.data?.message || error.message);
    } finally {
      // ALWAYS clear local session
      logout();
      setIsLoggingOut(false);
      setShowDropdown(false);
      
      // Redirect to login
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-card/95 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-500">NullPointer</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/blogs"
              className="text-dark-text hover:text-primary-500 transition-colors"
            >
              Blogs
            </Link>
            <Link
              href="/my-learning"
              className="text-dark-text hover:text-primary-500 transition-colors"
            >
              My Learning
            </Link>
          </nav>

          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Auth */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-dark-bg transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-dark-text">{user.username}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-lg py-2">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-dark-text hover:bg-dark-bg transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-dark-bg transition-colors disabled:opacity-50"
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-dark-text hover:text-primary-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}