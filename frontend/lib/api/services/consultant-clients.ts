import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { Client, ClientStats } from '../../store/zustand/useConsultantClientsStore';

interface ClientsListResponse {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
}

interface ClientsFilters {
  search?: string;
  status?: string;
  tags?: string[];
  source?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const useConsultantClients = (
  consultantId: string,
  filters: ClientsFilters
) => {
  return useQuery({
    queryKey: ['consultantClients', consultantId, filters],
    queryFn: async () => {
      const response = await apiClient.get<ClientsListResponse>(
        `/api/consultant/${consultantId}/clients`,
        {
          params: {
            ...filters,
            tags: filters.tags?.join(','),
          },
        }
      );
      return response.data;
    },
    enabled: !!consultantId,
  });
};

export const useConsultantClientStats = (consultantId: string) => {
  return useQuery({
    queryKey: ['consultantClientStats', consultantId],
    queryFn: async () => {
      const response = await apiClient.get<ClientStats>(
        `/api/consultant/${consultantId}/clients/stats`
      );
      return response.data;
    },
    enabled: !!consultantId,
  });
};

export const useAddClient = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      clientData,
    }: {
      consultantId: string;
      clientData: Omit<
        Client,
        'id' | 'userId' | 'displayName' | 'assignedConsultantId' | 'createdAt' | 'updatedAt'
      >;
    }) => {
      const response = await apiClient.post<Client>(
        `/api/consultant/${consultantId}/clients`,
        clientData
      );
      return response.data;
    },
  });
};

export const useUpdateClient = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      clientId,
      updates,
    }: {
      consultantId: string;
      clientId: string;
      updates: Partial<
        Omit<Client, 'id' | 'userId' | 'assignedConsultantId' | 'createdAt' | 'updatedAt'>
      >;
    }) => {
      const response = await apiClient.patch<Client>(
        `/api/consultant/${consultantId}/clients/${clientId}`,
        updates
      );
      return response.data;
    },
  });
};

export const useDeleteClient = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      clientId,
    }: {
      consultantId: string;
      clientId: string;
    }) => {
      await apiClient.delete(`/api/consultant/${consultantId}/clients/${clientId}`);
      return clientId;
    },
  });
};

export const useClientTags = (consultantId: string) => {
  return useQuery({
    queryKey: ['clientTags', consultantId],
    queryFn: async () => {
      const response = await apiClient.get<{ tags: string[] }>(
        `/api/consultant/${consultantId}/clients/tags`
      );
      return response.data.tags;
    },
    enabled: !!consultantId,
  });
};

export const useClientSources = (consultantId: string) => {
  return useQuery({
    queryKey: ['clientSources', consultantId],
    queryFn: async () => {
      const response = await apiClient.get<{ sources: string[] }>(
        `/api/consultant/${consultantId}/clients/sources`
      );
      return response.data.sources;
    },
    enabled: !!consultantId,
  });
};
