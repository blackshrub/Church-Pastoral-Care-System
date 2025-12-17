/**
 * Birthday Section Component
 * Displays today's birthdays or overdue birthdays
 */
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { TaskCard } from './TaskCard';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
const triggerHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
};

export const BirthdaySection = ({
  birthdays = [],
  title = 'Birthdays Today',
  icon = '🎂',
  borderClass = 'card-border-left-amber',
  // Bulk selection props
  selectable = false,
  isSelected,
  onSelectionChange,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  // Track which member IDs are currently being processed to prevent double-clicks
  const [loadingIds, setLoadingIds] = useState(new Set());

  const handleComplete = useCallback(async (memberId) => {
    // Prevent double-click: if already loading, do nothing
    if (loadingIds.has(memberId)) return;

    // Mark as loading
    setLoadingIds(prev => new Set(prev).add(memberId));

    try {
      // Optimistic update - remove from UI immediately
      queryClient.setQueryData(['dashboard'], (old) => {
        if (!old) return old;
        return {
          ...old,
          birthdays_today: old.birthdays_today?.filter(e => e.member_id !== memberId),
          overdue_birthdays: old.overdue_birthdays?.filter(e => e.member_id !== memberId)
        };
      });

      // Use the new member-based endpoint that creates event if needed
      await api.post(`/care-events/birthday/member/${memberId}/complete`);
      toast.success(t('toasts.birthday_completed'));
      // Refetch to get accurate data
      await queryClient.invalidateQueries(['dashboard']);
    } catch (_error) {
      toast.error(t('toasts.failed_complete'));
      // Revert optimistic update on error
      queryClient.invalidateQueries(['dashboard']);
    } finally {
      // Remove from loading state
      setLoadingIds(prev => {
        const next = new Set(prev);
        next.delete(memberId);
        return next;
      });
    }
  }, [loadingIds, queryClient, t]);

  if (birthdays.length === 0) return null;

  const config = {
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    btnClass: 'bg-amber-500 hover:bg-amber-600',
    ringClass: 'ring-amber-400'
  };

  return (
    <Card className={borderClass}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          {icon} {title} ({birthdays.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {birthdays.map(event => (
            <TaskCard
              key={event.member_id}
              event={event}
              config={config}
              onComplete={() => handleComplete(event.member_id)}
              isLoading={loadingIds.has(event.member_id)}
              actionLabel={t('mark_complete')}
              completedLabel={t('completed')}
              contactLabel={t('contact_whatsapp')}
              triggerHaptic={triggerHaptic}
              selectable={selectable}
              selected={isSelected ? isSelected(event.member_id) : false}
              onSelectionChange={onSelectionChange}
            >
              {event.completed
                ? "✅ Birthday contact completed"
                : t('labels.call_wish_birthday')}
              {event.member_age && (
                <span className="ml-2 text-xs">• {event.member_age} years old</span>
              )}
            </TaskCard>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BirthdaySection;
