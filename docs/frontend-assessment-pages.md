# ThinkForward AI 前端评估页面文档

本文档描述了ThinkForward AI平台的评估页面实现，包括页面结构、组件使用和后端集成点。

## 评估开始页面 (`/assessment/start`)

### 页面概述

评估开始页面是用户开始移民资格评估的入口点。该页面允许用户选择评估类型（全面评估、快速评估或定向评估），并提供关于评估流程的信息。页面采用响应式设计，适配不同设备尺寸。

### 页面结构

页面由以下几个主要部分组成：

1. **英雄区域**：顶部展示区，包含标题、描述和免责声明
2. **评估类型选择**：展示三种不同的评估类型供用户选择
3. **评估流程说明**：解释评估的三个步骤（回答问题、获取结果、探索选项）
4. **常见问题**：解答用户关于评估的常见问题

### 使用的组件

- `PageHeader`：用于页面标题和描述
- `SectionContainer`：用于内容分区和布局
- `Card`：用于评估类型选择卡片
- `Button`：用于开始评估按钮
- `Accordion`：用于常见问题展示

### 国际化支持

页面使用`next-i18next`实现国际化，所有文本内容都通过翻译键从语言文件中获取。翻译键位于`common.json`文件的`assessment`部分。

```json
"assessment": {
  "startPage": {
    "title": "开始您的移民评估",
    "description": "我们的评估将分析您的个人资料并确定最适合您的移民途径。选择最符合您需求的评估类型。",
    ...
  }
}
```

### 数据结构

评估类型数据结构：

```typescript
type AssessmentType = {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
};
```

常见问题数据结构：

```typescript
type FAQ = {
  question: string;
  answer: string;
};
```

### 后端集成点

评估开始页面目前使用静态数据，未来可能需要从后端API获取以下数据：

1. **评估类型信息**：
   - 端点：`/api/assessments/types`
   - 方法：`GET`
   - 返回：评估类型数组

2. **用户评估历史**：
   - 端点：`/api/assessments/history`
   - 方法：`GET`
   - 返回：用户之前的评估记录

3. **开始新评估**：
   - 端点：`/api/assessments/start`
   - 方法：`POST`
   - 数据：`{ type: 'comprehensive' | 'express' | 'targeted' }`
   - 返回：新评估的ID和第一个问题

### 交互功能

1. **评估类型选择**：
   - 用户可以选择三种评估类型之一
   - 选择后高亮显示所选类型
   - 点击"开始评估"按钮进入评估流程

2. **常见问题展开/折叠**：
   - 使用`Accordion`组件实现问题的展开和折叠
   - 用户可以同时展开多个问题或全部折叠

### 服务器端渲染

页面使用Next.js的`getServerSideProps`进行服务器端渲染，确保页面内容是基于用户的语言偏好。这也允许实现认证检查，未认证的用户仍可访问此页面，但某些功能可能受限。

```typescript
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};
```

### 状态管理

评估开始页面使用React的`useState`钩子管理本地状态：

```typescript
const [selectedType, setSelectedType] = useState<string | null>(null);
```

### 性能优化

1. **静态资源优化**：使用Next.js的Image组件进行图片优化
2. **组件分割**：将大型组件分割为更小的子组件，提高可维护性和性能
3. **翻译预加载**：使用服务器端渲染预加载翻译数据

### 可访问性

页面遵循WCAG 2.1标准，确保：
- 所有交互元素都可通过键盘访问
- 适当的ARIA标签和角色
- 足够的颜色对比度
- 响应式设计适应不同设备

### 待完成事项

- 实现评估步骤页面 (`/assessment/[step]`)
- 实现评估结果页面 (`/assessment/result/[id]`)
- 添加评估进度保存功能
- 实现与后端API的集成
- 添加评估历史查看功能

## 评估步骤页面 (`/assessment/[step]`)

此页面将在后续实现，用于展示评估过程中的各个问题步骤。

## 评估结果页面 (`/assessment/result/[id]`)

此页面将在后续实现，用于展示评估完成后的详细结果和推荐移民途径。
