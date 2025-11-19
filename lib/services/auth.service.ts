import { api } from '../api';
import type {
  LoginFormData,
  RegisterFormData,
  VerifyOtpFormData,
  ResendOtpFormData,
} from '../validations/auth.validations';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  needsVerification: boolean;
  message: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: null;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    username: string;
    email: string;
    roles: string;
  };
}

export const authService = {
  async register(data: RegisterFormData): Promise<ApiResponse<RegisterResponse>> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginFormData): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post('/auth/login', {
      ...data,
      deviceId: data.deviceId || 'web',
    });
    return response.data;
  },

  async verifyOtp(data: VerifyOtpFormData): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post('/auth/verify-otp', {
      ...data,
      deviceId: data.deviceId || 'web',
    });
    return response.data;
  },

  async resendOtp(data: ResendOtpFormData): Promise<ApiResponse<void>> {
    const response = await api.post('/auth/resend-otp', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async refreshToken(): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};