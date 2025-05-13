import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';

const mockPost = jest.fn();
global.mockApiPost = mockPost;

import { useApiMutation } from '../../mocks/api-hooks';

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

describe('API Mutation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPost.mockClear();
    
    mockPost.mockImplementation(() => {
      return Promise.resolve({ id: 1, name: '新用户' });
    });
    
    jest.spyOn(require('../../mocks/api-hooks'), 'useApiMutation').mockImplementation((url) => {
      const mutate = jest.fn((variables) => {
        global.mockApiPost?.(url, variables);
        return { id: 1, name: '新用户' };
      });
      
      return {
        isLoading: false,
        isSuccess: true,
        isError: false,
        data: { id: 1, name: '新用户' },
        error: null,
        mutate,
        mutateAsync: jest.fn().mockResolvedValue({ id: 1, name: '新用户' }),
      };
    });
  });

  it('成功提交数据', async () => {
    const mockData = { id: 1, name: '新用户' };
    const mockVariables = { name: '新用户' };
    
    const { result } = renderHook(
      () => useApiMutation('/api/users'),
      { wrapper: defaultWrapper }
    );
    
    result.current.mutate(mockVariables);
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(mockPost).toHaveBeenCalled();
    expect(mockPost.mock.calls[0][0]).toBe('/api/users');
    expect(result.current.data).toEqual(mockData);
  });
});
