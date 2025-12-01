/**
 * FaithTracker Mobile - Root Layout
 */

import '../global.css';

import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { queryClient } from '@/lib/queryClient';
import { UnifiedOverlayHost } from '@/components/overlay';

// Log immediately to detect import issues
console.log('[Layout] Module loading...');

export default function RootLayout() {
  console.log('[Layout] Component rendering...');
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[Layout] useEffect running...');
    const init = async () => {
      console.log('[Init] Starting...');
      try {
        // Lazy load to avoid import crashes
        const { initializeI18n } = await import('@/lib/i18n');
        await initializeI18n();
        console.log('[Init] i18n done');

        const { useAuthStore } = await import('@/stores/auth');
        await useAuthStore.getState().initialize();
        console.log('[Init] auth done');
      } catch (e: any) {
        console.error('[Init] Error:', e);
        setError(e.message || 'Unknown error');
      } finally {
        setIsReady(true);
        console.log('[Init] Ready!');
      }
    };
    init();
  }, []);

  // Show loading only while initializing
  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#14b8a6', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>FaithTracker</Text>
        <Text style={{ color: 'white', fontSize: 16, marginTop: 12 }}>
          {error ? `Error: ${error}` : 'Loading...'}
        </Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <Slot />
          <UnifiedOverlayHost />
          <Toast />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
