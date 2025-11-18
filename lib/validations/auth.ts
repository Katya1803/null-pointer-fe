import { z } from 'zod';

export const loginSchema = z.object({
  account: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
  deviceId: z.string().optional(),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscore and hyphen'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.string().regex(/^[0-9]{6}$/, 'OTP must be 6 digits'),
  deviceId: z.string().optional(),
});

export const resendOtpSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type ResendOtpFormData = z.infer<typeof resendOtpSchema>;