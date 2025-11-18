'use client';

import { useAuthStore } from '@/lib/stores/auth.store';
import { authService } from '@/lib/api/auth.service';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/lib/constants';
import type {
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
} from '@/lib/types/auth.types';

/**
 * Custom hook for authentication actions
 */
export function useAuth() {
  const router = useRouter();
  const { setAuth, clearAuth, setLoading, user, isAuthenticated, isLoading } = useAuthStore();

  /**
   * Login user
   */
  const login = async (data: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.access_token);
        router.push(APP_ROUTES.DASHBOARD);
        return response;
      }
      
      throw new Error(response.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      const response = await authService.register(data);
      
      if (response.success && response.data) {
        // Redirect to verify email page
        router.push(`${APP_ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(data.email)}`);
        return response;
      }
      
      throw new Error(response.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify OTP
   */
  const verifyOtp = async (data: VerifyOtpRequest) => {
    setLoading(true);
    try {
      const response = await authService.verifyOtp(data);
      
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.access_token);
        router.push(APP_ROUTES.DASHBOARD);
        return response;
      }
      
      throw new Error(response.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resend OTP
   */
  const resendOtp = async (data: ResendOtpRequest) => {
    const response = await authService.resendOtp(data);
    return response;
  };

  /**
   * Logout user
   */
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      router.push(APP_ROUTES.LOGIN);
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    verifyOtp,
    resendOtp,
    logout,
  };
}