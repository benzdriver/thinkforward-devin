import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useAuthStore, User } from '../store/zustand/useAuthStore';
import { authService } from '../api/services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  resetError: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/auth/forgot-password',
  '/about',
  '/pricing',
  '/',
  '/*', // Make all routes public for preview
];

interface AuthProviderProps {
  children: React.ReactNode;
}

const AUTH_STORAGE_KEY = 'thinkforward_auth';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  
  const authState = useAuthStore();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        
        if (savedAuth) {
          const parsedAuth = JSON.parse(savedAuth);
          
          const tokenExpiry = parsedAuth.tokenExpiry;
          const now = new Date().getTime();
          
          if (tokenExpiry && now < tokenExpiry) {
            authState.restoreAuth(
              parsedAuth.user,
              parsedAuth.token,
              parsedAuth.refreshToken
            );
          } else if (parsedAuth.refreshToken) {
            refreshToken();
          } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    };
    
    if (typeof window !== 'undefined') {
      loadAuthState();
    }
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (authState.isAuthenticated && authState.token) {
        const authData = {
          user: authState.user,
          token: authState.token,
          refreshToken: authState.refreshToken,
          tokenExpiry: authState.tokenExpiry
        };
        
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      } else if (!authState.isAuthenticated) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, [authState.isAuthenticated, authState.token, authState.refreshToken, authState.tokenExpiry]);
  
  const refreshToken = async (): Promise<boolean> => {
    if (!authState.refreshToken) return false;
    
    setIsRefreshing(true);
    
    try {
      const response = await authService.refreshToken(authState.refreshToken);
      
      if (response.success && response.data) {
        authState.updateToken(
          response.data.token,
          response.data.refreshToken,
          response.data.tokenExpiry
        );
        
        setIsRefreshing(false);
        return true;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setIsRefreshing(false);
      
      authState.logout();
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
      
      return false;
    }
  };
  
  useEffect(() => {
    const handleRouteChange = async (url: string) => {
      const isPreviewMode = true; // Set to true for preview
      
      if (isPreviewMode) {
        console.log('Preview mode: Bypassing authentication check for route:', url);
        return;
      }
      
      if (publicRoutes.some(route => url.startsWith(route))) {
        return;
      }
      
      if (!authState.isAuthenticated && !isRefreshing) {
        router.push({
          pathname: '/auth/login',
          query: { returnUrl: url },
        });
      }
    };
    
    if (router.isReady) {
      handleRouteChange(router.asPath);
    }
    
    router.events.on('routeChangeStart', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router, authState.isAuthenticated, isRefreshing]);
  
  useEffect(() => {
    if (!authState.isAuthenticated) return;
    
    const calculateRefreshTime = () => {
      if (!authState.tokenExpiry) return 15 * 60 * 1000; // 默认15分钟
      
      const now = new Date().getTime();
      const expiry = authState.tokenExpiry;
      const timeUntilExpiry = expiry - now;
      
      const refreshBuffer = 5 * 60 * 1000;
      
      if (timeUntilExpiry < refreshBuffer) {
        return 0;
      }
      
      return timeUntilExpiry - refreshBuffer;
    };
    
    const refreshTime = calculateRefreshTime();
    
    const refreshTimeout = setTimeout(async () => {
      const success = await refreshToken();
      
      if (success) {
        const newRefreshTime = calculateRefreshTime();
        setTimeout(async () => {
          await refreshToken();
        }, newRefreshTime);
      }
    }, refreshTime);
    
    return () => {
      clearTimeout(refreshTimeout);
    };
  }, [authState.isAuthenticated, authState.tokenExpiry]);
  
  const contextValue: AuthContextType = {
    ...authState,
    refreshToken,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WithAuth: React.FC<P> = (props) => {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
      setIsClient(true);
    }, []);
    
    if (isClient) {
      if (isLoading) {
        return <div>Loading...</div>;
      }
      
      if (!isAuthenticated) {
        router.push({
          pathname: '/auth/login',
          query: { returnUrl: router.asPath },
        });
        return null;
      }
    }
    
    return <Component {...props} />;
  };
  
  const displayName = Component.displayName || Component.name || 'Component';
  WithAuth.displayName = `withAuth(${displayName})`;
  
  return WithAuth;
};

export const withRole = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: Array<'admin' | 'consultant' | 'client'>
): React.FC<P> => {
  const WithRole: React.FC<P> = (props) => {
    const router = useRouter();
    const { t } = useTranslation('common');
    const { user, isAuthenticated, isLoading } = useAuth();
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
      setIsClient(true);
    }, []);
    
    if (isClient) {
      if (isLoading) {
        return <div>Loading...</div>;
      }
      
      if (!isAuthenticated) {
        router.push({
          pathname: '/auth/login',
          query: { returnUrl: router.asPath },
        });
        return null;
      }
      
      if (user && !allowedRoles.includes(user.role)) {
        router.push('/dashboard');
        return null;
      }
    }
    
    return <Component {...props} />;
  };
  
  const displayName = Component.displayName || Component.name || 'Component';
  WithRole.displayName = `withRole(${displayName})`;
  
  return WithRole;
};
