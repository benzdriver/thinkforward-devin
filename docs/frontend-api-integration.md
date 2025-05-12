# API 集成

## 概述

ThinkForward AI 前端应用使用 React Query 和 Axios 实现了一套完整的 API 集成解决方案，提供了高效、可靠的数据获取和状态管理能力。本文档详细介绍了 API 集成的实现方式、使用方法和最佳实践。

## 技术实现

### API 客户端

- 位置：`/frontend/lib/api/client.ts`
- 基于 Axios 实现
- 主要功能：
  - 请求拦截器（添加认证令牌）
  - 响应拦截器（错误处理）
  - 请求方法封装（GET, POST, PUT, PATCH, DELETE）

### API 钩子

- 位置：`/frontend/lib/api/hooks.ts`
- 基于 React Query 实现
- 主要功能：
  - 数据获取钩子
  - 数据修改钩子
  - 错误处理
  - 缓存管理
  - 乐观更新
  - 请求状态管理

### 查询客户端配置

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // 网络错误自动重试，其他错误不重试
        if (axios.isAxiosError(error) && !error.response) {
          return failureCount < 3;
        }
        // 服务器过载 (503) 或网关超时 (504) 错误自动重试
        if (axios.isAxiosError(error) && error.response) {
          const status = error.response.status;
          if (status === 503 || status === 504) {
            return failureCount < 3;
          }
        }
        return false;
      },
      staleTime: 5 * 60 * 1000, // 5 分钟
      gcTime: 10 * 60 * 1000, // 10 分钟 (formerly cacheTime)
    },
  },
});
```

## 数据获取钩子

### 基本查询钩子

```typescript
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
```

### 分页查询钩子

```typescript
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
```

### 无限加载查询钩子

```typescript
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
```

## 数据修改钩子

### 基本修改钩子

```typescript
export function useApiMutation<TData, TVariables, TError = ApiError>(
  url: string,
  options?: Omit<UseMutationOptions<TData, AxiosError<TError>, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, AxiosError<TError>, TVariables>({
    mutationFn: (variables) => post<TData>(url, variables),
    ...options,
  });
}
```

### PUT 修改钩子

```typescript
export function useApiPutMutation<TData, TVariables, TError = ApiError>(
  url: string,
  options?: Omit<UseMutationOptions<TData, AxiosError<TError>, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, AxiosError<TError>, TVariables>({
    mutationFn: (variables) => put<TData>(url, variables),
    ...options,
  });
}
```

### PATCH 修改钩子

```typescript
export function useApiPatchMutation<TData, TVariables, TError = ApiError>(
  url: string,
  options?: Omit<UseMutationOptions<TData, AxiosError<TError>, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, AxiosError<TError>, TVariables>({
    mutationFn: (variables) => patch<TData>(url, variables),
    ...options,
  });
}
```

### DELETE 修改钩子

```typescript
export function useApiDeleteMutation<TData, TVariables, TError = ApiError>(
  url: string,
  options?: Omit<UseMutationOptions<TData, AxiosError<TError>, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, AxiosError<TError>, TVariables>({
    mutationFn: (variables) => del<TData>(`${url}${variables ? `/${variables}` : ''}`),
    ...options,
  });
}
```

## 错误处理

### 错误类型定义

```typescript
export type ApiError = {
  message: string;
  code?: string;
  details?: Record<string, any>;
};
```

### 全局错误处理

```typescript
export function useGlobalErrorHandler() {
  const { showErrorNotification } = useNotification();
  
  return {
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        showErrorNotification(
          '操作失败',
          apiError?.message || '请求处理过程中发生错误，请稍后再试'
        );
      } else if (error instanceof Error) {
        showErrorNotification('操作失败', error.message);
      } else {
        showErrorNotification('操作失败', '发生未知错误，请稍后再试');
      }
    }
  };
}
```

### 错误重试逻辑

```typescript
export function getRetryLogic(maxRetries = 3) {
  return (failureCount: number, error: unknown) => {
    // 网络错误自动重试
    if (axios.isAxiosError(error) && !error.response) {
      return failureCount < maxRetries;
    }
    
    // 服务器过载 (503) 或网关超时 (504) 错误自动重试
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 503 || status === 504) {
        return failureCount < maxRetries;
      }
    }
    
    // 其他错误不重试
    return false;
  };
}
```

## 缓存管理

### 缓存配置

```typescript
export const cacheConfig = {
  // 短期缓存（适用于频繁变化的数据）
  short: {
    staleTime: 30 * 1000, // 30秒
    gcTime: 1 * 60 * 1000, // 1分钟 (formerly cacheTime)
  },
  // 中期缓存（默认）
  medium: {
    staleTime: 5 * 60 * 1000, // 5分钟
    gcTime: 10 * 60 * 1000, // 10分钟
  },
  // 长期缓存（适用于不常变化的数据）
  long: {
    staleTime: 30 * 60 * 1000, // 30分钟
    gcTime: 60 * 60 * 1000, // 1小时
  },
  // 持久缓存（适用于几乎不变的数据）
  persistent: {
    staleTime: 24 * 60 * 60 * 1000, // 24小时
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7天
  },
};
```

### 缓存使用示例

```typescript
// 使用中期缓存
const { data, isLoading } = useApiQuery(
  ['users'], 
  '/api/users',
  undefined,
  { ...cacheConfig.medium }
);

// 使用长期缓存
const { data, isLoading } = useApiQuery(
  ['settings'], 
  '/api/settings',
  undefined,
  { ...cacheConfig.long }
);
```

## 乐观更新

### 乐观更新工具函数

```typescript
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
```

### 乐观更新使用示例

```typescript
// 定义更新函数
const updateUserInList = (oldData: User[], newUser: User) => {
  return oldData.map(user => user.id === newUser.id ? newUser : user);
};

// 使用乐观更新
const mutation = useApiPatchMutation<User, User>(
  '/api/users',
  {
    ...optimisticUpdate(['users'], updateUserInList),
    onSuccess: (data) => {
      // 成功后的额外操作
    }
  }
);
```

## 请求状态管理

### 请求状态钩子

```typescript
export function useRequestStatus<TData, TError>(
  query: UseQueryResult<TData, TError>
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
```

### 请求状态使用示例

```typescript
const query = useApiQuery(['users'], '/api/users');
const { 
  isLoading, 
  isError, 
  error, 
  data, 
  isEmpty, 
  isLoadingOrFetching 
} = useRequestStatus(query);

// 根据状态渲染不同的UI
if (isLoadingOrFetching) {
  return <LoadingState />;
}

if (isError) {
  return <ErrorState error={error} />;
}

if (isEmpty) {
  return <EmptyState message="暂无用户数据" />;
}

return <UserList users={data} />;
```

## 查询失效

### 查询失效工具函数

```typescript
export function invalidateQueries(queryKey: QueryKey) {
  return {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  };
}
```

### 查询失效使用示例

```typescript
const mutation = useApiMutation<void, User>(
  '/api/users',
  {
    ...invalidateQueries(['users']),
    onSuccess: () => {
      // 成功后的额外操作
    }
  }
);
```

## 最佳实践

### 查询键命名约定

- 使用数组形式定义查询键
- 第一个元素为资源类型
- 后续元素为资源标识符或过滤条件

```typescript
// 获取所有用户
const queryKey = ['users'];

// 获取特定用户
const queryKey = ['users', userId];

// 获取特定用户的特定资源
const queryKey = ['users', userId, 'posts'];

// 带过滤条件的查询
const queryKey = ['users', { status: 'active', role: 'admin' }];
```

### 服务层封装

- 在服务层封装 API 钩子
- 隐藏查询键和 URL 细节
- 提供类型安全的接口

```typescript
// 用户服务
export const useUsers = () => {
  const fetchUsers = (filters?: UserFilters) => {
    return useApiQuery<User[]>(
      ['users', filters],
      '/api/users',
      { params: filters }
    );
  };
  
  const fetchUserById = (id: string) => {
    return useApiQuery<User>(
      ['users', id],
      `/api/users/${id}`
    );
  };
  
  const createUser = () => {
    return useApiMutation<User, CreateUserDto>(
      '/api/users',
      {
        ...invalidateQueries(['users']),
      }
    );
  };
  
  const updateUser = () => {
    return useApiPatchMutation<User, UpdateUserDto>(
      '/api/users',
      {
        ...optimisticUpdate(['users'], (oldData, newData) => {
          return oldData.map(user => user.id === newData.id ? { ...user, ...newData } : user);
        }),
      }
    );
  };
  
  const deleteUser = () => {
    return useApiDeleteMutation<void, string>(
      '/api/users',
      {
        ...invalidateQueries(['users']),
      }
    );
  };
  
  return {
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
  };
};
```

### 组件使用示例

```tsx
const UserManagement = () => {
  const { fetchUsers, createUser, updateUser, deleteUser } = useUsers();
  const { data: users, isLoading, isError } = fetchUsers();
  const createMutation = createUser();
  const updateMutation = updateUser();
  const deleteMutation = deleteUser();
  
  // 组件逻辑...
  
  return (
    // 组件渲染...
  );
};
```

## 后端 API 需求

为了支持前端 API 集成，后端 API 应满足以下要求：

1. RESTful 设计风格
2. JSON 格式的请求和响应
3. 标准的 HTTP 状态码
4. 一致的错误响应格式
5. 支持分页、排序和过滤
6. 适当的缓存控制头

### 标准错误响应格式

```json
{
  "message": "操作失败的描述信息",
  "code": "ERROR_CODE",
  "details": {
    "field1": "字段1的错误信息",
    "field2": "字段2的错误信息"
  }
}
```

### 分页响应格式

```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

## 未来扩展

- 添加请求去重功能
- 实现请求预取
- 添加离线支持
- 实现数据同步
- 添加实时更新（WebSocket 集成）
