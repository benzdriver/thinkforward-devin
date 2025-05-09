import { 
  useQuery, 
  useMutation, 
  UseQueryOptions, 
  UseMutationOptions,
  QueryClient,
  QueryKey
} from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { get, post, put, patch, del } from './client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export type ApiError = {
  message: string;
  code?: string;
  details?: Record<string, any>;
};

export function useApiQuery<TData, TError = ApiError>(
  queryKey: QueryKey,
  url: string,
  config?: AxiosRequestConfig,
  options?: Omit<UseQueryOptions<TData, AxiosError<TError>, TData, QueryKey>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, AxiosError<TError>, TData, QueryKey>({
    queryKey,
    queryFn: () => get<TData>(url, config),
    ...options,
  });
}

export function useApiMutation<TData, TVariables, TError = ApiError>(
  url: string,
  options?: Omit<UseMutationOptions<TData, AxiosError<TError>, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, AxiosError<TError>, TVariables>({
    mutationFn: (variables) => post<TData>(url, variables),
    ...options,
  });
}

export function useApiPutMutation<TData, TVariables, TError = ApiError>(
  url: string,
  options?: Omit<UseMutationOptions<TData, AxiosError<TError>, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, AxiosError<TError>, TVariables>({
    mutationFn: (variables) => put<TData>(url, variables),
    ...options,
  });
}

export function useApiPatchMutation<TData, TVariables, TError = ApiError>(
  url: string,
  options?: Omit<UseMutationOptions<TData, AxiosError<TError>, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, AxiosError<TError>, TVariables>({
    mutationFn: (variables) => patch<TData>(url, variables),
    ...options,
  });
}

export function useApiDeleteMutation<TData, TVariables, TError = ApiError>(
  url: string,
  options?: Omit<UseMutationOptions<TData, AxiosError<TError>, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, AxiosError<TError>, TVariables>({
    mutationFn: (variables) => del<TData>(`${url}${variables ? `/${variables}` : ''}`),
    ...options,
  });
}

export function optimisticUpdate<TData, TVariables>(
  queryKey: QueryKey,
  updateFn: (oldData: TData, variables: TVariables) => TData
) {
  return {
    onMutate: async (variables: TVariables) => {
      await queryClient.cancelQueries({ queryKey });
      
      const previousData = queryClient.getQueryData<TData>(queryKey);
      
      if (previousData) {
        queryClient.setQueryData<TData>(
          queryKey,
          (old) => old ? updateFn(old, variables) : old
        );
      }
      
      return { previousData };
    },
    onError: (_err: unknown, _variables: TVariables, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  };
}

export function invalidateQueries(queryKey: QueryKey) {
  return {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  };
}
