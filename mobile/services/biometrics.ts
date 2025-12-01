/**
 * Biometric Authentication Service
 *
 * Face ID / Touch ID / Fingerprint authentication for secure login
 * Uses expo-local-authentication
 */

import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';
import { storage, STORAGE_KEYS } from '@/lib/storage';

// ============================================================================
// TYPES
// ============================================================================

export type BiometricType = 'fingerprint' | 'facial' | 'iris' | 'none';

export interface BiometricStatus {
  isAvailable: boolean;
  isEnrolled: boolean;
  biometricType: BiometricType;
  displayName: string;
}

// ============================================================================
// STATUS CHECKS
// ============================================================================

/**
 * Check if biometric authentication is available on the device
 */
export async function checkBiometricAvailability(): Promise<BiometricStatus> {
  try {
    // Check hardware support
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      return {
        isAvailable: false,
        isEnrolled: false,
        biometricType: 'none',
        displayName: 'Biometrics',
      };
    }

    // Check if biometrics are enrolled
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    // Get supported authentication types
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    let biometricType: BiometricType = 'none';
    let displayName = 'Biometrics';

    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      biometricType = 'facial';
      displayName = Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition';
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      biometricType = 'fingerprint';
      displayName = Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      biometricType = 'iris';
      displayName = 'Iris';
    }

    return {
      isAvailable: hasHardware && supportedTypes.length > 0,
      isEnrolled,
      biometricType,
      displayName,
    };
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return {
      isAvailable: false,
      isEnrolled: false,
      biometricType: 'none',
      displayName: 'Biometrics',
    };
  }
}

// ============================================================================
// AUTHENTICATION
// ============================================================================

export interface AuthenticateOptions {
  promptMessage?: string;
  cancelLabel?: string;
  fallbackLabel?: string;
  disableDeviceFallback?: boolean;
}

export interface AuthenticateResult {
  success: boolean;
  error?: string;
  warning?: string;
}

/**
 * Authenticate user with biometrics
 */
export async function authenticateWithBiometrics(
  options: AuthenticateOptions = {}
): Promise<AuthenticateResult> {
  try {
    const status = await checkBiometricAvailability();

    if (!status.isAvailable) {
      return {
        success: false,
        error: 'Biometric authentication is not available on this device',
      };
    }

    if (!status.isEnrolled) {
      return {
        success: false,
        error: `No ${status.displayName} enrolled. Please set up biometrics in your device settings.`,
      };
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: options.promptMessage || 'Authenticate to continue',
      cancelLabel: options.cancelLabel || 'Cancel',
      fallbackLabel: options.fallbackLabel || 'Use Passcode',
      disableDeviceFallback: options.disableDeviceFallback || false,
    });

    if (result.success) {
      return { success: true };
    }

    // Handle specific error types
    if (result.error === 'user_cancel') {
      return {
        success: false,
        warning: 'Authentication cancelled',
      };
    }

    if (result.error === 'user_fallback') {
      return {
        success: false,
        warning: 'User chose fallback authentication',
      };
    }

    if (result.error === 'lockout') {
      return {
        success: false,
        error: 'Too many failed attempts. Please try again later.',
      };
    }

    return {
      success: false,
      error: result.error || 'Authentication failed',
    };
  } catch (error) {
    console.error('Biometric authentication error:', error);
    return {
      success: false,
      error: 'An error occurred during authentication',
    };
  }
}

// ============================================================================
// SETTINGS
// ============================================================================

/**
 * Check if biometric login is enabled
 */
export function isBiometricLoginEnabled(): boolean {
  return storage.getBoolean(STORAGE_KEYS.BIOMETRIC_ENABLED) ?? false;
}

/**
 * Enable biometric login
 */
export async function enableBiometricLogin(): Promise<boolean> {
  const status = await checkBiometricAvailability();

  if (!status.isAvailable || !status.isEnrolled) {
    return false;
  }

  // Verify with biometric auth before enabling
  const result = await authenticateWithBiometrics({
    promptMessage: 'Authenticate to enable biometric login',
  });

  if (result.success) {
    storage.set(STORAGE_KEYS.BIOMETRIC_ENABLED, true);
    return true;
  }

  return false;
}

/**
 * Disable biometric login
 */
export function disableBiometricLogin(): void {
  storage.set(STORAGE_KEYS.BIOMETRIC_ENABLED, false);
}

/**
 * Toggle biometric login
 */
export async function toggleBiometricLogin(): Promise<boolean> {
  if (isBiometricLoginEnabled()) {
    disableBiometricLogin();
    return false;
  } else {
    return enableBiometricLogin();
  }
}

// ============================================================================
// LOGIN FLOW
// ============================================================================

/**
 * Attempt biometric login
 * Returns true if should proceed with biometric auth, false if should skip
 */
export async function attemptBiometricLogin(): Promise<boolean> {
  // Check if biometric login is enabled
  if (!isBiometricLoginEnabled()) {
    return false;
  }

  // Check if biometrics are available
  const status = await checkBiometricAvailability();
  if (!status.isAvailable || !status.isEnrolled) {
    return false;
  }

  // Authenticate
  const result = await authenticateWithBiometrics({
    promptMessage: 'Login with ' + status.displayName,
    fallbackLabel: 'Use Password',
    disableDeviceFallback: false,
  });

  return result.success;
}

export default {
  checkBiometricAvailability,
  authenticateWithBiometrics,
  isBiometricLoginEnabled,
  enableBiometricLogin,
  disableBiometricLogin,
  toggleBiometricLogin,
  attemptBiometricLogin,
};
