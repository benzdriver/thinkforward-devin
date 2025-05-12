# ThinkForward AI 前端测试覆盖率提升任务清单

## 当前进度

截至目前，我们已经实现了以下组件的单元测试：

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

当前总体测试覆盖率为1.38%（目标：70%）。通过添加Radio和Toggle组件的测试，我们将UI组件的测试覆盖率从4.96%提高到了6.8%，总体测试覆盖率从0.98%提高到了1.38%。

## 剩余任务

为了达到70%的测试覆盖率目标，我们需要完成以下任务：

### 1. UI组件测试

按优先级排序的UI组件测试任务：

- [ ] Alert组件测试
- [ ] Textarea组件测试
- [ ] Select组件测试
- [ ] Tabs组件测试
- [ ] Modal组件测试
- [ ] Tooltip组件测试
- [ ] Avatar组件测试
- [ ] Progress组件测试
- [ ] Accordion组件测试
- [ ] Dropdown组件测试
- [ ] Empty-state组件测试
- [ ] Error-state组件测试
- [ ] Loading-state组件测试
- [ ] Notification组件测试

### 2. 表单组件测试

- [ ] FormField组件测试
- [ ] SearchInput组件测试
- [ ] FileUpload组件测试
- [ ] DatePicker组件测试

### 3. 布局组件测试

- [ ] AuthLayout组件测试
- [ ] DashboardLayout组件测试
- [ ] PageHeader组件测试
- [ ] SectionContainer组件测试
- [ ] MainLayout组件测试

### 4. API钩子测试

- [ ] 提高hooks.ts的测试覆盖率
- [ ] 为各个API服务创建测试

### 5. 状态管理测试

- [ ] 测试Zustand存储
- [ ] 测试Context提供者

### 6. 页面组件测试

- [ ] 认证页面测试
- [ ] 仪表盘页面测试
- [ ] 评估页面测试
- [ ] 资料收集页面测试
- [ ] 文档管理页面测试
- [ ] 顾问匹配页面测试
- [ ] 设置页面测试

## 测试实现指南

### 组件测试模板

每个UI组件测试应该包含以下测试用例：

1. 基本渲染测试
2. 变体样式测试
3. 尺寸样式测试
4. 属性传递测试
5. 事件处理测试
6. 自定义类名测试
7. 错误状态测试（如适用）
8. 交互状态测试（如适用）

示例测试结构：

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ComponentName } from '../../../components/ui/component-name';

describe('ComponentName 组件', () => {
  it('渲染基本组件', () => {
    render(<ComponentName />);
    // 断言
  });

  it('应用不同的变体样式', () => {
    // 测试不同变体
  });

  it('应用不同的尺寸样式', () => {
    // 测试不同尺寸
  });

  it('处理点击事件', () => {
    // 测试事件处理
  });

  // 其他测试用例...
});
```

### API钩子测试模板

API钩子测试应该包含以下测试用例：

1. 成功获取数据测试
2. 错误处理测试
3. 加载状态测试
4. 缓存测试
5. 参数变化测试

示例测试结构：

```tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useApiHook } from '../../../lib/api/hooks';

// 模拟依赖
jest.mock('axios');

describe('useApiHook 钩子', () => {
  it('成功获取数据', async () => {
    // 测试成功场景
  });

  it('处理错误', async () => {
    // 测试错误场景
  });

  // 其他测试用例...
});
```

## 测试运行指南

### 运行单个组件测试

```bash
cd /home/ubuntu/repos/thinkforward-devin/frontend
npm test -- -t "组件名称"
```

### 运行所有测试

```bash
cd /home/ubuntu/repos/thinkforward-devin/frontend
npm test
```

### 查看测试覆盖率报告

```bash
cd /home/ubuntu/repos/thinkforward-devin/frontend
npm test -- --coverage
```

## 提交指南

每完成一个组件的测试，应该：

1. 更新`docs/frontend-todo-list.md`文件，将完成的任务标记为已完成
2. 更新`docs/frontend-testing.md`文件，添加新的测试覆盖率信息
3. 提交代码并推送到远程仓库
4. 如果是新的PR，创建PR；如果是在现有PR上工作，更新PR

## 注意事项

1. 测试应该关注组件的行为而不是实现细节
2. 使用React Testing Library的查询优先级：getByRole > getByLabelText > getByPlaceholderText > getByText > getByDisplayValue > getByAltText > getByTitle > getByTestId
3. 避免在测试中使用快照测试，除非有特殊需要
4. 确保测试是独立的，一个测试的失败不应该影响其他测试
5. 测试覆盖率不是唯一目标，测试质量同样重要

## 下一步任务

下一个Devin会话应该优先实现以下组件的测试：

1. Alert组件测试
2. Textarea组件测试
3. Select组件测试

这些组件相对简单，可以快速提高测试覆盖率。
