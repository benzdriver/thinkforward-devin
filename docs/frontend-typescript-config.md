# 前端TypeScript配置文档

本文档描述了ThinkForward AI前端应用的TypeScript配置，以便后端开发人员了解前端类型系统和接口定义。

## 技术栈

前端TypeScript配置使用以下技术：

- **TypeScript**: 版本5.x
- **Next.js**: 版本15.3.0，支持TypeScript
- **React**: 版本19.0.0，使用TypeScript类型定义

## 配置详情

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "types/**/*.d.ts"],
  "exclude": ["node_modules"]
}
```

### 关键配置说明

- **strict**: 启用严格类型检查，包括`strictNullChecks`、`strictFunctionTypes`等
- **moduleResolution**: 使用"bundler"模式，适用于Next.js的模块解析
- **paths**: 配置路径别名，`@/*`映射到项目根目录
- **include**: 包含所有TypeScript文件和类型定义文件
- **plugins**: 使用Next.js插件进行TypeScript增强

## 类型定义

### 国际化类型定义

为了支持国际化功能的类型安全，我们创建了自定义类型定义文件：

```typescript
// types/next-i18next.d.ts
import 'react-i18next';
import type common from '../public/locales/en/common.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
    };
  }
}
```

这确保了在使用翻译函数时能够获得类型提示和类型检查。

## 组件类型定义示例

### 按钮组件

```typescript
// 按钮变体类型
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

// 按钮尺寸类型
export type ButtonSize = 'sm' | 'md' | 'lg';

// 按钮属性接口
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}
```

### 下拉菜单组件

```typescript
// 下拉选项接口
export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// 下拉菜单属性接口
export interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: DropdownOption[];
  error?: string;
}
```

## API请求类型定义

为了确保前后端数据交换的类型安全，我们定义了API请求和响应的类型：

```typescript
// API响应基础接口
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    locale?: string;
  };
}

// API错误接口
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

## 后端集成指南

后端API应遵循以下类型约定，以确保与前端类型系统的兼容性：

### 1. 响应格式

所有API响应应遵循统一的格式：

```typescript
// 成功响应
{
  "data": { ... },  // 实际数据
  "meta": {         // 元数据（可选）
    "page": 1,
    "limit": 10,
    "total": 100,
    "locale": "zh"
  }
}

// 错误响应
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "验证失败",
    "details": {
      "field": "错误信息"
    }
  }
}
```

### 2. 数据类型映射

前端TypeScript类型与后端数据类型的映射关系：

| 前端TypeScript类型 | 后端数据类型（示例：Java） | 后端数据类型（示例：Python） |
|-------------------|--------------------------|---------------------------|
| string            | String                   | str                       |
| number            | Integer, Double          | int, float                |
| boolean           | Boolean                  | bool                      |
| Date              | LocalDateTime            | datetime                  |
| string[]          | List<String>             | List[str]                 |
| Record<string, any> | Map<String, Object>    | Dict[str, Any]            |

### 3. 枚举类型

前端使用字符串联合类型表示枚举，后端应确保返回的枚举值在前端定义的范围内：

```typescript
// 前端定义
type UserRole = 'admin' | 'consultant' | 'client';

// 后端应确保返回的角色值在这些选项中
```

### 4. 空值处理

前端使用严格的空值检查，后端应遵循以下原则：

- 必填字段不应返回null或undefined
- 可选字段如果没有值，应明确返回null而不是undefined
- 数组字段如果为空，应返回空数组[]而不是null

## 类型检查

前端项目配置了TypeScript类型检查命令：

```bash
npm run type-check
```

此命令会检查所有TypeScript文件的类型错误，确保代码类型安全。

## 添加新类型定义

要添加新的类型定义，建议：

1. 在相关组件或功能模块的文件中定义特定类型
2. 对于共享类型，在`types/`目录下创建专门的类型定义文件
3. 对于API相关类型，在`types/api.ts`文件中定义

通过以上TypeScript配置和类型定义，可以确保前后端类型系统的一致性和完整性，减少因类型不匹配导致的错误。
