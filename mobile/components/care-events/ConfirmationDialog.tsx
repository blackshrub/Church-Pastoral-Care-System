/**
 * Confirmation Dialog
 *
 * Center modal for confirming destructive actions
 * Uses NativeWind for styling
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import type { ConfirmationPayload, OverlayComponentProps } from '@/stores/overlayStore';

export function ConfirmationDialog({
  payload,
  onClose,
}: OverlayComponentProps<ConfirmationPayload>) {
  const { t } = useTranslation();

  const handleConfirm = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    payload?.onConfirm();
    onClose();
  }, [payload, onClose]);

  const handleCancel = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  const isDestructive = payload?.variant === 'destructive';

  return (
    <View className="bg-white rounded-[20px] p-6 mx-6 items-center max-w-[340px]">
      {/* Icon */}
      <View
        className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${
          isDestructive ? 'bg-error-50' : 'bg-warning-50'
        }`}
      >
        <AlertTriangle size={36} color={isDestructive ? '#ef4444' : '#f59e0b'} />
      </View>

      {/* Content */}
      <View className="items-center mb-6">
        <Text className="text-lg font-bold text-gray-900 text-center">
          {payload?.title || t('common.confirm')}
        </Text>
        <Text className="text-gray-500 text-center mt-2 px-4">
          {payload?.message}
        </Text>
      </View>

      {/* Actions */}
      <View className="flex-row w-full gap-3">
        <Pressable
          onPress={handleCancel}
          className="flex-1 py-3.5 rounded-xl bg-gray-100 items-center justify-center active:opacity-80"
        >
          <Text className="text-gray-700 font-semibold text-base">
            {payload?.cancelLabel || t('common.cancel')}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleConfirm}
          className={`flex-1 py-3.5 rounded-xl items-center justify-center active:opacity-80 ${
            isDestructive ? 'bg-error-500' : 'bg-primary-500'
          }`}
        >
          <Text className="text-white font-semibold text-base">
            {payload?.confirmLabel || t('common.confirm')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default ConfirmationDialog;
