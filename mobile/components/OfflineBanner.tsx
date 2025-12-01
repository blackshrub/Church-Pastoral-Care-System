/**
 * Offline Banner Component
 *
 * Shows a banner when the device is offline
 * Uses NativeWind for styling
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiOff } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import { useIsOffline } from '@/hooks/useNetwork';

export function OfflineBanner() {
  const isOffline = useIsOffline();
  const insets = useSafeAreaInsets();

  if (!isOffline) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(200)}
      exiting={FadeOutUp.duration(200)}
      className="absolute left-0 right-0 bg-warning-500 z-50"
      style={{ top: insets.top }}
    >
      <View className="flex-row items-center justify-center py-2 px-4 gap-2">
        <WifiOff size={16} color="#ffffff" />
        <Text className="text-white text-sm font-medium">
          You're offline. Changes will sync when connected.
        </Text>
      </View>
    </Animated.View>
  );
}

export default OfflineBanner;
