# ThinkForward AI 前端表单式资料收集页面文档

本文档描述了ThinkForward AI平台的表单式资料收集页面实现，包括页面结构、组件使用和后端集成点。

## 表单式资料收集页面 (`/profile/build/form`)

### 页面概述

表单式资料收集页面提供了一个结构化的表单界面，让用户可以系统地填写个人资料。页面采用分步骤的标签页设计，将资料收集分为多个类别，使用户可以逐步完成资料填写，同时提供了实时验证和错误提示功能。

### 页面结构

页面由以下几个主要部分组成：

1. **标签页导航**：顶部的标签页，用于在不同资料类别之间切换
2. **表单区域**：当前选中类别的表单字段
3. **导航按钮**：用于在表单步骤之间前进和后退
4. **进度指示器**：显示资料完成度和当前编辑的类别
5. **操作按钮**：切换到对话式模式、返回仪表盘、重置表单等功能按钮

### 使用的组件

- `DashboardLayout`：提供带侧边栏和顶部导航的布局结构
- `PageHeader`：页面标题和描述
- `SectionContainer`：内容区块容器
- `Card`：表单和侧边栏卡片
- `FormField`：带标签和错误提示的表单字段容器
- `Input`：文本输入框
- `Select`：下拉选择器
- `Textarea`：多行文本输入框
- `Checkbox`：复选框
- `Radio`：单选按钮
- `DatePicker`：日期选择器
- `Button`：操作按钮
- `Progress`：完成度进度条
- `Badge`：当前类别标签
- `Tabs`：类别标签页

### 国际化支持

页面使用`next-i18next`实现国际化，所有文本内容都通过翻译键从语言文件中获取。翻译键位于`common.json`文件的`profile.form`部分。

```json
"profile": {
  "form": {
    "title": "表单式资料收集",
    "description": "通过结构化表单完成您的个人资料",
    "progress": "完成进度",
    "completed": "已完成",
    "current": "当前",
    "actions": "操作",
    "switchToConversation": "切换到对话模式",
    "resetForm": "重置表单",
    "previous": "上一步",
    "next": "下一步",
    "saveAndContinue": "保存并继续",
    "firstName": "名字",
    "lastName": "姓氏",
    "email": "电子邮箱",
    "phone": "电话号码",
    "dateOfBirth": "出生日期",
    "nationality": "国籍",
    "address": "地址",
    "city": "城市",
    "province": "省份/州",
    "postalCode": "邮政编码",
    "country": "国家",
    ...
  },
  "categories": {
    "personalInfo": "个人信息",
    "educationInfo": "教育背景",
    "workExperience": "工作经验",
    "languageSkills": "语言能力",
    "immigrationInfo": "移民意向"
  }
}
```

### 表单验证

页面使用Zod和React Hook Form实现表单验证，为每个资料类别定义了验证模式：

1. **个人信息验证**：
   - 必填字段：名字、姓氏、邮箱、电话、国籍、地址等
   - 邮箱格式验证
   - 电话号码长度验证

2. **教育背景验证**：
   - 必填字段：最高学位、专业、院校、毕业年份
   - 学位类型枚举验证

3. **工作经验验证**：
   - 必填字段：职业、工作年限
   - 可选字段：当前雇主、职位、技能

4. **语言能力验证**：
   - 英语和法语水平枚举验证
   - 语言考试类型枚举验证
   - 可选字段：考试分数、其他语言

5. **移民意向验证**：
   - 必填字段：目标国家、移民目的
   - 布尔字段：是否有工作机会、是否有家人在目标国家
   - 可选字段：目标省份、首选移民项目、附加信息

### 数据结构

表单数据结构：

```typescript
interface ProfileFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    nationality: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  education: {
    highestDegree: 'highSchool' | 'diploma' | 'bachelor' | 'master' | 'phd' | 'other';
    fieldOfStudy: string;
    institution: string;
    graduationYear: string;
    otherEducation?: string;
  };
  workExperience: {
    occupation: string;
    yearsOfExperience: string;
    currentEmployer?: string;
    jobTitle?: string;
    skills?: string;
  };
  language: {
    englishProficiency: 'none' | 'basic' | 'intermediate' | 'advanced' | 'fluent' | 'native';
    frenchProficiency: 'none' | 'basic' | 'intermediate' | 'advanced' | 'fluent' | 'native';
    otherLanguages?: string;
    englishTest?: 'none' | 'ielts' | 'celpip' | 'toefl';
    englishTestScore?: string;
    frenchTest?: 'none' | 'tef' | 'tcf';
    frenchTestScore?: string;
  };
  immigration: {
    targetCountry: string;
    targetProvince?: string;
    immigrationPurpose: 'work' | 'study' | 'family' | 'business' | 'refugee' | 'other';
    hasJobOffer: boolean;
    hasFamilyInTargetCountry: boolean;
    preferredImmigrationProgram?: string;
    additionalInformation?: string;
  };
}
```

### 表单状态管理

页面使用React Hook Form管理表单状态，使用Zustand存储管理用户资料数据：

```typescript
const { profile, updatePersonalInfo, updateEducationInfo, updateWorkExperience, updateLanguageSkills, updateImmigrationInfo, completionPercentage } = useProfileStore();

const methods = useForm<ProfileFormData>({
  resolver: zodResolver(profileSchema),
  defaultValues: {
    // 从存储中获取默认值
    personalInfo: {
      firstName: profile.firstName || '',
      // ...其他字段
    },
    // ...其他类别
  },
});
```

### 表单导航

页面实现了以下导航功能：

1. **标签页切换**：
   - 使用`Tabs`组件在不同资料类别之间切换
   - 点击侧边栏的类别项也可以切换

2. **步骤导航**：
   - "上一步"按钮：返回上一个类别
   - "下一步"按钮：前进到下一个类别
   - 最后一步显示"保存并继续"按钮

3. **模式切换**：
   - 提供切换到对话式资料收集模式的按钮
   - 保持两种模式之间的数据同步

### 后端集成点

表单式资料收集页面需要与以下后端API端点集成：

1. **获取用户资料**：
   - 端点：`/api/profile`
   - 方法：`GET`
   - 返回：用户当前资料数据

2. **更新用户资料**：
   - 端点：`/api/profile`
   - 方法：`PUT`
   - 数据：完整的用户资料数据

3. **部分更新资料**：
   - 端点：`/api/profile`
   - 方法：`PATCH`
   - 数据：部分用户资料数据

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

1. **条件渲染**：
   - 只渲染当前选中的表单类别，隐藏其他类别
   - 使用`watch`监听表单变化，避免不必要的重渲染

2. **表单验证优化**：
   - 使用Zod进行高效的表单验证
   - 使用React Hook Form减少重渲染

3. **响应式设计**：
   - 使用Grid布局实现响应式表单
   - 在移动设备上优化表单字段布局

### 可访问性

页面遵循WCAG 2.1标准，确保：
- 所有表单字段都有关联的标签
- 错误消息清晰可见
- 键盘导航支持
- 适当的ARIA属性
- 足够的颜色对比度

### 待完成事项

- 集成实际的后端API，替换模拟数据
- 添加表单数据持久化功能
- 实现表单数据导出功能
- 添加表单字段的条件显示逻辑
- 实现表单数据的版本控制
