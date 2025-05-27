import React, { useEffect, useState } from 'react';
import { useSettings } from '../store/context/StoreProvider';
import { Theme, SettingsStore } from '../store/zustand/useSettingsStore';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const settings = useSettings() as SettingsStore;
  const theme = settings.theme;
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
  
  if (!mounted) return null;
  
  return <>{children}</>;
};
