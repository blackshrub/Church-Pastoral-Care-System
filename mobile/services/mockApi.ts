/**
 * Mock API Service
 *
 * Wraps API calls to use mock data when MOCK_MODE is enabled
 * Easy to toggle between mock and real backend
 */

import {
  mockUser,
  mockMembers,
  mockMemberListItems,
  mockCareEvents,
  mockDashboardReminders,
  mockGriefStages,
  mockFinancialAidSchedules,
  simulateApiDelay,
  MOCK_MODE_ENABLED,
} from '@/lib/mockData';
import type {
  User,
  Member,
  MemberListItem,
  CareEvent,
  DashboardReminders,
  CreateMemberRequest,
  CreateCareEventRequest,
} from '@/types';

// Toggle this to switch between mock and real API
export const USE_MOCK_DATA = __DEV__ && MOCK_MODE_ENABLED;

// ============================================================================
// AUTH
// ============================================================================

export async function mockLogin(email: string, password: string): Promise<{ token: string; user: User }> {
  await simulateApiDelay(500, 1200);

  // Simulate login validation
  if (email === 'demo@faithtracker.app' || email === 'pastor.budi@gkbj.org') {
    return {
      token: 'mock_jwt_token_' + Date.now(),
      user: mockUser,
    };
  }

  // Simulate invalid credentials
  throw new Error('Invalid email or password');
}

export async function mockGetCurrentUser(): Promise<User> {
  await simulateApiDelay(200, 400);
  return mockUser;
}

// ============================================================================
// MEMBERS
// ============================================================================

export async function mockGetMembers(
  filters: { search?: string; engagement_status?: string; page?: number; limit?: number } = {}
): Promise<{ data: MemberListItem[]; total: number; page: number }> {
  await simulateApiDelay();

  let filtered = [...mockMemberListItems];

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(searchLower) ||
        m.phone?.toLowerCase().includes(searchLower)
    );
  }

  // Apply engagement filter
  if (filters.engagement_status && filters.engagement_status !== 'all') {
    filtered = filtered.filter((m) => m.engagement_status === filters.engagement_status);
  }

  // Apply pagination
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: filtered.slice(start, end),
    total: filtered.length,
    page,
  };
}

export async function mockGetMember(memberId: string): Promise<Member> {
  await simulateApiDelay();
  const member = mockMembers.find((m) => m.id === memberId);
  if (!member) {
    throw new Error('Member not found');
  }
  return member;
}

export async function mockCreateMember(data: CreateMemberRequest): Promise<Member> {
  await simulateApiDelay(500, 1000);

  const newMember: Member = {
    id: `member_${Date.now()}`,
    ...data,
    engagement_status: 'active',
    days_since_last_contact: 0,
    is_archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Add to mock data (in memory only)
  mockMembers.unshift(newMember);
  mockMemberListItems.unshift({
    id: newMember.id,
    name: newMember.name,
    phone: newMember.phone,
    campus_id: newMember.campus_id,
    photo_url: newMember.photo_url,
    engagement_status: newMember.engagement_status,
    days_since_last_contact: newMember.days_since_last_contact,
    is_archived: newMember.is_archived,
    age: newMember.age,
    gender: newMember.gender,
    category: newMember.category,
  });

  return newMember;
}

export async function mockUpdateMember(memberId: string, data: Partial<Member>): Promise<Member> {
  await simulateApiDelay(400, 800);

  const index = mockMembers.findIndex((m) => m.id === memberId);
  if (index === -1) {
    throw new Error('Member not found');
  }

  const updatedMember = {
    ...mockMembers[index],
    ...data,
    updated_at: new Date().toISOString(),
  };

  mockMembers[index] = updatedMember;

  // Update list item too
  const listIndex = mockMemberListItems.findIndex((m) => m.id === memberId);
  if (listIndex !== -1) {
    mockMemberListItems[listIndex] = {
      ...mockMemberListItems[listIndex],
      name: updatedMember.name,
      phone: updatedMember.phone,
      photo_url: updatedMember.photo_url,
    };
  }

  return updatedMember;
}

export async function mockDeleteMember(memberId: string): Promise<void> {
  await simulateApiDelay(300, 600);

  const index = mockMembers.findIndex((m) => m.id === memberId);
  if (index === -1) {
    throw new Error('Member not found');
  }

  mockMembers.splice(index, 1);

  const listIndex = mockMemberListItems.findIndex((m) => m.id === memberId);
  if (listIndex !== -1) {
    mockMemberListItems.splice(listIndex, 1);
  }
}

// ============================================================================
// CARE EVENTS
// ============================================================================

export async function mockGetCareEvents(
  filters: { member_id?: string; event_type?: string; completed?: boolean } = {}
): Promise<CareEvent[]> {
  await simulateApiDelay();

  let filtered = [...mockCareEvents];

  if (filters.member_id) {
    filtered = filtered.filter((e) => e.member_id === filters.member_id);
  }

  if (filters.event_type) {
    filtered = filtered.filter((e) => e.event_type === filters.event_type);
  }

  if (filters.completed !== undefined) {
    filtered = filtered.filter((e) => e.completed === filters.completed);
  }

  return filtered.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
}

export async function mockCreateCareEvent(data: CreateCareEventRequest): Promise<CareEvent> {
  await simulateApiDelay(500, 1000);

  const member = mockMembers.find((m) => m.id === data.member_id);

  const newEvent: CareEvent = {
    id: `event_${Date.now()}`,
    member_id: data.member_id,
    member_name: member?.name || 'Unknown',
    campus_id: data.campus_id,
    event_type: data.event_type,
    event_date: data.event_date,
    title: data.title,
    description: data.description,
    completed: false,
    ignored: false,
    created_by_user_id: mockUser.id,
    created_by_user_name: mockUser.name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    grief_relationship: data.grief_relationship,
    hospital_name: data.hospital_name,
    aid_type: data.aid_type,
    aid_amount: data.aid_amount,
    aid_notes: data.aid_notes,
  };

  mockCareEvents.unshift(newEvent);
  return newEvent;
}

export async function mockCompleteCareEvent(eventId: string): Promise<CareEvent> {
  await simulateApiDelay(300, 600);

  const index = mockCareEvents.findIndex((e) => e.id === eventId);
  if (index === -1) {
    throw new Error('Event not found');
  }

  mockCareEvents[index] = {
    ...mockCareEvents[index],
    completed: true,
    completed_at: new Date().toISOString(),
    completed_by_user_id: mockUser.id,
    completed_by_user_name: mockUser.name,
    updated_at: new Date().toISOString(),
  };

  return mockCareEvents[index];
}

export async function mockIgnoreCareEvent(eventId: string): Promise<CareEvent> {
  await simulateApiDelay(300, 600);

  const index = mockCareEvents.findIndex((e) => e.id === eventId);
  if (index === -1) {
    throw new Error('Event not found');
  }

  mockCareEvents[index] = {
    ...mockCareEvents[index],
    ignored: true,
    ignored_at: new Date().toISOString(),
    ignored_by: mockUser.id,
    ignored_by_name: mockUser.name,
    updated_at: new Date().toISOString(),
  };

  return mockCareEvents[index];
}

// ============================================================================
// DASHBOARD
// ============================================================================

export async function mockGetDashboardReminders(): Promise<DashboardReminders> {
  await simulateApiDelay(400, 1000);
  return mockDashboardReminders;
}

// ============================================================================
// GRIEF SUPPORT
// ============================================================================

export async function mockCompleteGriefStage(stageId: string): Promise<void> {
  await simulateApiDelay(300, 600);

  const index = mockGriefStages.findIndex((s) => s.id === stageId);
  if (index !== -1) {
    mockGriefStages[index] = {
      ...mockGriefStages[index],
      completed: true,
      completed_at: new Date().toISOString(),
    };
  }

  // Remove from dashboard
  const dashboardIndex = mockDashboardReminders.grief_today.findIndex(
    (t) => t.stage_id === stageId
  );
  if (dashboardIndex !== -1) {
    mockDashboardReminders.grief_today.splice(dashboardIndex, 1);
    mockDashboardReminders.total_tasks--;
  }
}

// ============================================================================
// FINANCIAL AID
// ============================================================================

export async function mockMarkAidDistributed(scheduleId: string): Promise<void> {
  await simulateApiDelay(300, 600);

  const index = mockFinancialAidSchedules.findIndex((s) => s.id === scheduleId);
  if (index !== -1) {
    mockFinancialAidSchedules[index].occurrences_completed++;
  }

  // Remove from dashboard
  const dashboardIndex = mockDashboardReminders.financial_aid_due.findIndex(
    (t) => t.member_id === mockFinancialAidSchedules[index]?.member_id
  );
  if (dashboardIndex !== -1) {
    mockDashboardReminders.financial_aid_due.splice(dashboardIndex, 1);
    mockDashboardReminders.total_tasks--;
  }
}

export default {
  USE_MOCK_DATA,
  // Auth
  mockLogin,
  mockGetCurrentUser,
  // Members
  mockGetMembers,
  mockGetMember,
  mockCreateMember,
  mockUpdateMember,
  mockDeleteMember,
  // Care Events
  mockGetCareEvents,
  mockCreateCareEvent,
  mockCompleteCareEvent,
  mockIgnoreCareEvent,
  // Dashboard
  mockGetDashboardReminders,
  // Grief
  mockCompleteGriefStage,
  // Financial Aid
  mockMarkAidDistributed,
};
