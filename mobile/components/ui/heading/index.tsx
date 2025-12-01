/**
 * Heading Component - Styled heading text
 */

import React from 'react';
import { Text as RNText, TextProps, TextStyle, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

interface Props extends TextProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
}

const SIZE_MAP: Record<string, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
};

export function Heading({ size = 'md', style, className, ...props }: Props) {
  const sizeStyle: TextStyle = {
    fontSize: SIZE_MAP[size] || SIZE_MAP.md,
  };

  // Parse className for common patterns
  const classStyles: TextStyle = {};
  if (className) {
    if (className.includes('text-gray-900')) classStyles.color = colors.gray[900];
    else if (className.includes('text-gray-700')) classStyles.color = colors.gray[700];
    else if (className.includes('text-white')) classStyles.color = colors.white;

    if (className.includes('text-center')) classStyles.textAlign = 'center';
  }

  return (
    <RNText style={[styles.default, sizeStyle, classStyles, style]} {...props} />
  );
}

const styles = StyleSheet.create({
  default: {
    color: colors.gray[900],
    fontWeight: '700',
  },
});

export default Heading;
