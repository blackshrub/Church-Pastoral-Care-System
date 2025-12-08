/**
 * Task Type Constants
 *
 * Shared task type styling and helper functions used across
 * TodayScreen (index.tsx) and TasksScreen (tasks.tsx)
 */

import {
  Cake,
  Heart,
  Hospital,
  DollarSign,
  Baby,
  Home,
  Phone,
  Clock,
  AlertTriangle,
  CheckSquare,
  type LucideIcon,
} from 'lucide-react-native';

import { eventTypeColors, colors } from '@/constants/theme';
import type { DashboardTask, EventType } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

export interface TaskTypeStyle {
  ring: string;
  bg: string;
  text: string;
  color: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Task type styling configuration
 * Used for consistent styling of task cards across screens
 */
export const TASK_TYPE_STYLES: Record<string, TaskTypeStyle> = {
  birthday: {
    ring: 'border-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    color: eventTypeColors.birthday,
  },
  grief_stage: {
    ring: 'border-purple-400',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    color: eventTypeColors.grief_loss,
  },
  grief_loss: {
    ring: 'border-purple-400',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    color: eventTypeColors.grief_loss,
  },
  accident_followup: {
    ring: 'border-teal-400',
    bg: 'bg-teal-50',
    text: 'text-teal-600',
    color: eventTypeColors.accident_illness,
  },
  accident_illness: {
    ring: 'border-teal-400',
    bg: 'bg-teal-50',
    text: 'text-teal-600',
    color: eventTypeColors.accident_illness,
  },
  financial_aid: {
    ring: 'border-violet-400',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    color: eventTypeColors.financial_aid,
  },
  at_risk: {
    ring: 'border-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    color: colors.status.warning,
  },
  disconnected: {
    ring: 'border-red-400',
    bg: 'bg-red-50',
    text: 'text-red-600',
    color: colors.status.error,
  },
  childbirth: {
    ring: 'border-pink-400',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    color: '#ec4899',
  },
  new_house: {
    ring: 'border-emerald-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    color: '#10b981',
  },
  regular_contact: {
    ring: 'border-blue-400',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    color: '#6366f1',
  },
};

const DEFAULT_TASK_STYLE: TaskTypeStyle = {
  ring: 'border-gray-300',
  bg: 'bg-gray-50',
  text: 'text-gray-600',
  color: colors.primary[500],
};

/**
 * Event type configuration for quick add buttons
 */
export const EVENT_TYPE_CONFIG: {
  key: EventType;
  icon: LucideIcon;
  color: string;
  hasGriefRelationship?: boolean;
  hasHospitalName?: boolean;
  hasAidFields?: boolean;
}[] = [
  { key: 'birthday', icon: Cake, color: eventTypeColors.birthday },
  { key: 'childbirth', icon: Baby, color: '#ec4899' },
  { key: 'grief_loss', icon: Heart, color: eventTypeColors.grief_loss, hasGriefRelationship: true },
  { key: 'new_house', icon: Home, color: '#8b5cf6' },
  { key: 'accident_illness', icon: Hospital, color: eventTypeColors.accident_illness, hasHospitalName: true },
  { key: 'financial_aid', icon: DollarSign, color: eventTypeColors.financial_aid, hasAidFields: true },
  { key: 'regular_contact', icon: Phone, color: '#6366f1' },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the appropriate icon for a task type
 */
export function getTaskIcon(type: string): LucideIcon {
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
    case 'childbirth':
      return Baby;
    case 'new_house':
      return Home;
    case 'regular_contact':
      return Phone;
    case 'at_risk':
      return Clock;
    case 'disconnected':
      return AlertTriangle;
    default:
      return CheckSquare;
  }
}

/**
 * Get styling for a task type
 */
export function getTaskStyles(type: string): TaskTypeStyle {
  return TASK_TYPE_STYLES[type] || DEFAULT_TASK_STYLE;
}

/**
 * Get the color for a task type
 */
export function getTaskColor(type: string): string {
  return TASK_TYPE_STYLES[type]?.color || colors.primary[500];
}

/**
 * Determine the task type from various backend fields
 * Backend may return type in different fields depending on the task source
 */
export function getTaskType(task: DashboardTask): string {
  // Direct type field
  if (task.type) return task.type;

  // Event type from care events
  if (task.event_type) return task.event_type;

  // Stage-based detection (grief or accident followup)
  if (task.stage) {
    const stageValue = task.stage;
    if (
      typeof stageValue === 'string' &&
      (stageValue.includes('followup') ||
        stageValue === 'first_followup' ||
        stageValue === 'second_followup' ||
        stageValue === 'final_followup')
    ) {
      return 'accident_followup';
    }
    return 'grief_stage';
  }

  // Financial aid detection
  if (task.aid_type || task.aid_amount !== undefined) {
    return 'financial_aid';
  }

  return '';
}

/**
 * Calculate days until a date
 */
export function getDaysUntil(dateStr: string | undefined): number | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const diffTime = date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if task type is a contact type (at_risk or disconnected)
 */
export function isContactType(taskType: string): boolean {
  return taskType === 'at_risk' || taskType === 'disconnected';
}
