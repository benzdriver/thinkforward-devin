import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { 
  useApiQuery, 
  useApiMutation, 
  optimisticUpdate,
  invalidateQueries,
  cacheConfig
} from '../../../lib/api/hooks';

jest.mock('axios', () => ({
  isAxiosError: jest.fn(),
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  }
}));

jest.mock('../../../lib/api/client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  del: jest.fn(),
}));

import { get, post, put, patch, del } from '../../../lib/api/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('API Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe('useApiQuery', () => {
    it('成功获取数据', async () => {
      const mockData = { name: '测试用户' };
      (get as jest.Mock).mockResolvedValueOnce(mockData);
      
      const { result } = renderHook(
        () => useApiQuery(['user', 1], '/api/users/1'),
        { wrapper }
      );
      
      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      expect(get).toHaveBeenCalledWith('/api/users/1', undefined);
      expect(result.current.data).toEqual(mockData);
    });

    it('处理错误', async () => {
      const error = new Error('API错误');
      (get as jest.Mock).mockRejectedValueOnce(error);
      
      const { result } = renderHook(
        () => useApiQuery(['user', 2], '/api/users/2'),
        { wrapper }
      );
      
      await waitFor(() => expect(result.current.isError).toBe(true));
      
      expect(get).toHaveBeenCalledWith('/api/users/2', undefined);
      expect(result.current.error).toBeDefined();
    });
  });

  describe('useApiMutation', () => {
    it('成功提交数据', async () => {
      const mockData = { id: 1, name: '新用户' };
      const mockVariables = { name: '新用户' };
      (post as jest.Mock).mockResolvedValueOnce(mockData);
      
      const { result } = renderHook(
        () => useApiMutation('/api/users'),
        { wrapper }
      );
      
      result.current.mutate(mockVariables);
      
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      expect(post).toHaveBeenCalledWith('/api/users', mockVariables);
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('缓存配置', () => {
    it('应该有不同的缓存配置', () => {
      expect(cacheConfig.short.staleTime).toBeLessThan(cacheConfig.medium.staleTime);
      expect(cacheConfig.medium.staleTime).toBeLessThan(cacheConfig.long.staleTime);
      expect(cacheConfig.long.staleTime).toBeLessThan(cacheConfig.persistent.staleTime);
    });
  });
});
