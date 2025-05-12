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

### 页面概述

评估步骤页面是用户完成移民资格评估的核心部分，采用动态路由实现多步骤表单。该页面根据当前步骤（如个人信息、教育背景、工作经验等）显示相应的问题集，并允许用户在步骤之间导航。页面采用响应式设计，适配不同设备尺寸。

### 页面结构

页面由以下几个主要部分组成：

1. **页面标题和描述**：显示当前步骤的标题和说明
2. **进度指示器**：显示用户在整个评估过程中的进度
3. **问题表单**：根据当前步骤显示相应的问题集
4. **导航按钮**：允许用户在步骤之间前进和后退

### 使用的组件

- `DashboardLayout`：提供带侧边栏和顶部导航的布局结构
- `PageHeader`：用于步骤标题和描述
- `SectionContainer`：用于内容分区和布局
- `Card`：用于问题表单的容器
- `Progress`：用于显示评估完成进度
- `FormField`：用于表单字段的容器，包含标签和错误提示
- `Input`、`Select`、`Radio`、`Checkbox`、`Textarea`：用于不同类型的问题输入
- `Button`：用于导航按钮
- `Alert`：用于显示表单验证错误

### 国际化支持

页面使用`next-i18next`实现国际化，所有文本内容都通过翻译键从语言文件中获取。翻译键位于`common.json`文件的`assessment`部分。

```json
"assessment": {
  "steps": {
    "personal": {
      "title": "个人信息",
      "description": "请提供您的基本个人信息。"
    },
    "education": {
      "title": "教育背景",
      "description": "请提供您的教育经历和学历信息。"
    },
    ...
  },
  "questions": {
    "age": "您的年龄是多少？",
    "maritalStatus": "您的婚姻状况是什么？",
    ...
  }
}
```

### 数据结构

评估步骤和问题数据结构：

```typescript
// 步骤类型
type AssessmentStep = 'personal' | 'education' | 'workExperience' | 'language' | 'adaptability';

// 问题类型
type Question = {
  id: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'textarea';
  question: string; // 翻译键
  options?: Array<{ value: string; label: string }>; // 用于select、radio和checkbox
  required: boolean;
};

// 表单数据类型
type FormData = Record<string, any>;
```

### 后端集成点

评估步骤页面需要与以下后端API端点集成：

1. **获取步骤问题**：
   - 端点：`/api/assessments/{assessmentId}/steps/{step}`
   - 方法：`GET`
   - 返回：当前步骤的问题数组

2. **保存步骤回答**：
   - 端点：`/api/assessments/{assessmentId}/steps/{step}`
   - 方法：`POST`
   - 数据：`{ answers: Record<string, any> }`
   - 返回：保存状态和下一步信息

3. **获取评估进度**：
   - 端点：`/api/assessments/{assessmentId}/progress`
   - 方法：`GET`
   - 返回：评估完成百分比和已完成步骤

### 状态管理

评估步骤页面使用React的`useState`钩子管理本地表单状态，并在步骤之间导航时保存数据：

```typescript
// 表单数据状态
const [formData, setFormData] = useState<Record<string, any>>({});

// 表单错误状态
const [errors, setErrors] = useState<Record<string, string>>({});
```

在实际应用中，这些数据应该保存到全局状态管理（如Zustand）或通过API发送到后端。

### 表单验证

页面实现了客户端表单验证，确保所有必填字段都已填写：

```typescript
const validateForm = () => {
  const newErrors: Record<string, string> = {};
  
  questions.forEach((question) => {
    if (question.required && !formData[question.id]) {
      newErrors[question.id] = t('assessment.errors.required');
    }
  });
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### 服务器端渲染

页面使用Next.js的`getServerSideProps`进行服务器端渲染，确保页面内容是基于用户的语言偏好。这也允许验证步骤参数的有效性，无效的步骤会重定向到评估开始页面：

```typescript
export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const { step } = query;
  
  // 验证步骤是否有效
  if (!step || !steps.includes(step as string)) {
    return {
      redirect: {
        destination: '/assessment/start',
        permanent: false,
      },
    };
  }
  
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};
```

### 性能优化

1. **条件渲染**：根据问题类型条件渲染不同的表单组件
2. **表单状态本地化**：使用本地状态管理表单数据，减少不必要的重渲染
3. **服务器端验证**：在服务器端验证步骤参数，避免无效路由

### 可访问性

页面遵循WCAG 2.1标准，确保：
- 所有表单字段都有关联的标签
- 错误消息清晰且与相关字段关联
- 键盘导航支持
- 适当的ARIA属性

### 待完成事项

- 实现与后端API的集成
- 添加表单数据持久化
- 实现更复杂的表单验证（如数字范围、格式验证等）
- 添加条件性问题（基于之前的回答显示或隐藏某些问题）
- 实现保存草稿功能

## 评估结果页面 (`/assessment/result/[id]`)

### 页面概述

评估结果页面是用户完成移民资格评估后查看结果的页面。该页面展示用户的评估总分、推荐的移民途径、分数明细和常见问题解答。页面采用选项卡式设计，允许用户在不同内容区域之间切换，并提供清晰的视觉反馈。

### 页面结构

页面由以下几个主要部分组成：

1. **总分卡片**：顶部展示用户的总评估分数和资格级别（高、中、低）
2. **内容选项卡**：允许用户在推荐途径、分数明细和常见问题之间切换
3. **推荐途径**：展示适合用户的移民途径，包括分数、要求和下一步操作
4. **分数明细**：详细展示各评估类别的得分情况
5. **常见问题**：解答用户关于评估结果的常见问题

### 使用的组件

- `DashboardLayout`：提供带侧边栏和顶部导航的布局结构
- `PageHeader`：用于页面标题和描述
- `SectionContainer`：用于内容分区和布局
- `Card`：用于各内容区块的容器
- `Badge`：用于显示资格级别标签
- `Progress`：用于显示分数进度条
- `Tabs`：用于内容区域切换
- `Accordion`：用于常见问题的展开/折叠
- `Button`：用于各种操作按钮

### 国际化支持

页面使用`next-i18next`实现国际化，所有文本内容都通过翻译键从语言文件中获取。翻译键位于`common.json`文件的`assessment.results`部分。

```json
"assessment": {
  "results": {
    "title": "您的评估结果",
    "description": "根据您提供的信息，以下是我们对您移民资格的评估。",
    "overallScore": "总评分",
    "scoreDescription": "此分数基于您在评估中提供的信息计算得出。",
    "eligibility": {
      "high": "高度符合资格",
      "medium": "中度符合资格",
      "low": "低度符合资格"
    },
    ...
  }
}
```

### 数据结构

评估结果数据结构：

```typescript
// 评估结果
interface AssessmentResult {
  id: string;
  score: number;
  date: string;
  eligibility: 'high' | 'medium' | 'low';
  recommendedPathways: Pathway[];
  scoreBreakdown: ScoreCategory[];
  faqs: FAQ[];
}

// 移民途径
interface Pathway {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  eligibility: 'high' | 'medium' | 'low';
  description: string; // 翻译键
  requirements: string; // 翻译键
  timeframe: string;
  nextSteps: string[]; // 翻译键数组
}

// 分数类别
interface ScoreCategory {
  category: string;
  score: number;
  maxScore: number;
  details: string; // 翻译键
}

// 常见问题
interface FAQ {
  question: string; // 翻译键
  answer: string; // 翻译键
}
```

### 后端集成点

评估结果页面需要与以下后端API端点集成：

1. **获取评估结果**：
   - 端点：`/api/assessments/{id}/results`
   - 方法：`GET`
   - 返回：包含评估总分、推荐途径、分数明细和常见问题的完整结果数据

2. **获取推荐途径详情**：
   - 端点：`/api/pathways/{pathwayId}`
   - 方法：`GET`
   - 返回：特定移民途径的详细信息

3. **保存用户选择的途径**：
   - 端点：`/api/users/me/selected-pathway`
   - 方法：`POST`
   - 数据：`{ pathwayId: string }`
   - 返回：保存状态

### 状态管理

评估结果页面使用React的`useState`钩子管理选项卡状态：

```typescript
// 选项卡状态
const [activeTab, setActiveTab] = useState('pathways');
```

在实际应用中，评估结果数据应该从API获取并使用React Query进行缓存和状态管理。

### 视觉反馈

页面使用颜色编码提供直观的视觉反馈：

- 高度符合资格：绿色
- 中度符合资格：橙色
- 低度符合资格：红色

这些颜色应用于徽章、进度条和圆形进度指示器，帮助用户快速理解其资格状态。

### 服务器端渲染

页面使用Next.js的`getServerSideProps`进行服务器端渲染，确保页面内容是基于用户的语言偏好。这也允许验证评估ID的有效性：

```typescript
export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const { id } = query;
  
  // 在实际应用中，这里会验证评估ID是否有效
  // 如果是预览模式，允许访问
  if (id !== 'preview') {
    // 这里可以添加API调用来验证ID
  }
  
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};
```

### 用户操作

页面提供以下主要用户操作：

1. **查看不同内容区域**：通过选项卡切换查看推荐途径、分数明细和常见问题
2. **探索移民途径**：点击"探索途径"按钮查看特定途径的详细信息
3. **寻找顾问**：点击"寻找顾问"按钮根据选定的途径匹配合适的顾问
4. **重新评估**：点击"重新评估"按钮重新开始评估流程
5. **返回仪表盘**：点击"返回仪表盘"按钮导航回用户仪表盘

### 性能优化

1. **条件渲染**：根据活动选项卡条件渲染不同的内容区域，减少不必要的DOM元素
2. **组件分割**：将大型组件分割为更小的函数组件，提高可维护性和性能
3. **服务器端验证**：在服务器端验证评估ID参数，避免无效路由

### 可访问性

页面遵循WCAG 2.1标准，确保：
- 颜色不是唯一的信息传达方式（使用徽章和文本标签）
- 选项卡可通过键盘访问
- 适当的ARIA属性用于选项卡和手风琴组件
- 足够的颜色对比度

### 待完成事项

- 实现与后端API的集成
- 添加结果分享功能
- 实现结果PDF导出
- 添加与顾问预约的直接集成
- 实现结果历史查看功能
