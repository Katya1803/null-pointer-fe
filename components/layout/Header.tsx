"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { authService } from "@/lib/services/auth.service";

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authService.logout();
      logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Logout locally anyway
      logout();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
      setShowDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-card/95 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-8">
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
          </div>

          {/* Center: Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          {/* Right: Auth */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold hover:bg-primary-600 transition-colors"
                >
                  {user.username.charAt(0).toUpperCase()}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-lg">
                    <div className="p-3 border-b border-dark-border">
                      <p className="font-medium text-dark-text truncate">{user.username}</p>
                      <p className="text-sm text-dark-muted truncate">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-dark-text hover:bg-dark-bg transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/my-learning"
                        className="block px-4 py-2 text-dark-text hover:bg-dark-bg transition-colors"
                      >
                        My Learning
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-dark-bg transition-colors disabled:opacity-50"
                      >
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-dark-text hover:text-primary-500 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}