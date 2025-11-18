'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Button } from '@/components/ui/Button';
import { APP_ROUTES } from '@/lib/constants';

export function Header() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-bg/95 backdrop-blur supports-[backdrop-filter]:bg-dark-bg/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={APP_ROUTES.HOME} className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary-500">{'<'}</span>
              <span className="text-xl font-bold text-white">NullPointer</span>
              <span className="text-2xl font-bold text-primary-500">{'/>'}</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/courses" className="text-dark-text hover:text-primary-500 transition-colors">
              Courses
            </Link>
            <Link href="/blogs" className="text-dark-text hover:text-primary-500 transition-colors">
              Blogs
            </Link>
            {isAuthenticated && (
              <Link href="/my-course" className="text-dark-text hover:text-primary-500 transition-colors">
                My Course
              </Link>
            )}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Bell Icon - Notifications */}
                <button className="p-2 text-dark-text hover:text-primary-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>

                {/* User Avatar */}
                <Link href={APP_ROUTES.PROFILE}>
                  <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-primary-600 transition-colors">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link href={APP_ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href={APP_ROUTES.REGISTER}>
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}