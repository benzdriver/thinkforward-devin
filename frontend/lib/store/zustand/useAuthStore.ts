import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'consultant' | 'client';
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

export type AuthActions = {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  resetError: () => void;
};

export type AuthStore = AuthState & AuthActions;

const mockLogin = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === 'test@example.com' && password === 'password') {
    return {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'client',
      },
      token: 'mock-jwt-token',
    };
  }
  
  throw new Error('Invalid credentials');
};

const mockRegister = async (email: string, password: string, name: string): Promise<{ user: User; token: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    user: {
      id: '2',
      email,
      name,
      role: 'client',
    },
    token: 'mock-jwt-token',
  };
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          const { user, token } = await mockLogin(email, password);
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred',
          });
        }
      },
      
      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        
        try {
          const { user, token } = await mockRegister(email, password, name);
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred',
          });
        }
      },
      
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          error: null,
        });
      },
      
      resetError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
