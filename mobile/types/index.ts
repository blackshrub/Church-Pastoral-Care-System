/**
 * FaithTracker Mobile Type Definitions
 */

import type { EventType, EngagementStatus, UserRole, AidType, GriefRelationship } from '@/constants/api';

// Re-export API types
export type { EventType, EngagementStatus, UserRole, AidType, GriefRelationship } from '@/constants/api';

// ============================================================================
// USER & AUTH
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  campus_id: string;
  campus_name: string;
  phone?: string;
  photo_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  campus_id?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ============================================================================
// MEMBER
// ============================================================================

export interface Member {
  id: string;
  name: string;
  phone?: string;
  campus_id: string;
  photo_url?: string;
  last_contact_date?: string;
  engagement_status: EngagementStatus;
  days_since_last_contact?: number;
  is_archived: boolean;
  archived_at?: string;
  archived_reason?: string;
  external_member_id?: string;
  notes?: string;
  birth_date?: string;
  address?: string;
  category?: string;
  gender?: 'M' | 'F';
  blood_type?: string;
  marital_status?: string;
  membership_status?: string;
  age?: number;
  created_at: string;
  updated_at: string;
}

export interface MemberListItem {
  id: string;
  name: string;
  phone?: string;
  campus_id: string;
  photo_url?: string;
  last_contact_date?: string;
  engagement_status: EngagementStatus;
  days_since_last_contact?: number;
  is_archived: boolean;
  external_member_id?: string;
  age?: number;
  gender?: 'M' | 'F';
  category?: string;
}

export interface CreateMemberRequest {
  name: string;
  phone?: string;
  campus_id: string;
  external_member_id?: string;
  notes?: string;
  birth_date?: string;
  address?: string;
  category?: string;
  gender?: 'M' | 'F';
  blood_type?: string;
  marital_status?: string;
  membership_status?: string;
  age?: number;
}

// ============================================================================
// CARE EVENT
// ============================================================================

export interface CareEvent {
  id: string;
  member_id: string;
  member_name: string;
  campus_id: string;
  event_type: EventType;
  event_date: string;
  title: string;
  description?: string;
  completed: boolean;
  completed_at?: string;
  completed_by_user_id?: string;
  completed_by_user_name?: string;
  ignored: boolean;
  ignored_at?: string;
  ignored_by?: string;
  ignored_by_name?: string;
  created_by_user_id: string;
  created_by_user_name: string;
  created_at: string;
  updated_at: string;
  // Type-specific fields
  grief_relationship?: GriefRelationship;
  hospital_name?: string;
  discharge_date?: string;
  aid_type?: AidType;
  aid_amount?: number;
  aid_notes?: string;
  visitation_logs?: VisitationLog[];
}

export interface CreateCareEventRequest {
  member_id: string;
  campus_id: string;
  event_type: EventType;
  event_date: string;
  title: string;
  description?: string;
  // Type-specific fields
  grief_relationship?: GriefRelationship;
  hospital_name?: string;
  initial_visitation?: {
    visitor_name: string;
    visit_date: string;
    notes?: string;
    prayer_offered?: boolean;
  };
  aid_type?: AidType;
  aid_amount?: number;
  aid_notes?: string;
}

export interface VisitationLog {
  visitor_name: string;
  visit_date: string;
  notes?: string;
  prayer_offered?: boolean;
}

// ============================================================================
// GRIEF SUPPORT
// ============================================================================

export interface GriefStage {
  id: string;
  care_event_id: string;
  member_id: string;
  member_name?: string;
  member_phone?: string;
  member_photo_url?: string;
  campus_id: string;
  stage: string;
  scheduled_date: string;
  completed: boolean;
  completed_at?: string;
  ignored: boolean;
  ignored_at?: string;
  ignored_by?: string;
  notes?: string;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ACCIDENT FOLLOWUP
// ============================================================================

export interface AccidentFollowup {
  id: string;
  care_event_id: string;
  member_id: string;
  member_name?: string;
  member_phone?: string;
  member_photo_url?: string;
  campus_id: string;
  stage: 'first_followup' | 'second_followup' | 'final_followup';
  scheduled_date: string;
  completed: boolean;
  completed_at?: string;
  ignored: boolean;
  ignored_at?: string;
  ignored_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// FINANCIAL AID
// ============================================================================

export interface FinancialAidSchedule {
  id: string;
  member_id: string;
  member_name?: string;
  member_phone?: string;
  member_photo_url?: string;
  campus_id: string;
  title: string;
  aid_type: AidType;
  aid_amount: number;
  frequency: 'one_time' | 'weekly' | 'monthly' | 'annually';
  start_date: string;
  end_date?: string;
  day_of_week?: string;
  day_of_month?: number;
  month_of_year?: number;
  is_active: boolean;
  ignored_occurrences: string[];
  next_occurrence?: string;
  occurrences_completed: number;
  created_by: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// DASHBOARD
// ============================================================================

export interface DashboardReminders {
  birthdays_today: DashboardTask[];
  upcoming_birthdays: DashboardTask[];
  grief_today: DashboardTask[];
  accident_followup: DashboardTask[];
  at_risk_members: DashboardTask[];
  disconnected_members: DashboardTask[];
  financial_aid_due: DashboardTask[];
  ai_suggestions: any[];
  total_tasks: number;
  total_members: number;
  cache_version: string;
}

export interface DashboardTask {
  type: string;
  member_id: string;
  member_name: string;
  member_phone?: string;
  member_photo_url?: string;
  member_age?: number;
  // Event-specific fields
  event_id?: string;
  stage_id?: string;
  stage?: string;
  scheduled_date?: string;
  aid_amount?: number;
  aid_type?: AidType;
  title?: string;
  days_since_last_contact?: number;
}

export interface DashboardStats {
  total_members: number;
  active_grief_support: number;
  members_at_risk: number;
  month_financial_aid: number;
}

// ============================================================================
// CAMPUS
// ============================================================================

export interface Campus {
  id: string;
  campus_name: string;
  location?: string;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// PAGINATION
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface MemberFilters {
  search?: string;
  engagement_status?: EngagementStatus;
  show_archived?: boolean;
  page?: number;
  limit?: number;
}

export interface CareEventFilters {
  member_id?: string;
  event_type?: EventType;
  completed?: boolean;
  page?: number;
  limit?: number;
}
