/**
 * Network Connectivity Hook
 *
 * Monitors network state and provides offline detection
 */

import { useEffect, useState, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
}

/**
 * Hook to monitor network connectivity
 */
export function useNetwork() {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: true,
    isInternetReachable: true,
    type: 'unknown',
  });

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const isConnected = state.isConnected ?? false;
      const isInternetReachable = state.isInternetReachable;

      setNetworkState({
        isConnected,
        isInternetReachable,
        type: state.type,
      });

      // Update React Query online status
      // Only set to online if we have internet reachability
      onlineManager.setOnline(isConnected && isInternetReachable !== false);
    });

    // Get initial state
    NetInfo.fetch().then((state) => {
      const isConnected = state.isConnected ?? false;
      const isInternetReachable = state.isInternetReachable;

      setNetworkState({
        isConnected,
        isInternetReachable,
        type: state.type,
      });

      onlineManager.setOnline(isConnected && isInternetReachable !== false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const isOffline = !networkState.isConnected || networkState.isInternetReachable === false;

  return {
    ...networkState,
    isOffline,
    isOnline: !isOffline,
  };
}

/**
 * Hook to get simple online/offline status
 */
export function useIsOnline(): boolean {
  const { isOnline } = useNetwork();
  return isOnline;
}

/**
 * Hook to get simple offline status
 */
export function useIsOffline(): boolean {
  const { isOffline } = useNetwork();
  return isOffline;
}

export default useNetwork;
