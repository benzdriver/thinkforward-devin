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
