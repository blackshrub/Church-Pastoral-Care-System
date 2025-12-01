/**
 * Floating Action Button (FAB)
 *
 * Production-grade FAB with animations and haptic feedback
 * Uses NativeWind for styling
 */

import React, { memo, useCallback } from 'react';
import { Pressable, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '@/constants/theme';
import { haptics } from '@/constants/interaction';

// ============================================================================
// TYPES
// ============================================================================

interface FloatingActionButtonProps {
  icon?: React.ComponentType<any>;
  iconSize?: number;
  iconColor?: string;
  backgroundColor?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  label?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const FloatingActionButton = memo(function FloatingActionButton({
  icon: Icon = Plus,
  iconSize,
  iconColor = 'white',
  backgroundColor = colors.primary[500],
  size = 'md',
  position = 'bottom-right',
  onPress,
  disabled = false,
  style,
  label,
}: FloatingActionButtonProps) {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);

  // Size configurations
  const sizeConfig = {
    sm: { button: 48, icon: 20, padding: 12 },
    md: { button: 56, icon: 24, padding: 16 },
    lg: { button: 64, icon: 28, padding: 18 },
  };

  const config = sizeConfig[size];
  const finalIconSize = iconSize || config.icon;

  // Position configurations
  const positionStyle = {
    'bottom-right': { right: 20, left: undefined },
    'bottom-center': { alignSelf: 'center' as const, right: undefined, left: undefined },
    'bottom-left': { left: 20, right: undefined },
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Press handlers
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    haptics.tap();
    onPress();
  }, [onPress]);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: insets.bottom + 90, // Account for tab bar
          zIndex: 999,
          ...positionStyle[position],
          ...shadows.lg,
        },
        animatedStyle,
        style,
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          {
            width: config.button,
            height: config.button,
            borderRadius: config.button / 2,
            backgroundColor: disabled ? colors.gray[300] : backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          },
          label && { paddingHorizontal: 20, width: 'auto' },
        ]}
      >
        <Icon size={finalIconSize} color={disabled ? colors.gray[500] : iconColor} />
        {label && (
          <Animated.Text
            style={{
              color: disabled ? colors.gray[500] : iconColor,
              fontSize: 14,
              fontWeight: '600',
              marginLeft: 8,
            }}
          >
            {label}
          </Animated.Text>
        )}
      </Pressable>
    </Animated.View>
  );
});

// ============================================================================
// EXTENDED FAB WITH MENU
// ============================================================================

interface FABMenuItem {
  icon: React.ComponentType<any>;
  label: string;
  onPress: () => void;
  color?: string;
}

interface ExtendedFABProps {
  items: FABMenuItem[];
  mainIcon?: React.ComponentType<any>;
  mainColor?: string;
}

export const ExtendedFAB = memo(function ExtendedFAB({
  items,
  mainIcon: MainIcon = Plus,
  mainColor = colors.primary[500],
}: ExtendedFABProps) {
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = React.useState(false);
  const rotation = useSharedValue(0);
  const menuOpacity = useSharedValue(0);

  const toggleMenu = useCallback(() => {
    haptics.tap();
    setIsOpen((prev) => !prev);
    rotation.value = withSpring(isOpen ? 0 : 45, { damping: 15, stiffness: 200 });
    menuOpacity.value = withSpring(isOpen ? 0 : 1, { damping: 15, stiffness: 200 });
  }, [isOpen, rotation, menuOpacity]);

  const mainIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const menuStyle = useAnimatedStyle(() => ({
    opacity: menuOpacity.value,
    transform: [
      { translateY: interpolate(menuOpacity.value, [0, 1], [20, 0]) },
      { scale: interpolate(menuOpacity.value, [0, 1], [0.8, 1]) },
    ],
  }));

  const handleItemPress = useCallback((item: FABMenuItem) => {
    setIsOpen(false);
    rotation.value = withSpring(0, { damping: 15, stiffness: 200 });
    menuOpacity.value = withSpring(0, { damping: 15, stiffness: 200 });
    item.onPress();
  }, [rotation, menuOpacity]);

  return (
    <>
      {/* Menu Items */}
      {isOpen && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: insets.bottom + 160,
              right: 20,
              zIndex: 998,
            },
            menuStyle,
          ]}
        >
          {items.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => handleItemPress(item)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
                justifyContent: 'flex-end',
              }}
            >
              <Animated.View
                style={{
                  backgroundColor: 'white',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  marginRight: 12,
                  ...shadows.md,
                }}
              >
                <Animated.Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: colors.gray[700],
                  }}
                >
                  {item.label}
                </Animated.Text>
              </Animated.View>
              <Animated.View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: item.color || mainColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...shadows.md,
                }}
              >
                <item.icon size={20} color="white" />
              </Animated.View>
            </Pressable>
          ))}
        </Animated.View>
      )}

      {/* Backdrop */}
      {isOpen && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 997,
          }}
          onPress={toggleMenu}
        />
      )}

      {/* Main FAB */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: insets.bottom + 90,
          right: 20,
          zIndex: 999,
          ...shadows.lg,
        }}
      >
        <Pressable
          onPress={toggleMenu}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: mainColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Animated.View style={mainIconStyle}>
            <MainIcon size={24} color="white" />
          </Animated.View>
        </Pressable>
      </Animated.View>
    </>
  );
});

export default FloatingActionButton;
