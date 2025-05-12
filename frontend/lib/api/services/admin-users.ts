import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { User, UserRole } from '../../store/zustand/useAdminUsersStore';

interface UserFilters {
  search?: string;
  role?: UserRole | null;
  status?: 'active' | 'inactive' | 'pending' | null;
  startDate?: string | null;
  endDate?: string | null;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface UsersResponse {
  users: User[];
  total: number;
}

/**
 * 获取管理员用户数据
 */
export const useAdminUsersData = () => {
  const fetchAdminUsersData = async (
    page = 1,
    limit = 20,
    filters: UserFilters = {}
  ): Promise<UsersResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    if (filters.search) {
      queryParams.append('search', filters.search);
    }

    if (filters.role) {
      queryParams.append('role', filters.role);
    }

    if (filters.status) {
      queryParams.append('status', filters.status);
    }

    if (filters.startDate) {
      queryParams.append('startDate', filters.startDate);
    }

    if (filters.endDate) {
      queryParams.append('endDate', filters.endDate);
    }

    if (filters.sortBy) {
      queryParams.append('sortBy', filters.sortBy);
    }

    if (filters.sortOrder) {
      queryParams.append('sortOrder', filters.sortOrder);
    }

    const response = await apiClient.get<UsersResponse>(
      `/api/admin/users?${queryParams.toString()}`
    );
    return response.data;
  };

  const query = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => fetchAdminUsersData(),
    enabled: false, // 不自动获取数据，由组件控制
  });

  return {
    ...query,
    fetchAdminUsersData,
  };
};

/**
 * 邀请用户
 */
export const useInviteUsers = () => {
  return {
    inviteUsers: async (emails: string[], role: UserRole): Promise<{ success: boolean }> => {
      const response = await apiClient.post<{ success: boolean }>(
        '/api/admin/users/invite',
        { emails, role }
      );
      return response.data;
    },
  };
};

/**
 * 删除用户
 */
export const useDeleteUsers = () => {
  return {
    deleteUsers: async (userIds: string[]): Promise<{ success: boolean }> => {
      const response = await apiClient.delete<{ success: boolean }>(
        '/api/admin/users',
        { data: { userIds } }
      );
      return response.data;
    },
  };
};

/**
 * 更新用户
 */
export const useUpdateUser = () => {
  return {
    updateUser: async (
      userIds: string[],
      updates: Partial<User>
    ): Promise<{ success: boolean }> => {
      const response = await apiClient.patch<{ success: boolean }>(
        '/api/admin/users',
        { userIds, updates }
      );
      return response.data;
    },
  };
};

/**
 * 获取单个用户详情
 */
export const useUserDetails = (userId: string) => {
  return useQuery({
    queryKey: ['userDetails', userId],
    queryFn: async () => {
      const response = await apiClient.get<User>(`/api/admin/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};

/**
 * 获取用户活动日志
 */
export const useUserActivityLogs = (userId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['userActivityLogs', userId, page, limit],
    queryFn: async () => {
      const response = await apiClient.get<{
        logs: Array<{
          id: string;
          userId: string;
          action: string;
          details: string;
          ipAddress: string;
          userAgent: string;
          timestamp: string;
        }>;
        total: number;
      }>(`/api/admin/users/${userId}/activity?page=${page}&limit=${limit}`);
      return response.data;
    },
    enabled: !!userId,
  });
};

/**
 * 重置用户密码
 */
export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        `/api/admin/users/${userId}/reset-password`
      );
      return response.data;
    },
  });
};

/**
 * 锁定/解锁用户账户
 */
export const useToggleUserLock = () => {
  return useMutation({
    mutationFn: async ({
      userId,
      locked,
    }: {
      userId: string;
      locked: boolean;
    }) => {
      const response = await apiClient.patch<{ success: boolean; message: string }>(
        `/api/admin/users/${userId}/lock`,
        { locked }
      );
      return response.data;
    },
  });
};

/**
 * 获取用户统计数据
 */
export const useUserStats = () => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      const response = await apiClient.get<{
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        pendingUsers: number;
        usersByRole: {
          role: UserRole;
          count: number;
        }[];
        newUsersThisMonth: number;
        userGrowthRate: number;
      }>('/api/admin/users/stats');
      return response.data;
    },
  });
};
