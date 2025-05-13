# 前端单元测试指南

## 概述

本文档提供了 ThinkForward AI 项目前端单元测试的详细指南，包括测试结构、运行方法和最佳实践。

## 测试目录结构

前端单元测试已从原来的 `/frontend/__tests__/` 目录迁移到 `/tests/frontend-unit/` 目录，采用以下结构：

```
/tests/frontend-unit/
├── components/           # UI组件测试
│   └── ui/               # UI基础组件测试
│       ├── badge.test.tsx
│       ├── button.test.tsx
│       ├── card.test.tsx
│       ├── checkbox.test.tsx
│       ├── input.test.tsx
│       ├── radio.test.tsx
│       └── toggle.test.tsx
├── lib/                  # 工具函数测试
│   ├── utils.test.ts     # 通用工具函数测试
│   └── api/              # API相关测试
│       ├── hooks.test.ts # API钩子测试
│       ├── query.test.ts # 查询钩子测试
│       └── mutation.test.ts # 变更钩子测试
├── mocks/                # 测试模拟
│   ├── api-hooks.ts      # API钩子模拟
│   ├── react-query-wrapper.tsx # React Query包装器
│   └── toggle.tsx        # Toggle组件模拟
├── jest.config.js        # Jest配置
├── jest.setup.js         # Jest设置
└── test-utils.js         # 测试工具函数
```

## 运行测试

### 运行所有前端单元测试

```bash
cd /home/ubuntu/repos/thinkforward-devin/tests
npm run test:frontend-unit
```

### 运行特定测试文件

```bash
cd /home/ubuntu/repos/thinkforward-devin/tests
npm test -- frontend-unit/components/ui/button.test.tsx
```

### 运行所有前端测试（单元测试和集成测试）

```bash
cd /home/ubuntu/repos/thinkforward-devin/tests
npm run test:all-frontend
```

## 测试环境设置

我们使用以下工具进行前端单元测试：

- **Jest**: 测试运行器
- **React Testing Library**: 组件测试库
- **Jest DOM**: DOM测试断言
- **User Event**: 用户事件模拟

测试环境配置在以下文件中：

- `/tests/frontend-unit/jest.config.js`: Jest配置
- `/tests/frontend-unit/jest.setup.js`: Jest设置
- `/tests/babel.config.js`: Babel配置

## 编写测试的最佳实践

### 组件测试

1. **测试渲染**：确保组件能够正确渲染
   ```jsx
   it('渲染按钮文本', () => {
     render(<Button>点击我</Button>);
     expect(screen.getByText('点击我')).toBeInTheDocument();
   });
   ```

2. **测试交互**：测试用户交互
   ```jsx
   it('点击按钮触发回调', () => {
     const handleClick = jest.fn();
     render(<Button onClick={handleClick}>点击我</Button>);
     fireEvent.click(screen.getByText('点击我'));
     expect(handleClick).toHaveBeenCalledTimes(1);
   });
   ```

3. **测试属性**：测试组件属性是否正确应用
   ```jsx
   it('禁用按钮', () => {
     render(<Button disabled>点击我</Button>);
     expect(screen.getByText('点击我')).toBeDisabled();
   });
   ```

### 钩子测试

1. **测试查询钩子**：测试数据获取
   ```jsx
   it('成功获取数据', async () => {
     const { result } = renderHook(() => useApiQuery(['user', 1], '/api/users/1'));
     await waitFor(() => expect(result.current.isSuccess).toBe(true));
     expect(result.current.data).toEqual({ name: '测试用户' });
   });
   ```

2. **测试变更钩子**：测试数据修改
   ```jsx
   it('成功提交数据', async () => {
     const { result } = renderHook(() => useApiMutation('/api/users'));
     result.current.mutate({ name: '新用户' });
     await waitFor(() => expect(result.current.isSuccess).toBe(true));
     expect(result.current.data).toEqual({ id: 1, name: '新用户' });
   });
   ```

## 模拟（Mocking）

### API请求模拟

我们使用自定义模拟来模拟API请求：

```jsx
// 在测试文件中
const mockGet = jest.fn();
global.mockApiGet = mockGet;

// 设置模拟响应
mockGet.mockImplementation((url) => {
  if (url === '/api/users/1') {
    return Promise.resolve({ name: '测试用户' });
  }
  return Promise.reject(new Error('API错误'));
});
```

### 组件模拟

对于复杂组件，我们创建简化的模拟版本：

```jsx
// /tests/frontend-unit/mocks/toggle.tsx
import React from 'react';

export const Toggle = ({ defaultChecked, onCheckedChange, ...props }) => {
  const [checked, setChecked] = React.useState(defaultChecked || false);
  
  const handleChange = (e) => {
    setChecked(e.target.checked);
    onCheckedChange?.(e.target.checked);
  };
  
  return (
    <label className="toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        {...props}
      />
      <span className="toggle-thumb" />
    </label>
  );
};
```

## 已知问题和解决方案

### React.act 废弃警告

运行测试时可能会看到关于 `ReactDOMTestUtils.act` 被废弃的警告。详细信息和解决方案请参见 [React.act 废弃警告解决方案](/test_doc/react_act_deprecation_warnings.md)。

## 测试覆盖率

当前测试覆盖率较低（约2%）。我们计划增加更多测试以提高覆盖率。运行以下命令查看测试覆盖率报告：

```bash
cd /home/ubuntu/repos/thinkforward-devin/tests
npm run test:coverage
```

## 持续集成

前端单元测试已集成到CI/CD流程中。每次提交代码时，CI系统会自动运行所有测试。

## 后续计划

1. 增加更多组件测试
2. 提高测试覆盖率
3. 解决React.act废弃警告
4. 添加更多复杂场景的测试用例
