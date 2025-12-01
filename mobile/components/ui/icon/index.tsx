/**
 * Icon Component - Wrapper for Lucide icons
 */

import React from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors } from '@/constants/theme';

interface Props {
  as: LucideIcon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: ViewStyle & { color?: string };
  color?: string;
}

const SIZE_MAP: Record<string, number> = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 28,
  xl: 36,
};

export function Icon({ as: IconComponent, size = 'md', className, style, color: colorProp }: Props) {
  const iconSize = SIZE_MAP[size] || SIZE_MAP.md;

  // Priority: colorProp > style.color > className > default
  const styleColor = (style as any)?.color;
  let color = colorProp || styleColor || colors.gray[600];

  if (!colorProp && !styleColor && className) {
    if (className.includes('text-gray-900')) color = colors.gray[900];
    else if (className.includes('text-gray-700')) color = colors.gray[700];
    else if (className.includes('text-gray-600')) color = colors.gray[600];
    else if (className.includes('text-gray-500')) color = colors.gray[500];
    else if (className.includes('text-gray-400')) color = colors.gray[400];
    else if (className.includes('text-white')) color = colors.white;
    else if (className.includes('text-primary-600')) color = colors.primary[600];
    else if (className.includes('text-primary-500')) color = colors.primary[500];
    else if (className.includes('text-success-600')) color = colors.success[600];
    else if (className.includes('text-error-500')) color = colors.error[500];
    else if (className.includes('text-warning-500')) color = colors.warning[500];
  }

  // Extract margins from className and filter out color from style
  const marginStyle: ViewStyle = {};
  if (className) {
    if (className.includes('mr-2')) marginStyle.marginRight = 8;
    if (className.includes('ml-2')) marginStyle.marginLeft = 8;
  }

  // Remove color from style to avoid passing to SVG component
  const { color: _, ...restStyle } = (style || {}) as any;

  return (
    <IconComponent
      size={iconSize}
      color={color}
      style={[marginStyle, restStyle]}
    />
  );
}

export default Icon;
