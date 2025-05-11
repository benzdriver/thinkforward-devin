import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { Consultant, DashboardStats } from '../../store/zustand/useConsultantDashboardStore';

export const useConsultantDashboard = (consultantId: string) => {
  return useQuery({
    queryKey: ['consultantDashboard', consultantId],
    queryFn: async () => {
      const response = await apiClient.get<{
        consultant: Consultant;
        stats: DashboardStats;
      }>(`/api/consultant/${consultantId}/dashboard`);
      return response.data;
    },
    enabled: !!consultantId,
  });
};

export const useUpdateConsultantStatus = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      status,
    }: {
      consultantId: string;
      status: 'active' | 'away' | 'offline';
    }) => {
      const response = await apiClient.patch<Consultant>(
        `/api/consultant/${consultantId}/status`,
        { status }
      );
      return response.data;
    },
  });
};

export const useUpdateTaskStatus = () => {
  return useMutation({
    mutationFn: async ({
      taskId,
      status,
    }: {
      taskId: string;
      status: 'pending' | 'in_progress' | 'completed';
    }) => {
      const response = await apiClient.patch<{
        id: string;
        status: 'pending' | 'in_progress' | 'completed';
      }>(`/api/tasks/${taskId}/status`, { status });
      return response.data;
    },
  });
};

export const useConsultantAppointments = (consultantId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['consultantAppointments', consultantId, page, limit],
    queryFn: async () => {
      const response = await apiClient.get<{
        appointments: DashboardStats['upcomingAppointments'];
        total: number;
        page: number;
        limit: number;
      }>(`/api/consultant/${consultantId}/appointments`, {
        params: { page, limit },
      });
      return response.data;
    },
    enabled: !!consultantId,
  });
};

export const useConsultantTasks = (consultantId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['consultantTasks', consultantId, page, limit],
    queryFn: async () => {
      const response = await apiClient.get<{
        tasks: DashboardStats['pendingTasks'];
        total: number;
        page: number;
        limit: number;
      }>(`/api/consultant/${consultantId}/tasks`, {
        params: { page, limit },
      });
      return response.data;
    },
    enabled: !!consultantId,
  });
};

export const useConsultantActivities = (consultantId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['consultantActivities', consultantId, page, limit],
    queryFn: async () => {
      const response = await apiClient.get<{
        activities: DashboardStats['recentActivity'];
        total: number;
        page: number;
        limit: number;
      }>(`/api/consultant/${consultantId}/activities`, {
        params: { page, limit },
      });
      return response.data;
    },
    enabled: !!consultantId,
  });
};

export const useConfirmAppointment = () => {
  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await apiClient.patch<{
        id: string;
        status: 'confirmed';
      }>(`/api/appointments/${appointmentId}/confirm`);
      return response.data;
    },
  });
};

export const useCancelAppointment = () => {
  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await apiClient.patch<{
        id: string;
        status: 'cancelled';
      }>(`/api/appointments/${appointmentId}/cancel`);
      return response.data;
    },
  });
};
