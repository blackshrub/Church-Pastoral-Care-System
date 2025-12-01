/**
 * Text Component - Simple wrapper for React Native Text
 */

import React from 'react';
import { Text as RNText, TextProps, TextStyle, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

interface Props extends TextProps {
  className?: string;
}

export function Text({ style, className, ...props }: Props) {
  // Parse className for common patterns
  const classStyles: TextStyle = {};

  if (className) {
    if (className.includes('text-gray-900')) classStyles.color = colors.gray[900];
    else if (className.includes('text-gray-700')) classStyles.color = colors.gray[700];
    else if (className.includes('text-gray-600')) classStyles.color = colors.gray[600];
    else if (className.includes('text-gray-500')) classStyles.color = colors.gray[500];
    else if (className.includes('text-gray-400')) classStyles.color = colors.gray[400];
    else if (className.includes('text-white')) classStyles.color = colors.white;
    else if (className.includes('text-primary-600')) classStyles.color = colors.primary[600];
    else if (className.includes('text-primary-500')) classStyles.color = colors.primary[500];
    else if (className.includes('text-success-600')) classStyles.color = colors.success[600];
    else if (className.includes('text-error-500')) classStyles.color = colors.error[500];

    if (className.includes('font-bold')) classStyles.fontWeight = '700';
    else if (className.includes('font-semibold')) classStyles.fontWeight = '600';
    else if (className.includes('font-medium')) classStyles.fontWeight = '500';

    if (className.includes('text-xs')) classStyles.fontSize = 12;
    else if (className.includes('text-sm')) classStyles.fontSize = 14;
    else if (className.includes('text-base')) classStyles.fontSize = 16;
    else if (className.includes('text-lg')) classStyles.fontSize = 18;
    else if (className.includes('text-xl')) classStyles.fontSize = 20;
    else if (className.includes('text-2xl')) classStyles.fontSize = 24;

    if (className.includes('text-center')) classStyles.textAlign = 'center';
    if (className.includes('mt-1')) classStyles.marginTop = 4;
    if (className.includes('mt-2')) classStyles.marginTop = 8;
    if (className.includes('px-4')) {
      classStyles.paddingLeft = 16;
      classStyles.paddingRight = 16;
    }
  }

  return <RNText style={[styles.default, classStyles, style]} {...props} />;
}

const styles = StyleSheet.create({
  default: {
    color: colors.gray[900],
    fontSize: 14,
  },
});

export default Text;
