# 前端API客户端文档

本文档描述了ThinkForward AI前端应用的API客户端架构，以便后端开发人员了解前端如何与API交互。

## 技术栈

前端API客户端使用以下技术：

- **Axios**: HTTP客户端库，用于发送API请求
- **React Query**: 用于服务器状态管理和数据获取
- **TypeScript**: 提供类型安全的API交互

## API客户端架构

### 基础HTTP客户端

使用Axios创建了一个基础HTTP客户端，具有以下特性：

1. **请求拦截器**：自动添加认证令牌
2. **响应拦截器**：处理常见错误（如401未授权）
3. **错误处理**：统一的错误处理机制
4. **类型安全**：所有请求和响应都有TypeScript类型定义

```typescript
// 创建axios实例
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10秒
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage获取令牌
    const token = localStorage.getItem('auth-storage')
      ? JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token
      : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

### React Query集成

使用React Query管理服务器状态，提供以下功能：

1. **数据缓存**：自动缓存API响应
2. **自动重试**：请求失败时自动重试
3. **乐观更新**：在服务器响应前更新UI
4. **失效处理**：自动使缓存失效并重新获取数据
5. **加载和错误状态**：自动处理加载和错误状态

```typescript
// 配置React Query客户端
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5分钟
    },
  },
});
```

### 自定义Hooks

提供了一系列自定义Hooks，简化API交互：

1. **useApiQuery**: 用于GET请求
2. **useApiMutation**: 用于POST请求
3. **useApiPutMutation**: 用于PUT请求
4. **useApiPatchMutation**: 用于PATCH请求
5. **useApiDeleteMutation**: 用于DELETE请求

```typescript
// GET请求Hook
export function useApiQuery<TData, TError = ApiError>(
  queryKey: QueryKey,
  url: string,
  config?: AxiosRequestConfig,
  options?: UseQueryOptions<...>
) {
  return useQuery<TData, AxiosError<TError>, TData, QueryKey>({
    queryKey,
    queryFn: () => get<TData>(url, config),
    ...options,
  });
}

// POST请求Hook
export function useApiMutation<TData, TVariables, TError = ApiError>(
  url: string,
  options?: UseMutationOptions<...>
) {
  return useMutation<TData, AxiosError<TError>, TVariables>({
    mutationFn: (variables) => post<TData>(url, variables),
    ...options,
  });
}
```

### 乐观更新

提供了乐观更新工具函数，用于在服务器响应前更新UI：

```typescript
// 乐观更新工具函数
export function optimisticUpdate<TData, TVariables>(
  queryKey: QueryKey,
  updateFn: (oldData: TData, variables: TVariables) => TData
) {
  return {
    onMutate: async (variables: TVariables) => {
      // 取消任何正在进行的请求
      await queryClient.cancelQueries({ queryKey });
      
      // 保存旧数据
      const previousData = queryClient.getQueryData<TData>(queryKey);
      
      // 乐观更新
      if (previousData) {
        queryClient.setQueryData<TData>(
          queryKey,
          (old) => old ? updateFn(old, variables) : old
        );
      }
      
      return { previousData };
    },
    // 错误回滚
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    // 完成后重新获取
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  };
}
```

## API服务

API服务按功能模块组织，每个模块提供特定的API交互Hooks：

### 认证服务

```typescript
// 登录Hook
export function useLogin() {
  return useApiMutation<AuthResponse, LoginRequest>('/auth/login');
}

// 注册Hook
export function useRegister() {
  return useApiMutation<AuthResponse, RegisterRequest>('/auth/register');
}

// 注销Hook
export function useLogout() {
  return useApiMutation<void, void>('/auth/logout');
}
```

### 用户档案服务

```typescript
// 获取用户档案
export function useGetProfile(userId: string) {
  return useApiQuery<ProfileData>(
    ['profile', userId],
    `/profile/${userId}`
  );
}

// 更新用户档案
export function useUpdateProfile(userId: string) {
  return useApiPatchMutation<ProfileData, Partial<ProfileData>>(
    `/profile/${userId}`,
    {
      ...optimisticUpdate<ProfileData, Partial<ProfileData>>(
        ['profile', userId],
        (oldData, newData) => ({
          ...oldData,
          ...newData,
        })
      ),
    }
  );
}

// 获取用户档案（对话模式）
export function useGetProfileConversation(userId: string) {
  return useApiQuery<ProfileConversationData>(
    ['profile', userId, 'conversation'],
    `/profile/${userId}/conversation`
  );
}

// 更新用户档案（对话模式）
export function useUpdateProfileConversation(userId: string) {
  return useApiPatchMutation<ProfileConversationData, Partial<ProfileConversationData>>(
    `/profile/${userId}/conversation`,
    {
      ...optimisticUpdate<ProfileConversationData, Partial<ProfileConversationData>>(
        ['profile', userId, 'conversation'],
        (oldData, newData) => ({
          ...oldData,
          ...newData,
        })
      ),
    }
  );
}

// 获取用户档案（表单模式）
export function useGetProfileForm(userId: string) {
  return useApiQuery<ProfileFormData>(
    ['profile', userId, 'form'],
    `/profile/${userId}/form`
  );
}

// 更新用户档案（表单模式）
export function useUpdateProfileForm(userId: string) {
  return useApiPatchMutation<ProfileFormData, Partial<ProfileFormData>>(
    `/profile/${userId}/form`,
    {
      ...optimisticUpdate<ProfileFormData, Partial<ProfileFormData>>(
        ['profile', userId, 'form'],
        (oldData, newData) => ({
          ...oldData,
          ...newData,
        })
      ),
    }
  );
}

// 切换档案模式
export function useSwitchProfileMode(userId: string) {
  return useApiMutation<{ mode: 'conversation' | 'form' }, { mode: 'conversation' | 'form' }>(
    `/profile/${userId}/switch-mode`,
    {
      onSuccess: () => {
        // 切换成功后使相关查询失效，触发重新获取
        queryClient.invalidateQueries(['profile', userId]);
        queryClient.invalidateQueries(['profile', userId, 'conversation']);
        queryClient.invalidateQueries(['profile', userId, 'form']);
      }
    }
  );
}
```

## 使用示例

### 获取数据

```typescript
import { useGetProfile } from '../lib/api/services/profile';

function ProfilePage({ userId }) {
  const { 
    data: profile, 
    isLoading, 
    error 
  } = useGetProfile(userId);

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>出错了: {error.message}</div>;

  return (
    <div>
      <h1>{profile.personalInfo.firstName} {profile.personalInfo.lastName}</h1>
      {/* 显示更多档案信息 */}
    </div>
  );
}
```

### 更新数据

```typescript
import { useUpdatePersonalInfo } from '../lib/api/services/profile';

function PersonalInfoForm({ userId }) {
  const { mutate, isLoading } = useUpdatePersonalInfo(userId);

  const handleSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        // 成功处理
        alert('个人信息已更新');
      },
      onError: (error) => {
        // 错误处理
        alert(`更新失败: ${error.message}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 表单字段 */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? '更新中...' : '保存'}
      </button>
    </form>
  );
}
```

## 后端集成指南

后端API应遵循以下约定，以确保与前端API客户端的兼容性：

### 1. 认证

- 使用JWT令牌进行认证
- 令牌应通过Authorization头传递，格式为`Bearer {token}`
- 令牌过期时返回401状态码

### 2. 响应格式

所有API响应应遵循统一的格式：

```json
// 成功响应
{
  "data": {
    // 实际数据
  },
  "meta": {
    // 元数据（可选）
  }
}

// 错误响应
{
  "error": {
    "code": "ERROR_CODE",
    "message": "错误消息",
    "details": {
      // 详细错误信息（可选）
    }
  }
}
```

### 3. HTTP状态码

- 200: 成功的GET请求
- 201: 成功的POST请求（创建资源）
- 204: 成功的DELETE请求（无内容返回）
- 400: 客户端错误（如验证错误）
- 401: 未授权（需要认证）
- 403: 禁止访问（权限不足）
- 404: 资源不存在
- 500: 服务器错误

### 4. 分页

分页数据应包含以下元数据：

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 5. 过滤和排序

- 过滤参数应使用`filter[field]=value`格式
- 排序参数应使用`sort=field`（升序）或`sort=-field`（降序）格式

### 6. 关系数据

关系数据应支持通过`include`参数包含：

```
GET /api/users/123?include=profile,posts
```

## 模式切换功能的API集成

ThinkForward AI平台支持两种资料收集模式：对话式和表单式。前端实现了模式切换组件，允许用户在这两种模式之间无缝切换。以下是后端需要支持的API集成点：

### 1. 数据结构

两种模式使用相同的基础数据结构，但有不同的表示方式：

```typescript
// 基础档案数据结构
interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    // 其他个人信息字段
  };
  education: {
    highestDegree: string;
    institution: string;
    graduationYear: number;
    // 其他教育信息字段
  };
  workExperience: {
    occupation: string;
    yearsOfExperience: number;
    // 其他工作经验字段
  };
  language: {
    englishProficiency: string;
    frenchProficiency: string;
    // 其他语言能力字段
  };
  immigration: {
    targetCountry: string;
    immigrationPurpose: string;
    // 其他移民信息字段
  };
}

// 对话模式特有数据
interface ProfileConversationData extends ProfileData {
  conversation: {
    messages: Array<{
      id: string;
      role: 'user' | 'assistant';
      content: string;
      timestamp: string;
    }>;
    extractedData: Record<string, any>; // 从对话中提取的结构化数据
  };
}

// 表单模式特有数据
interface ProfileFormData extends ProfileData {
  form: {
    completionStatus: Record<string, boolean>; // 各部分完成状态
    validationErrors: Record<string, string[]>; // 验证错误信息
    lastUpdated: string; // 最后更新时间
  };
}
```

### 2. API端点

后端需要提供以下API端点支持模式切换功能：

1. **获取用户档案**：
   - `GET /api/profile/:userId` - 获取完整档案数据
   - `GET /api/profile/:userId/conversation` - 获取对话模式数据
   - `GET /api/profile/:userId/form` - 获取表单模式数据

2. **更新用户档案**：
   - `PATCH /api/profile/:userId` - 更新完整档案数据
   - `PATCH /api/profile/:userId/conversation` - 更新对话模式数据
   - `PATCH /api/profile/:userId/form` - 更新表单模式数据
   - `POST /api/profile/:userId/conversation/messages` - 添加新对话消息

3. **模式切换**：
   - `POST /api/profile/:userId/switch-mode` - 切换档案模式
     - 请求体：`{ mode: 'conversation' | 'form' }`
     - 响应：`{ mode: 'conversation' | 'form', status: 'success' }`

### 3. 数据映射逻辑

后端需要实现以下数据映射逻辑：

1. **对话到表单映射**：
   - 从对话内容中提取结构化数据
   - 使用NLP技术识别关键信息
   - 将提取的数据映射到表单字段

2. **表单到对话映射**：
   - 将表单数据转换为自然语言描述
   - 生成对话历史记录，反映表单中填写的信息

### 4. 状态保持机制

后端需要确保：

1. 两种模式之间的数据同步
2. 模式切换时不丢失用户数据
3. 提供数据版本控制，处理可能的冲突

### 5. 错误处理

模式切换相关的错误响应应包含：

```json
{
  "error": {
    "code": "MODE_SWITCH_ERROR",
    "message": "模式切换失败",
    "details": {
      "reason": "数据映射错误",
      "fields": ["personalInfo.dateOfBirth"]
    }
  }
}
```

通过以上API客户端架构，ThinkForward AI前端应用能够高效地与后端API交互，提供流畅的用户体验和可靠的数据流。
