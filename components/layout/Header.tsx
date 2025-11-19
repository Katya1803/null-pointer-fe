"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { authService } from "@/lib/services/auth.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import { Avatar } from "@/components/ui/Avatar";

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await authService.logout();
    } catch (error) {
      console.warn("Backend logout failed:", getErrorMessage(error));
    } finally {
      logout();
      setIsLoggingOut(false);
      setShowDropdown(false);
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-card/95 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-500">NullPointer</span>
          </Link>

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

          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Avatar avatarUrl={null} username={user.username} size="md" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-lg">
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
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-dark-text hover:text-primary-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}