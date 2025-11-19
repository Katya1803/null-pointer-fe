import { create } from "zustand";

interface User {
  id: string;
  username: string;
  email: string;
  roles: string;
}

interface AuthState {
  // State
  access_token: string | null;
  user: User | null;
  isInitialized: boolean;

  // Actions
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  markInitialized: () => void;
}

/**
 * Auth Store - NO PERSISTENCE
 * 
 * Security:
 * - access_token stored ONLY in memory (Zustand state)
 * - refreshToken stored in HttpOnly cookie (managed by backend)
 * - On page reload: auto-refresh via AuthProvider
 */
export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  access_token: null,
  user: null,
  isInitialized: false,

  // Set both token and user (after login/refresh)
  setAuth: (token, user) => set({ 
    access_token: token, 
    user,
    isInitialized: true 
  }),

  // Clear all auth state
  logout: () => set({ 
    access_token: null, 
    user: null 
  }),

  // Mark initialization complete
  markInitialized: () => set({ isInitialized: true }),
}));