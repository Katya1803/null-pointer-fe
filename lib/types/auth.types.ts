/**
 * Register Request
 * Matches: com.app.auth.dto.RegisterRequest
 */
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Register Response
 * Matches: com.app.auth.dto.RegisterResponse
 */
export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  needsVerification: boolean;
  message: string;
}

/**
 * Login Request
 * Matches: com.app.auth.dto.LoginRequest
 */
export interface LoginRequest {
  account: string; // username or email
  password: string;
  deviceId?: string;
}

/**
 * Login Response
 * Matches: com.app.auth.dto.LoginResponse
 */
export interface LoginResponse {
  access_token: string;
  refresh_token?: string; // null in response (httpOnly cookie)
  token_type: string;
  expires_in: number;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  roles: string;
}

/**
 * Verify OTP Request
 * Matches: com.app.auth.dto.VerifyOtpRequest
 */
export interface VerifyOtpRequest {
  email: string;
  otp: string;
  deviceId?: string;
}

/**
 * Resend OTP Request
 * Matches: com.app.auth.dto.ResendOtpRequest
 */
export interface ResendOtpRequest {
  email: string;
}

/**
 * Refresh Token Request
 * Matches: com.app.auth.dto.RefreshTokenRequest
 */
export interface RefreshTokenRequest {
  refresh_token: string;
}