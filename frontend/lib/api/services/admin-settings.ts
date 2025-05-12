import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { SystemSettings } from '../../types/admin-settings';

/**
 * 获取系统设置
 */
export const useSystemSettings = () => {
  const fetchSystemSettings = async (): Promise<SystemSettings> => {
    const response = await apiClient.get<SystemSettings>('/api/admin/settings');
    return response.data;
  };

  const query = useQuery({
    queryKey: ['systemSettings'],
    queryFn: fetchSystemSettings,
    enabled: false, // 不自动获取数据，由组件控制
  });

  return {
    ...query,
    fetchSystemSettings,
  };
};

/**
 * 更新系统设置
 */
export const useUpdateSystemSettings = () => {
  return {
    updateSystemSettings: async (settings: SystemSettings): Promise<{ success: boolean }> => {
      const response = await apiClient.patch<{ success: boolean }>(
        '/api/admin/settings',
        settings
      );
      return response.data;
    },
  };
};

/**
 * 重置系统设置为默认值
 */
export const useResetSystemSettings = () => {
  return {
    resetSystemSettings: async (): Promise<{ success: boolean }> => {
      const response = await apiClient.post<{ success: boolean }>(
        '/api/admin/settings/reset'
      );
      return response.data;
    },
  };
};

/**
 * 获取系统设置历史记录
 */
export const useSystemSettingsHistory = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['systemSettingsHistory', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<{
        history: Array<{
          id: string;
          userId: string;
          userName: string;
          changes: Record<string, any>;
          timestamp: string;
        }>;
        total: number;
      }>(`/api/admin/settings/history?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
};

/**
 * 导出系统设置
 */
export const useExportSystemSettings = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.get<Blob>('/api/admin/settings/export', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `system-settings-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true };
    },
  });
};

/**
 * 导入系统设置
 */
export const useImportSystemSettings = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post<{ success: boolean; message: string }>(
        '/api/admin/settings/import',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    },
  });
};

/**
 * 测试邮件配置
 */
export const useTestEmailSettings = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        '/api/admin/settings/test-email',
        { email }
      );
      return response.data;
    },
  });
};

/**
 * 清除系统缓存
 */
export const useClearSystemCache = () => {
  return useMutation({
    mutationFn: async (cacheType: 'all' | 'api' | 'database' | 'files') => {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        '/api/admin/settings/clear-cache',
        { type: cacheType }
      );
      return response.data;
    },
  });
};
