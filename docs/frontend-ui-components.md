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

### Alert 提示框

提示框组件用于向用户显示重要信息、警告或错误消息。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| info | 信息提示 | 提供一般信息或提示 |
| success | 成功提示 | 操作成功或完成时的反馈 |
| warning | 警告提示 | 需要注意的信息 |
| error | 错误提示 | 操作失败或错误信息 |
| neutral | 中性提示 | 一般性通知 |

#### 尺寸

| 尺寸名 | 描述 |
|--------|------|
| sm | 小尺寸 |
| md | 中等尺寸（默认） |
| lg | 大尺寸 |

#### 使用示例

```jsx
// 基本用法
<Alert>这是一条信息提示</Alert>

// 不同变体
<Alert variant="info">这是一条信息提示</Alert>
<Alert variant="success">这是一条成功提示</Alert>
<Alert variant="warning">这是一条警告提示</Alert>
<Alert variant="error">这是一条错误提示</Alert>
<Alert variant="neutral">这是一条中性提示</Alert>

// 不同尺寸
<Alert size="sm">小尺寸提示</Alert>
<Alert size="md">中等尺寸提示</Alert>
<Alert size="lg">大尺寸提示</Alert>

// 带标题
<Alert title="提示标题">这是提示内容</Alert>

// 可关闭的提示
<Alert 
  dismissible 
  onDismiss={() => console.log('提示已关闭')}
>
  这是一条可关闭的提示
</Alert>

// 自定义图标
<Alert 
  icon={<CustomIcon />}
>
  带自定义图标的提示
</Alert>
```

### Input 输入框

输入框组件用于收集用户输入的文本信息。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 默认输入框 | 一般文本输入 |
| error | 错误状态 | 表单验证失败时 |
| success | 成功状态 | 表单验证成功时 |
| warning | 警告状态 | 需要注意的输入 |

#### 尺寸

| 尺寸名 | 描述 |
|--------|------|
| sm | 小尺寸 |
| md | 中等尺寸（默认） |
| lg | 大尺寸 |

#### 使用示例

```jsx
// 基本用法
<Input placeholder="请输入文本" />

// 不同变体
<Input variant="default" placeholder="默认输入框" />
<Input variant="error" error="请输入有效内容" placeholder="错误状态" />
<Input variant="success" placeholder="成功状态" />
<Input variant="warning" placeholder="警告状态" />

// 不同尺寸
<Input size="sm" placeholder="小尺寸" />
<Input size="md" placeholder="中等尺寸" />
<Input size="lg" placeholder="大尺寸" />

// 带标签
<Input label="用户名" placeholder="请输入用户名" />

// 带帮助文本
<Input 
  label="电子邮件" 
  placeholder="请输入电子邮件" 
  helperText="我们不会公开您的电子邮件"
/>

// 带图标
<Input 
  startIcon={<EmailIcon />}
  endIcon={<InfoIcon />}
  placeholder="请输入电子邮件"
/>

// 禁用状态
<Input disabled placeholder="禁用状态" />

// 只读状态
<Input readOnly value="只读内容" />

// 密码输入
<Input type="password" placeholder="请输入密码" />

// 数字输入
<Input type="number" placeholder="请输入数字" />
```

### Checkbox 复选框

复选框组件用于让用户从一组选项中选择一个或多个选项。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 默认复选框 | 一般选择场景 |
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
<Checkbox label="同意条款和条件" />

// 不同变体
<Checkbox variant="default" label="默认复选框" />
<Checkbox variant="error" error="请选择此项" label="错误状态" />
<Checkbox variant="success" label="成功状态" />
<Checkbox variant="warning" label="警告状态" />

// 不同尺寸
<Checkbox size="sm" label="小尺寸" />
<Checkbox size="md" label="中等尺寸" />
<Checkbox size="lg" label="大尺寸" />

// 带描述
<Checkbox 
  label="接收营销邮件" 
  description="我们会定期发送有关新功能和优惠的信息"
/>

// 禁用状态
<Checkbox disabled label="禁用状态" />

// 默认选中
<Checkbox defaultChecked label="默认选中" />

// 受控组件
<Checkbox 
  checked={isChecked} 
  onChange={(e) => setIsChecked(e.target.checked)}
  label="受控复选框"
/>

// 带错误信息
<Checkbox 
  label="必须同意条款" 
  error="请同意条款才能继续"
/>
```

### Radio 单选框

单选框组件用于让用户从一组选项中选择一个选项。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 默认单选框 | 一般选择场景 |
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
<Radio name="option" value="option1" label="选项1" />
<Radio name="option" value="option2" label="选项2" />

// 不同变体
<Radio variant="default" name="variant" value="default" label="默认单选框" />
<Radio variant="error" name="variant" value="error" error="请选择一个选项" label="错误状态" />
<Radio variant="success" name="variant" value="success" label="成功状态" />
<Radio variant="warning" name="variant" value="warning" label="警告状态" />

// 不同尺寸
<Radio size="sm" name="size" value="sm" label="小尺寸" />
<Radio size="md" name="size" value="md" label="中等尺寸" />
<Radio size="lg" name="size" value="lg" label="大尺寸" />

// 带描述
<Radio 
  name="description" 
  value="with-desc"
  label="带描述的选项" 
  description="这是关于此选项的更多信息"
/>

// 禁用状态
<Radio disabled name="disabled" value="disabled" label="禁用状态" />

// 默认选中
<Radio defaultChecked name="default" value="checked" label="默认选中" />

// 受控组件
<Radio 
  checked={selectedValue === 'controlled'} 
  onChange={() => setSelectedValue('controlled')}
  name="controlled"
  value="controlled"
  label="受控单选框"
/>

// 带错误信息
<Radio 
  name="error" 
  value="error"
  label="必选选项" 
  error="请选择此项才能继续"
/>
```

### Toggle 开关

开关组件用于让用户切换某个功能或设置的开启/关闭状态。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 默认开关 | 一般开关场景，使用主色 |
| success | 成功开关 | 表示积极操作的开关 |
| warning | 警告开关 | 需要注意的开关 |
| destructive | 危险开关 | 表示危险操作的开关 |

#### 尺寸

| 尺寸名 | 描述 |
|--------|------|
| sm | 小尺寸 |
| md | 中等尺寸（默认） |
| lg | 大尺寸 |

#### 使用示例

```jsx
// 基本用法
<Toggle label="启用通知" />

// 不同变体
<Toggle variant="default" label="默认开关" />
<Toggle variant="success" label="成功开关" />
<Toggle variant="warning" label="警告开关" />
<Toggle variant="destructive" label="危险开关" />

// 不同尺寸
<Toggle size="sm" label="小尺寸" />
<Toggle size="md" label="中等尺寸" />
<Toggle size="lg" label="大尺寸" />

// 带描述
<Toggle 
  label="启用双重认证" 
  description="提高账户安全性，登录时需要额外验证"
/>

// 禁用状态
<Toggle disabled label="禁用状态" />

// 默认选中
<Toggle defaultChecked label="默认开启" />

// 受控组件
<Toggle 
  checked={isEnabled} 
  onCheckedChange={setIsEnabled}
  label="受控开关"
/>

// 带错误信息
<Toggle 
  label="必须启用" 
  error="请启用此功能才能继续"
/>
```

### Textarea 多行文本输入框

多行文本输入框组件用于收集用户输入的长文本信息。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 默认文本框 | 一般文本输入 |
| error | 错误状态 | 表单验证失败时 |
| success | 成功状态 | 表单验证成功时 |
| warning | 警告状态 | 需要注意的输入 |

#### 尺寸

| 尺寸名 | 描述 |
|--------|------|
| sm | 小尺寸 |
| md | 中等尺寸（默认） |
| lg | 大尺寸 |

#### 调整大小选项

| 选项名 | 描述 |
|--------|------|
| none | 不可调整大小 |
| vertical | 可垂直调整大小（默认） |
| horizontal | 可水平调整大小 |
| both | 可自由调整大小 |

#### 使用示例

```jsx
// 基本用法
<Textarea placeholder="请输入详细描述" />

// 不同变体
<Textarea variant="default" placeholder="默认文本框" />
<Textarea variant="error" error="请输入有效内容" placeholder="错误状态" />
<Textarea variant="success" placeholder="成功状态" />
<Textarea variant="warning" placeholder="警告状态" />

// 不同尺寸
<Textarea size="sm" placeholder="小尺寸" />
<Textarea size="md" placeholder="中等尺寸" />
<Textarea size="lg" placeholder="大尺寸" />

// 不同调整大小选项
<Textarea resize="none" placeholder="不可调整大小" />
<Textarea resize="vertical" placeholder="可垂直调整大小" />
<Textarea resize="horizontal" placeholder="可水平调整大小" />
<Textarea resize="both" placeholder="可自由调整大小" />

// 带标签
<Textarea label="反馈意见" placeholder="请输入您的反馈意见" />

// 带帮助文本
<Textarea 
  label="个人简介" 
  placeholder="请简要介绍自己" 
  helperText="最多500字"
/>

// 禁用状态
<Textarea disabled placeholder="禁用状态" />

// 只读状态
<Textarea readOnly value="只读内容" />

// 设置行数
<Textarea rows={5} placeholder="五行高度" />
```

### Select 高级选择器

高级选择器组件用于从多个选项中选择一个值，相比原生下拉菜单提供更好的用户体验和自定义能力。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 默认选择器 | 一般选择场景 |
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
<Select 
  options={[
    { value: "option1", label: "选项1" },
    { value: "option2", label: "选项2" },
    { value: "option3", label: "选项3" }
  ]} 
  placeholder="请选择"
/>

// 不同变体
<Select 
  variant="default" 
  options={options} 
  placeholder="默认选择器" 
/>
<Select 
  variant="error" 
  error="请选择一个选项" 
  options={options} 
  placeholder="错误状态" 
/>
<Select 
  variant="success" 
  options={options} 
  placeholder="成功状态" 
/>
<Select 
  variant="warning" 
  options={options} 
  placeholder="警告状态" 
/>

// 不同尺寸
<Select size="sm" options={options} placeholder="小尺寸" />
<Select size="md" options={options} placeholder="中等尺寸" />
<Select size="lg" options={options} placeholder="大尺寸" />

// 带标签
<Select 
  label="选择国家" 
  options={countryOptions} 
  placeholder="请选择国家"
/>

// 带帮助文本
<Select 
  label="选择语言" 
  options={languageOptions} 
  placeholder="请选择语言" 
  helperText="选择您偏好的语言"
/>

// 禁用状态
<Select 
  disabled 
  options={options} 
  placeholder="禁用状态"
/>

// 禁用特定选项
<Select 
  options={[
    { value: "option1", label: "选项1" },
    { value: "option2", label: "选项2", disabled: true },
    { value: "option3", label: "选项3" }
  ]} 
  placeholder="部分选项禁用"
/>

// 受控组件
<Select 
  value={selectedValue} 
  onChange={setSelectedValue}
  options={options} 
  placeholder="受控选择器"
/>

// 必填字段
<Select 
  label="必选字段" 
  required 
  options={options} 
  placeholder="请选择"
/>

// 带错误信息
<Select 
  label="国家" 
  error="请选择一个国家" 
  options={countryOptions} 
  placeholder="请选择国家"
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
