/**
 * HStack Component - Horizontal stack layout
 */

import React from 'react';
import { View, ViewProps, ViewStyle, StyleSheet } from 'react-native';

interface Props extends ViewProps {
  space?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const SPACE_MAP: Record<string, number> = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
};

export function HStack({ space, style, className, children, ...props }: Props) {
  const spaceStyle: ViewStyle = space ? { gap: SPACE_MAP[space] || 0 } : {};

  // Parse className for common patterns
  const classStyles: ViewStyle = {};
  if (className) {
    if (className.includes('flex-1')) classStyles.flex = 1;
    if (className.includes('items-center')) classStyles.alignItems = 'center';
    if (className.includes('justify-between')) classStyles.justifyContent = 'space-between';
    if (className.includes('justify-center')) classStyles.justifyContent = 'center';
    if (className.includes('w-full')) classStyles.width = '100%';
  }

  return (
    <View style={[styles.default, spaceStyle, classStyles, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  default: {
    flexDirection: 'row',
  },
});

export default HStack;
