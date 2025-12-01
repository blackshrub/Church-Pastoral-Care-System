/**
 * Members Hooks
 *
 * Data fetching hooks for members with mock data support
 */

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/constants/api';
import {
  USE_MOCK_DATA,
  mockGetMembers,
  mockGetMember,
  mockCreateMember,
  mockUpdateMember,
  mockDeleteMember,
} from '@/services/mockApi';
import type { Member, MemberListItem, MemberFilters, CreateMemberRequest } from '@/types';

/**
 * Fetch paginated members list
 */
export function useMembers(filters: MemberFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['members', filters],
    queryFn: async ({ pageParam = 1 }) => {
      if (USE_MOCK_DATA) {
        const result = await mockGetMembers({
          ...filters,
          page: pageParam,
          limit: 20,
        });
        return {
          members: result.data,
          total: result.total,
          page: pageParam,
        };
      }

      const { data, headers } = await api.get<MemberListItem[]>(API_ENDPOINTS.MEMBERS.LIST, {
        params: {
          page: pageParam,
          limit: 20,
          ...filters,
        },
      });

      const total = parseInt(headers['x-total-count'] || '0', 10);

      return {
        members: data,
        total,
        page: pageParam,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.flatMap((p) => p.members).length;
      if (loadedCount >= lastPage.total) {
        return undefined;
      }
      return lastPage.page + 1;
    },
  });
}

/**
 * Fetch single member detail
 */
export function useMember(memberId: string) {
  return useQuery<Member>({
    queryKey: ['member', memberId],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return mockGetMember(memberId);
      }

      const { data } = await api.get(API_ENDPOINTS.MEMBERS.DETAIL(memberId));
      return data;
    },
    enabled: !!memberId,
  });
}

/**
 * Create a new member
 */
export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (member: CreateMemberRequest) => {
      if (USE_MOCK_DATA) {
        return mockCreateMember(member);
      }

      const { data } = await api.post<Member>(API_ENDPOINTS.MEMBERS.CREATE, member);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      Toast.show({
        type: 'success',
        text1: 'Member Created',
        text2: 'New member has been added successfully',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to create member',
      });
    },
  });
}

/**
 * Update a member
 */
export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ memberId, data }: { memberId: string; data: Partial<Member> }) => {
      if (USE_MOCK_DATA) {
        return mockUpdateMember(memberId, data);
      }

      const response = await api.put<Member>(API_ENDPOINTS.MEMBERS.UPDATE(memberId), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member', variables.memberId] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      Toast.show({
        type: 'success',
        text1: 'Member Updated',
        text2: 'Changes have been saved successfully',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to update member',
      });
    },
  });
}

/**
 * Delete a member
 */
export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      if (USE_MOCK_DATA) {
        return mockDeleteMember(memberId);
      }

      await api.delete(API_ENDPOINTS.MEMBERS.DELETE(memberId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      Toast.show({
        type: 'success',
        text1: 'Member Deleted',
        text2: 'Member has been removed',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to delete member',
      });
    },
  });
}
