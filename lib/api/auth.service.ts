import apiClient from './client';
import type { ApiResponse } from '@/lib/types/api.types';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  ResendOtpRequest,
} from '@/lib/types/auth.types';
import { API_ROUTES } from '@/lib/constants';

/**
 * Auth Service - Handles all authentication API calls
 */
export const authService = {
  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>(
      API_ROUTES.AUTH.REGISTER,
      data
    );
    return response.data;
  },

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_ROUTES.AUTH.LOGIN,
      data
    );
    return response.data;
  },

  /**
   * Verify OTP
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_ROUTES.AUTH.VERIFY_OTP,
      data
    );
    return response.data;
  },

  /**
   * Resend OTP
   */
  async resendOtp(data: ResendOtpRequest): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      API_ROUTES.AUTH.RESEND_OTP,
      data
    );
    return response.data;
  },

  /**
   * Refresh access token
   * Uses httpOnly cookie automatically
   */
  async refresh(): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_ROUTES.AUTH.REFRESH
    );
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      API_ROUTES.AUTH.LOGOUT
    );
    return response.data;
  },
};