import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from '../zustand/useAuthStore';
import { useSettingsStore } from '../zustand/useSettingsStore';
import { useProfileStore } from '../zustand/useProfileStore';

export const StoreContext = createContext<{
  auth: ReturnType<typeof useAuthStore>;
  settings: ReturnType<typeof useSettingsStore>;
  profile: ReturnType<typeof useProfileStore>;
} | null>(null);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuthStore();
  const settings = useSettingsStore();
  const profile = useProfileStore();

  return (
    <StoreContext.Provider value={{ auth, settings, profile }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const useAuth = () => useStore().auth;
export const useSettings = () => useStore().settings;
export const useProfile = () => useStore().profile;
