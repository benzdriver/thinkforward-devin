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

### Modal 模态对话框

模态对话框组件用于在当前页面上显示需要用户注意或交互的内容，阻断用户与页面其他部分的交互，直到用户关闭对话框或完成操作。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 默认对话框 | 一般信息展示和交互 |
| destructive | 危险操作对话框 | 删除、重置等危险操作确认 |
| success | 成功对话框 | 操作成功的反馈 |
| warning | 警告对话框 | 需要用户注意的操作 |

#### 尺寸

| 尺寸名 | 描述 |
|--------|------|
| sm | 小尺寸 (最大宽度 384px) |
| md | 中等尺寸 (最大宽度 448px) |
| lg | 大尺寸 (最大宽度 512px) |
| xl | 超大尺寸 (最大宽度 576px) |
| 2xl | 双倍超大尺寸 (最大宽度 672px) |
| 3xl | 三倍超大尺寸 (最大宽度 768px) |
| 4xl | 四倍超大尺寸 (最大宽度 896px) |
| 5xl | 五倍超大尺寸 (最大宽度 1024px) |
| full | 全屏 |

#### 位置

| 位置名 | 描述 |
|--------|------|
| center | 居中显示（默认） |
| top | 顶部显示 |
| bottom | 底部显示 |

#### 使用示例

```jsx
// 基本用法
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="对话框标题"
>
  <p>这是一个基本的模态对话框内容。</p>
</Modal>

// 不同变体
<Modal
  variant="default"
  isOpen={isOpen}
  onClose={onClose}
  title="信息"
>
  <p>这是一个默认对话框。</p>
</Modal>

<Modal
  variant="destructive"
  isOpen={isOpen}
  onClose={onClose}
  title="确认删除"
>
  <p>您确定要删除此项目吗？此操作无法撤销。</p>
</Modal>

<Modal
  variant="success"
  isOpen={isOpen}
  onClose={onClose}
  title="操作成功"
>
  <p>您的更改已成功保存。</p>
</Modal>

<Modal
  variant="warning"
  isOpen={isOpen}
  onClose={onClose}
  title="注意"
>
  <p>此操作可能需要几分钟时间完成。</p>
</Modal>

// 不同尺寸
<Modal
  size="sm"
  isOpen={isOpen}
  onClose={onClose}
  title="小尺寸对话框"
>
  <p>这是一个小尺寸对话框。</p>
</Modal>

<Modal
  size="lg"
  isOpen={isOpen}
  onClose={onClose}
  title="大尺寸对话框"
>
  <p>这是一个大尺寸对话框，适合展示更多内容。</p>
</Modal>

// 不同位置
<Modal
  position="top"
  isOpen={isOpen}
  onClose={onClose}
  title="顶部对话框"
>
  <p>这个对话框显示在页面顶部。</p>
</Modal>

<Modal
  position="bottom"
  isOpen={isOpen}
  onClose={onClose}
  title="底部对话框"
>
  <p>这个对话框显示在页面底部。</p>
</Modal>

// 带描述
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="账户设置"
  description="管理您的账户偏好设置"
>
  <p>这里是账户设置的内容。</p>
</Modal>

// 带页脚
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="确认操作"
  footer={
    <div>
      <Button variant="outline" onClick={onClose}>取消</Button>
      <Button onClick={handleConfirm}>确认</Button>
    </div>
  }
>
  <p>您确定要执行此操作吗？</p>
</Modal>

// 自定义内容间距
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="自定义间距"
  bodySpacing="lg"
>
  <p>这个对话框的内容区域有更大的内边距。</p>
</Modal>

// 无标题栏
<Modal
  isOpen={isOpen}
  onClose={onClose}
  showCloseButton={false}
>
  <div className="p-6">
    <h3 className="text-lg font-bold mb-4">自定义标题</h3>
    <p>这是一个没有标准标题栏的对话框，您可以完全自定义内容。</p>
    <Button className="mt-4" onClick={onClose}>关闭</Button>
  </div>
</Modal>

// 禁用点击遮罩关闭
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="重要操作"
  closeOnOverlayClick={false}
>
  <p>此对话框必须通过关闭按钮关闭，点击外部区域不会关闭。</p>
</Modal>

// 禁用ESC键关闭
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="重要操作"
  closeOnEsc={false}
>
  <p>此对话框不能通过按ESC键关闭。</p>
</Modal>
```

### Tooltip 工具提示

工具提示组件用于在用户悬停或聚焦在元素上时显示简短的信息提示，帮助用户理解元素的功能或提供额外的上下文信息。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 深色背景，浅色文字 | 默认样式，适用于大多数场景 |
| light | 浅色背景，深色文字，带边框 | 在深色背景上使用 |
| primary | 主题色背景 | 强调重要信息 |
| destructive | 危险色背景 | 警告或危险操作提示 |
| success | 成功色背景 | 成功状态相关提示 |
| warning | 警告色背景 | 需要注意的信息提示 |

#### 尺寸

| 尺寸名 | 描述 |
|--------|------|
| sm | 小尺寸，适合简短文本 |
| md | 中等尺寸（默认） |
| lg | 大尺寸，适合较长文本 |

#### 位置

| 位置名 | 描述 |
|--------|------|
| top | 显示在目标元素上方（默认） |
| right | 显示在目标元素右侧 |
| bottom | 显示在目标元素下方 |
| left | 显示在目标元素左侧 |

#### 使用示例

```jsx
// 基本用法
<Tooltip content="这是一个提示信息">
  <Button>悬停查看提示</Button>
</Tooltip>

// 不同变体
<Tooltip 
  content="默认深色提示" 
  variant="default"
>
  <Button>默认提示</Button>
</Tooltip>

<Tooltip 
  content="浅色提示" 
  variant="light"
>
  <Button>浅色提示</Button>
</Tooltip>

<Tooltip 
  content="主题色提示" 
  variant="primary"
>
  <Button>主题色提示</Button>
</Tooltip>

<Tooltip 
  content="危险操作提示" 
  variant="destructive"
>
  <Button variant="destructive">危险提示</Button>
</Tooltip>

<Tooltip 
  content="成功状态提示" 
  variant="success"
>
  <Button variant="success">成功提示</Button>
</Tooltip>

<Tooltip 
  content="警告信息提示" 
  variant="warning"
>
  <Button variant="warning">警告提示</Button>
</Tooltip>

// 不同尺寸
<Tooltip 
  content="小尺寸提示" 
  size="sm"
>
  <Button>小尺寸</Button>
</Tooltip>

<Tooltip 
  content="大尺寸提示" 
  size="lg"
>
  <Button>大尺寸</Button>
</Tooltip>

// 不同位置
<Tooltip 
  content="顶部提示" 
  position="top"
>
  <Button>顶部</Button>
</Tooltip>

<Tooltip 
  content="右侧提示" 
  position="right"
>
  <Button>右侧</Button>
</Tooltip>

<Tooltip 
  content="底部提示" 
  position="bottom"
>
  <Button>底部</Button>
</Tooltip>

<Tooltip 
  content="左侧提示" 
  position="left"
>
  <Button>左侧</Button>
</Tooltip>

// 自定义延迟
<Tooltip 
  content="显示延迟较长的提示" 
  delayShow={500}
  delayHide={200}
>
  <Button>自定义延迟</Button>
</Tooltip>

// 自定义最大宽度
<Tooltip 
  content="这是一个较长的提示信息，可能需要限制最大宽度以确保良好的用户体验。" 
  maxWidth={300}
>
  <Button>自定义宽度</Button>
</Tooltip>

// 禁用提示
<Tooltip 
  content="此提示不会显示" 
  disabled={true}
>
  <Button>禁用提示</Button>
</Tooltip>

// 交互式提示（鼠标可以移动到提示上而不消失）
<Tooltip 
  content={
    <div>
      <p>这是一个交互式提示</p>
      <Button size="sm">点击此按钮</Button>
    </div>
  } 
  interactive={true}
>
  <Button>交互式提示</Button>
</Tooltip>

// 自定义偏移距离
<Tooltip 
  content="与目标元素有更大间距的提示" 
  offset={10}
>
  <Button>自定义偏移</Button>
</Tooltip>

// 复杂内容
<Tooltip 
  content={
    <div className="p-2">
      <h4 className="font-bold mb-2">提示标题</h4>
      <p className="mb-2">这是提示的详细描述内容。</p>
      <div className="flex items-center text-xs">
        <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded">标签</span>
      </div>
    </div>
  } 
  maxWidth={300}
>
  <Button>复杂内容提示</Button>
</Tooltip>
```

### Badge 徽章

徽章组件用于显示状态、计数或标签信息，通常用于突出显示项目的状态或分类。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 浅灰色背景，深灰色文字 | 一般标签或状态 |
| primary | 主题色背景 | 强调重要标签 |
| secondary | 次要色背景 | 次要信息标签 |
| destructive | 危险色背景 | 错误或警告状态 |
| success | 成功色背景 | 成功或完成状态 |
| warning | 警告色背景 | 需要注意的状态 |
| info | 信息色背景 | 提供信息的标签 |
| outline | 透明背景，带边框 | 低强调度标签 |

#### 尺寸

| 尺寸名 | 描述 |
|--------|------|
| sm | 小尺寸，适合紧凑布局 |
| md | 中等尺寸（默认） |
| lg | 大尺寸，适合更多内容 |

#### 使用示例

```jsx
// 基本用法
<Badge>默认徽章</Badge>

// 不同变体
<Badge variant="default">默认</Badge>
<Badge variant="primary">主要</Badge>
<Badge variant="secondary">次要</Badge>
<Badge variant="destructive">危险</Badge>
<Badge variant="success">成功</Badge>
<Badge variant="warning">警告</Badge>
<Badge variant="info">信息</Badge>
<Badge variant="outline">轮廓</Badge>

// 不同尺寸
<Badge size="sm">小尺寸</Badge>
<Badge size="md">中等尺寸</Badge>
<Badge size="lg">大尺寸</Badge>

// 带图标
<Badge icon={<CheckIcon className="h-3 w-3" />}>已完成</Badge>

// 可交互
<Badge interactive onClick={() => console.log('点击了徽章')}>
  可点击徽章
</Badge>

// 可移除
<Badge 
  onRemove={() => console.log('移除了徽章')}
>
  可移除徽章
</Badge>

// 带图标且可移除
<Badge 
  icon={<UserIcon className="h-3 w-3" />}
  onRemove={() => console.log('移除了徽章')}
>
  用户标签
</Badge>

// 组合使用
<div className="flex flex-wrap gap-2">
  <Badge variant="primary">标签1</Badge>
  <Badge variant="secondary">标签2</Badge>
  <Badge variant="success">标签3</Badge>
</div>

// 计数徽章
<Badge variant="destructive">99+</Badge>

// 状态徽章
<Badge variant="success">在线</Badge>
<Badge variant="warning">离开</Badge>
<Badge variant="destructive">离线</Badge>

// 分类徽章
<Badge variant="primary">前端</Badge>
<Badge variant="info">后端</Badge>
<Badge variant="secondary">设计</Badge>

// 可筛选的标签
<Badge 
  variant="outline"
  interactive
  onClick={() => console.log('筛选')}
  onRemove={() => console.log('移除筛选')}
>
  筛选条件
</Badge>
```

### Avatar 头像

Avatar 头像组件用于展示用户或实体的图像标识，支持图片、文字缩写和图标作为头像内容，并提供多种尺寸、形状和状态选项。

#### 变体与尺寸

| 尺寸 | 描述 | 用途 |
|------|------|------|
| xs | 超小尺寸 (24px) | 紧凑列表、评论区 |
| sm | 小尺寸 (32px) | 表格、紧凑布局 |
| md | 中等尺寸 (40px) | 标准布局（默认） |
| lg | 大尺寸 (48px) | 用户卡片、详情页 |
| xl | 超大尺寸 (64px) | 个人资料页 |
| 2xl | 特大尺寸 (80px) | 突出显示 |

| 形状 | 描述 |
|------|------|
| circle | 圆形（默认） |
| square | 方形（圆角） |

| 边框 | 描述 |
|------|------|
| none | 无边框（默认） |
| thin | 细边框 |
| thick | 粗边框 |

| 状态 | 描述 |
|------|------|
| none | 无状态指示器（默认） |
| online | 在线状态（绿色） |
| offline | 离线状态（灰色） |
| busy | 忙碌状态（红色） |
| away | 离开状态（黄色） |

| 头像占位符变体 | 描述 |
|--------------|------|
| default | 默认灰色背景 |
| primary | 主题色背景 |
| secondary | 次要色背景 |
| destructive | 危险色背景 |
| success | 成功色背景 |
| warning | 警告色背景 |
| info | 信息色背景 |

#### 特性

- **图片加载处理**：支持图片加载状态管理，包括加载中、加载成功和加载失败状态
- **自动生成缩写**：当没有提供图片或自定义占位符时，自动从名称生成缩写字母
- **默认图标**：当没有图片、缩写或自定义占位符时，显示默认用户图标
- **状态指示器**：可选的状态指示器，显示用户的在线状态
- **头像组**：支持头像组展示，可设置最大显示数量和溢出计数

#### 使用示例

```jsx
// 基本用法
<Avatar src="/path/to/image.jpg" alt="用户名" />

// 不同尺寸
<Avatar size="xs" alt="小尺寸" />
<Avatar size="sm" alt="小尺寸" />
<Avatar size="md" alt="中等尺寸" />
<Avatar size="lg" alt="大尺寸" />
<Avatar size="xl" alt="超大尺寸" />
<Avatar size="2xl" alt="特大尺寸" />

// 不同形状
<Avatar shape="circle" alt="圆形" />
<Avatar shape="square" alt="方形" />

// 带边框
<Avatar border="thin" alt="细边框" />
<Avatar border="thick" alt="粗边框" />

// 状态指示器
<Avatar status="online" alt="在线" />
<Avatar status="offline" alt="离线" />
<Avatar status="busy" alt="忙碌" />
<Avatar status="away" alt="离开" />

// 自定义占位符
<Avatar 
  fallback={<CheckIcon className="h-1/2 w-1/2" />}
  fallbackVariant="success"
  alt="自定义图标"
/>

// 使用缩写作为占位符
<Avatar alt="张三" /> // 显示 "张"
<Avatar alt="Zhang San" /> // 显示 "ZS"

// 自定义占位符颜色
<Avatar 
  alt="李四"
  fallbackVariant="primary"
/>

// 图片加载状态处理
<Avatar 
  src="/path/to/image.jpg"
  alt="王五"
  delayMs={1000} // 1秒后显示占位符
  onLoadingStatusChange={(status) => console.log(`图片加载状态: ${status}`)}
/>

// 头像组
<AvatarGroup spacing="normal" max={3}>
  <Avatar src="/path/to/user1.jpg" alt="用户1" />
  <Avatar src="/path/to/user2.jpg" alt="用户2" />
  <Avatar src="/path/to/user3.jpg" alt="用户3" />
  <Avatar src="/path/to/user4.jpg" alt="用户4" />
  <Avatar src="/path/to/user5.jpg" alt="用户5" />
</AvatarGroup>

// 头像组不同间距
<AvatarGroup spacing="tight">
  {/* 头像列表 */}
</AvatarGroup>

<AvatarGroup spacing="normal">
  {/* 头像列表 */}
</AvatarGroup>

<AvatarGroup spacing="loose">
  {/* 头像列表 */}
</AvatarGroup>

// 头像组统一样式
<AvatarGroup size="sm" shape="square" border="thin">
  {/* 所有头像将应用相同的尺寸、形状和边框 */}
</AvatarGroup>

// 实际应用场景
<div className="flex items-center space-x-3">
  <Avatar src="/path/to/user.jpg" alt="张三" status="online" />
  <div>
    <h4 className="font-medium">张三</h4>
    <p className="text-sm text-neutral-500">产品经理</p>
  </div>
</div>

// 评论区用法
<div className="flex space-x-3">
  <Avatar size="sm" src="/path/to/user.jpg" alt="李四" />
  <div className="flex-1">
    <div className="bg-neutral-50 p-3 rounded-lg">
      <h5 className="font-medium">李四</h5>
      <p>这是一条评论内容...</p>
    </div>
    <div className="mt-1 text-xs text-neutral-500">
      2分钟前
    </div>
  </div>
</div>
```

### Progress 进度条

Progress 进度条组件用于显示操作的完成进度或加载状态，支持多种样式、尺寸和动画效果，以及多步骤进度指示器。

#### 变体与尺寸

| 尺寸 | 描述 | 用途 |
|------|------|------|
| xs | 超小尺寸 (4px) | 紧凑布局、微妙提示 |
| sm | 小尺寸 (8px) | 次要操作、内联显示 |
| md | 中等尺寸 (12px) | 标准布局（默认） |
| lg | 大尺寸 (16px) | 重要操作、突出显示 |

| 变体 | 描述 | 用途 |
|------|------|------|
| default | 默认灰色 | 一般加载状态 |
| primary | 主题色 | 主要操作进度 |
| secondary | 次要色 | 次要操作进度 |
| destructive | 危险色 | 危险或警告操作 |
| success | 成功色 | 成功或完成操作 |
| warning | 警告色 | 需要注意的操作 |
| info | 信息色 | 信息性操作 |

| 动画 | 描述 |
|------|------|
| none | 无动画（默认） |
| pulse | 脉冲动画 |
| indeterminate | 不确定进度动画 |

#### 特性

- **进度显示**：支持百分比或自定义格式的进度显示
- **值位置**：可在进度条内部或外部显示进度值
- **动画效果**：支持多种动画效果，包括脉冲和不确定进度动画
- **多步骤进度**：支持显示多步骤流程的进度
- **垂直/水平方向**：步骤进度支持垂直和水平方向
- **可访问性**：包含适当的ARIA属性，确保屏幕阅读器可以正确解读进度信息

#### 使用示例

```jsx
// 基本用法
<Progress value={60} />

// 不同尺寸
<Progress size="xs" value={60} />
<Progress size="sm" value={60} />
<Progress size="md" value={60} />
<Progress size="lg" value={60} />

// 不同变体
<Progress variant="default" value={60} />
<Progress variant="primary" value={60} />
<Progress variant="secondary" value={60} />
<Progress variant="destructive" value={60} />
<Progress variant="success" value={60} />
<Progress variant="warning" value={60} />
<Progress variant="info" value={60} />

// 显示进度值
<Progress value={60} showValue />

// 进度值位置
<Progress value={60} showValue valuePosition="outside" />
<Progress value={60} showValue valuePosition="inside" />

// 自定义进度值格式
<Progress 
  value={60} 
  max={100} 
  showValue 
  valueFormat={(value, max) => `${value}/${max} 完成`} 
/>

// 带标签
<Progress value={60} showValue>
  上传进度
</Progress>

// 动画效果
<Progress value={60} animation="pulse" />

// 不确定进度
<Progress animation="indeterminate" />

// 多步骤进度 - 水平方向
<ProgressSteps 
  steps={5} 
  currentStep={3} 
  variant="primary" 
  showLabels 
  labels={["步骤1", "步骤2", "步骤3", "步骤4", "步骤5"]} 
/>

// 多步骤进度 - 垂直方向
<ProgressSteps 
  steps={5} 
  currentStep={3} 
  variant="primary" 
  orientation="vertical" 
  showLabels 
  labels={["步骤1", "步骤2", "步骤3", "步骤4", "步骤5"]} 
/>

// 实际应用场景 - 文件上传
<div className="space-y-2">
  <div className="flex justify-between">
    <span className="text-sm font-medium">上传文件</span>
    <span className="text-sm text-neutral-500">3.2MB / 10MB</span>
  </div>
  <Progress value={32} variant="primary" />
</div>

// 实际应用场景 - 多步骤表单
<div className="mb-8">
  <ProgressSteps 
    steps={4} 
    currentStep={2} 
    variant="primary" 
    showLabels 
    labels={["个人信息", "联系方式", "职业背景", "确认提交"]} 
  />
</div>

// 实际应用场景 - 加载状态
<div className="flex flex-col items-center justify-center p-8">
  <Progress animation="indeterminate" variant="primary" className="w-48" />
  <p className="mt-4 text-sm text-neutral-500">正在加载数据，请稍候...</p>
</div>

// 实际应用场景 - 任务完成度
<div className="space-y-4">
  <div>
    <Progress value={100} variant="success" showValue>
      已完成任务
    </Progress>
  </div>
  <div>
    <Progress value={50} variant="warning" showValue>
      进行中任务
    </Progress>
  </div>
  <div>
    <Progress value={0} variant="destructive" showValue>
      未开始任务
    </Progress>
  </div>
</div>
```

### Tabs 标签页

Tabs 标签页组件用于在同一区域内组织和切换不同内容视图，使用户能够在不同内容部分之间轻松导航，同时保持界面整洁。

#### 变体与尺寸

| 变体 | 描述 | 用途 |
|------|------|------|
| default | 底部边框样式 | 一般内容切换 |
| pills | 胶囊式样式 | 强调内容分类 |
| underline | 下划线样式 | 简洁的内容切换 |
| bordered | 带边框样式 | 更明显的内容分组 |
| minimal | 极简样式 | 低干扰的内容切换 |

| 尺寸 | 描述 | 用途 |
|------|------|------|
| sm | 小尺寸 | 紧凑布局、次要内容 |
| md | 中等尺寸 | 标准布局（默认） |
| lg | 大尺寸 | 重要内容、主要功能 |

| 方向 | 描述 |
|------|------|
| horizontal | 水平排列（默认） |
| vertical | 垂直排列 |

#### 特性

- **可控与非可控模式**：支持受控和非受控使用方式
- **自适应宽度**：可设置标签页占满容器宽度
- **图标支持**：标签可包含图标
- **徽章支持**：标签可包含徽章（如计数器）
- **动画效果**：内容切换时的过渡动画
- **可访问性**：符合ARIA规范，支持键盘导航
- **方向选择**：支持水平和垂直方向的标签页

#### 使用示例

```jsx
// 基本用法
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">标签页 1</TabsTrigger>
    <TabsTrigger value="tab2">标签页 2</TabsTrigger>
    <TabsTrigger value="tab3">标签页 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">标签页 1 的内容</TabsContent>
  <TabsContent value="tab2">标签页 2 的内容</TabsContent>
  <TabsContent value="tab3">标签页 3 的内容</TabsContent>
</Tabs>

// 不同变体
<Tabs defaultValue="tab1">
  <TabsList variant="default">
    {/* 标签触发器 */}
  </TabsList>
</Tabs>

<Tabs defaultValue="tab1">
  <TabsList variant="pills">
    {/* 标签触发器 */}
  </TabsList>
</Tabs>

<Tabs defaultValue="tab1">
  <TabsList variant="underline">
    {/* 标签触发器 */}
  </TabsList>
</Tabs>

<Tabs defaultValue="tab1">
  <TabsList variant="bordered">
    {/* 标签触发器 */}
  </TabsList>
</Tabs>

<Tabs defaultValue="tab1">
  <TabsList variant="minimal">
    {/* 标签触发器 */}
  </TabsList>
</Tabs>

// 不同尺寸
<TabsList size="sm">
  {/* 小尺寸标签 */}
</TabsList>

<TabsList size="md">
  {/* 中等尺寸标签 */}
</TabsList>

<TabsList size="lg">
  {/* 大尺寸标签 */}
</TabsList>

// 占满宽度
<TabsList fullWidth>
  {/* 标签将平均分配可用宽度 */}
</TabsList>

// 垂直方向
<Tabs orientation="vertical">
  <TabsList>
    {/* 标签将垂直排列 */}
  </TabsList>
  {/* 内容 */}
</Tabs>

// 带图标的标签
<TabsTrigger 
  value="dashboard" 
  icon={<DashboardIcon className="h-4 w-4" />}
>
  仪表盘
</TabsTrigger>

// 带徽章的标签
<TabsTrigger 
  value="messages" 
  badge={<Badge variant="primary">5</Badge>}
>
  消息
</TabsTrigger>

// 禁用的标签
<TabsTrigger value="settings" disabled>
  设置
</TabsTrigger>

// 内容动画
<TabsContent value="tab1" animation="fade">
  内容将淡入淡出
</TabsContent>

<TabsContent value="tab2" animation="slide">
  内容将滑入滑出
</TabsContent>

<TabsContent value="tab3" animation="zoom">
  内容将缩放显示
</TabsContent>

// 受控模式
const [activeTab, setActiveTab] = React.useState("tab1");

<Tabs value={activeTab} onValueChange={setActiveTab}>
  {/* 标签和内容 */}
</Tabs>

// 实际应用场景 - 用户资料页
<Tabs defaultValue="profile">
  <TabsList>
    <TabsTrigger value="profile">个人资料</TabsTrigger>
    <TabsTrigger value="account">账户设置</TabsTrigger>
    <TabsTrigger value="security">安全设置</TabsTrigger>
    <TabsTrigger value="notifications">通知设置</TabsTrigger>
  </TabsList>
  <TabsContent value="profile">
    <h3 className="text-lg font-medium mb-4">个人资料</h3>
    {/* 个人资料表单 */}
  </TabsContent>
  <TabsContent value="account">
    <h3 className="text-lg font-medium mb-4">账户设置</h3>
    {/* 账户设置表单 */}
  </TabsContent>
  <TabsContent value="security">
    <h3 className="text-lg font-medium mb-4">安全设置</h3>
    {/* 安全设置表单 */}
  </TabsContent>
  <TabsContent value="notifications">
    <h3 className="text-lg font-medium mb-4">通知设置</h3>
    {/* 通知设置表单 */}
  </TabsContent>
</Tabs>

// 实际应用场景 - 产品详情页
<Tabs defaultValue="description" variant="underline">
  <TabsList>
    <TabsTrigger value="description">产品描述</TabsTrigger>
    <TabsTrigger value="specs">规格参数</TabsTrigger>
    <TabsTrigger value="reviews">用户评价</TabsTrigger>
    <TabsTrigger value="shipping">配送信息</TabsTrigger>
  </TabsList>
  <TabsContent value="description">
    {/* 产品描述内容 */}
  </TabsContent>
  <TabsContent value="specs">
    {/* 规格参数内容 */}
  </TabsContent>
  <TabsContent value="reviews">
    {/* 用户评价内容 */}
  </TabsContent>
  <TabsContent value="shipping">
    {/* 配送信息内容 */}
  </TabsContent>
</Tabs>

// 实际应用场景 - 仪表盘
<Tabs defaultValue="overview" variant="pills">
  <TabsList className="mb-6">
    <TabsTrigger 
      value="overview" 
      icon={<ChartIcon className="h-4 w-4" />}
    >
      概览
    </TabsTrigger>
    <TabsTrigger 
      value="analytics" 
      icon={<AnalyticsIcon className="h-4 w-4" />}
    >
      分析
    </TabsTrigger>
    <TabsTrigger 
      value="reports" 
      icon={<ReportIcon className="h-4 w-4" />}
    >
      报告
    </TabsTrigger>
    <TabsTrigger 
      value="settings" 
      icon={<SettingsIcon className="h-4 w-4" />}
    >
      设置
    </TabsTrigger>
  </TabsList>
  {/* 各标签页内容 */}
</Tabs>
```

### Accordion 手风琴折叠面板

Accordion 手风琴折叠面板组件用于在有限空间内展示大量内容，允许用户展开或折叠内容部分，提高信息的可访问性和页面的整洁度。

#### 变体与尺寸

| 变体 | 描述 | 用途 |
|------|------|------|
| default | 标准边框样式 | 一般内容展示 |
| bordered | 带边框样式 | 强调内容分组 |
| minimal | 极简样式 | 低干扰的内容展示 |
| shadow | 阴影样式 | 突出显示重要内容 |
| ghost | 无样式 | 自定义样式场景 |

| 尺寸 | 描述 | 用途 |
|------|------|------|
| sm | 小尺寸 | 紧凑布局、次要内容 |
| md | 中等尺寸 | 标准布局（默认） |
| lg | 大尺寸 | 重要内容、主要功能 |

| 图标位置 | 描述 |
|----------|------|
| left | 图标在左侧 |
| right | 图标在右侧（默认） |

#### 特性

- **单项或多项展开**：支持同时只展开一项或允许多项同时展开
- **可折叠选项**：允许折叠所有项目或保持至少一项展开
- **自定义图标**：支持自定义展开/折叠图标
- **图标位置选择**：可选择图标在左侧或右侧显示
- **禁用状态**：支持禁用特定项目
- **动画效果**：内容展开和折叠时的平滑过渡动画
- **可访问性**：符合ARIA规范，支持键盘导航
- **受控与非受控模式**：支持受控和非受控使用方式

#### 使用示例

```jsx
// 基本用法
<Accordion type="single" defaultValue="item-1" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>第一项</AccordionTrigger>
    <AccordionContent>
      这是第一项的内容。
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>第二项</AccordionTrigger>
    <AccordionContent>
      这是第二项的内容。
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>第三项</AccordionTrigger>
    <AccordionContent>
      这是第三项的内容。
    </AccordionContent>
  </AccordionItem>
</Accordion>

// 多项展开
<Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
  {/* 折叠面板项目 */}
</Accordion>

// 不同变体
<Accordion variant="default">
  {/* 折叠面板项目 */}
</Accordion>

<Accordion variant="bordered">
  {/* 折叠面板项目 */}
</Accordion>

<Accordion variant="minimal">
  {/* 折叠面板项目 */}
</Accordion>

<Accordion variant="shadow">
  {/* 折叠面板项目 */}
</Accordion>

<Accordion variant="ghost">
  {/* 折叠面板项目 */}
</Accordion>

// 不同尺寸
<AccordionTrigger size="sm">
  小尺寸触发器
</AccordionTrigger>

<AccordionTrigger size="md">
  中等尺寸触发器
</AccordionTrigger>

<AccordionTrigger size="lg">
  大尺寸触发器
</AccordionTrigger>

// 图标位置
<AccordionTrigger iconPosition="left">
  图标在左侧
</AccordionTrigger>

<AccordionTrigger iconPosition="right">
  图标在右侧
</AccordionTrigger>

// 自定义图标
<AccordionTrigger 
  icon={<PlusMinusIcon className="h-4 w-4" />}
>
  自定义图标
</AccordionTrigger>

// 禁用项目
<AccordionItem value="item-disabled" disabled>
  <AccordionTrigger>禁用项目</AccordionTrigger>
  <AccordionContent>
    此内容无法访问。
  </AccordionContent>
</AccordionItem>

// 隐藏图标
<AccordionTrigger showIcon={false}>
  无图标触发器
</AccordionTrigger>

// 受控模式
const [value, setValue] = React.useState("item-1");

<Accordion 
  type="single" 
  value={value} 
  onValueChange={setValue}
>
  {/* 折叠面板项目 */}
</Accordion>

// 实际应用场景 - 常见问题解答
<Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
  <AccordionItem value="faq-1">
    <AccordionTrigger>
      如何创建账户？
    </AccordionTrigger>
    <AccordionContent>
      点击页面右上角的"注册"按钮，填写必要信息并按照指示完成账户创建流程。
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="faq-2">
    <AccordionTrigger>
      如何重置密码？
    </AccordionTrigger>
    <AccordionContent>
      在登录页面点击"忘记密码"链接，输入您的电子邮件地址，然后按照发送到您邮箱的指示进行操作。
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="faq-3">
    <AccordionTrigger>
      如何联系客服？
    </AccordionTrigger>
    <AccordionContent>
      您可以通过页面底部的"联系我们"链接，或发送电子邮件至support@example.com与我们的客服团队取得联系。
    </AccordionContent>
  </AccordionItem>
</Accordion>

// 实际应用场景 - 产品详情
<Accordion type="multiple" variant="minimal" className="mt-8">
  <AccordionItem value="description">
    <AccordionTrigger size="lg">产品描述</AccordionTrigger>
    <AccordionContent>
      <p className="text-neutral-700">
        这款高性能笔记本电脑采用最新的处理器技术，提供卓越的计算性能和图形处理能力。
        轻薄的设计和长效电池续航使其成为专业人士和学生的理想选择。
      </p>
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="specs">
    <AccordionTrigger size="lg">技术规格</AccordionTrigger>
    <AccordionContent>
      <ul className="list-disc pl-5 space-y-2">
        <li>处理器: Intel Core i7 第12代</li>
        <li>内存: 16GB DDR5</li>
        <li>存储: 512GB NVMe SSD</li>
        <li>显示屏: 15.6英寸 4K UHD</li>
        <li>电池: 86Wh，最长12小时续航</li>
      </ul>
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="shipping">
    <AccordionTrigger size="lg">配送信息</AccordionTrigger>
    <AccordionContent>
      <p className="text-neutral-700">
        我们提供全国范围内的免费标准配送服务，预计送达时间为3-5个工作日。
        如需加急配送，可选择我们的优先配送服务，额外收取费用。
      </p>
    </AccordionContent>
  </AccordionItem>
</Accordion>

// 实际应用场景 - 设置面板
<Accordion 
  type="multiple" 
  defaultValue={["account"]} 
  variant="bordered"
  className="w-full max-w-2xl"
>
  <AccordionItem value="account">
    <AccordionTrigger 
      icon={<UserIcon className="h-4 w-4" />}
      iconPosition="left"
    >
      账户设置
    </AccordionTrigger>
    <AccordionContent>
      {/* 账户设置表单 */}
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="privacy">
    <AccordionTrigger 
      icon={<LockIcon className="h-4 w-4" />}
      iconPosition="left"
    >
      隐私设置
    </AccordionTrigger>
    <AccordionContent>
      {/* 隐私设置表单 */}
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="notifications">
    <AccordionTrigger 
      icon={<BellIcon className="h-4 w-4" />}
      iconPosition="left"
    >
      通知设置
    </AccordionTrigger>
    <AccordionContent>
      {/* 通知设置表单 */}
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

## 分子组件

### FormField 表单字段

FormField 表单字段组件是一个分子级组件，用于创建具有标签、描述文本和错误消息的完整表单控件。它可以与任何表单输入元素（如Input、Select、Checkbox等）结合使用，提供一致的布局和样式。

#### 布局与尺寸

| 布局 | 描述 | 用途 |
|------|------|------|
| vertical | 垂直布局（默认） | 标准表单布局，标签在上，输入在下 |
| horizontal | 水平布局 | 紧凑布局，标签在左，输入在右 |
| inline | 内联布局 | 极简布局，标签和输入在同一行 |

| 标签宽度 | 描述 | 用途 |
|----------|------|------|
| auto | 自动宽度（默认） | 根据内容自动调整宽度 |
| sm | 小宽度 (6rem) | 短标签，紧凑布局 |
| md | 中等宽度 (8rem) | 标准标签长度 |
| lg | 大宽度 (10rem) | 较长标签 |
| xl | 超大宽度 (12rem) | 非常长的标签 |

| 文本尺寸 | 描述 | 用途 |
|----------|------|------|
| sm | 小尺寸 | 紧凑布局、次要内容 |
| md | 中等尺寸 | 标准布局（默认） |
| lg | 大尺寸 | 重要内容、主要功能 |

#### 特性

- **灵活布局**：支持垂直、水平和内联三种布局方式
- **标签宽度控制**：在水平布局中可设置标签宽度
- **描述文本**：支持添加辅助说明文本
- **错误消息**：支持显示不同类型的消息（错误、警告、成功、信息）
- **必填标记**：可显示必填字段标记
- **禁用状态**：支持整个表单字段的禁用状态
- **可访问性**：自动关联标签、描述和错误消息，符合ARIA规范
- **尺寸变体**：支持不同尺寸的文本样式

#### 使用示例

```jsx
// 基本用法
<FormField
  id="username"
  label="用户名"
  description="请输入您的用户名"
  message="用户名不能为空"
  messageVariant="error"
  required
>
  <Input placeholder="请输入用户名" />
</FormField>

// 不同布局
<FormField
  id="email"
  label="电子邮箱"
  layout="vertical"
>
  <Input type="email" placeholder="example@domain.com" />
</FormField>

<FormField
  id="password"
  label="密码"
  layout="horizontal"
  labelWidth="md"
>
  <Input type="password" placeholder="请输入密码" />
</FormField>

<FormField
  id="remember"
  label="记住我"
  layout="inline"
>
  <Checkbox />
</FormField>

// 带描述和错误消息
<FormField
  id="bio"
  label="个人简介"
  description="请简要介绍自己，不超过200字"
  message="个人简介不能超过200字"
  messageVariant="warning"
>
  <Textarea placeholder="请输入个人简介" />
</FormField>

// 不同消息类型
<FormField
  id="field1"
  label="字段1"
  message="这是一个错误消息"
  messageVariant="error"
>
  <Input />
</FormField>

<FormField
  id="field2"
  label="字段2"
  message="这是一个警告消息"
  messageVariant="warning"
>
  <Input />
</FormField>

<FormField
  id="field3"
  label="字段3"
  message="这是一个成功消息"
  messageVariant="success"
>
  <Input />
</FormField>

<FormField
  id="field4"
  label="字段4"
  message="这是一个信息消息"
  messageVariant="info"
>
  <Input />
</FormField>

// 带图标的消息
<FormField
  id="password"
  label="密码"
  message="密码强度不足"
  messageVariant="warning"
  messageIcon={<WarningIcon className="h-4 w-4" />}
>
  <Input type="password" />
</FormField>

// 禁用状态
<FormField
  id="disabled-field"
  label="禁用字段"
  description="此字段已禁用"
  disabled
>
  <Input disabled />
</FormField>

// 隐藏标签（但保持可访问性）
<FormField
  id="search"
  label="搜索"
  hideLabel
>
  <Input placeholder="搜索..." />
</FormField>

// 与其他表单元素结合使用
<FormField
  id="country"
  label="国家/地区"
>
  <Select>
    <option value="cn">中国</option>
    <option value="us">美国</option>
    <option value="uk">英国</option>
  </Select>
</FormField>

<FormField
  id="terms"
  label="我同意服务条款和隐私政策"
  layout="inline"
>
  <Checkbox />
</FormField>

// 实际应用场景 - 注册表单
<form className="space-y-6">
  <FormField
    id="register-name"
    label="姓名"
    required
  >
    <Input placeholder="请输入您的姓名" />
  </FormField>
  
  <FormField
    id="register-email"
    label="电子邮箱"
    description="我们将发送验证链接到此邮箱"
    required
  >
    <Input type="email" placeholder="example@domain.com" />
  </FormField>
  
  <FormField
    id="register-password"
    label="密码"
    description="密码长度至少为8位，包含字母和数字"
    required
  >
    <Input type="password" placeholder="请设置密码" />
  </FormField>
  
  <FormField
    id="register-confirm-password"
    label="确认密码"
    message="两次输入的密码不一致"
    messageVariant="error"
    required
  >
    <Input type="password" placeholder="请再次输入密码" />
  </FormField>
  
  <FormField
    id="register-terms"
    layout="inline"
  >
    <Checkbox id="terms" />
    <label htmlFor="terms" className="ml-2 text-sm text-neutral-600">
      我已阅读并同意<a href="#" className="text-primary-600 hover:underline">服务条款</a>和<a href="#" className="text-primary-600 hover:underline">隐私政策</a>
    </label>
  </FormField>
  
  <Button type="submit" className="w-full">注册账户</Button>
</form>

// 实际应用场景 - 设置表单
<form className="space-y-4">
  <FormField
    id="settings-name"
    label="显示名称"
    layout="horizontal"
    labelWidth="md"
  >
    <Input defaultValue="张三" />
  </FormField>
  
  <FormField
    id="settings-email"
    label="电子邮箱"
    layout="horizontal"
    labelWidth="md"
    message="邮箱已验证"
    messageVariant="success"
  >
    <Input type="email" defaultValue="zhangsan@example.com" />
  </FormField>
  
  <FormField
    id="settings-language"
    label="界面语言"
    layout="horizontal"
    labelWidth="md"
  >
    <Select defaultValue="zh">
      <option value="zh">中文</option>
      <option value="en">英文</option>
    </Select>
  </FormField>
  
  <FormField
    id="settings-notifications"
    label="接收通知"
    layout="horizontal"
    labelWidth="md"
  >
    <Toggle defaultChecked />
  </FormField>
</form>
```

## 分子组件

### FormField 表单字段

FormField 表单字段组件是一个分子级组件，用于创建具有标签、描述文本和错误消息的完整表单控件。它可以与任何表单输入元素（如Input、Select、Checkbox等）结合使用，提供一致的布局和样式。

#### 布局与尺寸

| 布局 | 描述 | 用途 |
|------|------|------|
| vertical | 垂直布局（默认） | 标准表单布局，标签在上，输入在下 |
| horizontal | 水平布局 | 紧凑布局，标签在左，输入在右 |
| inline | 内联布局 | 极简布局，标签和输入在同一行 |

| 标签宽度 | 描述 | 用途 |
|----------|------|------|
| auto | 自动宽度（默认） | 根据内容自动调整宽度 |
| sm | 小宽度 (6rem) | 短标签，紧凑布局 |
| md | 中等宽度 (8rem) | 标准标签长度 |
| lg | 大宽度 (10rem) | 较长标签 |
| xl | 超大宽度 (12rem) | 非常长的标签 |

| 文本尺寸 | 描述 | 用途 |
|----------|------|------|
| sm | 小尺寸 | 紧凑布局、次要内容 |
| md | 中等尺寸 | 标准布局（默认） |
| lg | 大尺寸 | 重要内容、主要功能 |

#### 特性

- **灵活布局**：支持垂直、水平和内联三种布局方式
- **标签宽度控制**：在水平布局中可设置标签宽度
- **描述文本**：支持添加辅助说明文本
- **错误消息**：支持显示不同类型的消息（错误、警告、成功、信息）
- **必填标记**：可显示必填字段标记
- **禁用状态**：支持整个表单字段的禁用状态
- **可访问性**：自动关联标签、描述和错误消息，符合ARIA规范
- **尺寸变体**：支持不同尺寸的文本样式

#### 使用示例

```jsx
// 基本用法
<FormField
  id="username"
  label="用户名"
  description="请输入您的用户名"
  message="用户名不能为空"
  messageVariant="error"
  required
>
  <Input placeholder="请输入用户名" />
</FormField>

// 不同布局
<FormField
  id="email"
  label="电子邮箱"
  layout="vertical"
>
  <Input type="email" placeholder="example@domain.com" />
</FormField>

<FormField
  id="password"
  label="密码"
  layout="horizontal"
  labelWidth="md"
>
  <Input type="password" placeholder="请输入密码" />
</FormField>

<FormField
  id="remember"
  label="记住我"
  layout="inline"
>
  <Checkbox />
</FormField>

// 带描述和错误消息
<FormField
  id="bio"
  label="个人简介"
  description="请简要介绍自己，不超过200字"
  message="个人简介不能超过200字"
  messageVariant="warning"
>
  <Textarea placeholder="请输入个人简介" />
</FormField>

// 不同消息类型
<FormField
  id="field1"
  label="字段1"
  message="这是一个错误消息"
  messageVariant="error"
>
  <Input />
</FormField>

<FormField
  id="field2"
  label="字段2"
  message="这是一个警告消息"
  messageVariant="warning"
>
  <Input />
</FormField>

<FormField
  id="field3"
  label="字段3"
  message="这是一个成功消息"
  messageVariant="success"
>
  <Input />
</FormField>

<FormField
  id="field4"
  label="字段4"
  message="这是一个信息消息"
  messageVariant="info"
>
  <Input />
</FormField>

// 带图标的消息
<FormField
  id="password"
  label="密码"
  message="密码强度不足"
  messageVariant="warning"
  messageIcon={<WarningIcon className="h-4 w-4" />}
>
  <Input type="password" />
</FormField>

// 禁用状态
<FormField
  id="disabled-field"
  label="禁用字段"
  description="此字段已禁用"
  disabled
>
  <Input disabled />
</FormField>

// 隐藏标签（但保持可访问性）
<FormField
  id="search"
  label="搜索"
  hideLabel
>
  <Input placeholder="搜索..." />
</FormField>

// 与其他表单元素结合使用
<FormField
  id="country"
  label="国家/地区"
>
  <Select>
    <option value="cn">中国</option>
    <option value="us">美国</option>
    <option value="uk">英国</option>
  </Select>
</FormField>

<FormField
  id="terms"
  label="我同意服务条款和隐私政策"
  layout="inline"
>
  <Checkbox />
</FormField>

// 实际应用场景 - 注册表单
<form className="space-y-6">
  <FormField
    id="register-name"
    label="姓名"
    required
  >
    <Input placeholder="请输入您的姓名" />
  </FormField>
  
  <FormField
    id="register-email"
    label="电子邮箱"
    description="我们将发送验证链接到此邮箱"
    required
  >
    <Input type="email" placeholder="example@domain.com" />
  </FormField>
  
  <FormField
    id="register-password"
    label="密码"
    description="密码长度至少为8位，包含字母和数字"
    required
  >
    <Input type="password" placeholder="请设置密码" />
  </FormField>
  
  <FormField
    id="register-confirm-password"
    label="确认密码"
    message="两次输入的密码不一致"
    messageVariant="error"
    required
  >
    <Input type="password" placeholder="请再次输入密码" />
  </FormField>
  
  <FormField
    id="register-terms"
    layout="inline"
  >
    <Checkbox id="terms" />
    <label htmlFor="terms" className="ml-2 text-sm text-neutral-600">
      我已阅读并同意<a href="#" className="text-primary-600 hover:underline">服务条款</a>和<a href="#" className="text-primary-600 hover:underline">隐私政策</a>
    </label>
  </FormField>
  
  <Button type="submit" className="w-full">注册账户</Button>
</form>

// 实际应用场景 - 设置表单
<form className="space-y-4">
  <FormField
    id="settings-name"
    label="显示名称"
    layout="horizontal"
    labelWidth="md"
  >
    <Input defaultValue="张三" />
  </FormField>
  
  <FormField
    id="settings-email"
    label="电子邮箱"
    layout="horizontal"
    labelWidth="md"
    message="邮箱已验证"
    messageVariant="success"
  >
    <Input type="email" defaultValue="zhangsan@example.com" />
  </FormField>
  
  <FormField
    id="settings-language"
    label="界面语言"
    layout="horizontal"
    labelWidth="md"
  >
    <Select defaultValue="zh">
      <option value="zh">中文</option>
      <option value="en">英文</option>
    </Select>
  </FormField>
  
  <FormField
    id="settings-notifications"
    label="接收通知"
    layout="horizontal"
    labelWidth="md"
  >
    <Toggle defaultChecked />
  </FormField>
</form>
```

### SearchInput 搜索输入框

SearchInput 搜索输入框组件是一个专门用于搜索功能的增强型输入框，提供了搜索图标、清除按钮和加载状态等功能，使搜索体验更加直观和友好。

#### 变体与尺寸

| 变体 | 描述 | 用途 |
|------|------|------|
| default | 默认样式 | 标准搜索框 |
| filled | 填充背景 | 在浅色背景上更加突出 |
| outline | 加粗边框 | 强调输入区域 |
| ghost | 透明背景 | 融入周围环境 |

| 尺寸 | 描述 | 用途 |
|------|------|------|
| sm | 小尺寸 | 紧凑布局、次要搜索 |
| md | 中等尺寸 | 标准搜索框（默认） |
| lg | 大尺寸 | 主要搜索功能 |

| 图标位置 | 描述 | 用途 |
|----------|------|------|
| left | 左侧图标 | 标准搜索框布局（默认） |
| right | 右侧图标 | 替代布局 |
| both | 两侧图标 | 特殊用途 |
| none | 无图标 | 极简布局 |

#### 特性

- **多种变体**：支持默认、填充、轮廓和幽灵四种变体
- **尺寸选项**：提供小、中、大三种尺寸
- **图标位置**：可选择图标在左侧、右侧、两侧或无图标
- **圆角选项**：支持标准圆角或完全圆形外观
- **清除按钮**：内置一键清除功能
- **加载状态**：支持显示加载指示器
- **自定义图标**：支持自定义搜索图标和清除图标
- **受控与非受控**：支持受控和非受控使用方式
- **禁用状态**：支持禁用状态样式

#### 使用示例

```jsx
// 基本用法
<SearchInput placeholder="搜索..." />

// 不同变体
<SearchInput variant="default" placeholder="默认变体" />
<SearchInput variant="filled" placeholder="填充变体" />
<SearchInput variant="outline" placeholder="轮廓变体" />
<SearchInput variant="ghost" placeholder="幽灵变体" />

// 不同尺寸
<SearchInput size="sm" placeholder="小尺寸" />
<SearchInput size="md" placeholder="中等尺寸" />
<SearchInput size="lg" placeholder="大尺寸" />

// 不同图标位置
<SearchInput iconPosition="left" placeholder="左侧图标" />
<SearchInput iconPosition="right" placeholder="右侧图标" />
<SearchInput iconPosition="both" placeholder="两侧图标" />
<SearchInput iconPosition="none" placeholder="无图标" />

// 圆形搜索框
<SearchInput isRounded placeholder="圆形搜索框" />

// 无清除按钮
<SearchInput hasClearButton={false} placeholder="无清除按钮" />

// 加载状态
<SearchInput loading placeholder="加载中..." />

// 自定义图标
<SearchInput 
  searchIcon={<CustomSearchIcon className="h-4 w-4" />}
  clearIcon={<CustomClearIcon className="h-4 w-4" />}
  placeholder="自定义图标"
/>

// 禁用状态
<SearchInput disabled placeholder="禁用状态" />

// 带清除回调
<SearchInput 
  placeholder="带清除回调"
  onClear={() => console.log('搜索已清除')}
/>

// 受控组件
const [searchValue, setSearchValue] = React.useState('');

<SearchInput 
  value={searchValue}
  onChange={(e) => setSearchValue(e.target.value)}
  placeholder="受控搜索框"
/>

// 实际应用场景 - 顶部导航搜索
<div className="flex items-center justify-between p-4 border-b">
  <div className="flex-1 max-w-md">
    <SearchInput 
      placeholder="搜索文档、设置等..." 
      size="md"
      variant="filled"
      isRounded
    />
  </div>
  <div className="flex items-center space-x-4">
    {/* 其他导航元素 */}
  </div>
</div>

// 实际应用场景 - 数据表格筛选
<div className="flex flex-col space-y-4">
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-semibold">用户列表</h2>
    <div className="w-64">
      <SearchInput 
        placeholder="搜索用户..." 
        size="sm"
        variant="outline"
      />
    </div>
  </div>
  <table className="min-w-full divide-y divide-gray-200">
    {/* 表格内容 */}
  </table>
</div>

// 实际应用场景 - 移动应用搜索
<div className="p-4 bg-gray-100">
  <SearchInput 
    placeholder="搜索商品..." 
    variant="default"
    size="lg"
    isRounded
    iconPosition="left"
    className="w-full"
  />
  <div className="mt-4 flex flex-wrap gap-2">
    <Badge variant="default">热门搜索</Badge>
    <Badge variant="outline">手机</Badge>
    <Badge variant="outline">电脑</Badge>
    <Badge variant="outline">耳机</Badge>
    <Badge variant="outline">相机</Badge>
  </div>
</div>

// 实际应用场景 - 带过滤器的搜索
<div className="flex space-x-2">
  <div className="flex-1">
    <SearchInput placeholder="搜索文件..." />
  </div>
  <Select className="w-32">
    <option value="all">所有类型</option>
    <option value="doc">文档</option>
    <option value="img">图片</option>
    <option value="vid">视频</option>
  </Select>
  <Button variant="primary" size="sm">搜索</Button>
</div>

// 实际应用场景 - 实时搜索结果
<div className="relative">
  <SearchInput 
    placeholder="搜索联系人..." 
    variant="filled"
  />
  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
    <div className="p-2 hover:bg-gray-100 cursor-pointer">
      <div className="font-medium">张三</div>
      <div className="text-sm text-gray-500">zhangsan@example.com</div>
    </div>
    <div className="p-2 hover:bg-gray-100 cursor-pointer">
      <div className="font-medium">李四</div>
      <div className="text-sm text-gray-500">lisi@example.com</div>
    </div>
    <div className="p-2 hover:bg-gray-100 cursor-pointer">
      <div className="font-medium">王五</div>
      <div className="text-sm text-gray-500">wangwu@example.com</div>
    </div>
  </div>
</div>
```

## 分子组件

### FormField 表单字段

FormField 表单字段组件是一个分子级组件，用于创建具有标签、描述文本和错误消息的完整表单控件。它可以与任何表单输入元素（如Input、Select、Checkbox等）结合使用，提供一致的布局和样式。

#### 布局与尺寸

| 布局 | 描述 | 用途 |
|------|------|------|
| vertical | 垂直布局（默认） | 标准表单布局，标签在上，输入在下 |
| horizontal | 水平布局 | 紧凑布局，标签在左，输入在右 |
| inline | 内联布局 | 极简布局，标签和输入在同一行 |

| 标签宽度 | 描述 | 用途 |
|----------|------|------|
| auto | 自动宽度（默认） | 根据内容自动调整宽度 |
| sm | 小宽度 (6rem) | 短标签，紧凑布局 |
| md | 中等宽度 (8rem) | 标准标签长度 |
| lg | 大宽度 (10rem) | 较长标签 |
| xl | 超大宽度 (12rem) | 非常长的标签 |

| 文本尺寸 | 描述 | 用途 |
|----------|------|------|
| sm | 小尺寸 | 紧凑布局、次要内容 |
| md | 中等尺寸 | 标准布局（默认） |
| lg | 大尺寸 | 重要内容、主要功能 |

#### 特性

- **灵活布局**：支持垂直、水平和内联三种布局方式
- **标签宽度控制**：在水平布局中可设置标签宽度
- **描述文本**：支持添加辅助说明文本
- **错误消息**：支持显示不同类型的消息（错误、警告、成功、信息）
- **必填标记**：可显示必填字段标记
- **禁用状态**：支持整个表单字段的禁用状态
- **可访问性**：自动关联标签、描述和错误消息，符合ARIA规范
- **尺寸变体**：支持不同尺寸的文本样式

#### 使用示例

```jsx
// 基本用法
<FormField
  id="username"
  label="用户名"
  description="请输入您的用户名"
  message="用户名不能为空"
  messageVariant="error"
  required
>
  <Input placeholder="请输入用户名" />
</FormField>

// 不同布局
<FormField
  id="email"
  label="电子邮箱"
  layout="vertical"
>
  <Input type="email" placeholder="example@domain.com" />
</FormField>

<FormField
  id="password"
  label="密码"
  layout="horizontal"
  labelWidth="md"
>
  <Input type="password" placeholder="请输入密码" />
</FormField>

<FormField
  id="remember"
  label="记住我"
  layout="inline"
>
  <Checkbox />
</FormField>

// 带描述和错误消息
<FormField
  id="bio"
  label="个人简介"
  description="请简要介绍自己，不超过200字"
  message="个人简介不能超过200字"
  messageVariant="warning"
>
  <Textarea placeholder="请输入个人简介" />
</FormField>

// 不同消息类型
<FormField
  id="field1"
  label="字段1"
  message="这是一个错误消息"
  messageVariant="error"
>
  <Input />
</FormField>

<FormField
  id="field2"
  label="字段2"
  message="这是一个警告消息"
  messageVariant="warning"
>
  <Input />
</FormField>

<FormField
  id="field3"
  label="字段3"
  message="这是一个成功消息"
  messageVariant="success"
>
  <Input />
</FormField>

<FormField
  id="field4"
  label="字段4"
  message="这是一个信息消息"
  messageVariant="info"
>
  <Input />
</FormField>

// 带图标的消息
<FormField
  id="password"
  label="密码"
  message="密码强度不足"
  messageVariant="warning"
  messageIcon={<WarningIcon className="h-4 w-4" />}
>
  <Input type="password" />
</FormField>

// 禁用状态
<FormField
  id="disabled-field"
  label="禁用字段"
  description="此字段已禁用"
  disabled
>
  <Input disabled />
</FormField>

// 隐藏标签（但保持可访问性）
<FormField
  id="search"
  label="搜索"
  hideLabel
>
  <Input placeholder="搜索..." />
</FormField>

// 与其他表单元素结合使用
<FormField
  id="country"
  label="国家/地区"
>
  <Select>
    <option value="cn">中国</option>
    <option value="us">美国</option>
    <option value="uk">英国</option>
  </Select>
</FormField>

<FormField
  id="terms"
  label="我同意服务条款和隐私政策"
  layout="inline"
>
  <Checkbox />
</FormField>

// 实际应用场景 - 注册表单
<form className="space-y-6">
  <FormField
    id="register-name"
    label="姓名"
    required
  >
    <Input placeholder="请输入您的姓名" />
  </FormField>
  
  <FormField
    id="register-email"
    label="电子邮箱"
    description="我们将发送验证链接到此邮箱"
    required
  >
    <Input type="email" placeholder="example@domain.com" />
  </FormField>
  
  <FormField
    id="register-password"
    label="密码"
    description="密码长度至少为8位，包含字母和数字"
    required
  >
    <Input type="password" placeholder="请设置密码" />
  </FormField>
  
  <FormField
    id="register-confirm-password"
    label="确认密码"
    message="两次输入的密码不一致"
    messageVariant="error"
    required
  >
    <Input type="password" placeholder="请再次输入密码" />
  </FormField>
  
  <FormField
    id="register-terms"
    layout="inline"
  >
    <Checkbox id="terms" />
    <label htmlFor="terms" className="ml-2 text-sm text-neutral-600">
      我已阅读并同意<a href="#" className="text-primary-600 hover:underline">服务条款</a>和<a href="#" className="text-primary-600 hover:underline">隐私政策</a>
    </label>
  </FormField>
  
  <Button type="submit" className="w-full">注册账户</Button>
</form>

// 实际应用场景 - 设置表单
<form className="space-y-4">
  <FormField
    id="settings-name"
    label="显示名称"
    layout="horizontal"
    labelWidth="md"
  >
    <Input defaultValue="张三" />
  </FormField>
  
  <FormField
    id="settings-email"
    label="电子邮箱"
    layout="horizontal"
    labelWidth="md"
    message="邮箱已验证"
    messageVariant="success"
  >
    <Input type="email" defaultValue="zhangsan@example.com" />
  </FormField>
  
  <FormField
    id="settings-language"
    label="界面语言"
    layout="horizontal"
    labelWidth="md"
  >
    <Select defaultValue="zh">
      <option value="zh">中文</option>
      <option value="en">英文</option>
    </Select>
  </FormField>
  
  <FormField
    id="settings-notifications"
    label="接收通知"
    layout="horizontal"
    labelWidth="md"
  >
    <Toggle defaultChecked />
  </FormField>
</form>
```

### SearchInput 搜索输入框

SearchInput 搜索输入框组件是一个专门用于搜索功能的增强型输入框，提供了搜索图标、清除按钮和加载状态等功能，使搜索体验更加直观和友好。

#### 变体与尺寸

| 变体 | 描述 | 用途 |
|------|------|------|
| default | 默认样式 | 标准搜索框 |
| filled | 填充背景 | 在浅色背景上更加突出 |
| outline | 加粗边框 | 强调输入区域 |
| ghost | 透明背景 | 融入周围环境 |

| 尺寸 | 描述 | 用途 |
|------|------|------|
| sm | 小尺寸 | 紧凑布局、次要搜索 |
| md | 中等尺寸 | 标准搜索框（默认） |
| lg | 大尺寸 | 主要搜索功能 |

| 图标位置 | 描述 | 用途 |
|----------|------|------|
| left | 左侧图标 | 标准搜索框布局（默认） |
| right | 右侧图标 | 替代布局 |
| both | 两侧图标 | 特殊用途 |
| none | 无图标 | 极简布局 |

#### 特性

- **多种变体**：支持默认、填充、轮廓和幽灵四种变体
- **尺寸选项**：提供小、中、大三种尺寸
- **图标位置**：可选择图标在左侧、右侧、两侧或无图标
- **圆角选项**：支持标准圆角或完全圆形外观
- **清除按钮**：内置一键清除功能
- **加载状态**：支持显示加载指示器
- **自定义图标**：支持自定义搜索图标和清除图标
- **受控与非受控**：支持受控和非受控使用方式
- **禁用状态**：支持禁用状态样式

#### 使用示例

```jsx
// 基本用法
<SearchInput placeholder="搜索..." />

// 不同变体
<SearchInput variant="default" placeholder="默认变体" />
<SearchInput variant="filled" placeholder="填充变体" />
<SearchInput variant="outline" placeholder="轮廓变体" />
<SearchInput variant="ghost" placeholder="幽灵变体" />

// 不同尺寸
<SearchInput size="sm" placeholder="小尺寸" />
<SearchInput size="md" placeholder="中等尺寸" />
<SearchInput size="lg" placeholder="大尺寸" />

// 不同图标位置
<SearchInput iconPosition="left" placeholder="左侧图标" />
<SearchInput iconPosition="right" placeholder="右侧图标" />
<SearchInput iconPosition="both" placeholder="两侧图标" />
<SearchInput iconPosition="none" placeholder="无图标" />

// 圆形搜索框
<SearchInput isRounded placeholder="圆形搜索框" />

// 无清除按钮
<SearchInput hasClearButton={false} placeholder="无清除按钮" />

// 加载状态
<SearchInput loading placeholder="加载中..." />

// 自定义图标
<SearchInput 
  searchIcon={<CustomSearchIcon className="h-4 w-4" />}
  clearIcon={<CustomClearIcon className="h-4 w-4" />}
  placeholder="自定义图标"
/>

// 禁用状态
<SearchInput disabled placeholder="禁用状态" />

// 带清除回调
<SearchInput 
  placeholder="带清除回调"
  onClear={() => console.log('搜索已清除')}
/>

// 受控组件
const [searchValue, setSearchValue] = React.useState('');

<SearchInput 
  value={searchValue}
  onChange={(e) => setSearchValue(e.target.value)}
  placeholder="受控搜索框"
/>

// 实际应用场景 - 顶部导航搜索
<div className="flex items-center justify-between p-4 border-b">
  <div className="flex-1 max-w-md">
    <SearchInput 
      placeholder="搜索文档、设置等..." 
      size="md"
      variant="filled"
      isRounded
    />
  </div>
  <div className="flex items-center space-x-4">
    {/* 其他导航元素 */}
  </div>
</div>

// 实际应用场景 - 数据表格筛选
<div className="flex flex-col space-y-4">
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-semibold">用户列表</h2>
    <div className="w-64">
      <SearchInput 
        placeholder="搜索用户..." 
        size="sm"
        variant="outline"
      />
    </div>
  </div>
  <table className="min-w-full divide-y divide-gray-200">
    {/* 表格内容 */}
  </table>
</div>

// 实际应用场景 - 移动应用搜索
<div className="p-4 bg-gray-100">
  <SearchInput 
    placeholder="搜索商品..." 
    variant="default"
    size="lg"
    isRounded
    iconPosition="left"
    className="w-full"
  />
  <div className="mt-4 flex flex-wrap gap-2">
    <Badge variant="default">热门搜索</Badge>
    <Badge variant="outline">手机</Badge>
    <Badge variant="outline">电脑</Badge>
    <Badge variant="outline">耳机</Badge>
    <Badge variant="outline">相机</Badge>
  </div>
</div>

// 实际应用场景 - 带过滤器的搜索
<div className="flex space-x-2">
  <div className="flex-1">
    <SearchInput placeholder="搜索文件..." />
  </div>
  <Select className="w-32">
    <option value="all">所有类型</option>
    <option value="doc">文档</option>
    <option value="img">图片</option>
    <option value="vid">视频</option>
  </Select>
  <Button variant="primary" size="sm">搜索</Button>
</div>

// 实际应用场景 - 实时搜索结果
<div className="relative">
  <SearchInput 
    placeholder="搜索联系人..." 
    variant="filled"
  />
  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
    <div className="p-2 hover:bg-gray-100 cursor-pointer">
      <div className="font-medium">张三</div>
      <div className="text-sm text-gray-500">zhangsan@example.com</div>
    </div>
    <div className="p-2 hover:bg-gray-100 cursor-pointer">
      <div className="font-medium">李四</div>
      <div className="text-sm text-gray-500">lisi@example.com</div>
    </div>
    <div className="p-2 hover:bg-gray-100 cursor-pointer">
      <div className="font-medium">王五</div>
      <div className="text-sm text-gray-500">wangwu@example.com</div>
    </div>
  </div>
</div>
```

### FileUpload 文件上传

FileUpload 文件上传组件是一个用于处理文件上传的分子级组件，提供了拖放区域、文件列表和验证功能，使文件上传体验更加直观和友好。

#### 变体与尺寸

| 变体 | 描述 | 用途 |
|------|------|------|
| default | 默认样式 | 标准上传区域 |
| filled | 填充背景 | 在浅色背景上更加突出 |
| outline | 加粗边框 | 强调上传区域 |
| ghost | 透明背景 | 融入周围环境 |

| 尺寸 | 描述 | 用途 |
|------|------|------|
| sm | 小尺寸 | 紧凑布局、次要上传功能 |
| md | 中等尺寸 | 标准上传区域（默认） |
| lg | 大尺寸 | 主要上传功能 |

#### 特性

- **多种变体**：支持默认、填充、轮廓和幽灵四种变体
- **尺寸选项**：提供小、中、大三种尺寸
- **拖放支持**：支持拖放文件上传
- **多文件上传**：支持单个或多个文件上传
- **文件类型验证**：支持限制允许的文件类型
- **文件大小验证**：支持限制文件大小
- **自定义图标**：支持自定义上传图标
- **文件列表**：内置文件列表显示
- **自定义文件渲染**：支持自定义文件项渲染
- **错误状态**：支持显示错误状态和消息
- **成功状态**：支持显示成功状态和消息
- **禁用状态**：支持禁用状态样式
- **受控与非受控**：支持受控和非受控使用方式

#### 使用示例

```jsx
// 基本用法
<FileUpload 
  label="上传文件"
  description="点击或拖放文件到此处上传"
/>

// 不同变体
<FileUpload variant="default" label="默认变体" />
<FileUpload variant="filled" label="填充变体" />
<FileUpload variant="outline" label="轮廓变体" />
<FileUpload variant="ghost" label="幽灵变体" />

// 不同尺寸
<FileUpload size="sm" label="小尺寸" />
<FileUpload size="md" label="中等尺寸" />
<FileUpload size="lg" label="大尺寸" />

// 多文件上传
<FileUpload 
  label="上传多个文件"
  description="最多可上传5个文件"
  maxFiles={5}
/>

// 文件类型限制
<FileUpload 
  label="上传图片"
  description="支持 JPG、PNG 和 GIF 格式"
  acceptedFileTypes={["image/jpeg", "image/png", "image/gif"]}
/>

// 文件大小限制
<FileUpload 
  label="上传文档"
  description="文件大小不超过5MB"
  maxSize={5 * 1024 * 1024} // 5MB
/>

// 错误状态
<FileUpload 
  label="上传文件"
  error
  errorMessage="上传失败，请重试"
/>

// 成功状态
<FileUpload 
  label="上传文件"
  success
  successMessage="文件上传成功"
/>

// 禁用状态
<FileUpload 
  label="上传文件"
  disabled
  description="当前不可上传"
/>

// 自定义图标
<FileUpload 
  label="上传文件"
  icon={<CustomUploadIcon className="h-8 w-8" />}
/>

// 隐藏文件列表
<FileUpload 
  label="上传文件"
  showFileList={false}
/>

// 自定义文件渲染
<FileUpload 
  label="上传文件"
  renderFile={(file, onRemove) => (
    <div className="flex items-center p-2 bg-primary-50 rounded-md">
      <FileIcon type={file.type} />
      <span className="ml-2 font-medium">{file.name}</span>
      <button onClick={onRemove} className="ml-auto">删除</button>
    </div>
  )}
/>

// 受控组件
const [file, setFile] = React.useState<File | null>(null);

<FileUpload 
  label="上传文件"
  value={file}
  onChange={(newFile) => setFile(newFile as File | null)}
/>

// 带回调函数
<FileUpload 
  label="上传文件"
  onChange={(files) => console.log('文件已选择', files)}
  onRemove={(file) => console.log('文件已移除', file)}
/>

// 实际应用场景 - 头像上传
<div className="space-y-4">
  <h3 className="text-lg font-medium">个人头像</h3>
  <div className="flex items-start space-x-4">
    <div className="w-20 h-20 rounded-full bg-secondary-100 flex items-center justify-center overflow-hidden">
      {avatarFile ? (
        <img 
          src={URL.createObjectURL(avatarFile)} 
          alt="头像预览" 
          className="w-full h-full object-cover"
        />
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-10 w-10 text-secondary-400" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
            clipRule="evenodd" 
          />
        </svg>
      )}
    </div>
    <div className="flex-1">
      <FileUpload 
        label="更换头像"
        description="支持 JPG、PNG 格式，文件大小不超过2MB"
        acceptedFileTypes={["image/jpeg", "image/png"]}
        maxSize={2 * 1024 * 1024}
        maxFiles={1}
        value={avatarFile}
        onChange={(file) => setAvatarFile(file as File | null)}
        size="sm"
      />
    </div>
  </div>
</div>

// 实际应用场景 - 文档上传
<div className="space-y-6">
  <h3 className="text-xl font-semibold">上传申请材料</h3>
  <p className="text-secondary-600">请上传以下必要文件以完成申请流程。所有文件必须为PDF格式。</p>
  
  <div className="space-y-4">
    <FormField
      id="passport"
      label="护照扫描件"
      description="请上传护照信息页的清晰扫描件"
      required
    >
      <FileUpload 
        acceptedFileTypes={[".pdf"]}
        maxSize={10 * 1024 * 1024}
        label="上传护照扫描件"
        description="PDF格式，不超过10MB"
      />
    </FormField>
    
    <FormField
      id="resume"
      label="个人简历"
      description="请上传最新的个人简历"
      required
    >
      <FileUpload 
        acceptedFileTypes={[".pdf"]}
        maxSize={10 * 1024 * 1024}
        label="上传个人简历"
        description="PDF格式，不超过10MB"
      />
    </FormField>
    
    <FormField
      id="education"
      label="学历证明"
      description="请上传学位证书和成绩单"
      required
    >
      <FileUpload 
        acceptedFileTypes={[".pdf"]}
        maxSize={10 * 1024 * 1024}
        maxFiles={5}
        label="上传学历证明"
        description="PDF格式，不超过10MB，最多5个文件"
      />
    </FormField>
    
    <FormField
      id="additional"
      label="其他支持材料"
      description="可选，如推荐信、获奖证书等"
    >
      <FileUpload 
        acceptedFileTypes={[".pdf"]}
        maxSize={10 * 1024 * 1024}
        maxFiles={10}
        label="上传其他材料"
        description="PDF格式，不超过10MB，最多10个文件"
      />
    </FormField>
  </div>
  
  <div className="flex justify-end space-x-4">
    <Button variant="outline">保存草稿</Button>
    <Button variant="primary">提交申请</Button>
  </div>
</div>

// 实际应用场景 - 图片上传
<div className="space-y-4">
  <h3 className="text-lg font-medium">上传产品图片</h3>
  
  <FileUpload 
    label="上传产品图片"
    description="支持 JPG、PNG 格式，每张图片不超过5MB，最多上传8张"
    acceptedFileTypes={["image/jpeg", "image/png"]}
    maxSize={5 * 1024 * 1024}
    maxFiles={8}
    renderFile={(file, onRemove) => (
      <div className="relative group">
        <div className="aspect-square w-24 rounded-md overflow-hidden border border-secondary-200">
          <img 
            src={URL.createObjectURL(file)} 
            alt={file.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="移除图片"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-destructive-500"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </button>
      </div>
    )}
  />
</div>
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

### DatePicker 日期选择器

DatePicker 日期选择器组件是一个用于选择日期的分子级组件，支持单个日期选择和日期范围选择，提供了丰富的自定义选项和交互体验。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 默认日期选择器 | 一般日期选择场景 |
| filled | 填充背景日期选择器 | 在浅色背景上更加突出 |
| outline | 轮廓日期选择器 | 更强边框的日期选择器 |
| ghost | 幽灵日期选择器 | 无背景的简洁日期选择器 |

#### 尺寸

| 尺寸名 | 描述 |
|--------|------|
| sm | 小尺寸 |
| md | 中等尺寸（默认） |
| lg | 大尺寸 |

#### 特性

1. **日期范围选择**：支持选择日期范围
2. **自定义格式**：支持自定义日期格式
3. **本地化支持**：支持多语言和地区设置
4. **禁用日期**：可以禁用特定日期或日期范围
5. **最小/最大日期**：可以设置可选择的日期范围
6. **自定义图标**：支持自定义日历图标
7. **键盘导航**：支持键盘导航和操作
8. **日期验证**：内置日期验证功能
9. **周数显示**：可选显示周数
10. **多种定位选项**：日历弹出位置可自定义

#### 使用示例

```jsx
// 基本用法
<DatePicker placeholder="选择日期" />

// 不同变体
<DatePicker variant="default" placeholder="默认日期选择器" />
<DatePicker variant="filled" placeholder="填充背景日期选择器" />
<DatePicker variant="outline" placeholder="轮廓日期选择器" />
<DatePicker variant="ghost" placeholder="幽灵日期选择器" />

// 不同尺寸
<DatePicker size="sm" placeholder="小尺寸" />
<DatePicker size="md" placeholder="中等尺寸" />
<DatePicker size="lg" placeholder="大尺寸" />

// 日期范围选择
<DatePicker 
  isRange 
  placeholder="选择日期范围" 
/>

// 自定义格式
<DatePicker 
  format="yyyy年MM月dd日" 
  placeholder="自定义格式" 
/>

// 本地化支持
<DatePicker 
  locale="zh-CN" 
  placeholder="中文日期" 
/>

// 最小/最大日期限制
<DatePicker 
  minDate={new Date(2023, 0, 1)} 
  maxDate={new Date(2023, 11, 31)} 
  placeholder="2023年日期" 
/>

// 禁用特定日期
<DatePicker 
  disabledDates={[new Date(2023, 5, 15), new Date(2023, 5, 16)]} 
  placeholder="禁用特定日期" 
/>

// 禁用特定星期几
<DatePicker 
  disabledDays={[0, 6]} // 禁用周六和周日
  placeholder="禁用周末" 
/>

// 显示周数
<DatePicker 
  showWeekNumbers 
  placeholder="显示周数" 
/>

// 自定义日历位置
<DatePicker 
  calendarPosition="top" 
  calendarAlign="right" 
  placeholder="日历在上方右对齐" 
/>

// 自定义图标
<DatePicker 
  icon={<CustomIcon />} 
  placeholder="自定义图标" 
/>

// 错误状态
<DatePicker 
  hasError 
  placeholder="错误状态" 
/>

// 禁用状态
<DatePicker 
  disabled 
  placeholder="禁用状态" 
/>

// 只读状态
<DatePicker 
  readOnly 
  value={new Date()} 
  placeholder="只读状态" 
/>

// 受控组件
<DatePicker 
  value={selectedDate} 
  onChange={(date) => setSelectedDate(date)} 
  placeholder="受控日期选择器" 
/>

// 日期范围受控组件
<DatePicker 
  isRange 
  value={{ start: startDate, end: endDate }} 
  onChange={(range) => {
    setStartDate(range.start);
    setEndDate(range.end);
  }} 
  placeholder="受控日期范围选择器" 
/>
```

#### 后端集成考虑

1. **日期格式**：后端API应当支持多种日期格式，并在文档中明确指定接受的格式。

```json
{
  "date": "2023-06-15",  // ISO 格式
  "dateRange": {
    "start": "2023-06-15",
    "end": "2023-06-20"
  }
}
```

2. **日期验证**：后端应当实现日期验证逻辑，确保日期在有效范围内。

```json
{
  "errors": {
    "date": "日期必须在2023年内",
    "dateRange.start": "开始日期不能晚于结束日期"
  }
}
```

3. **本地化支持**：后端应当考虑不同地区的日期格式和时区差异。

```json
{
  "dateFormats": {
    "zh-CN": "yyyy年MM月dd日",
    "en-US": "MM/dd/yyyy",
    "fr-FR": "dd/MM/yyyy"
  }
}
```

4. **预设选项**：后端可以提供常用的日期预设选项。

```json
{
  "datePresets": [
    { "label": "今天", "value": "2023-06-15" },
    { "label": "本周", "value": { "start": "2023-06-12", "end": "2023-06-18" } },
    { "label": "本月", "value": { "start": "2023-06-01", "end": "2023-06-30" } }
  ]
}
```

DatePicker组件提供了灵活且功能丰富的日期选择体验，适用于各种需要日期输入的场景，如预约系统、活动日历、报表筛选等。通过与后端良好的集成，可以确保日期数据的准确性和一致性。

### Notification 通知组件

Notification 通知组件用于向用户显示重要信息、成功消息、警告或错误提示，支持多种显示方式和自动关闭功能。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| info | 信息通知 | 提供一般信息或提示 |
| success | 成功通知 | 操作成功或完成时的反馈 |
| warning | 警告通知 | 需要注意的信息 |
| error | 错误通知 | 操作失败或错误信息 |
| neutral | 中性通知 | 一般性通知 |

#### 尺寸

| 尺寸名 | 描述 |
|--------|------|
| sm | 小尺寸 |
| md | 中等尺寸（默认） |
| lg | 大尺寸 |

#### 位置

| 位置名 | 描述 |
|--------|------|
| topLeft | 左上角 |
| topCenter | 顶部居中 |
| topRight | 右上角 |
| bottomLeft | 左下角 |
| bottomCenter | 底部居中 |
| bottomRight | 右下角 |
| inline | 内联显示（不固定位置） |

#### 特性

1. **自动关闭**：支持设置自动关闭时间
2. **自定义图标**：可以自定义通知图标
3. **动作按钮**：支持添加操作按钮
4. **关闭按钮**：可以显示或隐藏关闭按钮
5. **动画效果**：支持显示和隐藏动画
6. **Toast系统**：提供全局Toast通知系统
7. **多通知管理**：支持同时显示多个通知
8. **可访问性**：符合ARIA标准，支持屏幕阅读器

#### 使用示例

```jsx
// 基本用法
<Notification title="通知标题" description="这是一条通知消息" />

// 不同变体
<Notification variant="info" title="信息" description="这是一条信息通知" />
<Notification variant="success" title="成功" description="操作已成功完成" />
<Notification variant="warning" title="警告" description="请注意此操作的风险" />
<Notification variant="error" title="错误" description="操作失败，请重试" />
<Notification variant="neutral" title="提示" description="这是一条中性通知" />

// 不同尺寸
<Notification size="sm" title="小尺寸通知" />
<Notification size="md" title="中等尺寸通知" />
<Notification size="lg" title="大尺寸通知" />

// 不同位置
<Notification position="topRight" title="右上角通知" />
<Notification position="bottomCenter" title="底部居中通知" />
<Notification position="inline" title="内联通知" />

// 自动关闭
<Notification 
  title="自动关闭" 
  description="此通知将在5秒后自动关闭" 
  autoClose 
  autoCloseDelay={5000} 
/>

// 自定义图标
<Notification 
  title="自定义图标" 
  icon={<CustomIcon />} 
/>

// 带操作按钮
<Notification 
  title="带操作按钮" 
  description="点击按钮执行操作" 
  action={<Button size="sm">执行</Button>} 
/>

// 无关闭按钮
<Notification 
  title="无关闭按钮" 
  hasClose={false} 
/>

// 带动画效果
<Notification 
  title="带动画效果" 
  isAnimated 
/>

// 使用Toast系统
function MyComponent() {
  const { addToast, removeToast, clearToasts } = useToast();
  
  const handleShowToast = () => {
    addToast({
      variant: "success",
      title: "操作成功",
      description: "您的更改已保存",
      autoClose: true
    });
  };
  
  return (
    <Button onClick={handleShowToast}>
      显示通知
    </Button>
  );
}

// 使用ToastProvider
function App() {
  return (
    <ToastProvider position="topRight">
      <MyComponent />
    </ToastProvider>
  );
}
```

#### 后端集成考虑

1. **通知状态**：后端API应返回清晰的状态代码和消息，以便前端可以显示适当的通知。

```json
{
  "status": "success",
  "message": "用户资料已更新",
  "data": { ... }
}
```

2. **错误处理**：后端应提供结构化的错误信息，包括错误类型和详细描述。

```json
{
  "status": "error",
  "error": {
    "type": "validation_error",
    "message": "提交的表单包含错误",
    "details": { ... }
  }
}
```

3. **通知优先级**：后端可以指定通知的优先级，影响前端的显示方式。

```json
{
  "notifications": [
    {
      "id": "1",
      "type": "warning",
      "title": "系统维护",
      "message": "系统将于今晚10点进行维护",
      "priority": "high",
      "autoClose": false
    },
    {
      "id": "2",
      "type": "info",
      "title": "新功能上线",
      "message": "查看我们的新功能",
      "priority": "low",
      "autoClose": true,
      "autoCloseDelay": 8000
    }
  ]
}
```

4. **通知分组**：后端可以对相关通知进行分组，前端可以将它们显示为一组。

```json
{
  "notificationGroups": [
    {
      "id": "group1",
      "title": "文档更新",
      "notifications": [
        { "id": "1", "message": "文档1已更新" },
        { "id": "2", "message": "文档2已更新" }
      ]
    }
  ]
}
```

Notification组件提供了灵活且用户友好的通知系统，适用于各种需要向用户提供反馈的场景，如表单提交、异步操作完成、系统状态变更等。通过与后端良好的集成，可以确保用户及时获得重要信息并采取适当的行动。

### EmptyState 空状态

EmptyState 空状态组件用于在没有数据或内容时向用户显示友好的提示，可以包含图标、标题、描述和操作按钮。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 默认空状态 | 一般空内容场景 |
| subtle | 轻微空状态 | 浅色背景的空状态 |
| ghost | 幽灵空状态 | 无背景的简洁空状态 |
| card | 卡片空状态 | 带阴影的卡片式空状态 |

#### 尺寸

| 尺寸名 | 描述 |
|--------|------|
| sm | 小尺寸 |
| md | 中等尺寸（默认） |
| lg | 大尺寸 |

#### 特性

1. **自定义图标**：支持自定义空状态图标
2. **标题和描述**：可以设置标题和描述文本
3. **操作按钮**：支持添加主要和次要操作按钮
4. **加载状态**：内置加载状态显示
5. **全高模式**：可以设置为占满容器高度
6. **页脚内容**：支持添加页脚内容

#### 使用示例

```jsx
// 基本用法
<EmptyState 
  title="暂无数据" 
  description="当前没有可显示的数据" 
/>

// 不同变体
<EmptyState 
  variant="default" 
  title="默认空状态" 
/>

<EmptyState 
  variant="subtle" 
  title="轻微空状态" 
/>

<EmptyState 
  variant="ghost" 
  title="幽灵空状态" 
/>

<EmptyState 
  variant="card" 
  title="卡片空状态" 
/>

// 不同尺寸
<EmptyState 
  size="sm" 
  title="小尺寸空状态" 
/>

<EmptyState 
  size="md" 
  title="中等尺寸空状态" 
/>

<EmptyState 
  size="lg" 
  title="大尺寸空状态" 
/>

// 自定义图标
<EmptyState 
  icon={<CustomIcon />} 
  title="自定义图标" 
/>

// 带操作按钮
<EmptyState 
  title="暂无文件" 
  description="您还没有上传任何文件" 
  action={<Button>上传文件</Button>} 
/>

// 带主要和次要操作按钮
<EmptyState 
  title="暂无联系人" 
  description="您的联系人列表为空" 
  action={<Button>添加联系人</Button>} 
  secondaryAction={<Button variant="outline">导入联系人</Button>} 
/>

// 加载状态
<EmptyState 
  isLoading 
  title="加载中" 
  description="正在加载数据，请稍候" 
/>

// 全高模式
<EmptyState 
  fullHeight 
  title="暂无结果" 
  description="没有找到匹配的搜索结果" 
/>

// 带页脚
<EmptyState 
  title="暂无通知" 
  description="您没有未读通知" 
  footer="通知将在这里显示" 
/>
```

#### 后端集成考虑

1. **空数据状态**：后端API应当在返回空数据集时提供有用的元数据，帮助前端显示适当的空状态。

```json
{
  "items": [],
  "meta": {
    "isEmpty": true,
    "emptyReason": "no_data",
    "emptyMessage": "暂无数据",
    "emptyDescription": "您还没有创建任何项目",
    "suggestedAction": "create_new"
  }
}
```

2. **加载状态**：后端应当支持异步加载模式，并提供加载状态信息。

```json
{
  "status": "loading",
  "progress": 45,
  "estimatedTimeRemaining": "30s"
}
```

3. **错误处理**：当出现错误导致无法显示数据时，后端应提供有用的错误信息。

```json
{
  "status": "error",
  "error": {
    "code": "data_access_error",
    "message": "无法访问数据",
    "userAction": "retry",
    "technicalDetails": "Database connection timeout"
  }
}
```

4. **权限相关空状态**：当用户没有权限查看数据时，后端应提供明确的权限信息。

```json
{
  "status": "empty",
  "reason": "permission_denied",
  "message": "您没有权限查看此内容",
  "requiredPermission": "view_reports",
  "requestPermissionUrl": "/request-access/reports"
}
```

EmptyState组件提供了一种用户友好的方式来处理无数据或内容的情况，可以减少用户困惑并提供明确的后续操作指导。通过与后端良好的集成，可以根据不同的空数据原因显示最适合的空状态提示。

### LoadingState 加载状态

LoadingState 加载状态组件用于在数据加载过程中向用户显示友好的加载提示，可以包含旋转图标、进度条、标题和描述文本。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 默认加载状态 | 一般加载场景 |
| subtle | 轻微加载状态 | 浅色背景的加载状态 |
| ghost | 幽灵加载状态 | 无背景的简洁加载状态 |
| overlay | 覆盖加载状态 | 覆盖在内容上方的加载状态，带模糊效果 |

#### 尺寸

| 尺寸名 | 描述 |
|--------|------|
| sm | 小尺寸 |
| md | 中等尺寸（默认） |
| lg | 大尺寸 |

#### 特性

1. **自定义图标**：支持自定义加载图标
2. **标题和描述**：可以设置标题和描述文本
3. **进度条**：支持显示加载进度条
4. **进度百分比**：显示加载进度百分比
5. **全高模式**：可以设置为占满容器高度
6. **覆盖模式**：可以覆盖在内容上方显示

#### 使用示例

```jsx
// 基本用法
<LoadingState 
  title="加载中" 
  description="正在加载数据，请稍候" 
/>

// 不同变体
<LoadingState 
  variant="default" 
  title="默认加载状态" 
/>

<LoadingState 
  variant="subtle" 
  title="轻微加载状态" 
/>

<LoadingState 
  variant="ghost" 
  title="幽灵加载状态" 
/>

<LoadingState 
  variant="overlay" 
  title="覆盖加载状态" 
/>

// 不同尺寸
<LoadingState 
  size="sm" 
  title="小尺寸加载状态" 
/>

<LoadingState 
  size="md" 
  title="中等尺寸加载状态" 
/>

<LoadingState 
  size="lg" 
  title="大尺寸加载状态" 
/>

// 自定义图标
<LoadingState 
  icon={<CustomSpinner />} 
  title="自定义加载图标" 
/>

// 带进度条
<LoadingState 
  title="上传中" 
  description="正在上传文件" 
  progress={75}
  showProgressBar
/>

// 不显示旋转图标
<LoadingState 
  title="处理中" 
  description="正在处理您的请求" 
  showSpinner={false}
  progress={50}
  showProgressBar
/>

// 全高模式
<LoadingState 
  fullHeight 
  title="初始化中" 
  description="正在初始化应用" 
/>

// 覆盖模式
<LoadingState 
  variant="overlay" 
  title="保存中" 
  description="正在保存您的更改" 
/>
```

#### 后端集成考虑

1. **进度反馈**：后端API应当支持进度反馈，特别是对于长时间运行的操作。

```json
{
  "status": "loading",
  "progress": 65,
  "estimatedTimeRemaining": "约1分钟",
  "currentStep": "正在处理图片",
  "totalSteps": 4,
  "currentStepIndex": 2
}
```

2. **分阶段加载**：对于复杂操作，后端应提供分阶段加载信息。

```json
{
  "status": "loading",
  "stages": [
    { "name": "初始化", "status": "completed", "progress": 100 },
    { "name": "数据处理", "status": "in_progress", "progress": 45 },
    { "name": "生成报告", "status": "pending", "progress": 0 },
    { "name": "完成", "status": "pending", "progress": 0 }
  ],
  "currentStage": 1,
  "overallProgress": 35
}
```

3. **加载状态持久化**：对于可能跨会话的长时间操作，后端应支持加载状态持久化。

```json
{
  "status": "loading",
  "operationId": "op_12345",
  "progress": 70,
  "resumable": true,
  "startedAt": "2023-05-01T10:30:00Z",
  "lastUpdatedAt": "2023-05-01T10:35:00Z"
}
```

4. **取消操作支持**：后端应支持取消正在进行的操作。

```json
{
  "status": "loading",
  "operationId": "op_12345",
  "progress": 80,
  "cancellable": true,
  "cancelEndpoint": "/api/operations/op_12345/cancel"
}
```

LoadingState组件提供了一种用户友好的方式来显示加载状态，减少用户等待焦虑并提供清晰的进度反馈。通过与后端良好的集成，可以为用户提供准确的加载进度和预估完成时间，提升整体用户体验。

### ErrorState 错误状态

ErrorState 错误状态组件用于在发生错误时向用户显示友好的错误提示，可以包含图标、标题、描述、错误代码和重试操作按钮。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 默认错误状态 | 一般错误场景 |
| subtle | 轻微错误状态 | 浅色背景的错误状态 |
| ghost | 幽灵错误状态 | 无背景的简洁错误状态 |
| critical | 严重错误状态 | 强调严重错误的状态 |

#### 尺寸

| 尺寸名 | 描述 |
|--------|------|
| sm | 小尺寸 |
| md | 中等尺寸（默认） |
| lg | 大尺寸 |

#### 特性

1. **自定义图标**：支持自定义错误图标
2. **标题和描述**：可以设置标题和描述文本
3. **错误代码**：显示错误代码或错误标识
4. **错误详情**：可折叠的详细错误信息
5. **重试操作**：支持添加重试按钮
6. **次要操作**：支持添加次要操作按钮
7. **全高模式**：可以设置为占满容器高度

#### 使用示例

```jsx
// 基本用法
<ErrorState 
  title="发生错误" 
  description="无法加载数据，请稍后再试" 
/>

// 不同变体
<ErrorState 
  variant="default" 
  title="默认错误状态" 
/>

<ErrorState 
  variant="subtle" 
  title="轻微错误状态" 
/>

<ErrorState 
  variant="ghost" 
  title="幽灵错误状态" 
/>

<ErrorState 
  variant="critical" 
  title="严重错误状态" 
/>

// 不同尺寸
<ErrorState 
  size="sm" 
  title="小尺寸错误状态" 
/>

<ErrorState 
  size="md" 
  title="中等尺寸错误状态" 
/>

<ErrorState 
  size="lg" 
  title="大尺寸错误状态" 
/>

// 自定义图标
<ErrorState 
  icon={<CustomErrorIcon />} 
  title="自定义错误图标" 
/>

// 带错误代码
<ErrorState 
  title="请求失败" 
  description="无法连接到服务器" 
  errorCode={500}
/>

// 带错误详情
<ErrorState 
  title="表单提交失败" 
  description="提交表单时发生错误" 
  errorDetails={JSON.stringify(errorResponse, null, 2)}
  showDetails
/>

// 带重试按钮
<ErrorState 
  title="加载失败" 
  description="无法加载数据" 
  retryAction={<Button onClick={handleRetry}>重试</Button>}
/>

// 带主要和次要操作按钮
<ErrorState 
  title="权限不足" 
  description="您没有访问此资源的权限" 
  retryAction={<Button>请求权限</Button>} 
  secondaryAction={<Button variant="outline">返回</Button>} 
/>

// 全高模式
<ErrorState 
  fullHeight 
  title="页面错误" 
  description="加载页面时发生错误" 
  errorCode="PAGE_LOAD_ERROR"
/>
```

#### 后端集成考虑

1. **标准化错误响应**：后端API应当提供标准化的错误响应格式。

```json
{
  "status": "error",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "请求的资源不存在",
    "userMessage": "无法找到您请求的内容",
    "details": "Resource ID 12345 not found in database",
    "timestamp": "2023-05-01T10:30:00Z",
    "requestId": "req_abcdef123456",
    "path": "/api/resources/12345"
  }
}
```

2. **错误分类**：后端应提供错误分类信息，帮助前端显示适当的错误状态。

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "category": "user_input",
    "severity": "warning",
    "message": "输入验证失败",
    "fields": [
      {
        "field": "email",
        "message": "请输入有效的电子邮件地址"
      },
      {
        "field": "password",
        "message": "密码长度必须至少为8个字符"
      }
    ]
  }
}
```

3. **可恢复性信息**：后端应指明错误是否可恢复以及如何恢复。

```json
{
  "status": "error",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "超出API请求限制",
    "recoverable": true,
    "retryAfter": 60,
    "retryStrategy": "exponential_backoff"
  }
}
```

4. **错误上下文**：提供足够的上下文信息，帮助用户理解和解决问题。

```json
{
  "status": "error",
  "error": {
    "code": "PAYMENT_FAILED",
    "message": "支付处理失败",
    "context": {
      "paymentMethod": "credit_card",
      "lastFourDigits": "1234",
      "failureReason": "insufficient_funds",
      "alternativePaymentMethods": ["balance", "alipay"],
      "supportReference": "case_12345"
    }
  }
}
```

ErrorState组件提供了一种用户友好的方式来处理错误情况，减少用户挫折感并提供明确的错误信息和恢复路径。通过与后端良好的集成，可以根据不同的错误类型和严重程度显示最适合的错误状态提示，帮助用户理解问题并采取适当的行动。
