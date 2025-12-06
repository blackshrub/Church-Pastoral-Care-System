/**
 * Date Utilities for FaithTracker Mobile
 * Centralized date formatting with local timezone support
 *
 * Ported from frontend/src/lib/dateUtils.js for consistency
 */

// Get timezone from environment variable, or default to Asia/Jakarta
const APP_TIMEZONE = process.env.EXPO_PUBLIC_TIMEZONE || 'Asia/Jakarta';

/**
 * Parse a timestamp that may or may not have timezone indicator
 * Backend stores timestamps in UTC but may not include 'Z' suffix
 * @param timestamp - Timestamp to parse
 * @param isDateOnly - If true, parse as local date (no timezone conversion)
 * @returns Parsed Date object or null if invalid
 */
export function parseUTCTimestamp(
  timestamp: string | Date | null | undefined,
  isDateOnly = false
): Date | null {
  if (!timestamp) return null;

  // If already a Date object, return it
  if (timestamp instanceof Date) return timestamp;

  // Convert to string if needed
  let ts = String(timestamp);

  // Check if this is a date-only string (YYYY-MM-DD format, no time component)
  const isDateOnlyString = /^\d{4}-\d{2}-\d{2}$/.test(ts);

  if (isDateOnly || isDateOnlyString) {
    // For date-only values, parse as local date to avoid timezone shift
    // This ensures "2024-12-03" displays as "Dec 03" regardless of timezone
    const [year, month, day] = ts.split('T')[0].split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  }

  // For full timestamps, assume UTC if no timezone indicator
  if (!ts.endsWith('Z') && !ts.match(/[+-]\d{2}:\d{2}$/)) {
    ts = ts + 'Z';
  }

  const date = new Date(ts);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Format a timestamp to local timezone with full date and time
 * @param timestamp - Timestamp to format
 * @returns Formatted date string or '-' if invalid
 */
export function formatToLocalTimezone(
  timestamp: string | Date | null | undefined
): string {
  const date = parseUTCTimestamp(timestamp);
  if (!date) return '-';

  return date.toLocaleString('id-ID', {
    timeZone: APP_TIMEZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Format a timestamp to local timezone with date only
 * @param timestamp - Timestamp to format
 * @param style - 'short' (dd MMM), 'medium' (dd MMM yyyy), 'long' (dd MMMM yyyy)
 * @returns Formatted date string or '-' if invalid
 */
export function formatDateToLocalTimezone(
  timestamp: string | Date | null | undefined,
  style: 'short' | 'medium' | 'long' = 'medium'
): string {
  const date = parseUTCTimestamp(timestamp);
  if (!date) return '-';

  const options: Intl.DateTimeFormatOptions = {
    timeZone: APP_TIMEZONE,
    day: 'numeric',
  };

  switch (style) {
    case 'short':
      options.month = 'short';
      break;
    case 'long':
      options.month = 'long';
      options.year = 'numeric';
      break;
    case 'medium':
    default:
      options.month = 'short';
      options.year = 'numeric';
      break;
  }

  return date.toLocaleDateString('id-ID', options);
}

/**
 * Format a timestamp to local timezone with time only
 * @param timestamp - Timestamp to format
 * @param includeSeconds - Whether to include seconds
 * @returns Formatted time string or '-' if invalid
 */
export function formatTimeToLocalTimezone(
  timestamp: string | Date | null | undefined,
  includeSeconds = false
): string {
  const date = parseUTCTimestamp(timestamp);
  if (!date) return '-';

  const options: Intl.DateTimeFormatOptions = {
    timeZone: APP_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  if (includeSeconds) {
    options.second = '2-digit';
  }

  return date.toLocaleTimeString('id-ID', options);
}

/**
 * Safe date formatter
 * Handles invalid dates gracefully
 * @param dateStr - Date to format
 * @param formatStyle - Format style: 'short', 'medium', 'long'
 * @returns Formatted date string or original input if invalid
 */
export function formatDate(
  dateStr: string | Date | null | undefined,
  formatStyle: 'short' | 'medium' | 'long' = 'medium'
): string {
  try {
    const date = parseUTCTimestamp(dateStr);
    if (!date) return dateStr?.toString() || '-';
    return formatDateToLocalTimezone(date, formatStyle);
  } catch {
    return dateStr?.toString() || '-';
  }
}

/**
 * Get current date in local timezone as ISO string (YYYY-MM-DD)
 * @returns Current date in local timezone
 */
export function getTodayLocal(): string {
  const now = new Date();
  // Format to local timezone and extract date part
  // Using 'sv-SE' locale as it returns YYYY-MM-DD format
  const localDate = now.toLocaleDateString('sv-SE', { timeZone: APP_TIMEZONE });
  return localDate;
}

/**
 * Format relative time (e.g., "2 days ago", "in 3 hours")
 * @param timestamp - Timestamp to format
 * @returns Relative time string
 */
export function formatRelativeTime(
  timestamp: string | Date | null | undefined
): string {
  const date = parseUTCTimestamp(timestamp);
  if (!date) return '-';

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hari ini';
  if (diffDays === 1) return 'Besok';
  if (diffDays === -1) return 'Kemarin';
  if (diffDays > 0) return `${diffDays} hari lagi`;
  return `${Math.abs(diffDays)} hari lalu`;
}

/**
 * Check if a date is today
 * @param timestamp - Timestamp to check
 * @returns True if the date is today
 */
export function isToday(timestamp: string | Date | null | undefined): boolean {
  const date = parseUTCTimestamp(timestamp);
  if (!date) return false;

  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is in the past
 * @param timestamp - Timestamp to check
 * @returns True if the date is before today
 */
export function isPast(timestamp: string | Date | null | undefined): boolean {
  const date = parseUTCTimestamp(timestamp);
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Calculate age from birth date
 * @param birthDate - Birth date string (YYYY-MM-DD)
 * @returns Age in years or null if invalid
 */
export function calculateAge(birthDate: string | null | undefined): number | null {
  if (!birthDate) return null;

  const date = parseUTCTimestamp(birthDate, true);
  if (!date) return null;

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }

  return age;
}

/**
 * Format age as a readable string
 * @param birthDate - Birth date string
 * @returns Age string like "34 tahun" or "-" if invalid
 */
export function formatAge(birthDate: string | null | undefined): string {
  const age = calculateAge(birthDate);
  if (age === null) return '-';
  return `${age} tahun`;
}

// Aliases for backward compatibility
export const formatToJakarta = formatToLocalTimezone;
export const formatDateToJakarta = formatDateToLocalTimezone;
export const formatTimeToJakarta = formatTimeToLocalTimezone;
export const getTodayInJakarta = getTodayLocal;

export default {
  parseUTCTimestamp,
  formatToLocalTimezone,
  formatDateToLocalTimezone,
  formatTimeToLocalTimezone,
  formatDate,
  getTodayLocal,
  formatRelativeTime,
  isToday,
  isPast,
  calculateAge,
  formatAge,
  // Aliases
  formatToJakarta,
  formatDateToJakarta,
  formatTimeToJakarta,
  getTodayInJakarta,
};
