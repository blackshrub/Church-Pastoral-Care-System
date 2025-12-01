/**
 * Login Screen
 *
 * Email/password authentication with FaithTracker branding
 * Uses NativeWind for styling where supported
 * LinearGradient and KeyboardAvoidingView use style prop (not className)
 * Supports biometric authentication (Face ID / Touch ID)
 */

console.log('[Login] Module start...');

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Mail, Lock, LogIn, Fingerprint, ScanFace, Play } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

console.log('[Login] Core imports done...');

import { useAuthStore } from '@/stores/auth';
import { getErrorMessage } from '@/services/api';
import { gradients } from '@/constants/theme';
import { haptics } from '@/constants/interaction';
import { useBiometrics } from '@/hooks/useBiometrics';
import { USE_MOCK_DATA } from '@/services/mockApi';

console.log('[Login] All imports done...');

export default function LoginScreen() {
  console.log('[Login] Component rendering...');
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { login, loginWithBiometrics, hasSavedCredentials } = useAuthStore();
  const { status, isEnabled, authenticate, refresh } = useBiometrics();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Show biometric prompt on mount if enabled and available
  useEffect(() => {
    const checkBiometric = async () => {
      await refresh();
      if (isEnabled && status?.isAvailable && hasSavedCredentials()) {
        handleBiometricLogin();
      }
    };
    checkBiometric();
  }, []);

  // Handle biometric login
  const handleBiometricLogin = useCallback(async () => {
    if (!isEnabled || !status?.isAvailable) return;

    setIsBiometricLoading(true);
    setError(null);

    try {
      const success = await authenticate();
      if (success) {
        // Use saved credentials
        const result = await loginWithBiometrics();
        if (result) {
          haptics.success();
          router.replace('/(tabs)');
        } else {
          setError(t('auth.biometricFailed') || 'Biometric login failed. Please use email and password.');
        }
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      haptics.error();
    } finally {
      setIsBiometricLoading(false);
    }
  }, [isEnabled, status, authenticate, loginWithBiometrics, t]);

  // Handle demo login (mock mode)
  const handleDemoLogin = useCallback(async () => {
    setIsDemoLoading(true);
    setError(null);

    try {
      // Use mock login directly
      await login('demo@faithtracker.app', 'demo123');
      haptics.success();
      router.replace('/(tabs)');
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      haptics.error();
    } finally {
      setIsDemoLoading(false);
    }
  }, [login]);

  const handleLogin = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      setError(t('auth.loginError'));
      haptics.error();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(email.trim(), password);
      haptics.success();
      router.replace('/(tabs)');
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      haptics.error();
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login, t]);

  // Determine biometric icon based on type
  const BiometricIcon = status?.biometricType === 'facial' ? ScanFace : Fingerprint;
  const biometricLabel = status?.biometricType === 'facial'
    ? t('auth.faceId') || 'Face ID'
    : t('auth.touchId') || 'Touch ID';
  const showBiometric = isEnabled && status?.isAvailable && hasSavedCredentials();

  const isAnyLoading = isLoading || isDemoLoading || isBiometricLoading;

  return (
    // LinearGradient MUST use style prop (doesn't support className)
    <LinearGradient
      colors={[gradients.header.start, gradients.header.mid, gradients.header.end]}
      style={{ flex: 1 }}
    >
      {/* KeyboardAvoidingView MUST use style prop */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Inner View can use NativeWind className */}
        <View
          className="flex-1 px-6 justify-between"
          style={{ paddingTop: insets.top + 32 }}
        >
          {/* Logo & Title */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(500)}
            className="items-center mb-8"
          >
            <View className="w-20 h-20 rounded-2xl bg-white items-center justify-center mb-6 shadow-lg">
              <Text className="text-3xl font-bold text-teal-600">FT</Text>
            </View>
            <Text className="text-3xl font-bold text-white text-center mb-1">
              {t('auth.welcome')}
            </Text>
            <Text className="text-base text-teal-100 text-center">
              {t('auth.subtitle')}
            </Text>
          </Animated.View>

          {/* Login Form */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(500)}
            className="gap-4"
          >
            {/* Demo Login Button - Primary action for demo mode */}
            {USE_MOCK_DATA && (
              <TouchableOpacity
                className="min-h-14 rounded-xl bg-white justify-center items-center shadow-md active:opacity-80"
                onPress={handleDemoLogin}
                disabled={isAnyLoading}
                activeOpacity={0.8}
              >
                {isDemoLoading ? (
                  <ActivityIndicator color="#0d9488" size="small" />
                ) : (
                  <View className="flex-row items-center justify-center">
                    <Play size={20} color="#0d9488" />
                    <Text className="text-base font-semibold text-teal-600 ml-2">Demo Login</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}

            {/* Divider - only show if mock mode */}
            {USE_MOCK_DATA && (
              <View className="flex-row items-center my-2">
                <View className="flex-1 h-px bg-white/30" />
                <Text className="mx-4 text-white/60 text-sm">or</Text>
                <View className="flex-1 h-px bg-white/30" />
              </View>
            )}

            {/* Email Input */}
            <View className="flex-row items-center bg-white rounded-xl px-4 min-h-14 shadow-sm">
              <Mail size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 text-base text-gray-900 py-4 ml-3"
                placeholder={t('auth.emailPlaceholder')}
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isAnyLoading}
              />
            </View>

            {/* Password Input */}
            <View className="flex-row items-center bg-white rounded-xl px-4 min-h-14 shadow-sm">
              <Lock size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 text-base text-gray-900 py-4 ml-3"
                placeholder={t('auth.passwordPlaceholder')}
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isAnyLoading}
              />
            </View>

            {/* Error Message */}
            {error && (
              <Animated.View
                entering={FadeInDown.duration(200)}
                className="bg-red-50 rounded-lg p-3 border border-red-200"
              >
                <Text className="text-sm text-red-600 text-center">{error}</Text>
              </Animated.View>
            )}

            {/* Login Button */}
            <TouchableOpacity
              className={`mt-2 min-h-14 rounded-xl bg-teal-600 justify-center items-center shadow-md active:opacity-80 ${isAnyLoading ? 'opacity-60' : ''}`}
              onPress={handleLogin}
              disabled={isAnyLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <View className="flex-row items-center justify-center">
                  <LogIn size={20} color="white" />
                  <Text className="text-base font-semibold text-white ml-2">{t('auth.loginButton')}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Biometric Login Button */}
            {showBiometric && (
              <Animated.View entering={FadeInUp.delay(400).duration(300)}>
                <Pressable
                  className="flex-row items-center justify-center mt-4 py-4 rounded-xl bg-white/10 active:bg-white/20"
                  onPress={handleBiometricLogin}
                  disabled={isAnyLoading}
                >
                  {isBiometricLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <>
                      <BiometricIcon size={24} color="white" />
                      <Text className="text-base font-semibold text-white ml-3">
                        {t('auth.loginWith') || 'Login with'} {biometricLabel}
                      </Text>
                    </>
                  )}
                </Pressable>
              </Animated.View>
            )}
          </Animated.View>

          {/* Footer */}
          <Animated.View
            entering={FadeInUp.delay(500).duration(500)}
            className="items-center"
            style={{ paddingBottom: insets.bottom + 24 }}
          >
            <Text className="text-xs text-teal-200">
              GKBJ Pastoral Care System
            </Text>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
