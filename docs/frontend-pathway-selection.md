# ThinkForward AI 前端路径选择页面文档

本文档描述了ThinkForward AI平台的移民路径选择页面实现，包括页面结构、组件使用和后端集成点。

## 路径选择页面 (`/pathways/select`)

### 页面概述

路径选择页面允许用户浏览和筛选各种移民途径，根据自身情况找到最适合的移民路径。页面提供多种筛选条件，详细的路径信息卡片，以及申请和咨询入口。

### 页面结构

页面由以下几个主要部分组成：

1. **筛选区域**：顶部的筛选工具，包含搜索框和下拉选择器
2. **类别标签页**：快速切换不同类别的移民途径
3. **路径卡片列表**：展示符合筛选条件的移民途径卡片
4. **空结果状态**：当没有符合条件的结果时显示
5. **底部操作按钮**：提供返回仪表盘和开始评估的选项

### 使用的组件

- `DashboardLayout`：提供带侧边栏和顶部导航的布局结构
- `PageHeader`：页面标题和描述
- `SectionContainer`：内容区块容器
- `Card`：路径信息卡片
- `Badge`：资格级别标签
- `Progress`：分数进度条
- `FormField`：表单字段容器
- `Input`：搜索输入框
- `Select`：下拉选择器
- `Tabs`：类别标签页
- `Button`：操作按钮

### 国际化支持

页面使用`next-i18next`实现国际化，所有文本内容都通过翻译键从语言文件中获取。翻译键位于`common.json`文件的`pathways`部分。

```json
"pathways": {
  "title": "移民路径选择",
  "description": "探索适合您的移民途径，根据您的资格和偏好筛选最佳选项。",
  "filters": {
    "search": "搜索",
    "searchPlaceholder": "输入关键词搜索...",
    "category": "类别",
    "eligibility": "资格级别",
    "processingTime": "处理时间"
  },
  ...
}
```

### 数据结构

移民路径数据结构：

```typescript
interface ImmigrationPathway {
  id: string;
  name: string;
  category: string;
  eligibility: 'high' | 'medium' | 'low';
  score: number;
  maxScore: number;
  processingTime: string;
  description: string;
  requirements: string[];
  benefits: string[];
  steps: string[];
}
```

筛选选项数据结构：

```typescript
interface FilterOption {
  value: string;
  label: string;
}
```

### 筛选功能

页面实现了以下筛选功能：

1. **关键词搜索**：在路径名称和描述中搜索关键词
2. **类别筛选**：按移民类别筛选（技术类、商业类、家庭类、省提名）
3. **资格级别筛选**：按资格要求高低筛选
4. **处理时间筛选**：按处理时间长短筛选

筛选逻辑使用React的useState钩子管理状态，并通过filter方法实时更新显示结果。

### 路径卡片展示

每个路径卡片包含以下信息：

1. **基本信息**：名称、资格级别标签
2. **描述**：简短介绍
3. **评分**：当前分数和最高分数的进度条
4. **详细信息**：要求、优势、处理时间和类别
5. **申请步骤**：有序列表展示申请流程
6. **操作按钮**：查看详情、立即申请、寻找顾问

### 后端集成点

路径选择页面需要与以下后端API端点集成：

1. **获取移民路径列表**：
   - 端点：`/api/pathways`
   - 方法：`GET`
   - 参数：可选的筛选参数
   - 返回：移民路径数组

2. **获取用户匹配度**：
   - 端点：`/api/pathways/match`
   - 方法：`GET`
   - 返回：用户与各路径的匹配分数

3. **开始申请流程**：
   - 端点：`/api/applications`
   - 方法：`POST`
   - 数据：`{ pathwayId: string }`

### 服务器端渲染

页面使用Next.js的`getServerSideProps`进行服务器端渲染，确保页面内容是基于用户的最新数据，并支持国际化：

```typescript
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};
```

### 性能优化

1. **组件分割**：将大型组件分割为更小的子组件（如renderFilters、renderCategoryTabs等）
2. **条件渲染**：只渲染符合筛选条件的路径卡片
3. **类型安全**：使用TypeScript接口确保类型安全
4. **响应式设计**：使用Tailwind CSS的响应式类确保在各种设备上的良好显示

### 可访问性

页面遵循WCAG 2.1标准，确保：
- 所有交互元素都可通过键盘访问
- 适当的ARIA标签和角色
- 足够的颜色对比度
- 响应式设计适应不同设备

### 待完成事项

- 集成实际的后端API，替换模拟数据
- 实现路径详情页面
- 实现申请流程页面
- 添加路径比较功能
- 实现顾问匹配功能
