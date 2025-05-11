import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import {
  ClientDetail,
  ClientNote,
  ClientDocument,
  ClientAppointment,
  ClientCase,
  ClientActivity,
} from '../../store/zustand/useClientDetailStore';

export const useClientDetail = (consultantId: string, clientId: string) => {
  return useQuery({
    queryKey: ['clientDetail', consultantId, clientId],
    queryFn: async () => {
      const response = await apiClient.get<ClientDetail>(
        `/api/consultant/${consultantId}/clients/${clientId}`
      );
      return response.data;
    },
    enabled: !!consultantId && !!clientId,
  });
};

export const useUpdateClientDetail = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      clientId,
      updates,
    }: {
      consultantId: string;
      clientId: string;
      updates: Partial<ClientDetail>;
    }) => {
      const response = await apiClient.patch<ClientDetail>(
        `/api/consultant/${consultantId}/clients/${clientId}`,
        updates
      );
      return response.data;
    },
  });
};

export const useClientNotes = (
  consultantId: string,
  clientId: string,
  page = 1,
  limit = 20
) => {
  return useQuery({
    queryKey: ['clientNotes', consultantId, clientId, page, limit],
    queryFn: async () => {
      const response = await apiClient.get<{
        notes: ClientNote[];
        total: number;
        page: number;
        limit: number;
      }>(`/api/consultant/${consultantId}/clients/${clientId}/notes`, {
        params: { page, limit },
      });
      return response.data;
    },
    enabled: !!consultantId && !!clientId,
  });
};

export const useAddClientNote = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      clientId,
      content,
      isPrivate,
    }: {
      consultantId: string;
      clientId: string;
      content: string;
      isPrivate: boolean;
    }) => {
      const response = await apiClient.post<ClientNote>(
        `/api/consultant/${consultantId}/clients/${clientId}/notes`,
        { content, isPrivate }
      );
      return response.data;
    },
  });
};

export const useUpdateClientNote = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      clientId,
      noteId,
      updates,
    }: {
      consultantId: string;
      clientId: string;
      noteId: string;
      updates: Partial<Pick<ClientNote, 'content' | 'isPrivate'>>;
    }) => {
      const response = await apiClient.patch<ClientNote>(
        `/api/consultant/${consultantId}/clients/${clientId}/notes/${noteId}`,
        updates
      );
      return response.data;
    },
  });
};

export const useDeleteClientNote = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      clientId,
      noteId,
    }: {
      consultantId: string;
      clientId: string;
      noteId: string;
    }) => {
      await apiClient.delete(
        `/api/consultant/${consultantId}/clients/${clientId}/notes/${noteId}`
      );
      return noteId;
    },
  });
};

export const useClientDocuments = (
  consultantId: string,
  clientId: string,
  page = 1,
  limit = 20,
  category?: string,
  status?: string
) => {
  return useQuery({
    queryKey: ['clientDocuments', consultantId, clientId, page, limit, category, status],
    queryFn: async () => {
      const response = await apiClient.get<{
        documents: ClientDocument[];
        total: number;
        page: number;
        limit: number;
      }>(`/api/consultant/${consultantId}/clients/${clientId}/documents`, {
        params: { page, limit, category, status },
      });
      return response.data;
    },
    enabled: !!consultantId && !!clientId,
  });
};

export const useUploadClientDocument = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      clientId,
      formData,
    }: {
      consultantId: string;
      clientId: string;
      formData: FormData;
    }) => {
      const response = await apiClient.post<ClientDocument>(
        `/api/consultant/${consultantId}/clients/${clientId}/documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
  });
};

export const useUpdateClientDocument = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      clientId,
      documentId,
      updates,
    }: {
      consultantId: string;
      clientId: string;
      documentId: string;
      updates: Partial<Pick<ClientDocument, 'name' | 'category' | 'status' | 'notes'>>;
    }) => {
      const response = await apiClient.patch<ClientDocument>(
        `/api/consultant/${consultantId}/clients/${clientId}/documents/${documentId}`,
        updates
      );
      return response.data;
    },
  });
};

export const useDeleteClientDocument = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      clientId,
      documentId,
    }: {
      consultantId: string;
      clientId: string;
      documentId: string;
    }) => {
      await apiClient.delete(
        `/api/consultant/${consultantId}/clients/${clientId}/documents/${documentId}`
      );
      return documentId;
    },
  });
};

export const useClientAppointments = (
  consultantId: string,
  clientId: string,
  page = 1,
  limit = 20,
  status?: string,
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: [
      'clientAppointments',
      consultantId,
      clientId,
      page,
      limit,
      status,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      const response = await apiClient.get<{
        appointments: ClientAppointment[];
        total: number;
        page: number;
        limit: number;
      }>(`/api/consultant/${consultantId}/clients/${clientId}/appointments`, {
        params: { page, limit, status, startDate, endDate },
      });
      return response.data;
    },
    enabled: !!consultantId && !!clientId,
  });
};

export const useCreateClientAppointment = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      clientId,
      appointmentData,
    }: {
      consultantId: string;
      clientId: string;
      appointmentData: Omit<
        ClientAppointment,
        'id' | 'clientId' | 'consultantId' | 'createdAt' | 'updatedAt'
      >;
    }) => {
      const response = await apiClient.post<ClientAppointment>(
        `/api/consultant/${consultantId}/clients/${clientId}/appointments`,
        appointmentData
      );
      return response.data;
    },
  });
};

export const useUpdateClientAppointment = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      clientId,
      appointmentId,
      updates,
    }: {
      consultantId: string;
      clientId: string;
      appointmentId: string;
      updates: Partial<
        Omit<ClientAppointment, 'id' | 'clientId' | 'consultantId' | 'createdAt' | 'updatedAt'>
      >;
    }) => {
      const response = await apiClient.patch<ClientAppointment>(
        `/api/consultant/${consultantId}/clients/${clientId}/appointments/${appointmentId}`,
        updates
      );
      return response.data;
    },
  });
};

export const useDeleteClientAppointment = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      clientId,
      appointmentId,
    }: {
      consultantId: string;
      clientId: string;
      appointmentId: string;
    }) => {
      await apiClient.delete(
        `/api/consultant/${consultantId}/clients/${clientId}/appointments/${appointmentId}`
      );
      return appointmentId;
    },
  });
};

export const useClientCases = (
  consultantId: string,
  clientId: string,
  page = 1,
  limit = 20,
  status?: string
) => {
  return useQuery({
    queryKey: ['clientCases', consultantId, clientId, page, limit, status],
    queryFn: async () => {
      const response = await apiClient.get<{
        cases: ClientCase[];
        total: number;
        page: number;
        limit: number;
      }>(`/api/consultant/${consultantId}/clients/${clientId}/cases`, {
        params: { page, limit, status },
      });
      return response.data;
    },
    enabled: !!consultantId && !!clientId,
  });
};

export const useCreateClientCase = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      clientId,
      caseData,
    }: {
      consultantId: string;
      clientId: string;
      caseData: Omit<
        ClientCase,
        'id' | 'clientId' | 'consultantId' | 'createdAt' | 'updatedAt'
      >;
    }) => {
      const response = await apiClient.post<ClientCase>(
        `/api/consultant/${consultantId}/clients/${clientId}/cases`,
        caseData
      );
      return response.data;
    },
  });
};

export const useUpdateClientCase = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      clientId,
      caseId,
      updates,
    }: {
      consultantId: string;
      clientId: string;
      caseId: string;
      updates: Partial<
        Omit<ClientCase, 'id' | 'clientId' | 'consultantId' | 'createdAt' | 'updatedAt'>
      >;
    }) => {
      const response = await apiClient.patch<ClientCase>(
        `/api/consultant/${consultantId}/clients/${clientId}/cases/${caseId}`,
        updates
      );
      return response.data;
    },
  });
};

export const useDeleteClientCase = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      clientId,
      caseId,
    }: {
      consultantId: string;
      clientId: string;
      caseId: string;
    }) => {
      await apiClient.delete(
        `/api/consultant/${consultantId}/clients/${clientId}/cases/${caseId}`
      );
      return caseId;
    },
  });
};

export const useClientActivities = (
  consultantId: string,
  clientId: string,
  page = 1,
  limit = 20,
  type?: string,
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: [
      'clientActivities',
      consultantId,
      clientId,
      page,
      limit,
      type,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      const response = await apiClient.get<{
        activities: ClientActivity[];
        total: number;
        page: number;
        limit: number;
      }>(`/api/consultant/${consultantId}/clients/${clientId}/activities`, {
        params: { page, limit, type, startDate, endDate },
      });
      return response.data;
    },
    enabled: !!consultantId && !!clientId,
  });
};
