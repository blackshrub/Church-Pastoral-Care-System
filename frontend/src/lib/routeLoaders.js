/**
 * Route Loaders for React Router v7
 *
 * These loaders prefetch data in parallel with component loading,
 * reducing Time-to-Interactive (TTI) significantly.
 *
 * TanStack Query is still used for caching - loaders just prime the cache.
 *
 * IMPORTANT: Loaders are defensive - they catch all errors and return null
 * to prevent blocking navigation when user is not authenticated.
 */

import { QueryClient } from '@tanstack/react-query';
import api from './api';

// Shared query client for prefetching
let queryClient = null;

export const setQueryClient = (client) => {
  queryClient = client;
};

/**
 * Check if user is authenticated (has valid token)
 */
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Safe prefetch wrapper - catches all errors to prevent blocking navigation
 */
const safePrefetch = async (queryKey, queryFn, options = {}) => {
  if (!queryClient || !isAuthenticated()) return;

  try {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: options.staleTime || 1000 * 30,
    });
  } catch (error) {
    // Silently fail - component will fetch data anyway
    console.debug(`Prefetch failed for ${queryKey.join('/')}:`, error.message);
  }
};

/**
 * Dashboard loader - prefetches reminders and members
 */
export const dashboardLoader = async () => {
  if (!isAuthenticated()) return null;

  // Prefetch in parallel - these match Dashboard.jsx actual API calls
  await Promise.allSettled([
    safePrefetch(
      ['dashboard-reminders'],
      () => api.get('/dashboard/reminders').then(res => res.data),
      { staleTime: 1000 * 30 }
    ),
    safePrefetch(
      ['members-list'],
      () => api.get('/members?limit=1000').then(res => res.data),
      { staleTime: 1000 * 60 }
    ),
  ]);

  return null;
};

/**
 * Members list loader - prefetches member list
 */
export const membersLoader = async () => {
  if (!isAuthenticated()) return null;

  await safePrefetch(
    ['members', { page: 1, limit: 50 }],
    () => api.get('/members?page=1&limit=50').then(res => res.data),
    { staleTime: 1000 * 30 }
  );

  return null;
};

/**
 * Member detail loader - prefetches member data
 * NOTE: Using different query keys to avoid conflicting with component's combined query
 */
export const memberDetailLoader = async ({ params }) => {
  // Always return null - never throw, never block
  try {
    if (!isAuthenticated() || !params?.id) return null;

    // Prefetch individual data that the component might use
    // Use unique query keys that don't conflict with the component's main query
    await Promise.allSettled([
      safePrefetch(
        ['member-prefetch', params.id],
        () => api.get(`/members/${params.id}`).then(res => res.data),
        { staleTime: 1000 * 30 }
      ),
      safePrefetch(
        ['care-events-prefetch', params.id],
        () => api.get(`/care-events?member_id=${params.id}`).then(res => res.data),
        { staleTime: 1000 * 30 }
      ),
    ]);
  } catch (error) {
    console.debug('Member detail loader error:', error);
  }

  return null;
};

/**
 * Analytics loader - prefetches analytics dashboard data
 */
export const analyticsLoader = async () => {
  if (!isAuthenticated()) return null;

  // Prefetch with default time_range='all' to match component's initial state
  await safePrefetch(
    ['analytics-dashboard', 'all', '', ''],
    () => api.get('/analytics/dashboard?time_range=all').then(res => res.data),
    { staleTime: 1000 * 60 * 5 }
  );

  return null;
};

/**
 * Financial aid loader - prefetches all financial aid data in parallel
 */
export const financialAidLoader = async () => {
  if (!isAuthenticated()) return null;

  await safePrefetch(
    ['financial-aid-data'],
    async () => {
      const [summaryRes, eventsRes, membersRes] = await Promise.all([
        api.get('/financial-aid/summary'),
        api.get('/care-events?event_type=financial_aid'),
        api.get('/members?limit=1000')
      ]);

      const memberMap = {};
      membersRes.data.forEach(m => memberMap[m.id] = {
        name: m.name,
        photo_url: m.photo_url
      });

      const eventsWithPhotos = eventsRes.data.map(event => ({
        ...event,
        member_photo_url: memberMap[event.member_id]?.photo_url
      }));

      return {
        summary: summaryRes.data,
        aidEvents: eventsWithPhotos
      };
    },
    { staleTime: 1000 * 60 * 2 }
  );

  return null;
};

/**
 * Admin loader - prefetches users and campuses together
 */
export const adminLoader = async () => {
  if (!isAuthenticated()) return null;

  await safePrefetch(
    ['admin-data'],
    async () => {
      const [c, u] = await Promise.all([api.get('/campuses'), api.get('/users')]);
      return { campuses: c.data, users: u.data };
    },
    { staleTime: 1000 * 60 }
  );

  return null;
};

/**
 * Activity log loader - prefetches with default filter values
 */
export const activityLogLoader = async () => {
  if (!isAuthenticated()) return null;

  // Calculate default date range (30 days ago to today)
  const endDate = new Date().toISOString().split('T')[0];
  const startDateObj = new Date();
  startDateObj.setDate(startDateObj.getDate() - 30);
  const startDate = startDateObj.toISOString().split('T')[0];

  await Promise.allSettled([
    safePrefetch(
      ['activity-logs', 'all', 'all', startDate, endDate],
      async () => {
        const params = new URLSearchParams();
        params.append('start_date', new Date(startDate).toISOString());
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        params.append('end_date', endDateTime.toISOString());
        params.append('limit', '200');
        const response = await api.get(`/activity-logs?${params.toString()}`);
        return response.data;
      },
      { staleTime: 1000 * 30 }
    ),
    safePrefetch(
      ['activity-logs-summary'],
      () => api.get('/activity-logs/summary').then(res => res.data),
      { staleTime: 1000 * 60 }
    ),
    safePrefetch(
      ['users-list'],
      () => api.get('/users').then(res => res.data),
      { staleTime: 1000 * 60 * 5 }
    ),
  ]);

  return null;
};

/**
 * Calendar loader - prefetches care events
 */
export const calendarLoader = async () => {
  if (!isAuthenticated()) return null;

  await safePrefetch(
    ['calendar-events'],
    () => api.get('/care-events?limit=2000').then(res => res.data),
    { staleTime: 1000 * 60 * 2 }
  );

  return null;
};

/**
 * Reports loader - prefetches all three report endpoints in parallel
 */
export const reportsLoader = async () => {
  if (!isAuthenticated()) return null;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  await Promise.allSettled([
    safePrefetch(
      ['monthly-report', year, month],
      () => api.get(`/reports/monthly?year=${year}&month=${month}`).then(res => res.data),
      { staleTime: 1000 * 60 * 5 }
    ),
    safePrefetch(
      ['staff-performance', year, month],
      () => api.get(`/reports/staff-performance?year=${year}&month=${month}`).then(res => res.data),
      { staleTime: 1000 * 60 * 5 }
    ),
    safePrefetch(
      ['yearly-summary', year],
      () => api.get(`/reports/yearly-summary?year=${year}`).then(res => res.data),
      { staleTime: 1000 * 60 * 5 }
    ),
  ]);

  return null;
};
