import { api } from '../api';
import {
  LoginFormData,
  RegisterFormData,
  VerifyOtpFormData,
  ResendOtpFormData,
} from '../validations/auth';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  needsVerification: boolean;
  message: string;
}

interface LoginResponse {
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
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async verifyOtp(data: VerifyOtpFormData): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  async resendOtp(data: ResendOtpFormData): Promise<ApiResponse<void>> {
    const response = await api.post('/auth/resend-otp', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};