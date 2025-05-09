import { useApiMutation } from '../hooks';
import { User } from '../../store/zustand/useAuthStore';

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
