import { 
  useQuery, 
  useMutation,
  useInfiniteQuery,
  UseQueryOptions, 
  UseMutationOptions,
  UseInfiniteQueryOptions,
  QueryClient,
  QueryKey
} from '@tanstack/react-query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { get, post, put, patch, del } from './client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (axios.isAxiosError(error) && !error.response) {
          return failureCount < 3;
        }
        if (axios.isAxiosError(error) && error.response) {
          const status = error.response.status;
          if (status === 503 || status === 504) {
            return failureCount < 3;
          }
        }
        return false;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

export type ApiError = {
  message: string;
  code?: string;
  details?: Record<string, any>;
};

export const cacheConfig = {
  short: {
    staleTime: 30 * 1000, // 30秒
    gcTime: 1 * 60 * 1000, // 1分钟 (formerly cacheTime)
  },
  medium: {
    staleTime: 5 * 60 * 1000, // 5分钟
    gcTime: 10 * 60 * 1000, // 10分钟
  },
  long: {
    staleTime: 30 * 60 * 1000, // 30分钟
    gcTime: 60 * 60 * 1000, // 1小时
  },
  persistent: {
    staleTime: 24 * 60 * 60 * 1000, // 24小时
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7天
  },
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

/**
 * 分页查询钩子
 */
export function useApiPaginatedQuery<TData, TError = ApiError>(
  queryKey: QueryKey,
  url: string,
  page: number,
  limit: number,
  config?: AxiosRequestConfig,
  options?: Omit<UseQueryOptions<TData, AxiosError<TError>, TData, QueryKey>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, AxiosError<TError>, TData, QueryKey>({
    queryKey: [...queryKey, page, limit],
    queryFn: () => get<TData>(`${url}?page=${page}&limit=${limit}`, config),
    placeholderData: (previousData) => previousData, // 替代 keepPreviousData
    ...options,
  });
}

/**
 * 无限加载查询钩子
 */
export function useApiInfiniteQuery<TData, TError = ApiError>(
  queryKey: QueryKey,
  url: string,
  getNextPageParam: (lastPage: TData, allPages: TData[]) => number | undefined,
  config?: AxiosRequestConfig,
  options?: Omit<UseInfiniteQueryOptions<TData, AxiosError<TError>, TData, TData[], QueryKey>, 'queryKey' | 'queryFn' | 'getNextPageParam'>
) {
  return useInfiniteQuery<TData, AxiosError<TError>, TData, TData[], QueryKey>({
    queryKey,
    queryFn: ({ pageParam = 1 }) => get<TData>(`${url}?page=${pageParam}`, config),
    getNextPageParam,
    ...options,
  });
}

/**
 * 全局错误处理钩子
 */
export function useGlobalErrorHandler() {
  return {
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        console.error('API Error:', apiError?.message || '请求处理过程中发生错误');
      } else if (error instanceof Error) {
        console.error('Error:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
    }
  };
}

/**
 * 获取重试逻辑
 */
export function getRetryLogic(maxRetries = 3) {
  return (failureCount: number, error: unknown) => {
    if (axios.isAxiosError(error) && !error.response) {
      return failureCount < maxRetries;
    }
    
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 503 || status === 504) {
        return failureCount < maxRetries;
      }
    }
    
    return false;
  };
}

/**
 * 请求状态钩子
 */
export function useRequestStatus<TData, TError>(
  query: any // UseQueryResult<TData, TError> 类型，但为了避免循环引用问题使用 any
) {
  const { isLoading, isError, error, data, isFetching, isSuccess } = query;
  
  return {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isSuccess,
    isEmpty: isSuccess && (!data || (Array.isArray(data) && data.length === 0)),
    isLoadingOrFetching: isLoading || isFetching,
  };
}
