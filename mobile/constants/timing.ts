/**
 * Timing Constants
 *
 * Centralized timing values for animations, delays, and intervals
 */

// ============================================================================
// ANIMATION DURATIONS
// ============================================================================

/** Standard animation duration for modals and transitions */
export const ANIMATION_DURATION = 300;

/** Fast animation for micro-interactions */
export const ANIMATION_DURATION_FAST = 150;

/** Slow animation for emphasis */
export const ANIMATION_DURATION_SLOW = 500;

/** Skeleton shimmer animation duration */
export const SKELETON_ANIMATION_DURATION = 1500;

// ============================================================================
// DEBOUNCE & THROTTLE
// ============================================================================

/** Search input debounce delay */
export const DEBOUNCE_DELAY = 500;

/** Fast debounce for immediate feedback */
export const DEBOUNCE_DELAY_FAST = 200;

/** Query persistence throttle */
export const QUERY_PERSIST_THROTTLE = 1000;

// ============================================================================
// NETWORK & SYNC
// ============================================================================

/** SSE initial reconnect delay */
export const SSE_RECONNECT_INITIAL = 1000;

/** SSE maximum reconnect delay */
export const SSE_RECONNECT_MAX = 30000;

/** API request timeout */
export const API_TIMEOUT = 30000;

/** API upload timeout (longer for files) */
export const API_UPLOAD_TIMEOUT = 120000;

// ============================================================================
// LIMITS & COUNTS
// ============================================================================

/** Maximum activities in activity feed */
export const MAX_ACTIVITIES = 50;

/** Members per page for pagination */
export const MEMBERS_PER_PAGE = 20;

/** Maximum retry attempts for API requests */
export const MAX_RETRY_ATTEMPTS = 3;

// ============================================================================
// UI LAYOUT
// ============================================================================

/** Tab bar height */
export const TAB_BAR_HEIGHT = 65;

/** FAB bottom offset from tab bar */
export const FAB_BOTTOM_OFFSET = 90;

/** Minimum touch target size (WCAG AA) */
export const MIN_TOUCH_TARGET = 44;

/** Comfortable touch target size */
export const COMFORTABLE_TOUCH_TARGET = 56;

// ============================================================================
// CACHE & STALE TIMES
// ============================================================================

/** Query stale time (2 minutes) */
export const QUERY_STALE_TIME = 2 * 60 * 1000;

/** Query cache time (24 hours) */
export const QUERY_CACHE_TIME = 24 * 60 * 60 * 1000;

/** Cache max age for persistence (7 days) */
export const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
