# ThinkForward AI 前端UI组件库

## 概述

ThinkForward AI 前端UI组件库是基于 Tailwind CSS 和 class-variance-authority 构建的一套可复用组件系统。这套组件库旨在提供一致的用户界面体验，同时保持足够的灵活性以适应不同的设计需求。

## 核心组件

### Button 按钮

按钮组件提供了多种变体和尺寸，用于触发操作或导航。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| primary | 主要按钮 | 页面主要操作，如提交表单、确认操作 |
| secondary | 次要按钮 | 次要操作，如取消、返回 |
| outline | 轮廓按钮 | 不太重要的操作，保持界面清爽 |
| ghost | 幽灵按钮 | 最不引人注目的按钮，用于辅助操作 |
| link | 链接按钮 | 看起来像链接的按钮 |
| destructive | 危险按钮 | 删除、移除等破坏性操作 |
| success | 成功按钮 | 表示积极结果的操作 |
| warning | 警告按钮 | 需要注意的操作 |
| neutral | 中性按钮 | 普通操作，不强调 |

#### 尺寸

| 尺寸名 | 描述 |
|--------|------|
| xs | 超小尺寸 |
| sm | 小尺寸 |
| md | 中等尺寸（默认） |
| lg | 大尺寸 |
| xl | 超大尺寸 |
| icon | 图标按钮 |

#### 使用示例

```jsx
// 基本用法
<Button>默认按钮</Button>

// 不同变体
<Button variant="primary">主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="outline">轮廓按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button variant="link">链接按钮</Button>
<Button variant="destructive">危险按钮</Button>
<Button variant="success">成功按钮</Button>
<Button variant="warning">警告按钮</Button>
<Button variant="neutral">中性按钮</Button>

// 不同尺寸
<Button size="xs">超小按钮</Button>
<Button size="sm">小按钮</Button>
<Button size="md">中等按钮</Button>
<Button size="lg">大按钮</Button>
<Button size="xl">超大按钮</Button>

// 图标按钮
<Button size="icon">
  <IconComponent />
</Button>

// 全宽按钮
<Button fullWidth>全宽按钮</Button>

// 禁用状态
<Button disabled>禁用按钮</Button>
```

### Card 卡片

卡片组件用于在包含内容的容器中展示信息。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 默认卡片 | 一般内容展示 |
| feature | 特性卡片 | 突出显示特性或优势 |
| destructive | 警告卡片 | 显示警告或错误信息 |
| success | 成功卡片 | 显示成功或完成信息 |
| warning | 警告卡片 | 显示需要注意的信息 |
| neutral | 中性卡片 | 次要信息展示 |
| elevated | 浮起卡片 | 更突出的卡片，有更强的阴影 |
| flat | 扁平卡片 | 无边框和阴影的简洁卡片 |

#### 子组件

- `CardHeader`: 卡片头部
- `CardTitle`: 卡片标题
- `CardContent`: 卡片内容
- `CardFooter`: 卡片底部

#### 使用示例

```jsx
// 基本用法
<Card>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
  </CardHeader>
  <CardContent>
    <p>卡片内容</p>
  </CardContent>
  <CardFooter>
    <Button>操作按钮</Button>
  </CardFooter>
</Card>

// 不同变体
<Card variant="default">默认卡片</Card>
<Card variant="feature">特性卡片</Card>
<Card variant="destructive">警告卡片</Card>
<Card variant="success">成功卡片</Card>
<Card variant="warning">警告卡片</Card>
<Card variant="neutral">中性卡片</Card>
<Card variant="elevated">浮起卡片</Card>
<Card variant="flat">扁平卡片</Card>

// 悬停效果
<Card hover>悬停时显示阴影</Card>
```

### Dropdown 下拉菜单

下拉菜单组件用于从预定义选项列表中选择一个选项。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 默认下拉菜单 | 一般选择操作 |
| error | 错误状态 | 表单验证失败时 |
| success | 成功状态 | 表单验证成功时 |
| warning | 警告状态 | 需要注意的选择 |

#### 尺寸

| 尺寸名 | 描述 |
|--------|------|
| sm | 小尺寸 |
| md | 中等尺寸（默认） |
| lg | 大尺寸 |

#### 使用示例

```jsx
// 基本用法
<Dropdown
  label="选择选项"
  options={[
    { value: "option1", label: "选项 1" },
    { value: "option2", label: "选项 2" },
    { value: "option3", label: "选项 3" },
  ]}
/>

// 不同变体
<Dropdown
  variant="default"
  label="默认下拉菜单"
  options={options}
/>

<Dropdown
  variant="error"
  label="错误状态"
  options={options}
  error="请选择一个有效选项"
/>

<Dropdown
  variant="success"
  label="成功状态"
  options={options}
/>

<Dropdown
  variant="warning"
  label="警告状态"
  options={options}
/>

// 不同尺寸
<Dropdown
  size="sm"
  label="小尺寸"
  options={options}
/>

<Dropdown
  size="md"
  label="中等尺寸"
  options={options}
/>

<Dropdown
  size="lg"
  label="大尺寸"
  options={options}
/>

// 带图标
<Dropdown
  label="带图标的下拉菜单"
  options={options}
  startIcon={<StartIcon />}
  endIcon={<EndIcon />}
/>

// 带帮助文本
<Dropdown
  label="带帮助文本的下拉菜单"
  options={options}
  helperText="选择最适合您的选项"
/>

// 禁用选项
<Dropdown
  label="带禁用选项的下拉菜单"
  options={[
    { value: "option1", label: "选项 1" },
    { value: "option2", label: "选项 2", disabled: true },
    { value: "option3", label: "选项 3" },
  ]}
/>
```

## 组件设计原则

1. **一致性**：所有组件遵循相同的设计语言和交互模式。
2. **可访问性**：组件符合 WCAG 2.1 AA 级标准，支持键盘导航和屏幕阅读器。
3. **响应式**：组件自适应不同屏幕尺寸和设备。
4. **可定制性**：通过变体和属性提供灵活的定制选项。
5. **性能优化**：组件经过优化，确保高性能和低资源消耗。

## 组件扩展

所有组件都使用 `class-variance-authority` 构建，这使得扩展现有组件变得简单。例如：

```jsx
// 扩展按钮组件
import { Button, buttonVariants } from "../components/ui/button";
import { cn } from "../lib/utils";

// 使用现有变体
<div className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
  自定义元素使用按钮样式
</div>

// 创建自定义按钮
const CustomButton = ({ className, ...props }) => (
  <Button 
    className={cn("bg-gradient-to-r from-purple-500 to-pink-500", className)} 
    {...props} 
  />
);
```

## 后端集成指南

后端开发人员在设计 API 响应时，可以考虑以下几点：

1. **表单验证**：API 应返回结构化的验证错误，以便前端可以将错误消息与特定表单字段关联。

```json
{
  "errors": {
    "email": "请输入有效的电子邮件地址",
    "password": "密码长度必须至少为8个字符"
  }
}
```

2. **状态反馈**：API 应返回清晰的状态代码和消息，以便前端可以显示适当的反馈。

```json
{
  "status": "success",
  "message": "操作成功完成",
  "data": { ... }
}
```

3. **选项数据**：对于下拉菜单等组件，API 应返回结构化的选项数据。

```json
{
  "options": [
    { "value": "option1", "label": "选项 1" },
    { "value": "option2", "label": "选项 2", "disabled": true },
    { "value": "option3", "label": "选项 3" }
  ]
}
```

4. **分页数据**：对于列表和表格，API 应返回分页信息。

```json
{
  "items": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

通过遵循这些指南，后端和前端可以更好地协作，提供一致的用户体验。
