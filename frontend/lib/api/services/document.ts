import { queryClient } from '../../api';
import { useApiQuery, useApiMutation, useApiDeleteMutation, invalidateQueries } from '../../api/hooks';
import { Document, DocumentCategory } from '../../store/zustand/useDocumentStore';

export function useGetDocuments(userId: string) {
  return useApiQuery<Document[]>(
    ['documents', userId],
    `/documents/${userId}`
  );
}

export function useGetDocumentsByCategory(userId: string, categoryId: string) {
  return useApiQuery<Document[]>(
    ['documents', userId, categoryId],
    `/documents/${userId}/category/${categoryId}`
  );
}

export function useGetDocument(userId: string, documentId: string) {
  return useApiQuery<Document>(
    ['document', userId, documentId],
    `/documents/${userId}/${documentId}`
  );
}

export function useUploadDocument(userId: string) {
  return useApiMutation<Document, FormData>(
    `/documents/${userId}/upload`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['documents', userId] });
      }
    }
  );
}

export function useUpdateDocument(userId: string, documentId: string) {
  return useApiMutation<Document, Partial<Document>>(
    `/documents/${userId}/${documentId}`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['documents', userId] });
        queryClient.invalidateQueries({ queryKey: ['document', userId, documentId] });
      }
    }
  );
}

export function useDeleteDocument(userId: string) {
  return useApiDeleteMutation<void, string>(
    `/documents/${userId}/:documentId`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['documents', userId] });
      }
    }
  );
}

export function useGetDocumentCategories() {
  return useApiQuery<DocumentCategory[]>(
    ['document-categories'],
    '/document-categories'
  );
}

export function useCreateDocumentCategory() {
  return useApiMutation<DocumentCategory, Omit<DocumentCategory, 'id'>>(
    '/document-categories',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['document-categories'] });
      }
    }
  );
}

export function useUpdateDocumentCategory(categoryId: string) {
  return useApiMutation<DocumentCategory, Partial<DocumentCategory>>(
    `/document-categories/${categoryId}`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['document-categories'] });
      }
    }
  );
}

export function useDeleteDocumentCategory() {
  return useApiDeleteMutation<void, string>(
    `/document-categories/:categoryId`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['document-categories'] });
      }
    }
  );
}
