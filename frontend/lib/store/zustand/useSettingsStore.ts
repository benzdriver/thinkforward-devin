import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'zh' | 'fr';
export type InputMode = 'conversation' | 'form';

export type SettingsState = {
  theme: Theme;
  language: Language;
  inputMode: InputMode;
  notifications: boolean;
};

export type SettingsActions = {
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setInputMode: (mode: InputMode) => void;
  toggleNotifications: () => void;
};

export type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      inputMode: 'conversation',
      notifications: true,
      
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setInputMode: (mode) => set({ inputMode: mode }),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
    }),
    {
      name: 'settings-storage',
    }
  )
);
