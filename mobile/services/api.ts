/**
 * FaithTracker API Service
 *
 * Axios instance with authentication and error handling
 */

import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8001/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach auth token
// Using lazy import to avoid circular dependency with auth store
api.interceptors.request.use(
  (config) => {
    // Lazy import to break circular dependency
    const { useAuthStore } = require('@/stores/auth');
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      const originalRequest = error?.config;

      // Handle 401 Unauthorized
      if (error?.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        // Lazy import to break circular dependency
        const { useAuthStore } = require('@/stores/auth');
        const { logout } = useAuthStore.getState();
        await logout();

        // The router will handle redirect to login
        return Promise.reject(error);
      }

      // Handle network errors
      if (!error?.response && error?.message) {
        console.warn('Network error:', error.message);
        // Could queue for offline sync here
      }
    } catch (interceptorError) {
      // Silently handle interceptor errors to prevent crashes
      console.warn('Interceptor error:', interceptorError);
    }

    return Promise.reject(error);
  }
);

export default api;

// ============================================================================
// API HELPER FUNCTIONS
// ============================================================================

/**
 * Handle API errors and extract message
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Server responded with error
    if (error.response?.data?.detail) {
      return error.response.data.detail;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    // Network error
    if (!error.response) {
      return 'Network error. Please check your connection.';
    }
    // Default HTTP error
    return `Error: ${error.response.status} ${error.response.statusText}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Check if error is a network error (offline)
 */
export function isNetworkError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return !error.response;
  }
  return false;
}

/**
 * Check if error is an auth error (401)
 */
export function isAuthError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 401;
  }
  return false;
}
