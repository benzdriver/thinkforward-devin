# 表格生成功能

## 概述

表格生成功能允许用户基于其个人资料数据自动生成官方移民申请表格。该功能包括表格模板选择、数据自动填充、表格验证和PDF生成与下载等核心功能。

## 页面

### 表格生成页面 (`/forms/generate`)

表格生成页面允许用户选择需要生成的官方表格类型，系统会基于用户已有的资料自动填充表格内容。

**功能特点：**

- 表格类型选择
- 数据自动填充
- 表格验证
- 缺失数据提示
- 表格生成状态指示

### 表格预览页面 (`/forms/preview/[id]`)

表格预览页面允许用户预览生成的表格，编辑特定字段，并下载最终的PDF文件。

**功能特点：**

- 表格预览
- 字段编辑
- 表格验证
- PDF下载
- 表格版本历史

## 数据模型

### 表格 (Form)

```typescript
interface Form {
  id: string;
  userId: string;
  formType: string;
  formData: Record<string, any>;
  status: 'generating' | 'completed' | 'error';
  validationResults: ValidationResult[];
  generatedDate: string;
  lastUpdated: string;
  downloadUrl?: string;
  version: number;
}
```

### 表格类型 (FormType)

```typescript
interface FormType {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredFields: string[];
  templateId: string;
}
```

### 验证结果 (ValidationResult)

```typescript
interface ValidationResult {
  fieldPath: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  code: string;
}
```

## 状态管理

表格生成功能使用Zustand进行状态管理，主要通过`useFormStore`存储：

- 表格列表
- 表格类型
- 当前选中的表格
- 生成状态
- 验证结果
- 错误信息

## API集成

### 表格API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/forms/types` | GET | 获取可用的表格类型 |
| `/forms/:userId` | GET | 获取用户的所有表格 |
| `/forms/:userId/:formId` | GET | 获取特定表格详情 |
| `/forms/:userId/generate` | POST | 生成新表格 |
| `/forms/:userId/:formId` | PUT | 更新表格数据 |
| `/forms/:userId/:formId/field` | PATCH | 更新表格特定字段 |
| `/forms/:userId/:formId/download` | GET | 获取表格PDF下载链接 |

### API钩子函数

```typescript
// 获取表格类型
useGetFormTypes()

// 获取表格
useGetForms(userId: string)
useGetForm(userId: string, formId: string)

// 表格操作
useGenerateForm(userId: string)
useUpdateForm(userId: string, formId: string)
useUpdateFormField(userId: string, formId: string, fieldPath: string)
useDownloadForm(userId: string, formId: string)
```

## 组件

### FormTypeSelector

表格类型选择组件，显示可用的表格类型并允许用户选择。

**属性：**

- `formTypes`: 可用的表格类型列表
- `selectedType`: 当前选中的类型
- `onChange`: 选择变更回调
- `disabled`: 是否禁用

### FormPreview

表格预览组件，显示生成的表格内容，支持字段编辑。

**属性：**

- `formData`: 表格数据
- `validationResults`: 验证结果
- `onFieldChange`: 字段变更回调
- `readOnly`: 是否只读模式

### FormValidationSummary

表格验证摘要组件，显示表格中的错误和警告。

**属性：**

- `validationResults`: 验证结果列表
- `onFieldFocus`: 字段聚焦回调

### PDFViewer

PDF预览组件，显示生成的PDF文件。

**属性：**

- `url`: PDF文件URL
- `height`: 预览高度
- `width`: 预览宽度

## 多语言支持

表格生成功能支持多语言，通过i18n实现。主要翻译键包括：

- `forms.generate.title`
- `forms.generate.description`
- `forms.preview.title`
- `forms.preview.description`
- `forms.types.*`
- `forms.validation.*`
- `forms.errors.*`

## 后端集成要求

1. 表格模板服务：需要支持存储和管理官方表格模板
2. 数据映射服务：需要将用户资料数据映射到表格字段
3. PDF生成服务：需要将填充的表格数据转换为PDF文件
4. 表格验证服务：需要验证表格数据的完整性和准确性
5. 版本控制：支持表格版本历史管理

## 实现步骤

1. 创建表格状态管理存储
2. 实现表格类型选择组件
3. 实现表格生成页面
4. 实现表格预览组件
5. 实现表格预览页面
6. 实现PDF生成和下载功能
7. 添加表格验证逻辑
8. 集成多语言支持

## 未来改进

1. 表格批量生成
2. 表格模板自定义
3. 表格数据导入/导出
4. 高级表格验证规则
5. 表格填写指南和帮助提示
6. 表格共享功能
7. 表格签名功能
