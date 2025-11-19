/**
 * Auth Request Types
 */
export interface LoginRequest {
  account: string;
  password: string;
  deviceId?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  deviceId?: string;
}

export interface ResendOtpRequest {
  email: string;
}

/**
 * Auth Response Types
 */
export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  needsVerification: boolean;
  message: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: null;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    username: string;
    email: string;
    roles: string;
  };
}