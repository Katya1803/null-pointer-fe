"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { authService } from "@/lib/services/auth.service";
import { postService } from "@/lib/services/blog.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import { Avatar } from "@/components/ui/Avatar";
import type { PostListItem } from "@/lib/types/blog.types";

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PostListItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

    useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery.trim());
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    try {
      setIsSearching(true);
      const response = await postService.getPublishedPosts(0, 5, query);
      setSearchResults(response.data.data.content);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchResultClick = (slug: string) => {
    setSearchQuery("");
    setShowSearchResults(false);
    router.push(`/blogs/posts/${slug}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      router.push(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

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

  // Backend returns roles as string: "ROLE_USER,ROLE_ADMIN"
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  // Debug logging
  useEffect(() => {
    if (user) {
      console.log("=== HEADER DEBUG ===");
      console.log("User:", user);
      console.log("Roles value:", user.roles);
      console.log("Roles type:", typeof user.roles);
      console.log("isAdmin:", isAdmin);
      console.log("Check result:", user.roles?.includes("ROLE_ADMIN"));
      console.log("==================");
    }
  }, [user, isAdmin]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-card/95 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-nullpointer.svg" alt="NullPointer Logo" className="h-12 w-12" />
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

          <div className="hidden lg:flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                  placeholder="Search blog posts..."
                  className="w-full px-4 py-2 pl-10 bg-dark-bg border border-dark-border rounded-3xl text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-primary-500"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-dark-card border border-dark-border rounded-lg shadow-lg overflow-hidden z-50">
                {searchResults.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => handleSearchResultClick(post.slug)}
                    className="w-full px-4 py-3 text-left hover:bg-dark-bg transition-colors border-b border-dark-border last:border-b-0"
                  >
                    <h4 className="font-medium text-dark-text text-sm mb-1">{post.title}</h4>
                  </button>
                ))}
                <button
                  onClick={() => handleSearchSubmit(new Event('submit') as any)}
                  className="w-full px-4 py-2 text-center text-sm text-primary-500 hover:bg-dark-bg transition-colors"
                >
                  View all results →
                </button>
              </div>
            )}

            {showSearchResults && searchQuery.trim().length >= 2 && searchResults.length === 0 && !isSearching && (
              <div className="absolute top-full mt-2 w-full bg-dark-card border border-dark-border rounded-lg shadow-lg p-4 z-50">
                <p className="text-sm text-dark-muted text-center">No posts found for "{searchQuery}"</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:opacity-70 transition-opacity"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Notification */}
            {user && (
              <button
                className="p-2 hover:opacity-70 transition-opacity relative"
                aria-label="Notifications"
              >
                <svg className="w-6 h-6 text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full"></span>
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Avatar avatarUrl={null} username={user.username} size="md" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-lg z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-dark-text hover:bg-dark-bg transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    {/* Force show admin link for debugging */}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-dark-text hover:bg-dark-bg transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        Admin {/* Shows isAdmin: {String(isAdmin)} */}
                      </Link>
                    )}
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