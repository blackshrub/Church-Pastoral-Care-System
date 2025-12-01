/**
 * FaithTracker Auth Store
 *
 * Manages authentication state with SecureStore persistence
 */

import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import * as SecureStore from 'expo-secure-store';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/constants/api';
import { USE_MOCK_DATA, mockLogin, mockGetCurrentUser } from '@/services/mockApi';
import type { User, LoginRequest, LoginResponse } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string, campusId?: string) => Promise<void>;
  loginWithBiometrics: () => Promise<boolean>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  refreshUser: () => Promise<void>;
  saveCredentialsForBiometric: (email: string, password: string) => Promise<void>;
  clearBiometricCredentials: () => Promise<void>;
  hasSavedCredentials: () => boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TOKEN_KEY = 'faithtracker_auth_token';
const USER_KEY = 'faithtracker_auth_user';
const BIOMETRIC_EMAIL_KEY = 'faithtracker_biometric_email';
const BIOMETRIC_PASSWORD_KEY = 'faithtracker_biometric_password';

// Track if credentials are saved (in-memory flag, set during initialize)
let hasCredentialsSaved = false;

// ============================================================================
// STORE
// ============================================================================

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,

  /**
   * Login with email and password
   */
  login: async (email: string, password: string, campusId?: string) => {
    try {
      let access_token: string;
      let user: User;

      if (USE_MOCK_DATA) {
        // Use mock API in development
        const result = await mockLogin(email, password);
        access_token = result.token;
        user = result.user;
      } else {
        // Use real API
        const payload: LoginRequest = { email, password };
        if (campusId) {
          payload.campus_id = campusId;
        }
        const response = await api.post<LoginResponse>(
          API_ENDPOINTS.AUTH.LOGIN,
          payload
        );
        access_token = response.data.access_token;
        user = response.data.user;
      }

      // Persist to secure storage
      await SecureStore.setItemAsync(TOKEN_KEY, access_token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

      // Update state
      set({
        token: access_token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * Login using saved biometric credentials
   */
  loginWithBiometrics: async () => {
    try {
      const email = await SecureStore.getItemAsync(BIOMETRIC_EMAIL_KEY);
      const password = await SecureStore.getItemAsync(BIOMETRIC_PASSWORD_KEY);

      if (!email || !password) {
        return false;
      }

      let access_token: string;
      let user: User;

      if (USE_MOCK_DATA) {
        const result = await mockLogin(email, password);
        access_token = result.token;
        user = result.user;
      } else {
        const response = await api.post<LoginResponse>(
          API_ENDPOINTS.AUTH.LOGIN,
          { email, password }
        );
        access_token = response.data.access_token;
        user = response.data.user;
      }

      // Persist to secure storage
      await SecureStore.setItemAsync(TOKEN_KEY, access_token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

      // Update state
      set({
        token: access_token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error('Biometric login failed:', error);
      return false;
    }
  },

  /**
   * Logout and clear all auth data
   */
  logout: async () => {
    try {
      // Clear secure storage
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }

    // Clear state
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  /**
   * Initialize auth state from secure storage
   * Called on app startup
   */
  initialize: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userStr = await SecureStore.getItemAsync(USER_KEY);

      // Check for saved biometric credentials
      const savedEmail = await SecureStore.getItemAsync(BIOMETRIC_EMAIL_KEY);
      hasCredentialsSaved = !!savedEmail;

      if (token && userStr) {
        const user = JSON.parse(userStr) as User;

        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });

        // Verify token is still valid by fetching current user
        // Skip verification in mock mode - trust the stored data
        if (!USE_MOCK_DATA) {
          try {
            const response = await api.get<User>(API_ENDPOINTS.AUTH.ME);
            set({ user: response.data });
            // Update stored user with fresh data
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(response.data));
          } catch (error) {
            // Token invalid, logout
            console.log('Token invalid, logging out');
            await get().logout();
          }
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false });
    }
  },

  /**
   * Refresh user data from server
   */
  refreshUser: async () => {
    try {
      let user: User;

      if (USE_MOCK_DATA) {
        user = await mockGetCurrentUser();
      } else {
        const response = await api.get<User>(API_ENDPOINTS.AUTH.ME);
        user = response.data;
      }

      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      set({ user });
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  },

  /**
   * Save credentials for biometric login
   */
  saveCredentialsForBiometric: async (email: string, password: string) => {
    try {
      await SecureStore.setItemAsync(BIOMETRIC_EMAIL_KEY, email);
      await SecureStore.setItemAsync(BIOMETRIC_PASSWORD_KEY, password);
      hasCredentialsSaved = true;
    } catch (error) {
      console.error('Error saving biometric credentials:', error);
      throw error;
    }
  },

  /**
   * Clear biometric credentials
   */
  clearBiometricCredentials: async () => {
    try {
      await SecureStore.deleteItemAsync(BIOMETRIC_EMAIL_KEY);
      await SecureStore.deleteItemAsync(BIOMETRIC_PASSWORD_KEY);
      hasCredentialsSaved = false;
    } catch (error) {
      console.error('Error clearing biometric credentials:', error);
    }
  },

  /**
   * Check if biometric credentials are saved
   */
  hasSavedCredentials: () => {
    return hasCredentialsSaved;
  },
}));

// ============================================================================
// SELECTORS (Shallow for performance)
// ============================================================================

/**
 * Use when you only need user data
 */
export const useAuthUser = () =>
  useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
    }))
  );

/**
 * Use when you only need the token
 */
export const useAuthToken = () =>
  useAuthStore(
    useShallow((state) => ({
      token: state.token,
      isAuthenticated: state.isAuthenticated,
    }))
  );

/**
 * Use when you only need auth actions
 */
export const useAuthActions = () =>
  useAuthStore(
    useShallow((state) => ({
      login: state.login,
      logout: state.logout,
      initialize: state.initialize,
      refreshUser: state.refreshUser,
    }))
  );

/**
 * Use when you only need loading state
 */
export const useAuthLoading = () =>
  useAuthStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
    }))
  );
