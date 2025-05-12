# ThinkForward AI 前端模式切换组件文档

本文档描述了ThinkForward AI平台的模式切换组件实现，该组件允许用户在对话式和表单式资料收集模式之间切换。

## 模式切换组件 (`ModeSwitcher`)

### 组件概述

模式切换组件提供了一个简单的界面，让用户可以在对话式和表单式资料收集模式之间切换。组件显示当前模式，提供模式描述，并提供一个按钮来切换到另一种模式。切换时，用户的数据会保持同步，确保无缝的用户体验。

### 组件结构

组件由以下几个主要部分组成：

1. **标题和当前模式标签**：显示组件标题和当前激活的模式
2. **模式描述**：简短描述当前模式的特点和适用场景
3. **切换按钮**：允许用户切换到另一种模式

### 使用的组件

- `Card`：提供容器样式
- `Badge`：显示当前模式
- `Button`：提供切换模式的操作

### 国际化支持

组件使用`next-i18next`实现国际化，所有文本内容都通过翻译键从语言文件中获取。翻译键位于`common.json`文件的`profile.modeSwitcher`部分。

```json
"profile": {
  "modeSwitcher": {
    "title": "资料收集模式",
    "conversationMode": "对话模式",
    "formMode": "表单模式",
    "conversationDescription": "通过自然对话方式收集您的信息，更加轻松自然。",
    "formDescription": "通过结构化表单填写您的信息，更加系统全面。",
    "switchToForm": "切换到表单模式",
    "switchToConversation": "切换到对话模式"
  }
}
```

### 组件接口

```typescript
interface ModeSwitcherProps {
  currentMode: 'conversation' | 'form';
  className?: string;
}
```

### 数据映射逻辑

模式切换组件本身不处理数据映射，而是依赖于共享的Zustand存储来保持数据同步。两种模式都使用相同的`useProfileStore`，确保数据在模式之间保持一致。

数据映射关系如下：

1. **对话式模式数据结构**：
   - 从用户消息中提取关键信息
   - 使用正则表达式和关键词匹配来识别数据点
   - 通过`updatePersonalInfo`、`updateEducationInfo`等方法更新存储

2. **表单式模式数据结构**：
   - 使用结构化表单字段直接收集数据
   - 使用Zod进行验证
   - 通过相同的`updatePersonalInfo`、`updateEducationInfo`等方法更新存储

### 状态保持机制

状态保持通过以下机制实现：

1. **共享存储**：两种模式使用相同的Zustand存储
2. **持久化**：使用Zustand的`persist`中间件将数据保存到localStorage
3. **路由切换**：使用Next.js的`router.push`在模式之间导航，保持应用状态

### 集成点

模式切换组件集成到以下页面：

1. **对话式资料收集页面** (`/profile/build/conversation`)：
   - 放置在侧边栏中
   - 设置`currentMode="conversation"`

2. **表单式资料收集页面** (`/profile/build/form`)：
   - 放置在侧边栏中
   - 设置`currentMode="form"`

### 响应式设计

组件采用响应式设计，确保在不同屏幕尺寸上都能正常显示：

1. **桌面视图**：在侧边栏中显示
2. **移动视图**：在主内容区域上方显示

### 可访问性

组件遵循WCAG 2.1标准，确保：
- 所有交互元素都可以通过键盘访问
- 适当的ARIA属性
- 足够的颜色对比度
- 清晰的焦点状态

### 使用示例

```tsx
// 在对话式页面中
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">
    {/* 对话界面 */}
  </div>
  <div className="lg:col-span-1">
    <ModeSwitcher currentMode="conversation" />
    {/* 其他侧边栏内容 */}
  </div>
</div>

// 在表单式页面中
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">
    {/* 表单界面 */}
  </div>
  <div className="lg:col-span-1">
    <ModeSwitcher currentMode="form" />
    {/* 其他侧边栏内容 */}
  </div>
</div>
```

### 待完成事项

- 添加动画效果，使模式切换更加流畅
- 实现更复杂的数据映射逻辑，处理特殊字段
- 添加模式偏好设置，记住用户的首选模式
