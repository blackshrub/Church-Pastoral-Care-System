/**
 * Storage Utilities
 *
 * MMKV-based persistent storage for the mobile app
 * MMKV is faster and more reliable than AsyncStorage
 */

import { MMKV } from 'react-native-mmkv';

// ============================================================================
// STORAGE INSTANCE
// ============================================================================

/**
 * Main storage instance
 * Uses default MMKV ID for general app data
 */
export const storage = new MMKV({ id: 'faithtracker-storage' });

// ============================================================================
// STORAGE KEYS
// ============================================================================

/**
 * Centralized storage keys to avoid magic strings
 */
export const STORAGE_KEYS = {
  // Auth
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',

  // Notifications
  NOTIFICATION_ENABLED: 'notification_enabled',
  PUSH_TOKEN: 'push_token',
  DAILY_DIGEST_ENABLED: 'daily_digest_enabled',

  // Theme
  THEME_MODE: 'theme_mode',

  // Biometrics
  BIOMETRIC_ENABLED: 'biometric_enabled',
  BIOMETRIC_CREDENTIALS: 'biometric_credentials',

  // Offline sync
  OFFLINE_QUEUE: 'offline_queue',
  LAST_SYNC_TIME: 'last_sync_time',

  // Cache
  DASHBOARD_CACHE: 'dashboard_cache',
  MEMBERS_CACHE: 'members_cache',

  // User preferences
  LANGUAGE: 'language',
  FIRST_LAUNCH: 'first_launch',
  ONBOARDING_COMPLETE: 'onboarding_complete',
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a JSON object from storage
 */
export function getJSON<T>(key: string): T | null {
  try {
    const value = storage.getString(key);
    if (value) {
      return JSON.parse(value) as T;
    }
  } catch (error) {
    console.error(`Failed to parse JSON for key ${key}:`, error);
  }
  return null;
}

/**
 * Set a JSON object in storage
 */
export function setJSON(key: string, value: unknown): void {
  try {
    storage.set(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to stringify JSON for key ${key}:`, error);
  }
}

/**
 * Remove a key from storage
 */
export function remove(key: string): void {
  storage.delete(key);
}

/**
 * Clear all storage
 */
export function clearAll(): void {
  storage.clearAll();
}

/**
 * Get all keys in storage
 */
export function getAllKeys(): string[] {
  return storage.getAllKeys();
}

/**
 * Check if a key exists
 */
export function has(key: string): boolean {
  return storage.contains(key);
}

export default {
  storage,
  STORAGE_KEYS,
  getJSON,
  setJSON,
  remove,
  clearAll,
  getAllKeys,
  has,
};
