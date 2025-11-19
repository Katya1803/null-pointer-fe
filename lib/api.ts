import axios from "axios";
import { useAuthStore } from "./store/auth-store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  withCredentials: true, // CRITICAL: Send cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Track refresh state
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export const setupInterceptors = () => {
  /**
   * REQUEST INTERCEPTOR
   * Add Bearer token to all requests
   */
api.interceptors.request.use(
  (config) => {
    console.log("🔥 REQUEST INTERCEPTOR RUNNING FOR:", config.url);
    console.log("🔥 TOKEN IN INTERCEPTOR:", useAuthStore.getState().access_token);

    const token = useAuthStore.getState().access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔥 ADDED Authorization:", config.headers.Authorization);
    } else {
      console.log("❌ NO TOKEN FOUND IN INTERCEPTOR");
    }

    return config;
  },
  (error) => Promise.reject(error)
);


  /**
   * RESPONSE INTERCEPTOR
   * Handle 401 errors with automatic token refresh
   */
  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      // Not a 401 error → reject immediately
      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      // Is a logout or refresh request → don't retry
      const isAuthEndpoint = 
        originalRequest.url?.includes('/auth/logout') ||
        originalRequest.url?.includes('/auth/refresh');
      
      if (isAuthEndpoint) {
        // Logout/refresh failed → clear session
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

      // Mark as retried
      originalRequest._retry = true;

      // If already refreshing, wait for it
      if (isRefreshing && refreshPromise) {
        try {
          const newToken = await refreshPromise;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch {
          return Promise.reject(error);
        }
      }

      // Start refresh
      isRefreshing = true;
      refreshPromise = refreshaccess_token();

      try {
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }
  );
};

/**
 * Refresh access token using httpOnly cookie
 */
async function refreshaccess_token(): Promise<string> {
  try {
    const response = await api.post("/auth/refresh", {}, {
      withCredentials: true, // Send refresh token cookie
      _retry: true, // Mark to prevent retry loop
    } as any);

    const { access_token, user } = response.data.data;

    // Update store with new token and user
    useAuthStore.setState({
      access_token,
      user,
      isInitialized: true,
    });

    return access_token;
  } catch (error) {
    // Refresh failed → logout
    useAuthStore.getState().logout();
    throw error;
  }
}