/**
 * Auth Layout
 *
 * Stack layout for authentication screens
 */

import { Stack } from 'expo-router';

console.log('[AuthLayout] Module loading...');

export default function AuthLayout() {
  console.log('[AuthLayout] Rendering...');
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#14b8a6' },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="login" />
    </Stack>
  );
}
