# 文档管理功能

## 概述

文档管理功能允许用户上传、查看、管理和组织与其移民申请相关的文件。该功能包括文档分类、状态跟踪和文件预览等核心功能。

## 页面

### 文档上传页面 (`/documents/upload`)

文档上传页面允许用户按类别上传文件，并查看每个类别中已上传的文件。

**功能特点：**

- 按类别组织文件上传
- 文件类型验证
- 文件大小限制
- 文件数量限制
- 上传状态指示
- 文件预览（对于图像文件）
- 文件状态标记（待处理、处理中、已批准、已拒绝）

### 文档管理页面 (`/documents/manage`)

文档管理页面允许用户查看、筛选、删除和管理所有已上传的文件。

**功能特点：**

- 按类别筛选文件
- 文件状态更新
- 文件删除
- 文件预览
- 文件详细信息查看

## 数据模型

### 文档 (Document)

```typescript
interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  category: string;
  uploadDate: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  url?: string;
  thumbnailUrl?: string;
  notes?: string;
}
```

### 文档类别 (DocumentCategory)

```typescript
interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  maxFiles?: number;
  acceptedFileTypes?: string[];
}
```

## 状态管理

文档管理功能使用Zustand进行状态管理，主要通过`useDocumentStore`存储：

- 文档列表
- 文档类别
- 加载状态
- 错误信息

## API集成

### 文档API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/documents/:userId` | GET | 获取用户的所有文档 |
| `/documents/:userId/category/:categoryId` | GET | 获取特定类别的文档 |
| `/documents/:userId/:documentId` | GET | 获取特定文档详情 |
| `/documents/:userId/upload` | POST | 上传新文档 |
| `/documents/:userId/:documentId` | PUT | 更新文档信息 |
| `/documents/:userId/:documentId` | DELETE | 删除文档 |
| `/document-categories` | GET | 获取所有文档类别 |

### API钩子函数

```typescript
// 获取文档
useGetDocuments(userId: string)
useGetDocumentsByCategory(userId: string, categoryId: string)
useGetDocument(userId: string, documentId: string)

// 文档操作
useUploadDocument(userId: string)
useUpdateDocument(userId: string, documentId: string)
useDeleteDocument(userId: string)

// 类别操作
useGetDocumentCategories()
useCreateDocumentCategory()
useUpdateDocumentCategory(categoryId: string)
useDeleteDocumentCategory()
```

## 组件

### FileUpload

文件上传组件，支持拖放和多文件上传。

**属性：**

- `onChange`: 文件选择回调
- `disabled`: 是否禁用
- `accept`: 接受的文件类型
- `maxFiles`: 最大文件数
- `label`: 上传按钮文本
- `description`: 上传区域描述文本

### 文档卡片

显示单个文档信息的卡片组件，包括文件名、大小、类别、状态和操作按钮。

## 多语言支持

文档管理功能支持多语言，通过i18n实现。主要翻译键包括：

- `documents.upload.title`
- `documents.upload.description`
- `documents.manage.title`
- `documents.manage.description`
- `documents.categories.*`
- `documents.status.*`
- `documents.errors.*`

## 后端集成要求

1. 文件存储服务：需要支持文件上传、存储和检索
2. 文件处理服务：需要支持文件验证、病毒扫描和格式转换
3. 文件元数据存储：需要存储文件元数据，包括类别、状态和关联用户
4. 访问控制：确保用户只能访问自己的文件
5. 文件版本控制：支持文件版本管理（可选）

## 未来改进

1. 文件批量操作
2. 文件共享功能
3. 文件评论和注释
4. 文件版本历史
5. 高级搜索和筛选
6. 文件标签系统
7. 文件预览增强（支持更多文件类型）
