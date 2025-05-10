# ThinkForward AI 前端定价页面文档

本文档描述了ThinkForward AI平台的定价页面实现，包括页面结构、组件使用和后端集成点。

## 定价页面 (`/pricing`)

### 页面概述

定价页面展示了ThinkForward AI的不同服务套餐、价格和功能比较，帮助用户选择最适合其需求的方案。页面采用响应式设计，适配不同设备尺寸，并支持月付/年付切换功能。

### 页面结构

页面由以下几个主要部分组成：

1. **英雄区域**：顶部展示区，包含标题和副标题
2. **价格方案**：展示三种不同的价格方案（基础版、专业版、企业版）
3. **计费周期切换**：允许用户在月付和年付之间切换
4. **功能比较表**：详细比较不同方案包含的功能
5. **常见问题**：解答用户关于价格和方案的常见问题
6. **行动召唤**：鼓励用户开始免费试用或联系销售

### 使用的组件

- `PageHeader`：用于各部分的标题和描述
- `SectionContainer`：用于内容分区和布局
- `Card`：用于价格方案展示
- `Badge`：用于标记热门方案和折扣信息
- `Button`：用于行动按钮
- `Tabs`：用于计费周期切换

### 国际化支持

页面使用`next-i18next`实现国际化，所有文本内容都通过翻译键从语言文件中获取。翻译键位于`common.json`文件的`pricing`部分。

```json
"pricing": {
  "pageTitle": "价格方案",
  "metaDescription": "探索ThinkForward AI的价格方案，找到适合您需求的移民咨询套餐。",
  ...
}
```

### 数据结构

价格方案数据结构：

```typescript
type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  popular?: boolean;
  buttonVariant?: 'primary' | 'secondary' | 'outline';
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

目前定价页面使用静态数据，未来可能需要从后端API获取以下数据：

1. **价格方案信息**：
   - 端点：`/api/pricing/plans`
   - 方法：`GET`
   - 返回：价格方案数组

2. **促销信息**：
   - 端点：`/api/pricing/promotions`
   - 方法：`GET`
   - 返回：当前有效的促销信息

3. **订阅处理**：
   - 端点：`/api/subscriptions`
   - 方法：`POST`
   - 数据：用户选择的方案和计费周期

### 交互功能

1. **计费周期切换**：
   - 使用`Tabs`组件实现月付/年付切换
   - 切换时动态更新显示的价格
   - 年付模式显示节省百分比和月均价格

2. **方案选择**：
   - 点击"选择方案"按钮触发订阅流程
   - 专业版标记为"最受欢迎"，使用`Badge`组件突出显示

### 性能考虑

页面使用Next.js的静态生成功能（`getStaticProps`），可以预渲染页面以提高加载速度。价格方案卡片使用CSS Grid布局，在移动设备上自动堆叠，确保良好的响应式体验。

### 可访问性

页面遵循WCAG 2.1标准，确保：
- 颜色对比度符合标准
- 语义化HTML结构（使用适当的表格标签展示比较信息）
- 键盘导航支持
- 屏幕阅读器友好的标记

### 待完成事项

- 集成支付处理系统
- 添加用户特定的折扣码功能
- 实现订阅流程
- 添加与后端的集成
