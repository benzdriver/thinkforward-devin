# 前端状态管理文档

本文档描述了ThinkForward AI前端应用的状态管理架构，以便后端开发人员了解前端数据流和状态管理方式。

## 技术栈

前端状态管理使用以下技术：

- **Zustand**: 轻量级状态管理库，用于全局状态管理
- **React Context**: 用于在组件树中传递状态
- **React Query**: 用于API请求和服务器状态管理
- **React Hook Form**: 用于表单状态管理
- **Zod**: 用于数据验证和类型安全

## 状态管理架构

### 全局状态管理

应用使用Zustand作为主要的全局状态管理解决方案，结合React Context提供更好的组件集成。

#### 主要状态存储

1. **认证状态 (AuthStore)**
   - 用户信息
   - 认证状态
   - 登录/注销功能
   - 令牌管理

2. **设置状态 (SettingsStore)**
   - 主题设置
   - 语言偏好
   - 输入模式
   - 通知设置

3. **用户档案状态 (ProfileStore)**
   - 个人信息
   - 教育背景
   - 工作经验
   - 语言技能
   - 移民信息

### 状态持久化

使用Zustand的persist中间件实现状态持久化，将关键状态存储在localStorage中：

```typescript
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // 状态和操作...
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### React Context集成

为了更好地与React组件集成，我们创建了Context Provider包装Zustand存储：

```typescript
export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuthStore();
  const settings = useSettingsStore();
  const profile = useProfileStore();

  return (
    <StoreContext.Provider value={{ auth, settings, profile }}>
      {children}
    </StoreContext.Provider>
  );
};
```

### 自定义Hooks

提供了便捷的自定义Hooks来访问状态：

```typescript
// 访问所有状态
export const useStore = () => useContext(StoreContext);

// 访问特定状态
export const useAuth = () => useStore().auth;
export const useSettings = () => useStore().settings;
export const useProfile = () => useStore().profile;
```

## 服务器状态管理

使用React Query管理服务器状态和API请求：

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// 获取数据示例
export const useGetUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId),
  });
};

// 更新数据示例
export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: (data: ProfileData) => updateUserProfile(data),
    onSuccess: () => {
      // 成功后的操作，如刷新缓存
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};
```

## 表单状态管理

使用React Hook Form结合Zod进行表单状态管理和验证：

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 表单验证模式
const loginSchema = z.object({
  email: z.string().email('请输入有效的电子邮件地址'),
  password: z.string().min(8, '密码至少需要8个字符'),
});

// 表单Hook
export const useLoginForm = () => {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // 表单提交处理
  const onSubmit = (data) => {
    // 处理登录逻辑
  };
  
  return { register, handleSubmit, formState, onSubmit };
};
```

## 状态更新流程

### 认证流程

1. 用户提交登录表单
2. 调用`useAuth().login(email, password)`
3. 认证状态更新，令牌存储在localStorage
4. UI根据认证状态更新

```typescript
// 登录组件示例
const LoginForm = () => {
  const { login, isLoading, error } = useAuth();
  const { register, handleSubmit, formState } = useLoginForm();
  
  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 表单字段 */}
    </form>
  );
};
```

### 用户设置流程

1. 用户更改设置（如语言或主题）
2. 调用相应的设置更新函数
3. 设置状态更新并持久化
4. UI根据新设置更新

```typescript
// 设置组件示例
const LanguageSelector = () => {
  const { language, setLanguage } = useSettings();
  
  return (
    <select 
      value={language} 
      onChange={(e) => setLanguage(e.target.value as Language)}
    >
      <option value="en">English</option>
      <option value="zh">中文</option>
      <option value="fr">Français</option>
    </select>
  );
};
```

### 用户档案更新流程

1. 用户填写或更新个人资料
2. 调用相应的档案更新函数
3. 档案状态更新并持久化
4. 完成度百分比自动计算
5. UI根据新档案数据和完成度更新

```typescript
// 个人信息表单示例
const PersonalInfoForm = () => {
  const { profile, updatePersonalInfo } = useProfile();
  const { register, handleSubmit } = useForm({
    defaultValues: profile.personalInfo || {},
  });
  
  const onSubmit = (data) => {
    updatePersonalInfo(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 表单字段 */}
    </form>
  );
};
```

## 后端集成指南

后端API应遵循以下状态管理约定，以确保与前端状态系统的兼容性：

### 1. 认证API

- 登录API应返回用户信息和JWT令牌
- 注册API应创建用户并返回用户信息和JWT令牌
- 注销API应使前端令牌失效

### 2. 用户档案API

- 获取用户档案API应返回完整的用户档案数据
- 更新用户档案API应支持部分更新（PATCH请求）
- 档案API应返回完成度信息

### 3. 设置API

- 用户设置应与用户账户关联
- 设置API应支持获取和更新用户偏好

### 4. 响应格式

所有API响应应遵循统一的格式，与前端状态结构兼容：

```json
{
  "data": {
    // 实际数据
  },
  "meta": {
    // 元数据
  }
}
```

通过以上状态管理架构，ThinkForward AI前端应用能够高效地管理全局状态、表单状态和服务器状态，提供流畅的用户体验和可靠的数据流。
