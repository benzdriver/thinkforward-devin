# 前端国际化实现文档

本文档描述了ThinkForward AI前端应用的国际化实现方案，以便后端开发人员了解如何与前端国际化功能集成。

## 技术栈

前端国际化使用以下技术：

- **next-i18next**: Next.js的国际化解决方案
- **i18next**: 底层国际化库
- **react-i18next**: React的国际化绑定

## 目录结构

国际化相关文件的目录结构如下：

```
frontend/
├── next-i18next.config.js     # 国际化配置文件
├── lib/
│   └── i18n.ts                # 国际化工具函数
└── public/
    └── locales/               # 翻译文件目录
        ├── en/                # 英文翻译
        │   └── common.json    # 通用翻译键值对
        ├── zh/                # 中文翻译
        │   └── common.json    # 通用翻译键值对
        └── fr/                # 法文翻译
            └── common.json    # 通用翻译键值对
```

## 配置详情

### next-i18next.config.js

```javascript
module.exports = {
  i18n: {
    defaultLocale: 'en',       // 默认语言为英文
    locales: ['en', 'zh', 'fr'], // 支持的语言列表
    localeDetection: true,     // 自动检测用户语言
  },
  localePath: './public/locales', // 翻译文件路径
  reloadOnPrerender: process.env.NODE_ENV === 'development', // 开发环境下预渲染时重新加载翻译
};
```

### 翻译文件格式

翻译文件使用JSON格式，按照嵌套的键值对结构组织。例如：

```json
{
  "app": {
    "name": "ThinkForward AI",
    "tagline": "您的AI驱动移民助手"
  },
  "navigation": {
    "home": "首页",
    "dashboard": "仪表盘"
  }
}
```

## 前端使用方式

### 页面组件中使用

```tsx
import { useAppTranslation, getStaticTranslations } from '@/lib/i18n';

// 在组件中使用翻译
export default function HomePage() {
  const { t } = useAppTranslation();
  
  return (
    <div>
      <h1>{t('app.name')}</h1>
      <p>{t('app.tagline')}</p>
    </div>
  );
}

// 在getStaticProps中加载翻译
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await getStaticTranslations({ locale })),
    },
  };
}
```

## 后端集成指南

后端需要支持以下功能以便与前端国际化功能集成：

### 1. 语言检测和切换

- API响应应包含当前语言信息
- 支持通过API请求头或参数指定语言

```
// 示例API请求
GET /api/user/profile
Accept-Language: zh

// 示例API响应
{
  "data": { ... },
  "meta": {
    "locale": "zh"
  }
}
```

### 2. 内容翻译

- 动态内容（如通知、消息等）应支持多语言
- API响应中的文本内容应根据请求的语言返回对应翻译

```
// 示例API响应（英文）
{
  "message": "Your application has been submitted successfully."
}

// 示例API响应（中文）
{
  "message": "您的申请已成功提交。"
}
```

### 3. 错误消息翻译

- API错误消息应支持多语言
- 错误代码应保持一致，但错误描述应根据语言变化

```
// 示例错误响应（英文）
{
  "error": {
    "code": "AUTH_FAILED",
    "message": "Authentication failed. Please check your credentials."
  }
}

// 示例错误响应（中文）
{
  "error": {
    "code": "AUTH_FAILED",
    "message": "认证失败。请检查您的凭据。"
  }
}
```

### 4. 日期和数字格式化

- 日期、时间、货币和数字格式应根据语言/地区进行本地化
- 后端应提供原始值和格式化后的值

```
// 示例API响应（英文 - 美国）
{
  "payment": {
    "amount": 1234.56,
    "formatted": "$1,234.56",
    "date": "2023-05-15T10:30:00Z",
    "formattedDate": "May 15, 2023"
  }
}

// 示例API响应（中文 - 中国）
{
  "payment": {
    "amount": 1234.56,
    "formatted": "¥1,234.56",
    "date": "2023-05-15T10:30:00Z",
    "formattedDate": "2023年5月15日"
  }
}
```

## 添加新语言

要添加新语言支持，需要：

1. 在`next-i18next.config.js`的`locales`数组中添加新语言代码
2. 在`public/locales/`目录下创建新语言的目录
3. 复制现有语言的翻译文件到新语言目录，并翻译内容

## 翻译键管理建议

为确保前后端翻译一致性，建议：

1. 维护一个中央翻译键仓库
2. 使用命名空间区分不同模块的翻译
3. 对于共享的错误消息和通知，使用一致的翻译键

## 后端实现建议

建议后端实现以下功能：

1. 多语言内容管理系统
2. 翻译API，供前端动态加载翻译
3. 用户语言偏好存储和检索
4. 内容国际化管道

通过以上实现，可以确保前后端国际化体验的一致性和完整性。
