import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { DashboardStats, User, SystemActivity, SystemHealth } from '../../store/zustand/useAdminDashboardStore';

interface AdminDashboardData {
  stats: DashboardStats;
  users: User[];
  activities: SystemActivity[];
  health: SystemHealth;
}

/**
 * 获取管理员仪表盘数据
 */
export const useAdminDashboardData = () => {
  const fetchAdminDashboardData = async (): Promise<AdminDashboardData> => {
    const response = await apiClient.get<AdminDashboardData>('/api/admin/dashboard');
    return response.data;
  };

  const query = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: fetchAdminDashboardData,
  });

  return {
    ...query,
    fetchAdminDashboardData,
  };
};

/**
 * 获取系统健康状态
 */
export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['systemHealth'],
    queryFn: async () => {
      const response = await apiClient.get<SystemHealth>('/api/admin/system/health');
      return response.data;
    },
  });
};

/**
 * 获取系统活动日志
 */
export const useSystemActivities = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['systemActivities', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<{
        activities: SystemActivity[];
        total: number;
      }>(`/api/admin/system/activities?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
};

/**
 * 获取最近注册用户
 */
export const useRecentUsers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['recentUsers', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<{
        users: User[];
        total: number;
      }>(`/api/admin/users/recent?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
};

/**
 * 重启系统服务
 */
export const useRestartService = () => {
  return useMutation({
    mutationFn: async (serviceId: string) => {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        `/api/admin/system/services/${serviceId}/restart`
      );
      return response.data;
    },
  });
};

/**
 * 清除系统缓存
 */
export const useClearCache = () => {
  return useMutation({
    mutationFn: async (cacheType: 'all' | 'api' | 'database' | 'files') => {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        `/api/admin/system/cache/clear`,
        { type: cacheType }
      );
      return response.data;
    },
  });
};

/**
 * 获取系统配置
 */
export const useSystemConfig = () => {
  return useQuery({
    queryKey: ['systemConfig'],
    queryFn: async () => {
      const response = await apiClient.get<Record<string, any>>('/api/admin/system/config');
      return response.data;
    },
  });
};

/**
 * 更新系统配置
 */
export const useUpdateSystemConfig = () => {
  return useMutation({
    mutationFn: async (config: Record<string, any>) => {
      const response = await apiClient.patch<{ success: boolean; message: string }>(
        '/api/admin/system/config',
        config
      );
      return response.data;
    },
  });
};
