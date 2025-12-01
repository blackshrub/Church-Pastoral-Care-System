/**
 * App Index - Initial Route Handler
 *
 * Redirects to appropriate screen based on authentication state
 */

import { Redirect } from 'expo-router';
import { View, Text } from 'react-native';
import { useAuthStore } from '@/stores/auth';

export default function Index() {
  const { isLoading, isAuthenticated } = useAuthStore();

  console.log('[Index] Rendering - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

  // Show loading while checking auth
  if (isLoading) {
    console.log('[Index] Showing loading screen');
    return (
      <View style={{ flex: 1, backgroundColor: '#14b8a6', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>FaithTracker</Text>
        <Text style={{ color: 'white', fontSize: 14, marginTop: 8 }}>Loading...</Text>
      </View>
    );
  }

  // Redirect based on auth state
  if (isAuthenticated) {
    console.log('[Index] Redirecting to tabs');
    return <Redirect href="/(tabs)" />;
  }

  console.log('[Index] Redirecting to login');
  return <Redirect href="/(auth)/login" />;
}
