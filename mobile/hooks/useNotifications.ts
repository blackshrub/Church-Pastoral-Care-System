/**
 * Notifications Hook
 *
 * React hook for managing push notifications
 */

import { useEffect, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import {
  requestNotificationPermissions,
  areNotificationsEnabled,
  setupNotificationListeners,
  setupAndroidChannels,
  cancelAllNotifications,
  getScheduledNotifications,
  scheduleDailyDigest,
  clearBadge,
  setBadgeCount,
} from '@/services/notifications';

export interface UseNotificationsReturn {
  isEnabled: boolean;
  isLoading: boolean;
  pushToken: string | null;
  scheduledCount: number;
  requestPermissions: () => Promise<boolean>;
  scheduleDailyReminder: (hour?: number, minute?: number) => Promise<void>;
  cancelAll: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

/**
 * Hook to manage notifications in components
 */
export function useNotifications(): UseNotificationsReturn {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [scheduledCount, setScheduledCount] = useState(0);

  // Check notification status
  const refreshStatus = useCallback(async () => {
    try {
      const enabled = await areNotificationsEnabled();
      setIsEnabled(enabled);

      const scheduled = await getScheduledNotifications();
      setScheduledCount(scheduled.length);
    } catch (error) {
      console.error('Failed to check notification status:', error);
    }
  }, []);

  // Request permissions
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const token = await requestNotificationPermissions();
      if (token) {
        setPushToken(token);
        setIsEnabled(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to request permissions:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Schedule daily reminder
  const scheduleDailyReminder = useCallback(
    async (hour: number = 8, minute: number = 0) => {
      if (!isEnabled) {
        const granted = await requestPermissions();
        if (!granted) return;
      }
      await scheduleDailyDigest(hour, minute);
      await refreshStatus();
    },
    [isEnabled, requestPermissions, refreshStatus]
  );

  // Cancel all notifications
  const cancelAll = useCallback(async () => {
    await cancelAllNotifications();
    await clearBadge();
    await refreshStatus();
  }, [refreshStatus]);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        // Set up Android channels
        await setupAndroidChannels();

        // Check current status
        await refreshStatus();
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [refreshStatus]);

  // Set up notification listeners
  useEffect(() => {
    const cleanup = setupNotificationListeners();
    return cleanup;
  }, []);

  // Clear badge when app comes to foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        clearBadge();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  return {
    isEnabled,
    isLoading,
    pushToken,
    scheduledCount,
    requestPermissions,
    scheduleDailyReminder,
    cancelAll,
    refreshStatus,
  };
}

/**
 * Simple hook to check if notifications are enabled
 */
export function useNotificationsEnabled(): boolean {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    areNotificationsEnabled().then(setIsEnabled);
  }, []);

  return isEnabled;
}

export default useNotifications;
