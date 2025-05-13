import { AxiosError } from 'axios';
import { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

export function useApiQuery<
  TData = unknown,
  TError = unknown,
  QueryKey extends [string, ...unknown[]] = [string, ...unknown[]]
>(
  queryKey: QueryKey,
  url: string,
  config?: any,
  options?: Omit<UseQueryOptions<TData, AxiosError<TError>, TData, QueryKey>, 'queryKey' | 'queryFn'>
) {
  global.mockApiGet?.(url, config);
  
  if (url === '/api/users/1') {
    return {
      isLoading: true,
      isSuccess: true,
      isError: false,
      data: { name: '测试用户' },
      error: null,
      refetch: jest.fn(),
    };
  } else if (url === '/api/users/2') {
    return {
      isLoading: false,
      isSuccess: false,
      isError: true,
      data: undefined,
      error: new Error('API错误'),
      refetch: jest.fn(),
    };
  } else {
    return {
      isLoading: false,
      isSuccess: true,
      isError: false,
      data: { name: '测试用户' } as unknown as TData,
      error: null,
      refetch: jest.fn(),
    };
  }
}

export function useApiMutation<
  TData = unknown,
  TError = unknown,
  TVariables = unknown
>(
  url: string,
  options?: Omit<UseMutationOptions<TData, AxiosError<TError>, TVariables>, 'mutationFn'>
) {
  
  const mutate = jest.fn((variables) => {
    global.mockApiPost?.(url, variables);
    return { id: 1, name: '新用户' };
  });
  
  return {
    isLoading: false,
    isSuccess: true,
    isError: false,
    data: { id: 1, name: '新用户' } as unknown as TData,
    error: null,
    mutate,
    mutateAsync: jest.fn().mockResolvedValue({ id: 1, name: '新用户' }),
  };
}

export const optimisticUpdate = jest.fn();
export const invalidateQueries = jest.fn();

export const cacheConfig = {
  short: { staleTime: 1000 * 60 * 5 }, // 5 minutes
  medium: { staleTime: 1000 * 60 * 30 }, // 30 minutes
  long: { staleTime: 1000 * 60 * 60 * 2 }, // 2 hours
  persistent: { staleTime: 1000 * 60 * 60 * 24 }, // 24 hours
};
