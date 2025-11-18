
export const API_ROUTES = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  USER: {
    ME: '/api/users/me',
    BY_ID: (userId: string) => `/api/users/${userId}`,
    BY_USERNAME: (username: string) => `/api/users/username/${username}`,
    ALL: '/api/users',
    UPDATE: (userId: string) => `/api/users/${userId}`,
    DELETE: (userId: string) => `/api/users/${userId}`,
  },
} as const;

/**
 * App Routes
 */
export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
} as const;
