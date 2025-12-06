/**
 * FaithTracker API Service
 *
 * Axios instance with authentication, error handling, and retry logic
 * Matches webapp's api.js implementation for consistency
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Timeout configuration
const DEFAULT_TIMEOUT = 30000; // 30 seconds for normal requests
const UPLOAD_TIMEOUT = 120000; // 2 minutes for file uploads

// Retry configuration (matches webapp)
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // Base delay of 1 second
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

// ============================================================================
// RETRY HELPERS
// ============================================================================

// Extend config type to include retry count
interface RetryConfig extends InternalAxiosRequestConfig {
  __retryCount?: number;
}

/**
 * Calculate exponential backoff delay with jitter
 * @param retryCount - Current retry attempt (0-indexed)
 * @returns Delay in milliseconds
 */
function getRetryDelay(retryCount: number): number {
  // Exponential backoff: 1s, 2s, 4s
  const exponentialDelay = RETRY_DELAY_BASE * Math.pow(2, retryCount);
  // Add jitter (0-500ms) to prevent thundering herd
  const jitter = Math.random() * 500;
  return exponentialDelay + jitter;
}

/**
 * Determine if request should be retried
 * @param error - Axios error
 * @returns boolean
 */
function shouldRetry(error: AxiosError): boolean {
  // Don't retry if no response (network error)
  if (!error.response) {
    // Retry network errors (timeout, connection refused)
    return error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK';
  }

  // Don't retry client errors (4xx) except specific codes
  const status = error.response.status;
  return RETRYABLE_STATUS_CODES.includes(status);
}

// ============================================================================
// AXIOS INSTANCE
// ============================================================================

// Create axios instance
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8001/api',
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach auth token and configure request
// Using lazy import to avoid circular dependency with auth store
api.interceptors.request.use(
  (config) => {
    // Lazy import to break circular dependency
    const { useAuthStore } = require('@/stores/auth');
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set longer timeout for file uploads (FormData)
    if (config.data instanceof FormData) {
      config.timeout = UPLOAD_TIMEOUT;
    }

    // Initialize retry count
    (config as RetryConfig).__retryCount = (config as RetryConfig).__retryCount || 0;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle auth errors and retry logic
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    try {
      const config = error.config as RetryConfig | undefined;

      // Check if we should retry
      if (config && (config.__retryCount || 0) < MAX_RETRIES && shouldRetry(error)) {
        config.__retryCount = (config.__retryCount || 0) + 1;

        // Wait with exponential backoff
        const delay = getRetryDelay(config.__retryCount - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Log retry attempt in development
        if (__DEV__) {
          console.log(
            `[API] Retrying request (attempt ${config.__retryCount}/${MAX_RETRIES}):`,
            config.url
          );
        }

        return api(config);
      }

      // Handle 401 Unauthorized
      if (error?.response?.status === 401 && config && !(config as any)._retry) {
        (config as any)._retry = true;

        // Lazy import to break circular dependency
        const { useAuthStore } = require('@/stores/auth');
        const { logout } = useAuthStore.getState();
        await logout();

        // The router will handle redirect to login
        return Promise.reject(error);
      }

      // Handle network errors
      if (!error?.response && error?.message) {
        console.warn('[API] Network error:', error.message);
        // Could queue for offline sync here
      }
    } catch (interceptorError) {
      // Silently handle interceptor errors to prevent crashes
      console.warn('[API] Interceptor error:', interceptorError);
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
