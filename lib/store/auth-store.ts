import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  roles: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isInitialized: boolean;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  setInitialized: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isInitialized: false,
      
      setAccessToken: (token) => set({ accessToken: token }),
      
      setUser: (user) => set({ user }),
      
      setAuth: (token, user) => set({ accessToken: token, user }),
      
      logout: () => set({ accessToken: null, user: null }),
      
      setInitialized: () => set({ isInitialized: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        accessToken: state.accessToken, 
        user: state.user 
      }),
    }
  )
);