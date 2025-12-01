/**
 * Biometrics Hook
 *
 * React hook for managing biometric authentication state
 */

import { useEffect, useState, useCallback } from 'react';
import {
  checkBiometricAvailability,
  authenticateWithBiometrics,
  isBiometricLoginEnabled,
  enableBiometricLogin,
  disableBiometricLogin,
  BiometricStatus,
  AuthenticateResult,
} from '@/services/biometrics';

export interface UseBiometricsReturn {
  status: BiometricStatus | null;
  isEnabled: boolean;
  isLoading: boolean;
  authenticate: (promptMessage?: string) => Promise<AuthenticateResult>;
  enable: () => Promise<boolean>;
  disable: () => void;
  toggle: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

/**
 * Hook to manage biometric authentication
 */
export function useBiometrics(): UseBiometricsReturn {
  const [status, setStatus] = useState<BiometricStatus | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const biometricStatus = await checkBiometricAvailability();
      setStatus(biometricStatus);
      setIsEnabled(isBiometricLoginEnabled());
    } catch (error) {
      console.error('Failed to check biometric status:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Authenticate
  const authenticate = useCallback(async (promptMessage?: string): Promise<AuthenticateResult> => {
    return authenticateWithBiometrics({ promptMessage });
  }, []);

  // Enable
  const enable = useCallback(async (): Promise<boolean> => {
    const success = await enableBiometricLogin();
    if (success) {
      setIsEnabled(true);
    }
    return success;
  }, []);

  // Disable
  const disable = useCallback(() => {
    disableBiometricLogin();
    setIsEnabled(false);
  }, []);

  // Toggle
  const toggle = useCallback(async (): Promise<boolean> => {
    if (isEnabled) {
      disable();
      return false;
    } else {
      return enable();
    }
  }, [isEnabled, enable, disable]);

  return {
    status,
    isEnabled,
    isLoading,
    authenticate,
    enable,
    disable,
    toggle,
    refresh,
  };
}

/**
 * Simple hook to check if biometrics are available
 */
export function useBiometricsAvailable(): boolean {
  const { status, isLoading } = useBiometrics();
  return !isLoading && !!status?.isAvailable && !!status?.isEnrolled;
}

export default useBiometrics;
