// components/overlay/UnifiedOverlayHost.tsx
import React, { useCallback } from 'react';
import {
  StyleSheet,
  Pressable,
  View,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useOverlayStore } from '@/stores/overlayStore';
import { BaseBottomSheet } from './BaseBottomSheet';
import { SharedAxisModal } from './SharedAxisModal';
import { ANIMATION_DURATION } from '@/constants/timing';
import { haptics } from '@/constants/interaction';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 100; // Pixels to swipe down before dismissing

export const UnifiedOverlayHost = () => {
  const { type, config, close } = useOverlayStore();
  const Component = config.component;

  // Swipe gesture state
  const translateY = useSharedValue(0);

  const handleClose = useCallback(() => {
    haptics.tap();
    close();
  }, [close]);

  // Pan gesture for swipe-to-dismiss
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow downward swipes
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > SWIPE_THRESHOLD) {
        // Dismiss if swiped past threshold
        translateY.value = withSpring(SCREEN_HEIGHT, { damping: 20 }, () => {
          runOnJS(handleClose)();
        });
      } else {
        // Snap back
        translateY.value = withSpring(0, { damping: 15 });
      }
    });

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Reset translateY when component mounts (new overlay opened)
  React.useEffect(() => {
    translateY.value = 0;
  }, [type, translateY]);

  if (!type || !Component) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Backdrop with synchronized animation */}
      <Animated.View
        entering={FadeIn.duration(ANIMATION_DURATION)}
        exiting={FadeOut.duration(ANIMATION_DURATION)}
        style={StyleSheet.absoluteFill}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
      </Animated.View>

      {type === 'center-modal' && (
        <SharedAxisModal
          visible
          onClose={handleClose}
          {...config.props}
        >
          <Component payload={config.props} onClose={handleClose} />
        </SharedAxisModal>
      )}

      {type === 'bottom-sheet' && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={0}
        >
          <GestureDetector gesture={panGesture}>
            <Animated.View
              entering={SlideInDown.duration(ANIMATION_DURATION).springify().damping(18)}
              exiting={SlideOutDown.duration(ANIMATION_DURATION)}
              style={[styles.bottomSheetWrapper, animatedSheetStyle]}
            >
              <BaseBottomSheet
                visible
                onClose={handleClose}
                {...config.props}
              >
                <Component payload={config.props} onClose={handleClose} />
              </BaseBottomSheet>
            </Animated.View>
          </GestureDetector>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  keyboardAvoidingView: {
    width: '100%',
  },
  bottomSheetWrapper: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});

export default UnifiedOverlayHost;
