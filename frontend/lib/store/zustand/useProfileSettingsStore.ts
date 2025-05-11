import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  profession?: string;
  company?: string;
  education?: {
    institution: string;
    degree: string;
    field: string;
    startYear: number;
    endYear?: number;
  }[];
  languages?: {
    language: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
  }[];
  socialLinks?: {
    platform: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface AccountSettings {
  userId: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  phoneVerified: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  twoFactorEnabled: boolean;
  twoFactorMethod?: 'sms' | 'app' | 'email';
  updatedAt: string;
}

export interface NotificationSettings {
  userId: string;
  email: {
    marketing: boolean;
    updates: boolean;
    security: boolean;
    reminders: boolean;
  };
  push: {
    messages: boolean;
    taskUpdates: boolean;
    appointments: boolean;
    documentUpdates: boolean;
  };
  sms: {
    security: boolean;
    appointments: boolean;
    importantUpdates: boolean;
  };
  updatedAt: string;
}

export interface PrivacySettings {
  userId: string;
  profileVisibility: 'public' | 'private' | 'contacts_only';
  activityVisibility: 'public' | 'private' | 'contacts_only';
  searchable: boolean;
  dataSharing: {
    analytics: boolean;
    thirdParty: boolean;
    improvementProgram: boolean;
  };
  updatedAt: string;
}

interface ProfileSettingsState {
  profile: UserProfile | null;
  accountSettings: AccountSettings | null;
  notificationSettings: NotificationSettings | null;
  privacySettings: PrivacySettings | null;
  activeTab: 'personal' | 'account' | 'notifications' | 'privacy' | 'security' | 'deletion';
  isLoading: boolean;
  error: string | null;
  
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  setAccountSettings: (settings: AccountSettings) => void;
  updateAccountSettings: (updates: Partial<AccountSettings>) => void;
  
  setNotificationSettings: (settings: NotificationSettings) => void;
  updateNotificationSettings: (updates: Partial<NotificationSettings>) => void;
  
  setPrivacySettings: (settings: PrivacySettings) => void;
  updatePrivacySettings: (updates: Partial<PrivacySettings>) => void;
  
  setActiveTab: (tab: 'personal' | 'account' | 'notifications' | 'privacy' | 'security' | 'deletion') => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

const initialState = {
  profile: null,
  accountSettings: null,
  notificationSettings: null,
  privacySettings: null,
  activeTab: 'personal' as const,
  isLoading: false,
  error: null,
};

export const useProfileSettingsStore = create<ProfileSettingsState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        setProfile: (profile) => set({ profile }),
        
        updateProfile: (updates) => set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),
        
        setAccountSettings: (settings) => set({ accountSettings: settings }),
        
        updateAccountSettings: (updates) => set((state) => ({
          accountSettings: state.accountSettings ? { ...state.accountSettings, ...updates } : null,
        })),
        
        setNotificationSettings: (settings) => set({ notificationSettings: settings }),
        
        updateNotificationSettings: (updates) => set((state) => {
          if (!state.notificationSettings) return { notificationSettings: null };
          
          return {
            notificationSettings: {
              ...state.notificationSettings,
              ...updates,
              email: {
                ...state.notificationSettings.email,
                ...(updates.email || {}),
              },
              push: {
                ...state.notificationSettings.push,
                ...(updates.push || {}),
              },
              sms: {
                ...state.notificationSettings.sms,
                ...(updates.sms || {}),
              },
            },
          };
        }),
        
        setPrivacySettings: (settings) => set({ privacySettings: settings }),
        
        updatePrivacySettings: (updates) => set((state) => {
          if (!state.privacySettings) return { privacySettings: null };
          
          return {
            privacySettings: {
              ...state.privacySettings,
              ...updates,
              dataSharing: {
                ...state.privacySettings.dataSharing,
                ...(updates.dataSharing || {}),
              },
            },
          };
        }),
        
        setActiveTab: (activeTab) => set({ activeTab }),
        
        setLoading: (isLoading) => set({ isLoading }),
        
        setError: (error) => set({ error }),
        
        resetState: () => set(initialState),
      }),
      {
        name: 'profile-settings-storage',
        partialize: (state) => ({
          profile: state.profile,
          accountSettings: state.accountSettings,
          notificationSettings: state.notificationSettings,
          privacySettings: state.privacySettings,
          activeTab: state.activeTab,
        }),
      }
    )
  )
);
