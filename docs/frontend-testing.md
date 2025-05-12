# ThinkForward AI 前端测试文档

## 测试策略概述

ThinkForward AI 前端采用全面的测试策略，确保应用的质量、可靠性和性能。测试策略包括：

1. **单元测试**：使用 Jest 和 React Testing Library 测试独立组件和函数
2. **集成测试**：测试组件之间的交互和数据流
3. **端到端测试**：使用 Cypress 测试完整用户流程
4. **性能测试**：确保应用在各种条件下保持响应性

## 单元测试

### 测试框架

- **Jest**：JavaScript 测试框架
- **React Testing Library**：用于测试 React 组件的工具库
- **jest-dom**：提供自定义的 DOM 元素匹配器

### 测试目录结构

```
frontend/
├── __tests__/
│   ├── components/
│   │   ├── ui/
│   │   ├── form/
│   │   └── layout/
│   ├── hooks/
│   ├── utils/
│   └── pages/
└── jest.config.js
```

### 测试命名约定

- 测试文件命名：`[filename].test.tsx` 或 `[filename].test.ts`
- 测试套件命名：描述被测试的组件或功能
- 测试用例命名：描述预期行为

### 单元测试最佳实践

1. **组件测试**：
   - 测试组件渲染是否正确
   - 测试组件交互（点击、输入等）
   - 测试组件状态变化
   - 测试组件属性变化

2. **钩子测试**：
   - 测试钩子初始状态
   - 测试钩子函数调用
   - 测试钩子状态变化

3. **工具函数测试**：
   - 测试函数输入和输出
   - 测试边界条件
   - 测试错误处理

### 测试覆盖率目标

- 组件：80%
- 钩子：90%
- 工具函数：95%

## 集成测试

集成测试关注组件之间的交互和数据流，确保系统各部分能够协同工作。

### 集成测试重点

1. 表单提交和验证
2. 数据获取和显示
3. 路由和导航
4. 状态管理

## 端到端测试

端到端测试使用 Cypress 模拟真实用户行为，测试完整的用户流程。

### 关键用户流程

1. 用户注册和登录
2. 评估流程完成
3. 资料收集（对话式和表单式）
4. 文档上传和管理
5. 顾问匹配和预约

## 性能测试

性能测试确保应用在各种条件下保持响应性。

### 性能指标

1. 首次加载时间
2. 交互响应时间
3. 内存使用
4. 网络请求效率

## 测试自动化

测试自动化通过 GitHub Actions 实现，包括：

1. 提交前运行单元测试
2. PR 时运行单元测试和集成测试
3. 定期运行端到端测试
4. 生成测试覆盖率报告

## 测试示例

### 组件测试示例

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/ui/button';

describe('Button 组件', () => {
  it('渲染按钮文本', () => {
    render(<Button>点击我</Button>);
    expect(screen.getByText('点击我')).toBeInTheDocument();
  });

  it('点击时调用 onClick 处理函数', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>点击我</Button>);
    fireEvent.click(screen.getByText('点击我'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('禁用状态下不可点击', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>点击我</Button>);
    fireEvent.click(screen.getByText('点击我'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### 钩子测试示例

```tsx
import { renderHook, act } from '@testing-library/react-hooks';
import useCounter from '../hooks/useCounter';

describe('useCounter 钩子', () => {
  it('初始值为 0', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('increment 增加计数', () => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });

  it('decrement 减少计数', () => {
    const { result } = renderHook(() => useCounter(10));
    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(9);
  });
});
```

### API 测试示例

```tsx
import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useApiQuery } from '../lib/api/hooks';

// 模拟 axios
jest.mock('axios', () => ({
  isAxiosError: jest.fn(),
  get: jest.fn()
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useApiQuery 钩子', () => {
  it('成功获取数据', async () => {
    // 模拟实现
    axios.get.mockResolvedValueOnce({ data: { name: '测试用户' } });
    
    const { result, waitFor } = renderHook(
      () => useApiQuery(['user', 1], '/api/users/1'),
      { wrapper }
    );
    
    await waitFor(() => result.current.isSuccess);
    
    expect(result.current.data).toEqual({ name: '测试用户' });
  });
});
```

## 测试资源

- [Jest 文档](https://jestjs.io/zh-Hans/docs/getting-started)
- [React Testing Library 文档](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress 文档](https://docs.cypress.io/)

## 当前测试状态

截至目前，我们已经完成了以下组件的单元测试：

1. **UI组件测试**：
   - Button组件：75%覆盖率（分支覆盖率100%）
   - Card组件：68.75%覆盖率（分支覆盖率100%）
   - Input组件：75%覆盖率
   - Checkbox组件：75%覆盖率
   - Badge组件：42.85%覆盖率
   - Radio组件：75%覆盖率
   - Toggle组件：100%覆盖率（分支覆盖率93.54%）

2. **工具函数测试**：
   - utils.ts：100%覆盖率

3. **API钩子测试**：
   - hooks.ts：部分测试覆盖率（3.77%）

当前总体测试覆盖率为1.38%（目标：70%）。下一步计划增加更多组件测试和集成测试，逐步提高覆盖率。

## 测试进度更新

通过添加Radio和Toggle组件的测试，我们将UI组件的测试覆盖率从4.96%提高到了6.8%，总体测试覆盖率从0.98%提高到了1.38%。虽然距离70%的目标还有很大差距，但我们正在稳步推进。

下一步将继续为其他UI组件添加测试，优先考虑以下组件：
- Alert组件
- Textarea组件
- Select组件
- Tabs组件
- Modal组件

同时，我们也需要提高API钩子的测试覆盖率，这将对整体测试覆盖率产生更大的影响。
