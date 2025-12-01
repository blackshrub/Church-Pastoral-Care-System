/**
 * Empty State Components
 *
 * Beautiful empty states with illustrations for better UX
 * Uses NativeWind for styling
 */

import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import {
  Users,
  Calendar,
  CheckSquare,
  Search,
  WifiOff,
  AlertTriangle,
  Inbox,
  Heart,
  FileText,
  Bell,
} from 'lucide-react-native';
import { colors } from '@/constants/theme';

// ============================================================================
// TYPES
// ============================================================================

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<any>;
  iconColor?: string;
  actionLabel?: string;
  onAction?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

// ============================================================================
// BASE COMPONENT
// ============================================================================

export const EmptyState = memo(function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  iconColor = colors.gray[300],
  actionLabel,
  onAction,
  size = 'md',
}: EmptyStateProps) {
  const iconSize = size === 'lg' ? 64 : size === 'md' ? 48 : 32;
  const titleSize = size === 'lg' ? 'text-xl' : size === 'md' ? 'text-lg' : 'text-base';
  const descSize = size === 'lg' ? 'text-base' : size === 'md' ? 'text-sm' : 'text-xs';
  const padding = size === 'lg' ? 'py-16' : size === 'md' ? 'py-12' : 'py-8';

  return (
    <Animated.View
      entering={FadeInUp.duration(400).springify()}
      className={`items-center justify-center ${padding}`}
    >
      {/* Decorative background circle */}
      <View className="relative mb-5">
        <View
          className="w-24 h-24 rounded-full items-center justify-center"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon size={iconSize} color={iconColor} strokeWidth={1.5} />
        </View>
        {/* Decorative dots */}
        <View
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
          style={{ backgroundColor: `${iconColor}30` }}
        />
        <View
          className="absolute -bottom-1 -left-2 w-2 h-2 rounded-full"
          style={{ backgroundColor: `${iconColor}20` }}
        />
      </View>

      <Text className={`${titleSize} font-semibold text-gray-700 text-center mb-2`}>
        {title}
      </Text>

      {description && (
        <Text className={`${descSize} text-gray-400 text-center max-w-[280px] leading-relaxed`}>
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <Pressable
          className="mt-6 px-6 py-3 bg-primary-500 rounded-xl active:bg-primary-600"
          onPress={onAction}
        >
          <Text className="text-sm font-semibold text-white">{actionLabel}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
});

// ============================================================================
// PRESET EMPTY STATES
// ============================================================================

interface PresetEmptyStateProps {
  onAction?: () => void;
}

/**
 * No members found
 */
export const EmptyMembers = memo(function EmptyMembers({ onAction }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={Users}
      iconColor={colors.primary[400]}
      title="No members found"
      description="Add your first church member to get started with pastoral care management."
      actionLabel={onAction ? "Add Member" : undefined}
      onAction={onAction}
    />
  );
});

/**
 * No search results
 */
export const EmptySearch = memo(function EmptySearch() {
  return (
    <EmptyState
      icon={Search}
      iconColor={colors.gray[400]}
      title="No results found"
      description="Try adjusting your search or filters to find what you're looking for."
      size="sm"
    />
  );
});

/**
 * No tasks
 */
export const EmptyTasks = memo(function EmptyTasks() {
  return (
    <EmptyState
      icon={CheckSquare}
      iconColor={colors.success[400]}
      title="All caught up!"
      description="You have no pending tasks. Great job staying on top of your pastoral care duties."
    />
  );
});

/**
 * No care events
 */
export const EmptyCareEvents = memo(function EmptyCareEvents({ onAction }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={Heart}
      iconColor={colors.error[300]}
      title="No care events yet"
      description="Create a care event to track birthdays, grief support, hospital visits, and more."
      actionLabel={onAction ? "Add Care Event" : undefined}
      onAction={onAction}
    />
  );
});

/**
 * No timeline events
 */
export const EmptyTimeline = memo(function EmptyTimeline({ onAction }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={Calendar}
      iconColor={colors.secondary[400]}
      title="No events in timeline"
      description="This member doesn't have any care events recorded yet."
      actionLabel={onAction ? "Add Event" : undefined}
      onAction={onAction}
      size="sm"
    />
  );
});

/**
 * Offline state
 */
export const EmptyOffline = memo(function EmptyOffline({ onAction }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={WifiOff}
      iconColor={colors.warning[400]}
      title="You're offline"
      description="Please check your internet connection to load the latest data."
      actionLabel={onAction ? "Retry" : undefined}
      onAction={onAction}
    />
  );
});

/**
 * Error state
 */
export const EmptyError = memo(function EmptyError({ onAction }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={AlertTriangle}
      iconColor={colors.error[400]}
      title="Something went wrong"
      description="We couldn't load the data. Please try again or contact support if the problem persists."
      actionLabel={onAction ? "Try Again" : undefined}
      onAction={onAction}
    />
  );
});

/**
 * No notifications
 */
export const EmptyNotifications = memo(function EmptyNotifications() {
  return (
    <EmptyState
      icon={Bell}
      iconColor={colors.gray[400]}
      title="No notifications"
      description="You're all caught up! We'll notify you when there's something new."
      size="sm"
    />
  );
});

/**
 * No notes
 */
export const EmptyNotes = memo(function EmptyNotes({ onAction }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={FileText}
      iconColor={colors.gray[400]}
      title="No notes yet"
      description="Add notes to keep track of important information about this member."
      actionLabel={onAction ? "Add Note" : undefined}
      onAction={onAction}
      size="sm"
    />
  );
});

export default {
  EmptyState,
  EmptyMembers,
  EmptySearch,
  EmptyTasks,
  EmptyCareEvents,
  EmptyTimeline,
  EmptyOffline,
  EmptyError,
  EmptyNotifications,
  EmptyNotes,
};
