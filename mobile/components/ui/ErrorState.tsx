/**
 * ErrorState Component
 *
 * Reusable error state display for failed API requests or other errors
 * Matches the EmptyState design pattern for consistency
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { AlertCircle, RefreshCw, WifiOff, ServerCrash } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { haptics } from '@/constants/interaction';

// ============================================================================
// TYPES
// ============================================================================

export type ErrorType = 'generic' | 'network' | 'server' | 'notFound';

interface ErrorStateProps {
  /** Error title */
  title?: string;
  /** Error message/description */
  message?: string;
  /** Error type for icon selection */
  type?: ErrorType;
  /** Retry callback */
  onRetry?: () => void;
  /** Custom retry button text */
  retryText?: string;
  /** Additional class names */
  className?: string;
}

// ============================================================================
// ICON MAP
// ============================================================================

const ERROR_ICONS: Record<ErrorType, typeof AlertCircle> = {
  generic: AlertCircle,
  network: WifiOff,
  server: ServerCrash,
  notFound: AlertCircle,
};

const ERROR_COLORS: Record<ErrorType, string> = {
  generic: '#ef4444',
  network: '#f59e0b',
  server: '#ef4444',
  notFound: '#6b7280',
};

// ============================================================================
// COMPONENT
// ============================================================================

export function ErrorState({
  title,
  message,
  type = 'generic',
  onRetry,
  retryText,
  className = '',
}: ErrorStateProps) {
  const { t } = useTranslation();

  const Icon = ERROR_ICONS[type];
  const iconColor = ERROR_COLORS[type];

  // Default title and message based on error type
  const defaultTitle = DEFAULT_TITLES[type];
  const defaultMessage = DEFAULT_MESSAGES[type];
  const displayTitle = title || t(defaultTitle.key, defaultTitle.fallback);
  const displayMessage = message || t(defaultMessage.key, defaultMessage.fallback);

  const handleRetry = () => {
    haptics.tap();
    onRetry?.();
  };

  return (
    <View className={`items-center py-10 px-6 ${className}`}>
      {/* Icon */}
      <View
        className="w-16 h-16 rounded-full items-center justify-center mb-4"
        style={{ backgroundColor: `${iconColor}15` }}
      >
        <Icon size={32} color={iconColor} />
      </View>

      {/* Title */}
      <Text className="text-lg font-semibold text-gray-900 dark:text-white text-center">
        {displayTitle}
      </Text>

      {/* Message */}
      {displayMessage && (
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center max-w-[280px]">
          {displayMessage}
        </Text>
      )}

      {/* Retry Button */}
      {onRetry && (
        <Pressable
          onPress={handleRetry}
          className="flex-row items-center mt-5 bg-primary-500 px-5 py-2.5 rounded-xl active:bg-primary-600 active:scale-[0.98]"
        >
          <RefreshCw size={16} color="white" />
          <Text className="text-white font-medium ml-2">
            {retryText || t('common.tryAgain', 'Try Again')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

const DEFAULT_TITLES: Record<ErrorType, { key: string; fallback: string }> = {
  network: { key: 'errors.networkError', fallback: 'No Connection' },
  server: { key: 'errors.serverError', fallback: 'Server Error' },
  notFound: { key: 'errors.notFound', fallback: 'Not Found' },
  generic: { key: 'errors.somethingWentWrong', fallback: 'Something Went Wrong' },
};

const DEFAULT_MESSAGES: Record<ErrorType, { key: string; fallback: string }> = {
  network: { key: 'errors.networkErrorMessage', fallback: 'Please check your internet connection and try again.' },
  server: { key: 'errors.serverErrorMessage', fallback: 'Our servers are having issues. Please try again later.' },
  notFound: { key: 'errors.notFoundMessage', fallback: 'The requested resource could not be found.' },
  generic: { key: 'errors.genericErrorMessage', fallback: 'An unexpected error occurred. Please try again.' },
};

export default ErrorState;
