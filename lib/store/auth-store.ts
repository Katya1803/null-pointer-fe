import { create } from 'zustand';

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

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isInitialized: false,
  
  setAccessToken: (token) => set({ accessToken: token }),
  
  setUser: (user) => set({ user }),
  
  setAuth: (token, user) => set({ accessToken: token, user }),
  
  logout: () => set({ accessToken: null, user: null }),
  
  setInitialized: () => set({ isInitialized: true }),
}));