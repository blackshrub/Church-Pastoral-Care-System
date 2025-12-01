/**
 * Event Type Selector Sheet
 *
 * Bottom sheet for selecting care event type
 * Uses NativeWind for styling
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Cake,
  Heart,
  Hospital,
  DollarSign,
  Phone,
  Baby,
  Home,
  X,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { eventTypeColors } from '@/constants/theme';
import type { EventType } from '@/constants/api';
import type { EventTypeSelectorPayload, OverlayComponentProps } from '@/stores/overlayStore';

const EVENT_TYPE_CONFIG: Record<EventType, { icon: any; color: string }> = {
  birthday: { icon: Cake, color: eventTypeColors.birthday },
  grief_loss: { icon: Heart, color: eventTypeColors.grief_loss },
  accident_illness: { icon: Hospital, color: eventTypeColors.accident_illness },
  financial_aid: { icon: DollarSign, color: eventTypeColors.financial_aid },
  regular_contact: { icon: Phone, color: eventTypeColors.regular_contact },
  childbirth: { icon: Baby, color: eventTypeColors.childbirth },
  new_house: { icon: Home, color: eventTypeColors.new_house },
};

const EVENT_TYPES: EventType[] = [
  'birthday',
  'grief_loss',
  'accident_illness',
  'financial_aid',
  'regular_contact',
  'childbirth',
  'new_house',
];

export function EventTypeSelector({
  payload,
  onClose,
}: OverlayComponentProps<EventTypeSelectorPayload>) {
  const { t } = useTranslation();

  const handleSelect = useCallback(
    (type: EventType) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      payload?.onSelect(type);
      onClose();
    },
    [payload, onClose]
  );

  return (
    <View className="bg-white rounded-t-[20px] pb-10">
      {/* Handle bar */}
      <View className="items-center pt-3 pb-2">
        <View className="w-9 h-1 bg-gray-300 rounded-full" />
      </View>

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-900">
          {t('careEvents.selectType', 'Select Event Type')}
        </Text>
        <Pressable
          onPress={onClose}
          className="p-2"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={22} color="#9ca3af" />
        </Pressable>
      </View>

      {/* Event type grid */}
      <View className="flex-row flex-wrap px-4 pt-5">
        {EVENT_TYPES.map((type) => {
          const config = EVENT_TYPE_CONFIG[type];
          const Icon = config.icon;
          return (
            <Pressable
              key={type}
              onPress={() => handleSelect(type)}
              className="w-1/3 items-center py-4 px-2 active:opacity-70"
            >
              <View
                className="w-14 h-14 rounded-2xl items-center justify-center"
                style={{ backgroundColor: config.color + '15' }}
              >
                <Icon size={28} color={config.color} />
              </View>
              <Text className="text-gray-700 font-medium text-sm text-center mt-2">
                {t(`careEvents.types.${type}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default EventTypeSelector;
