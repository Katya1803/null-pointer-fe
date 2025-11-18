import { z } from 'zod';

/**
 * Register Form Schema
 * Matches backend validation: RegisterRequest
 */
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscore and hyphen'
    ),
  
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .min(1, 'Password is required'),
  
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  
  firstName: z.string().optional(),
  
  lastName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Login Form Schema
 * Matches backend validation: LoginRequest
 */
export const loginSchema = z.object({
  account: z
    .string()
    .min(1, 'Username or email is required'),
  
  password: z
    .string()
    .min(1, 'Password is required'),
  
  deviceId: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Verify OTP Form Schema
 * Matches backend validation: VerifyOtpRequest
 */
export const verifyOtpSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  
  otp: z
    .string()
    .regex(/^[0-9]{6}$/, 'OTP must be 6 digits')
    .min(1, 'OTP is required'),
  
  deviceId: z.string().optional(),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

/**
 * Resend OTP Form Schema
 * Matches backend validation: ResendOtpRequest
 */
export const resendOtpSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
});

export type ResendOtpFormData = z.infer<typeof resendOtpSchema>;