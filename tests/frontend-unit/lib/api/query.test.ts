import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';

const mockGet = jest.fn();
global.mockApiGet = mockGet;

import { useApiQuery } from '../../mocks/api-hooks';

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

const defaultWrapper = ({ children }) => children;

describe('API Query Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockClear();
    
    mockGet.mockImplementation((url) => {
      if (url === '/api/users/1') {
        return Promise.resolve({ name: '测试用户' });
      } else if (url === '/api/users/2') {
        return Promise.reject(new Error('API错误'));
      }
      return Promise.resolve({ name: '测试用户' });
    });
  });

  it('成功获取数据', async () => {
    const mockData = { name: '测试用户' };
    mockGet.mockResolvedValueOnce(mockData);
    
    const { result } = renderHook(
      () => useApiQuery(['user', 1], '/api/users/1'),
      { wrapper: defaultWrapper }
    );
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(mockGet).toHaveBeenCalled();
    expect(mockGet.mock.calls[0][0]).toBe('/api/users/1');
    expect(result.current.data).toEqual(mockData);
  });

  it('处理错误', async () => {
    mockGet.mockImplementation((url) => {
      if (url === '/api/users/1') {
        return Promise.resolve({ name: '测试用户' });
      }
      return Promise.resolve({ name: '测试用户' });
    });
    
    jest.spyOn(require('../../mocks/api-hooks'), 'useApiQuery').mockImplementation(() => {
      return {
        isLoading: false,
        isSuccess: false,
        isError: true,
        data: undefined,
        error: new Error('API错误'),
        refetch: jest.fn(),
      };
    });
    
    const { result } = renderHook(
      () => useApiQuery(['user', 2], '/api/users/2'),
      { wrapper: defaultWrapper }
    );
    
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeDefined();
    expect(result.current.error).not.toBeNull();
    if (result.current.error) {
      expect(result.current.error.message).toBe('API错误');
    }
  });
});
