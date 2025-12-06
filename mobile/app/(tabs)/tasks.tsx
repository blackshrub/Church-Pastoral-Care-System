/**
 * Tasks Screen
 *
 * All tasks view with tabs for filtering
 * Uses NativeWind for styling
 */

import React, { useState, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import {
  CheckSquare,
  Cake,
  Heart,
  Hospital,
  DollarSign,
  Clock,
  AlertTriangle,
  User,
} from 'lucide-react-native';

import { useDashboardReminders, useCompleteTask } from '@/hooks/useDashboard';
import { eventTypeColors, colors } from '@/constants/theme';
import { haptics } from '@/constants/interaction';
import { formatDateToLocalTimezone } from '@/lib/dateUtils';
import type { DashboardTask } from '@/types';

// ============================================================================
// HELPERS
// ============================================================================

function getTaskIcon(type: string) {
  switch (type) {
    case 'birthday':
      return Cake;
    case 'grief_stage':
    case 'grief_loss':
      return Heart;
    case 'accident_followup':
    case 'accident_illness':
      return Hospital;
    case 'financial_aid':
      return DollarSign;
    case 'at_risk':
      return Clock;
    case 'disconnected':
      return AlertTriangle;
    default:
      return CheckSquare;
  }
}

function getTaskColor(type: string) {
  switch (type) {
    case 'birthday':
      return eventTypeColors.birthday;
    case 'grief_stage':
    case 'grief_loss':
      return eventTypeColors.grief_loss;
    case 'accident_followup':
    case 'accident_illness':
      return eventTypeColors.accident_illness;
    case 'financial_aid':
      return eventTypeColors.financial_aid;
    case 'at_risk':
      return colors.status.warning; // Orange/amber for at risk
    case 'disconnected':
      return colors.status.error; // Red for disconnected
    default:
      return colors.primary[500];
  }
}

type TabKey = 'today' | 'upcoming' | 'overdue';

// ============================================================================
// COMPONENTS
// ============================================================================

interface TaskCardProps {
  task: DashboardTask;
  onComplete: () => void;
  onPress: () => void;
}

const TaskCard = memo(function TaskCard({ task, onComplete, onPress }: TaskCardProps) {
  const { t } = useTranslation();
  // Backend uses different fields depending on task source:
  // - upcoming_tasks/today_tasks: has "type" field
  // - birthdays_today/overdue_birthdays: has "event_type" field (from care_events)
  // - grief_today: has "stage" field (from grief_support collection)
  // - accident_followup: has "stage" field (from accident_followups collection)
  // - financial_aid_due: has "aid_type" field (from financial_aid_schedules collection)
  const getTaskType = () => {
    if (task.type) return task.type;
    if ((task as any).event_type) return (task as any).event_type;
    // For grief/accident stages without explicit type, detect from stage or collection fields
    if ((task as any).stage) {
      // Check if it's an accident followup (has specific stage names)
      const stageValue = (task as any).stage;
      if (typeof stageValue === 'string' &&
          (stageValue.includes('followup') || stageValue === 'first_followup' ||
           stageValue === 'second_followup' || stageValue === 'final_followup')) {
        return 'accident_followup';
      }
      // Otherwise it's grief support
      return 'grief_stage';
    }
    // For financial aid schedules
    if ((task as any).aid_type || (task as any).aid_amount !== undefined) {
      return 'financial_aid';
    }
    return '';
  };
  const taskType = getTaskType();
  const Icon = getTaskIcon(taskType);
  const color = getTaskColor(taskType);

  // Determine the type label based on task type
  const getTypeLabel = () => {
    switch (taskType) {
      case 'birthday':
        return t('tasks.types.birthday', 'Birthday');
      case 'grief_stage':
      case 'grief_loss':
        return t('tasks.types.grief', 'Grief Support');
      case 'accident_followup':
      case 'accident_illness':
        return t('tasks.types.accident', 'Accident/Illness');
      case 'financial_aid':
        return t('tasks.types.financial_aid', 'Financial Aid');
      case 'at_risk':
        return t('tasks.types.at_risk', 'At Risk');
      case 'disconnected':
        return t('tasks.types.disconnected', 'Disconnected');
      case 'childbirth':
        return t('tasks.types.childbirth', 'Childbirth');
      case 'new_house':
        return t('tasks.types.new_house', 'New House');
      case 'regular_contact':
        return t('tasks.types.regular_contact', 'Regular Contact');
      default:
        return taskType || t('tasks.types.task', 'Task');
    }
  };
  const typeLabel = getTypeLabel();

  return (
    <Pressable
      className="flex-row items-center bg-white rounded-xl p-4 shadow-sm active:opacity-90 active:scale-[0.98]"
      onPress={onPress}
    >
      {/* Profile Photo or Icon */}
      {task.member_photo_url ? (
        <Image
          source={{ uri: task.member_photo_url }}
          className="w-10 h-10 rounded-full"
        />
      ) : (
        <View
          className="w-10 h-10 rounded-full items-center justify-center bg-gray-100"
        >
          <User size={20} color="#9ca3af" />
        </View>
      )}

      <View className="flex-1 ml-3">
        <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
          {task.member_name}
        </Text>
        <Text className="text-[13px] text-gray-500 mt-0.5">
          {typeLabel}
          {task.stage && ` - ${task.stage}`}
        </Text>
        {task.scheduled_date && (
          <Text className="text-xs text-gray-400 mt-0.5">
            {formatDateToLocalTimezone(task.scheduled_date, 'short')}
          </Text>
        )}
        {task.days_since_last_contact !== undefined && task.days_since_last_contact > 0 && (
          <Text className="text-xs text-gray-400 mt-0.5">
            {t('members.daysSinceContact', { days: task.days_since_last_contact })}
          </Text>
        )}
      </View>

      <Pressable
        className="w-10 h-10 rounded-lg bg-success-50 items-center justify-center active:bg-success-100"
        onPress={(e) => {
          e.stopPropagation();
          haptics.success();
          onComplete();
        }}
      >
        <CheckSquare size={18} color="#22c55e" />
      </Pressable>
    </Pressable>
  );
});

// ============================================================================
// MAIN SCREEN
// ============================================================================

function TasksScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>('today');

  const {
    data: reminders,
    isLoading,
    isRefetching,
    refetch,
  } = useDashboardReminders();

  const completeTask = useCompleteTask();

  // Group tasks by tab
  const todayTasks = useMemo(() => {
    if (!reminders) return [];
    // Use today_tasks if available (unified list from backend)
    // Otherwise fall back to manual combination of individual arrays
    if (reminders.today_tasks && reminders.today_tasks.length > 0) {
      return [
        ...(reminders.birthdays_today || []),
        ...reminders.today_tasks,
      ];
    }
    return [
      ...(reminders.birthdays_today || []),
      ...(reminders.grief_today || []),
      ...(reminders.accident_followup || []),
      ...(reminders.financial_aid_due || []),
    ];
  }, [reminders]);

  const upcomingTasks = useMemo(() => {
    if (!reminders) return [];
    // Use upcoming_tasks which includes ALL upcoming tasks (birthdays, accidents, financial aid)
    // Fall back to upcoming_birthdays for backward compatibility
    return reminders.upcoming_tasks || reminders.upcoming_birthdays || [];
  }, [reminders]);

  const overdueTasks = useMemo(() => {
    if (!reminders) return [];
    return [
      ...(reminders.overdue_birthdays || []),  // Past birthdays not yet completed
      ...(reminders.at_risk_members || []),
      ...(reminders.disconnected_members || []),
    ];
  }, [reminders]);

  // Current tasks based on tab
  const currentTasks = useMemo(() => {
    switch (activeTab) {
      case 'today':
        return todayTasks;
      case 'upcoming':
        return upcomingTasks;
      case 'overdue':
        return overdueTasks;
      default:
        return [];
    }
  }, [activeTab, todayTasks, upcomingTasks, overdueTasks]);

  // Handle task completion
  const handleComplete = useCallback(
    (task: DashboardTask) => {
      const eventId = task.event_id || task.stage_id || task.member_id;
      completeTask.mutate({ eventId, type: task.type });
    },
    [completeTask]
  );

  // Handle task press
  const handleTaskPress = useCallback((task: DashboardTask) => {
    router.push(`/member/${task.member_id}`);
  }, []);

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'today', label: t('tasks.tabs.today'), count: todayTasks.length },
    { key: 'upcoming', label: t('tasks.tabs.upcoming'), count: upcomingTasks.length },
    { key: 'overdue', label: t('tasks.tabs.overdue'), count: overdueTasks.length },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View
        className="bg-white px-6 pb-4 border-b border-gray-200"
        style={{ paddingTop: insets.top + 16 }}
      >
        <Text className="text-3xl font-bold text-gray-900 mb-4">
          {t('tasks.title')}
        </Text>

        {/* Tabs */}
        <View className="flex-row gap-2">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            const isOverdue = tab.key === 'overdue' && tab.count > 0;
            return (
              <Pressable
                key={tab.key}
                className={`flex-row items-center px-4 py-2 rounded-full gap-1 ${
                  isActive ? 'bg-primary-500' : 'bg-gray-100'
                }`}
                onPress={() => {
                  haptics.tap();
                  setActiveTab(tab.key);
                }}
              >
                <Text
                  className={`text-sm font-medium ${
                    isActive ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {tab.label}
                </Text>
                {tab.count > 0 && (
                  <View
                    className={`min-w-5 h-5 rounded-full items-center justify-center px-1.5 ${
                      isOverdue
                        ? 'bg-warning-500'
                        : isActive
                        ? 'bg-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        isOverdue
                          ? 'text-white'
                          : isActive
                          ? 'text-primary-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {tab.count}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#14b8a6" />
        </View>
      ) : (
        <FlashList
          data={currentTasks}
          renderItem={({ item: task, index }) => (
            <View className="mb-3">
              <TaskCard
                task={task}
                onComplete={() => handleComplete(task)}
                onPress={() => handleTaskPress(task)}
              />
            </View>
          )}
          keyExtractor={(task, index) => `${task.type}-${task.member_id}-${index}`}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16 }}
          ListEmptyComponent={
            <View className="items-center py-24">
              <CheckSquare size={48} color="#d1d5db" />
              <Text className="text-base font-semibold text-gray-600 mt-4">
                {t('tasks.emptyState.noTasks')}
              </Text>
              <Text className="text-sm text-gray-400 mt-1">
                {t('tasks.emptyState.noTasksDesc')}
              </Text>
            </View>
          }
          ListFooterComponent={<View className="h-24" />}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#14b8a6"
            />
          }
        />
      )}
    </View>
  );
}

export default memo(TasksScreen);
