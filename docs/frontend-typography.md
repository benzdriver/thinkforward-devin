# ThinkForward AI 前端排版系统

## 概述

ThinkForward AI 前端排版系统基于 Tailwind CSS 实现，提供了一套完整的排版规范，包括字体家族、字体大小、行高、字重、字间距等。这套系统旨在确保整个应用中文本的一致性和可读性，同时提供足够的灵活性以适应不同的设计需求。

## 字体家族

我们使用两种主要的字体家族：

| 类名 | 字体 | 用途 |
|------|------|------|
| `font-sans` | Inter, system-ui, sans-serif | 主要文本、界面元素 |
| `font-mono` | SFMono-Regular, Menlo, monospace | 代码、技术内容 |

## 字体大小与行高

我们定义了一套完整的字体大小和行高比例：

| 类名 | 字体大小 | 行高 | 用途 |
|------|----------|------|------|
| `text-xs` | 0.75rem (12px) | 1rem (16px) | 极小文本、标签 |
| `text-sm` | 0.875rem (14px) | 1.25rem (20px) | 小文本、次要信息 |
| `text-base` | 1rem (16px) | 1.5rem (24px) | 正文文本 |
| `text-lg` | 1.125rem (18px) | 1.75rem (28px) | 大文本、重要信息 |
| `text-xl` | 1.25rem (20px) | 1.75rem (28px) | 小标题 |
| `text-2xl` | 1.5rem (24px) | 2rem (32px) | 中标题 |
| `text-3xl` | 1.875rem (30px) | 2.25rem (36px) | 大标题 |
| `text-4xl` | 2.25rem (36px) | 2.5rem (40px) | 页面标题 |
| `text-5xl` | 3rem (48px) | 1 | 大型标题 |
| `text-6xl` | 3.75rem (60px) | 1 | 特大标题 |

## 字重

我们定义了一套完整的字重比例：

| 类名 | 字重 | 用途 |
|------|------|------|
| `font-light` | 300 | 轻量文本 |
| `font-normal` | 400 | 正常文本 |
| `font-medium` | 500 | 中等强调 |
| `font-semibold` | 600 | 半粗体，用于小标题 |
| `font-bold` | 700 | 粗体，用于标题和强调 |
| `font-extrabold` | 800 | 特粗体，用于特别强调 |

## 字间距

我们定义了一套完整的字间距比例：

| 类名 | 值 | 用途 |
|------|------|------|
| `tracking-tighter` | -0.05em | 紧凑标题 |
| `tracking-tight` | -0.025em | 紧凑文本 |
| `tracking-normal` | 0 | 正常文本 |
| `tracking-wide` | 0.025em | 宽松文本 |
| `tracking-wider` | 0.05em | 更宽松文本 |
| `tracking-widest` | 0.1em | 最宽松文本，用于小型大写字母 |

## HTML 元素样式

我们为常见的 HTML 元素定义了默认样式：

### 标题

```css
h1 {
  @apply text-4xl font-bold tracking-tight text-neutral-900 mb-6;
}
h2 {
  @apply text-3xl font-semibold tracking-tight text-neutral-900 mb-5;
}
h3 {
  @apply text-2xl font-semibold tracking-tight text-neutral-800 mb-4;
}
h4 {
  @apply text-xl font-semibold tracking-tight text-neutral-800 mb-3;
}
h5 {
  @apply text-lg font-medium text-neutral-800 mb-2;
}
h6 {
  @apply text-base font-medium text-neutral-800 mb-2;
}
```

### 正文文本

```css
p {
  @apply text-base text-neutral-700 leading-7 mb-4;
}
```

### 内联文本

```css
a {
  @apply text-primary hover:text-primary-700 transition-colors duration-200;
}
strong, b {
  @apply font-semibold text-neutral-900;
}
em, i {
  @apply italic;
}
small {
  @apply text-sm font-medium text-neutral-600 leading-tight;
}
```

### 列表

```css
ul, ol {
  @apply pl-6 mb-4 text-neutral-700;
}
ul {
  @apply list-disc;
}
ol {
  @apply list-decimal;
}
li {
  @apply mb-1;
}
```

### 块元素

```css
blockquote {
  @apply pl-4 border-l-4 border-neutral-300 text-neutral-600 italic my-4;
}
pre {
  @apply p-4 bg-neutral-100 rounded-md text-sm font-mono overflow-x-auto my-4;
}
code {
  @apply font-mono text-sm bg-neutral-100 px-1 py-0.5 rounded;
}
```

## 使用示例

### 标题层级

```jsx
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>
```

### 文本样式

```jsx
<p>这是一段正文文本，使用 <strong>粗体</strong> 和 <em>斜体</em> 来强调重要内容。</p>
<p>这是一个 <a href="#">链接</a>，鼠标悬停时会改变颜色。</p>
<small>这是一段小文本，用于次要信息。</small>
```

### 列表

```jsx
<ul>
  <li>无序列表项 1</li>
  <li>无序列表项 2</li>
  <li>无序列表项 3</li>
</ul>

<ol>
  <li>有序列表项 1</li>
  <li>有序列表项 2</li>
  <li>有序列表项 3</li>
</ol>
```

### 引用和代码

```jsx
<blockquote>
  这是一段引用文本，用于引用他人的话或重要内容。
</blockquote>

<pre>
  <code>
    // 这是一段代码块
    function example() {
      return 'Hello, world!';
    }
  </code>
</pre>

<p>这是一段包含 <code>内联代码</code> 的文本。</p>
```

## 响应式排版

我们的排版系统完全支持响应式设计，可以使用 Tailwind 的响应式前缀来调整不同屏幕尺寸下的文本样式：

```jsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">响应式标题</h1>
<p className="text-sm md:text-base lg:text-lg">响应式段落文本</p>
```

## 后端集成指南

后端开发人员在设计 API 响应时，可以考虑以下几点：

1. **内容结构化**：将内容结构化为标题、段落、列表等，以便前端可以应用适当的排版样式。

2. **富文本内容**：如果 API 返回富文本内容，可以使用 Markdown 或 HTML 格式，前端可以使用相应的解析器将其转换为带有适当排版样式的 HTML。

3. **文本长度考虑**：考虑文本内容的长度限制，特别是标题和摘要等需要在有限空间内显示的内容。

4. **多语言支持**：确保 API 支持多语言内容，并考虑不同语言文本长度的差异。

示例 API 响应：

```json
{
  "article": {
    "title": "文章标题",
    "subtitle": "文章副标题",
    "content": [
      {
        "type": "paragraph",
        "text": "这是一段正文内容..."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "二级标题"
      },
      {
        "type": "list",
        "style": "unordered",
        "items": [
          "列表项 1",
          "列表项 2",
          "列表项 3"
        ]
      },
      {
        "type": "quote",
        "text": "这是一段引用文本"
      }
    ]
  }
}
```

前端可以根据内容类型应用相应的排版样式，确保内容呈现的一致性和可读性。
