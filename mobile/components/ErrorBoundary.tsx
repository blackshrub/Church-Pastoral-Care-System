/**
 * Error Boundary Component
 *
 * Catches JavaScript errors in child components and displays a fallback UI
 * Production-grade error handling with recovery options
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/theme';

// ============================================================================
// TYPES
// ============================================================================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ============================================================================
// ERROR BOUNDARY CLASS
// ============================================================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Log error to console in development
    if (__DEV__) {
      console.error('Error Boundary caught an error:', error);
      console.error('Error Info:', errorInfo);
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // TODO: Send to error reporting service (Sentry, Bugsnag, etc.)
    // reportError(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    this.handleReset();
    router.replace('/(tabs)');
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          onGoHome={this.handleGoHome}
        />
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// ERROR FALLBACK UI
// ============================================================================

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
  onGoHome: () => void;
}

function ErrorFallback({ error, errorInfo, onReset, onGoHome }: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 py-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-error-100 items-center justify-center mb-4">
            <AlertTriangle size={40} color={colors.error[500]} />
          </View>
          <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
            Oops! Something went wrong
          </Text>
          <Text className="text-base text-gray-500 text-center">
            We're sorry, but something unexpected happened. Please try again.
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="gap-3 mb-8">
          <Pressable
            className="flex-row items-center justify-center h-14 bg-primary-500 rounded-xl active:bg-primary-600"
            onPress={onReset}
          >
            <RefreshCw size={20} color="white" />
            <Text className="text-base font-semibold text-white ml-2">Try Again</Text>
          </Pressable>

          <Pressable
            className="flex-row items-center justify-center h-14 bg-white border border-gray-200 rounded-xl active:bg-gray-50"
            onPress={onGoHome}
          >
            <Home size={20} color={colors.gray[700]} />
            <Text className="text-base font-semibold text-gray-700 ml-2">Go to Home</Text>
          </Pressable>
        </View>

        {/* Error Details (Development) */}
        {__DEV__ && (
          <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <Pressable
              className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100"
              onPress={() => setShowDetails(!showDetails)}
            >
              <View className="flex-row items-center">
                <Bug size={18} color={colors.gray[500]} />
                <Text className="text-sm font-medium text-gray-700 ml-2">
                  Developer Details
                </Text>
              </View>
              <Text className="text-sm text-primary-500">
                {showDetails ? 'Hide' : 'Show'}
              </Text>
            </Pressable>

            {showDetails && (
              <View className="p-4">
                {error && (
                  <View className="mb-4">
                    <Text className="text-xs font-semibold text-gray-500 mb-1 uppercase">
                      Error Message
                    </Text>
                    <View className="bg-error-50 rounded-lg p-3">
                      <Text className="text-sm text-error-700 font-mono">
                        {error.message}
                      </Text>
                    </View>
                  </View>
                )}

                {error?.stack && (
                  <View className="mb-4">
                    <Text className="text-xs font-semibold text-gray-500 mb-1 uppercase">
                      Stack Trace
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="bg-gray-900 rounded-lg p-3"
                    >
                      <Text className="text-xs text-green-400 font-mono">
                        {error.stack}
                      </Text>
                    </ScrollView>
                  </View>
                )}

                {errorInfo?.componentStack && (
                  <View>
                    <Text className="text-xs font-semibold text-gray-500 mb-1 uppercase">
                      Component Stack
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="bg-gray-900 rounded-lg p-3"
                    >
                      <Text className="text-xs text-blue-400 font-mono">
                        {errorInfo.componentStack}
                      </Text>
                    </ScrollView>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Help Text */}
        <View className="mt-8 items-center">
          <Text className="text-sm text-gray-400 text-center">
            If this problem persists, please contact support or try reinstalling the app.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// HOC FOR FUNCTIONAL COMPONENTS
// ============================================================================

export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: { fallback?: ReactNode; onError?: (error: Error, errorInfo: ErrorInfo) => void }
): React.ComponentType<P> {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={options?.fallback} onError={options?.onError}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

export default ErrorBoundary;
