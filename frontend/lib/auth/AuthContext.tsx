import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useAuthStore, User } from '../store/zustand/useAuthStore';

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
];

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  
  const authState = useAuthStore();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const refreshToken = async (): Promise<boolean> => {
    if (!authState.token) return false;
    
    setIsRefreshing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      
      setIsRefreshing(false);
      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setIsRefreshing(false);
      
      authState.logout();
      return false;
    }
  };
  
  useEffect(() => {
    const handleRouteChange = async (url: string) => {
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
    
    const refreshInterval = setInterval(async () => {
      await refreshToken();
    }, 15 * 60 * 1000); // 15 minutes
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [authState.isAuthenticated]);
  
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
