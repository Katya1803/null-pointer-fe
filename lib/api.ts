import axios from 'axios';
import { useAuthStore } from './store/auth-store';
import { getErrorMessage } from './utils/error.utils';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export const setupInterceptors = () => {
  /**
   * REQUEST INTERCEPTOR - Add Bearer token
   */
  api.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  /**
   * RESPONSE INTERCEPTOR - Handle errors & token refresh
   */
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Not a 401 error → reject immediately
      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      // Auth endpoints → don't retry
      const isAuthEndpoint =
        originalRequest.url?.includes('/auth/logout') ||
        originalRequest.url?.includes('/auth/refresh');

      if (isAuthEndpoint) {
        if (originalRequest.url?.includes('/auth/refresh')) {
          useAuthStore.getState().logout();
        }
        return Promise.reject(error);
      }

      // Already retried → give up
      if (originalRequest._retry) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // If already refreshing, wait for it
      if (isRefreshing && refreshPromise) {
        try {
          const newToken = await refreshPromise;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }
      }

      // Start refresh
      isRefreshing = true;
      refreshPromise = (async () => {
        try {
          const response = await api.post('/auth/refresh');
          const newToken = response.data.data.access_token;

          useAuthStore.getState().setAuth(newToken, response.data.data.user);

          return newToken;
        } catch (refreshError) {
          useAuthStore.getState().logout();
          throw refreshError;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();

      try {
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }
  );
};