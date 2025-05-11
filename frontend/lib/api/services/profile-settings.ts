import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { 
  UserProfile, 
  AccountSettings, 
  NotificationSettings, 
  PrivacySettings 
} from '../../store/zustand/useProfileSettingsStore';

export const mockUserProfile: UserProfile = {
  id: 'profile-1',
  userId: 'user-1',
  firstName: '张',
  lastName: '三',
  displayName: '张三',
  email: 'zhangsan@example.com',
  phone: '+86 123 4567 8901',
  avatar: 'https://ui-avatars.com/api/?name=张三&background=random',
  bio: '我是一名软件工程师，对移民加拿大很感兴趣。',
  dateOfBirth: '1990-01-15',
  gender: 'male',
  address: {
    street: '北京市海淀区中关村大街1号',
    city: '北京',
    state: '北京',
    postalCode: '100080',
    country: '中国',
  },
  profession: '软件工程师',
  company: 'ABC科技有限公司',
  education: [
    {
      institution: '北京大学',
      degree: '学士',
      field: '计算机科学',
      startYear: 2008,
      endYear: 2012,
    },
    {
      institution: '清华大学',
      degree: '硕士',
      field: '软件工程',
      startYear: 2012,
      endYear: 2015,
    },
  ],
  languages: [
    {
      language: '中文',
      proficiency: 'native',
    },
    {
      language: '英语',
      proficiency: 'advanced',
    },
    {
      language: '法语',
      proficiency: 'beginner',
    },
  ],
  socialLinks: [
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/zhangsan',
    },
    {
      platform: 'GitHub',
      url: 'https://github.com/zhangsan',
    },
  ],
  createdAt: '2023-01-10T08:00:00Z',
  updatedAt: '2023-05-15T14:30:00Z',
};

export const mockAccountSettings: AccountSettings = {
  userId: 'user-1',
  email: 'zhangsan@example.com',
  emailVerified: true,
  phone: '+86 123 4567 8901',
  phoneVerified: true,
  language: 'zh',
  timezone: 'Asia/Shanghai',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24h',
  currency: 'CNY',
  twoFactorEnabled: false,
  updatedAt: '2023-05-15T14:30:00Z',
};

export const mockNotificationSettings: NotificationSettings = {
  userId: 'user-1',
  email: {
    marketing: false,
    updates: true,
    security: true,
    reminders: true,
  },
  push: {
    messages: true,
    taskUpdates: true,
    appointments: true,
    documentUpdates: true,
  },
  sms: {
    security: true,
    appointments: true,
    importantUpdates: false,
  },
  updatedAt: '2023-05-15T14:30:00Z',
};

export const mockPrivacySettings: PrivacySettings = {
  userId: 'user-1',
  profileVisibility: 'contacts_only',
  activityVisibility: 'private',
  searchable: true,
  dataSharing: {
    analytics: true,
    thirdParty: false,
    improvementProgram: true,
  },
  updatedAt: '2023-05-15T14:30:00Z',
};

export const useGetUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      try {
        return mockUserProfile;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
    },
  });
};

export const useUpdateUserProfile = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      try {
        const updatedProfile = { ...mockUserProfile, ...updates, updatedAt: new Date().toISOString() };
        return updatedProfile;
      } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
    },
  });
};

export const useUploadAvatar = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (file: File) => {
      try {
        
        
        const avatarUrl = URL.createObjectURL(file);
        const updatedProfile = { ...mockUserProfile, avatar: avatarUrl, updatedAt: new Date().toISOString() };
        return updatedProfile;
      } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
    },
  });
};

export const useDeleteAvatar = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      try {
        const updatedProfile = { 
          ...mockUserProfile, 
          avatar: 'https://ui-avatars.com/api/?name=张三&background=random', 
          updatedAt: new Date().toISOString() 
        };
        return updatedProfile;
      } catch (error) {
        console.error('Error deleting avatar:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
    },
  });
};

export const useGetAccountSettings = (userId: string) => {
  return useQuery({
    queryKey: ['account-settings', userId],
    queryFn: async () => {
      try {
        return mockAccountSettings;
      } catch (error) {
        console.error('Error fetching account settings:', error);
        throw error;
      }
    },
  });
};

export const useUpdateAccountSettings = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<AccountSettings>) => {
      try {
        const updatedSettings = { ...mockAccountSettings, ...updates, updatedAt: new Date().toISOString() };
        return updatedSettings;
      } catch (error) {
        console.error('Error updating account settings:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-settings', userId] });
    },
  });
};

export const useSendEmailVerification = (userId: string) => {
  return useMutation({
    mutationFn: async (email: string) => {
      try {
        return { success: true, message: '验证邮件已发送' };
      } catch (error) {
        console.error('Error sending email verification:', error);
        throw error;
      }
    },
  });
};

export const useSendPhoneVerification = (userId: string) => {
  return useMutation({
    mutationFn: async (phone: string) => {
      try {
        return { success: true, message: '验证码已发送' };
      } catch (error) {
        console.error('Error sending phone verification:', error);
        throw error;
      }
    },
  });
};

export const useEnableTwoFactor = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (method: 'sms' | 'app' | 'email') => {
      try {
        const updatedSettings = { 
          ...mockAccountSettings, 
          twoFactorEnabled: true, 
          twoFactorMethod: method,
          updatedAt: new Date().toISOString() 
        };
        return updatedSettings;
      } catch (error) {
        console.error('Error enabling two-factor authentication:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-settings', userId] });
    },
  });
};

export const useDisableTwoFactor = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      try {
        const updatedSettings = { 
          ...mockAccountSettings, 
          twoFactorEnabled: false, 
          twoFactorMethod: undefined,
          updatedAt: new Date().toISOString() 
        };
        return updatedSettings;
      } catch (error) {
        console.error('Error disabling two-factor authentication:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-settings', userId] });
    },
  });
};

export const useGetNotificationSettings = (userId: string) => {
  return useQuery({
    queryKey: ['notification-settings', userId],
    queryFn: async () => {
      try {
        return mockNotificationSettings;
      } catch (error) {
        console.error('Error fetching notification settings:', error);
        throw error;
      }
    },
  });
};

export const useUpdateNotificationSettings = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<NotificationSettings>) => {
      try {
        const updatedSettings = { 
          ...mockNotificationSettings,
          ...updates,
          email: { ...mockNotificationSettings.email, ...(updates.email || {}) },
          push: { ...mockNotificationSettings.push, ...(updates.push || {}) },
          sms: { ...mockNotificationSettings.sms, ...(updates.sms || {}) },
          updatedAt: new Date().toISOString() 
        };
        return updatedSettings;
      } catch (error) {
        console.error('Error updating notification settings:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings', userId] });
    },
  });
};

export const useGetPrivacySettings = (userId: string) => {
  return useQuery({
    queryKey: ['privacy-settings', userId],
    queryFn: async () => {
      try {
        return mockPrivacySettings;
      } catch (error) {
        console.error('Error fetching privacy settings:', error);
        throw error;
      }
    },
  });
};

export const useUpdatePrivacySettings = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<PrivacySettings>) => {
      try {
        const updatedSettings = { 
          ...mockPrivacySettings,
          ...updates,
          dataSharing: { ...mockPrivacySettings.dataSharing, ...(updates.dataSharing || {}) },
          updatedAt: new Date().toISOString() 
        };
        return updatedSettings;
      } catch (error) {
        console.error('Error updating privacy settings:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacy-settings', userId] });
    },
  });
};

export const useChangePassword = (userId: string) => {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      try {
        return { success: true, message: '密码已成功更改' };
      } catch (error) {
        console.error('Error changing password:', error);
        throw error;
      }
    },
  });
};

export const useDeactivateAccount = (userId: string) => {
  return useMutation({
    mutationFn: async (reason?: string) => {
      try {
        return { success: true, message: '账户已成功停用' };
      } catch (error) {
        console.error('Error deactivating account:', error);
        throw error;
      }
    },
  });
};

export const useDeleteAccount = (userId: string) => {
  return useMutation({
    mutationFn: async (data: { password: string; reason?: string }) => {
      try {
        return { success: true, message: '账户已成功删除' };
      } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
      }
    },
  });
};
