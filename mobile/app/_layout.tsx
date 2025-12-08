/**
 * FaithTracker Mobile - Root Layout
 */

import '../global.css';

import { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { RefreshCw } from 'lucide-react-native';
import { queryClient } from '@/lib/queryClient';
import { UnifiedOverlayHost } from '@/components/overlay';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

// Log immediately to detect import issues
console.log('[Layout] Module loading...');

export default function RootLayout() {
  console.log('[Layout] Component rendering...');
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const init = useCallback(async () => {
    console.log('[Init] Starting...');
    let notificationCleanup: (() => void) | undefined;

    try {
      setError(null);
      setIsRetrying(true);

      // Lazy load to avoid import crashes
      const { initializeI18n } = await import('@/lib/i18n');
      await initializeI18n();
      console.log('[Init] i18n done');

      const { useAuthStore } = await import('@/stores/auth');
      await useAuthStore.getState().initialize();
      console.log('[Init] auth done');

      // Initialize push notifications
      const notifications = await import('@/services/notifications');
      notificationCleanup = notifications.setupNotificationListeners();
      const user = useAuthStore.getState().user;
      await notifications.initializePushNotifications(user?.id);
      console.log('[Init] notifications done');

      setIsReady(true);
      console.log('[Init] Ready!');
    } catch (e: any) {
      console.error('[Init] Error:', e);
      setError(e.message || 'Unknown error');
      setIsReady(false);
    } finally {
      setIsRetrying(false);
    }

    return notificationCleanup;
  }, []);

  useEffect(() => {
    console.log('[Layout] useEffect running...');
    let cleanup: (() => void) | undefined;

    init().then((notificationCleanup) => {
      cleanup = notificationCleanup;
    });

    // Cleanup notification listeners on unmount
    return () => {
      cleanup?.();
    };
  }, [init]);

  // Show error screen with retry option
  if (error && !isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#14b8a6', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>FaithTracker</Text>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginTop: 12, textAlign: 'center' }}>
          {error}
        </Text>
        <Pressable
          onPress={() => init()}
          disabled={isRetrying}
          style={{
            marginTop: 24,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.2)',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 12,
            opacity: isRetrying ? 0.6 : 1,
          }}
        >
          <RefreshCw size={18} color="white" />
          <Text style={{ color: 'white', fontWeight: '600', marginLeft: 8 }}>
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </Text>
        </Pressable>
      </View>
    );
  }

  // Show loading only while initializing
  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#14b8a6', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>FaithTracker</Text>
        <Text style={{ color: 'white', fontSize: 16, marginTop: 12 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemedStatusBar />
            <Slot />
            <UnifiedOverlayHost />
            <Toast />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Inner component that uses theme context for status bar
function ThemedStatusBar() {
  // Safe to call here since we're inside ThemeProvider
  try {
    const { isDark } = useTheme();
    return <StatusBar style={isDark ? 'light' : 'dark'} />;
  } catch {
    // Fallback if ThemeProvider not ready yet
    return <StatusBar style="auto" />;
  }
}
