"use client";

import { useAuthStore } from "@/lib/store/auth-store";

export default function HomePage() {
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        {user ? (
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome back, {user.username}!
            </h1>
            <p className="text-dark-muted">Ready to continue learning?</p>
          </div>
        ) : (
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to NullPointer
            </h1>
            <p className="text-dark-muted">Sign in to start learning</p>
          </div>
        )}
      </div>
    </div>
  );
}