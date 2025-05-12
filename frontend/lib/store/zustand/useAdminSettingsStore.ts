import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useSystemSettings, useUpdateSystemSettings, useResetSystemSettings } from '../../api/services/admin-settings';
import { SystemSettings, defaultSettings } from '../../types/admin-settings';

interface AdminSettingsState {
  settings: SystemSettings | null;
  isLoading: boolean;
  error: string | null;
  activeTab: string;
  hasUnsavedChanges: boolean;
  isResetModalOpen: boolean;
  
  setSettings: (settings: SystemSettings) => void;
  setActiveTab: (tab: string) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  updateSetting: <K extends keyof SystemSettings, SK extends keyof SystemSettings[K]>(
    category: K,
    key: SK,
    value: SystemSettings[K][SK]
  ) => void;
  
  fetchSettings: () => Promise<void>;
  updateSettings: () => Promise<void>;
  resetSettings: () => Promise<void>;
  
  openResetModal: () => void;
  closeResetModal: () => void;
}

const initialState = {
  settings: null,
  isLoading: false,
  error: null,
  activeTab: 'general',
  hasUnsavedChanges: false,
  isResetModalOpen: false,
};

export const useAdminSettingsStore = create<AdminSettingsState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        setSettings: (settings) => set({ settings }),
        
        setActiveTab: (tab) => set({ activeTab: tab }),
        
        setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),
        
        updateSetting: (category, key, value) => {
          set((state) => {
            if (!state.settings) return state;
            
            return {
              settings: {
                ...state.settings,
                [category]: {
                  ...state.settings[category],
                  [key]: value,
                },
              },
            };
          });
        },
        
        fetchSettings: async () => {
          set({ isLoading: true, error: null });
          
          try {
            const { fetchSystemSettings } = useSystemSettings();
            const settings = await fetchSystemSettings();
            
            set({
              settings,
              isLoading: false,
            });
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '获取系统设置失败',
            });
          }
        },
        
        updateSettings: async () => {
          const { settings } = get();
          if (!settings) return;
          
          set({ isLoading: true, error: null });
          
          try {
            const { updateSystemSettings } = useUpdateSystemSettings();
            await updateSystemSettings(settings);
            
            set({
              isLoading: false,
              hasUnsavedChanges: false,
            });
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '更新系统设置失败',
            });
          }
        },
        
        resetSettings: async () => {
          set({ isLoading: true, error: null });
          
          try {
            const { resetSystemSettings } = useResetSystemSettings();
            await resetSystemSettings();
            
            set({
              settings: defaultSettings,
              isLoading: false,
              hasUnsavedChanges: false,
            });
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '重置系统设置失败',
            });
          }
        },
        
        openResetModal: () => set({ isResetModalOpen: true }),
        
        closeResetModal: () => set({ isResetModalOpen: false }),
      }),
      {
        name: 'admin-settings-storage',
        partialize: (state) => ({
          activeTab: state.activeTab,
        }),
      }
    )
  )
);
