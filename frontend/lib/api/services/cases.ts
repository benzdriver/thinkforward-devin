import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import {
  CaseListItem,
  CaseDetail,
  CaseNote,
  CaseDocument,
  CaseTask,
  CaseTimelineEvent,
  CaseStats
} from '../../store/zustand/useCasesStore';

interface CasesListResponse {
  cases: CaseListItem[];
  total: number;
  page: number;
  limit: number;
}

interface CasesFilters {
  search?: string;
  status?: string;
  type?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const useCases = (
  consultantId: string,
  filters: CasesFilters
) => {
  return useQuery({
    queryKey: ['cases', consultantId, filters],
    queryFn: async () => {
      const response = await apiClient.get<CasesListResponse>(
        `/api/consultant/${consultantId}/cases`,
        {
          params: filters,
        }
      );
      return response.data;
    },
    enabled: !!consultantId,
  });
};

export const useCaseStats = (consultantId: string) => {
  return useQuery({
    queryKey: ['caseStats', consultantId],
    queryFn: async () => {
      const response = await apiClient.get<CaseStats>(
        `/api/consultant/${consultantId}/cases/stats`
      );
      return response.data;
    },
    enabled: !!consultantId,
  });
};

export const useCaseTypes = (consultantId: string) => {
  return useQuery({
    queryKey: ['caseTypes', consultantId],
    queryFn: async () => {
      const response = await apiClient.get<{ types: string[] }>(
        `/api/consultant/${consultantId}/cases/types`
      );
      return response.data.types;
    },
    enabled: !!consultantId,
  });
};

export const useCaseDetail = (consultantId: string, caseId: string) => {
  return useQuery({
    queryKey: ['caseDetail', consultantId, caseId],
    queryFn: async () => {
      const response = await apiClient.get<CaseDetail>(
        `/api/consultant/${consultantId}/cases/${caseId}`
      );
      return response.data;
    },
    enabled: !!consultantId && !!caseId,
  });
};

export const useCreateCase = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      caseData,
    }: {
      consultantId: string;
      caseData: {
        title: string;
        clientId: string;
        type: string;
        description: string;
        priority: 'low' | 'medium' | 'high';
        dueDate?: string;
        tasks?: {
          title: string;
          description?: string;
          status: 'pending' | 'in-progress' | 'completed';
          priority: 'low' | 'medium' | 'high';
          dueDate?: string;
        }[];
      };
    }) => {
      const response = await apiClient.post<CaseListItem>(
        `/api/consultant/${consultantId}/cases`,
        caseData
      );
      return response.data;
    },
  });
};

export const useUpdateCase = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      caseId,
      updates,
    }: {
      consultantId: string;
      caseId: string;
      updates: Partial<{
        title: string;
        description: string;
        status: 'open' | 'in-progress' | 'pending' | 'closed' | 'archived';
        priority: 'low' | 'medium' | 'high';
        progress: number;
        dueDate: string;
      }>;
    }) => {
      const response = await apiClient.patch<CaseListItem>(
        `/api/consultant/${consultantId}/cases/${caseId}`,
        updates
      );
      return response.data;
    },
  });
};

export const useDeleteCase = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      caseId,
    }: {
      consultantId: string;
      caseId: string;
    }) => {
      await apiClient.delete(`/api/consultant/${consultantId}/cases/${caseId}`);
      return caseId;
    },
  });
};

export const useCaseTasks = (
  consultantId: string,
  caseId: string,
  filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: ['caseTasks', consultantId, caseId, filters],
    queryFn: async () => {
      const response = await apiClient.get<{
        tasks: CaseTask[];
        total: number;
        page: number;
        limit: number;
      }>(`/api/consultant/${consultantId}/cases/${caseId}/tasks`, {
        params: filters,
      });
      return response.data;
    },
    enabled: !!consultantId && !!caseId,
  });
};

export const useCreateTask = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      caseId,
      taskData,
    }: {
      consultantId: string;
      caseId: string;
      taskData: {
        title: string;
        description?: string;
        assigneeId?: string;
        status: 'pending' | 'in-progress' | 'completed';
        priority: 'low' | 'medium' | 'high';
        dueDate?: string;
      };
    }) => {
      const response = await apiClient.post<CaseTask>(
        `/api/consultant/${consultantId}/cases/${caseId}/tasks`,
        taskData
      );
      return response.data;
    },
  });
};

export const useUpdateTask = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      caseId,
      taskId,
      updates,
    }: {
      consultantId: string;
      caseId: string;
      taskId: string;
      updates: Partial<{
        title: string;
        description: string;
        assigneeId: string;
        status: 'pending' | 'in-progress' | 'completed';
        priority: 'low' | 'medium' | 'high';
        dueDate: string;
        completedAt: string;
      }>;
    }) => {
      const response = await apiClient.patch<CaseTask>(
        `/api/consultant/${consultantId}/cases/${caseId}/tasks/${taskId}`,
        updates
      );
      return response.data;
    },
  });
};

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      caseId,
      taskId,
    }: {
      consultantId: string;
      caseId: string;
      taskId: string;
    }) => {
      await apiClient.delete(
        `/api/consultant/${consultantId}/cases/${caseId}/tasks/${taskId}`
      );
      return taskId;
    },
  });
};

export const useCaseNotes = (
  consultantId: string,
  caseId: string,
  filters?: {
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: ['caseNotes', consultantId, caseId, filters],
    queryFn: async () => {
      const response = await apiClient.get<{
        notes: CaseNote[];
        total: number;
        page: number;
        limit: number;
      }>(`/api/consultant/${consultantId}/cases/${caseId}/notes`, {
        params: filters,
      });
      return response.data;
    },
    enabled: !!consultantId && !!caseId,
  });
};

export const useCreateNote = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      caseId,
      noteData,
    }: {
      consultantId: string;
      caseId: string;
      noteData: {
        content: string;
        isPrivate: boolean;
      };
    }) => {
      const response = await apiClient.post<CaseNote>(
        `/api/consultant/${consultantId}/cases/${caseId}/notes`,
        noteData
      );
      return response.data;
    },
  });
};

export const useUpdateNote = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      caseId,
      noteId,
      updates,
    }: {
      consultantId: string;
      caseId: string;
      noteId: string;
      updates: Partial<{
        content: string;
        isPrivate: boolean;
      }>;
    }) => {
      const response = await apiClient.patch<CaseNote>(
        `/api/consultant/${consultantId}/cases/${caseId}/notes/${noteId}`,
        updates
      );
      return response.data;
    },
  });
};

export const useDeleteNote = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      caseId,
      noteId,
    }: {
      consultantId: string;
      caseId: string;
      noteId: string;
    }) => {
      await apiClient.delete(
        `/api/consultant/${consultantId}/cases/${caseId}/notes/${noteId}`
      );
      return noteId;
    },
  });
};

export const useCaseDocuments = (
  consultantId: string,
  caseId: string,
  filters?: {
    category?: string;
    status?: string;
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: ['caseDocuments', consultantId, caseId, filters],
    queryFn: async () => {
      const response = await apiClient.get<{
        documents: CaseDocument[];
        total: number;
        page: number;
        limit: number;
      }>(`/api/consultant/${consultantId}/cases/${caseId}/documents`, {
        params: filters,
      });
      return response.data;
    },
    enabled: !!consultantId && !!caseId,
  });
};

export const useUploadDocument = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      caseId,
      formData,
    }: {
      consultantId: string;
      caseId: string;
      formData: FormData;
    }) => {
      const response = await apiClient.post<CaseDocument>(
        `/api/consultant/${consultantId}/cases/${caseId}/documents`,
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

export const useUpdateDocument = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      caseId,
      documentId,
      updates,
    }: {
      consultantId: string;
      caseId: string;
      documentId: string;
      updates: Partial<{
        name: string;
        category: string;
        status: 'pending' | 'verified' | 'rejected';
        notes: string;
      }>;
    }) => {
      const response = await apiClient.patch<CaseDocument>(
        `/api/consultant/${consultantId}/cases/${caseId}/documents/${documentId}`,
        updates
      );
      return response.data;
    },
  });
};

export const useDeleteDocument = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      caseId,
      documentId,
    }: {
      consultantId: string;
      caseId: string;
      documentId: string;
    }) => {
      await apiClient.delete(
        `/api/consultant/${consultantId}/cases/${caseId}/documents/${documentId}`
      );
      return documentId;
    },
  });
};

export const useCaseTimeline = (
  consultantId: string,
  caseId: string,
  filters?: {
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: ['caseTimeline', consultantId, caseId, filters],
    queryFn: async () => {
      const response = await apiClient.get<{
        events: CaseTimelineEvent[];
        total: number;
        page: number;
        limit: number;
      }>(`/api/consultant/${consultantId}/cases/${caseId}/timeline`, {
        params: filters,
      });
      return response.data;
    },
    enabled: !!consultantId && !!caseId,
  });
};
