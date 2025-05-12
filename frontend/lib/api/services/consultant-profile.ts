import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ConsultantProfile, ConsultantProfileStats } from '../../store/zustand/useConsultantProfileStore';

/**
 * 获取顾问资料
 */
export const useConsultantProfile = () => {
  return useQuery({
    queryKey: ['consultantProfile'],
    queryFn: async () => {
      const response = await apiClient.get<ConsultantProfile>('/api/consultant/profile');
      return response.data;
    },
  });
};

/**
 * 获取顾问资料统计数据
 */
export const useConsultantProfileStats = () => {
  return useQuery({
    queryKey: ['consultantProfileStats'],
    queryFn: async () => {
      const response = await apiClient.get<ConsultantProfileStats>('/api/consultant/profile/stats');
      return response.data;
    },
  });
};

/**
 * 更新顾问资料
 */
export const useUpdateConsultantProfile = () => {
  return useMutation({
    mutationFn: async (updates: Partial<ConsultantProfile>) => {
      const response = await apiClient.patch<ConsultantProfile>('/api/consultant/profile', updates);
      return response.data;
    },
  });
};

/**
 * 上传顾问头像
 */
export const useUploadAvatar = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await apiClient.post<{ avatarUrl: string }>('/api/consultant/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.avatarUrl;
    },
  });
};

/**
 * 添加教育经历
 */
export const useAddEducation = () => {
  return useMutation({
    mutationFn: async (education: Omit<ConsultantProfile['education'][0], 'id'>) => {
      const response = await apiClient.post<ConsultantProfile['education'][0]>('/api/consultant/profile/education', education);
      return response.data;
    },
  });
};

/**
 * 更新教育经历
 */
export const useUpdateEducation = () => {
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ConsultantProfile['education'][0]>;
    }) => {
      const response = await apiClient.patch<ConsultantProfile['education'][0]>(`/api/consultant/profile/education/${id}`, updates);
      return response.data;
    },
  });
};

/**
 * 删除教育经历
 */
export const useDeleteEducation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/consultant/profile/education/${id}`);
      return id;
    },
  });
};

/**
 * 添加工作经验
 */
export const useAddExperience = () => {
  return useMutation({
    mutationFn: async (experience: Omit<ConsultantProfile['experience'][0], 'id'>) => {
      const response = await apiClient.post<ConsultantProfile['experience'][0]>('/api/consultant/profile/experience', experience);
      return response.data;
    },
  });
};

/**
 * 更新工作经验
 */
export const useUpdateExperience = () => {
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ConsultantProfile['experience'][0]>;
    }) => {
      const response = await apiClient.patch<ConsultantProfile['experience'][0]>(`/api/consultant/profile/experience/${id}`, updates);
      return response.data;
    },
  });
};

/**
 * 删除工作经验
 */
export const useDeleteExperience = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/consultant/profile/experience/${id}`);
      return id;
    },
  });
};

/**
 * 添加认证
 */
export const useAddCertification = () => {
  return useMutation({
    mutationFn: async (certification: Omit<ConsultantProfile['certifications'][0], 'id'>) => {
      const response = await apiClient.post<ConsultantProfile['certifications'][0]>('/api/consultant/profile/certification', certification);
      return response.data;
    },
  });
};

/**
 * 更新认证
 */
export const useUpdateCertification = () => {
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ConsultantProfile['certifications'][0]>;
    }) => {
      const response = await apiClient.patch<ConsultantProfile['certifications'][0]>(`/api/consultant/profile/certification/${id}`, updates);
      return response.data;
    },
  });
};

/**
 * 删除认证
 */
export const useDeleteCertification = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/consultant/profile/certification/${id}`);
      return id;
    },
  });
};

/**
 * 添加服务
 */
export const useAddService = () => {
  return useMutation({
    mutationFn: async (service: Omit<ConsultantProfile['services'][0], 'id'>) => {
      const response = await apiClient.post<ConsultantProfile['services'][0]>('/api/consultant/profile/service', service);
      return response.data;
    },
  });
};

/**
 * 更新服务
 */
export const useUpdateService = () => {
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ConsultantProfile['services'][0]>;
    }) => {
      const response = await apiClient.patch<ConsultantProfile['services'][0]>(`/api/consultant/profile/service/${id}`, updates);
      return response.data;
    },
  });
};

/**
 * 删除服务
 */
export const useDeleteService = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/consultant/profile/service/${id}`);
      return id;
    },
  });
};

/**
 * 更新技能
 */
export const useUpdateSkills = () => {
  return useMutation({
    mutationFn: async (skills: ConsultantProfile['skills']) => {
      const response = await apiClient.put<ConsultantProfile['skills']>('/api/consultant/profile/skills', skills);
      return response.data;
    },
  });
};

/**
 * 更新可用性
 */
export const useUpdateAvailability = () => {
  return useMutation({
    mutationFn: async (availability: ConsultantProfile['availability']) => {
      const response = await apiClient.patch<ConsultantProfile['availability']>('/api/consultant/profile/availability', availability);
      return response.data;
    },
  });
};

/**
 * 更新可见性设置
 */
export const useUpdateVisibility = () => {
  return useMutation({
    mutationFn: async (visibility: ConsultantProfile['visibility']) => {
      const response = await apiClient.patch<ConsultantProfile['visibility']>('/api/consultant/profile/visibility', visibility);
      return response.data;
    },
  });
};

/**
 * 更新社交链接
 */
export const useUpdateSocialLinks = () => {
  return useMutation({
    mutationFn: async (socialLinks: ConsultantProfile['socialLinks']) => {
      const response = await apiClient.put<ConsultantProfile['socialLinks']>('/api/consultant/profile/social-links', socialLinks);
      return response.data;
    },
  });
};

/**
 * 请求资料验证
 */
export const useRequestVerification = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<{ status: string; message: string }>('/api/consultant/profile/request-verification');
      return response.data;
    },
  });
};
