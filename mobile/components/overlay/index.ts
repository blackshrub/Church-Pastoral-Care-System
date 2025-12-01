/**
 * Overlay Components - FaithTracker Overlay System
 *
 * Central exports for the overlay system.
 *
 * API:
 * - useOverlay() - Main hook for showing/dismissing overlays
 * - UnifiedOverlayHost - Root-level component that renders all overlays
 *
 * Usage:
 * const { showCenterModal, showBottomSheet, close } = useOverlay();
 * showCenterModal(MyComponent, { prop1: 'value' });
 * showBottomSheet(MySheet, { data: someData });
 * close(); // dismiss current overlay
 */

// =============================================================================
// UNIFIED OVERLAY SYSTEM
// =============================================================================

export { UnifiedOverlayHost } from './UnifiedOverlayHost';
export { BaseBottomSheet } from './BaseBottomSheet';
export { SharedAxisModal } from './SharedAxisModal';

// Re-export store and hooks
export {
  useOverlay,
  useOverlayStore,
} from '@/stores/overlayStore';

export type {
  OverlayType,
  OverlayConfig,
  OverlayComponentProps,
  // FaithTracker-specific payload types
  CreateCareEventPayload,
  EventTypeSelectorPayload,
  GriefRelationshipPayload,
  AidTypePayload,
  ConfirmationPayload,
} from '@/stores/overlayStore';
