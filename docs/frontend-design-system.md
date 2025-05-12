# ThinkForward AI 前端设计系统

## 色彩系统

ThinkForward AI 前端使用一套完整的色彩系统，基于 Tailwind CSS 实现，包括主色、辅助色、中性色和功能色。

### 主色 (Primary)

主色是品牌的核心色彩，用于主要按钮、链接和重点元素。

| 变量名 | 颜色值 | 用途 |
|--------|--------|------|
| primary | #2563EB | 默认主色 |
| primary-50 | #EFF6FF | 极浅背景、悬停状态 |
| primary-100 | #DBEAFE | 浅背景、选中状态 |
| primary-200 | #BFDBFE | 浅背景 |
| primary-300 | #93C5FD | 边框、分割线 |
| primary-400 | #60A5FA | 次要文本 |
| primary-500 | #3B82F6 | 图标、强调 |
| primary-600 | #2563EB | 主要按钮、链接 |
| primary-700 | #1D4ED8 | 悬停状态 |
| primary-800 | #1E40AF | 按下状态 |
| primary-900 | #1E3A8A | 深色变体 |

### 辅助色 (Secondary)

辅助色用于次要按钮、标签和辅助元素。

| 变量名 | 颜色值 | 用途 |
|--------|--------|------|
| secondary | #64748B | 默认辅助色 |
| secondary-50 | #F8FAFC | 极浅背景 |
| secondary-100 | #F1F5F9 | 浅背景 |
| secondary-200 | #E2E8F0 | 边框、分割线 |
| secondary-300 | #CBD5E1 | 禁用状态 |
| secondary-400 | #94A3B8 | 图标、次要文本 |
| secondary-500 | #64748B | 次要按钮 |
| secondary-600 | #475569 | 悬停状态 |
| secondary-700 | #334155 | 按下状态 |
| secondary-800 | #1E293B | 深色文本 |
| secondary-900 | #0F172A | 主要文本 |

### 中性色 (Neutral)

中性色用于文本、背景和边框等元素。

| 变量名 | 颜色值 | 用途 |
|--------|--------|------|
| neutral | #6B7280 | 默认中性色 |
| neutral-50 | #F9FAFB | 页面背景 |
| neutral-100 | #F3F4F6 | 卡片背景、分割线 |
| neutral-200 | #E5E7EB | 边框、分割线 |
| neutral-300 | #D1D5DB | 禁用状态 |
| neutral-400 | #9CA3AF | 占位符文本 |
| neutral-500 | #6B7280 | 次要文本 |
| neutral-600 | #4B5563 | 标签文本 |
| neutral-700 | #374151 | 段落文本 |
| neutral-800 | #1F2937 | 标题文本 |
| neutral-900 | #111827 | 主要文本 |

### 功能色

功能色用于表示不同的状态和操作。

#### 成功 (Success)

| 变量名 | 颜色值 | 用途 |
|--------|--------|------|
| success | #10B981 | 默认成功色 |
| success-50 | #ECFDF5 | 成功背景 |
| success-500 | #10B981 | 成功图标、文本 |
| success-600 | #059669 | 成功按钮 |

#### 警告 (Warning)

| 变量名 | 颜色值 | 用途 |
|--------|--------|------|
| warning | #F59E0B | 默认警告色 |
| warning-50 | #FFFBEB | 警告背景 |
| warning-500 | #F59E0B | 警告图标、文本 |
| warning-600 | #D97706 | 警告按钮 |

#### 危险 (Destructive)

| 变量名 | 颜色值 | 用途 |
|--------|--------|------|
| destructive | #EF4444 | 默认危险色 |
| destructive-50 | #FEF2F2 | 危险背景 |
| destructive-500 | #EF4444 | 危险图标、文本 |
| destructive-600 | #DC2626 | 危险按钮 |

### 实用色

| 变量名 | 颜色值 | 用途 |
|--------|--------|------|
| foreground | #0F172A | 主要文本颜色 |
| background | #FFFFFF | 页面背景色 |
| muted | #F1F5F9 | 次要背景、禁用状态 |
| accent | #F8FAFC | 强调背景 |

## 使用方法

### 在 Tailwind CSS 中使用

```jsx
// 使用主色
<button className="bg-primary text-white">主要按钮</button>

// 使用辅助色
<button className="bg-secondary text-white">次要按钮</button>

// 使用功能色
<div className="text-success">成功消息</div>
<div className="text-warning">警告消息</div>
<div className="text-destructive">错误消息</div>

// 使用中性色
<p className="text-neutral-700">段落文本</p>
<h2 className="text-neutral-900">标题文本</h2>
```

### 在 CSS 变量中使用

在全局 CSS 中，我们也定义了一些 CSS 变量，可以在需要的地方使用：

```css
:root {
  --foreground-rgb: 15, 23, 42;
  --background-rgb: 255, 255, 255;
}

/* 使用 CSS 变量 */
.custom-element {
  color: rgb(var(--foreground-rgb));
  background-color: rgb(var(--background-rgb));
}
```

## 设计原则

1. **一致性**：在整个应用中保持色彩使用的一致性，避免使用未定义的颜色。
2. **层次感**：使用不同深浅的颜色创建视觉层次，引导用户注意力。
3. **可访问性**：确保文本和背景色之间有足够的对比度，符合 WCAG 2.1 AA 级标准。
4. **语义化**：根据颜色的语义含义使用颜色，如成功、警告、错误等。

## 后端集成指南

后端开发人员在设计 API 响应时，可以参考前端色彩系统的语义化命名，例如：

```json
{
  "status": "success",  // 对应前端的 success 颜色
  "message": "操作成功完成",
  "data": { ... }
}

{
  "status": "warning",  // 对应前端的 warning 颜色
  "message": "操作完成，但有警告",
  "warnings": [ ... ],
  "data": { ... }
}

{
  "status": "error",    // 对应前端的 destructive 颜色
  "message": "操作失败",
  "errors": [ ... ]
}
```

这样可以确保前后端在状态表示上的一致性，前端可以根据响应状态直接映射到相应的视觉样式。
