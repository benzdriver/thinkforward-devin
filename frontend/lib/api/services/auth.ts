import { useApiMutation } from '../hooks';
import { User } from '../../store/zustand/useAuthStore';
import { apiClient } from '../client';

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  token: string;
  refreshToken: string;
  tokenExpiry: number;
};

export type RefreshTokenResponse = {
  token: string;
  refreshToken: string;
  tokenExpiry: number;
};

export function useLogin() {
  return useApiMutation<AuthResponse, LoginRequest>('/auth/login');
}

export function useRegister() {
  return useApiMutation<AuthResponse, RegisterRequest>('/auth/register');
}

export function useLogout() {
  return useApiMutation<void, void>('/auth/logout');
}

export function useResetPassword() {
  return useApiMutation<void, { email: string }>('/auth/reset-password');
}

export function useChangePassword() {
  return useApiMutation<void, { currentPassword: string; newPassword: string }>('/auth/change-password');
}

export const authService = {
  async refreshToken(refreshToken: string): Promise<{ success: boolean; data?: RefreshTokenResponse }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: {
          token: 'new-mock-jwt-token',
          refreshToken: 'new-mock-refresh-token',
          tokenExpiry: new Date().getTime() + 30 * 60 * 1000, // 30分钟后过期
        }
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return { success: false };
    }
  },
  
  async validateToken(token: string): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
};
