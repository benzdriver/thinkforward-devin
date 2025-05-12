# Express Entry 模块实现文档

## 概述

Express Entry 模块是 ThinkForward AI 平台的核心功能之一，用于帮助用户管理和优化他们的加拿大 Express Entry 申请。该模块提供了全面的功能，包括资料管理、CRS 分数计算、资格检查、抽签信息和申请跟踪等。

## 数据模型

### ExpressEntryProfile

`ExpressEntryProfile` 模型存储用户的 Express Entry 申请资料，包括个人信息、语言能力、教育背景、工作经验、配偶信息、适应性因素等。

主要字段包括：

- **userId**: 关联到用户账户
- **profileId**: 关联到用户的主资料
- **status**: 资料状态（草稿、已提交、进行中、已完成、已归档）
- **personalInfo**: 个人基本信息
- **contactInfo**: 联系信息
- **languageAbility**: 语言能力（包括第一语言和第二语言）
- **education**: 教育背景
- **canadianWorkExperience**: 加拿大工作经验
- **foreignWorkExperience**: 国外工作经验
- **spouseInfo**: 配偶信息（如适用）
- **adaptabilityFactors**: 适应性因素
- **crsScore**: CRS 分数计算结果
- **applicationHistory**: 申请历史记录
- **documents**: 文档清单
- **notes**: 备注和顾问评论

## 服务层

### expressEntryService

`expressEntryService` 提供了与 Express Entry 资料相关的业务逻辑处理。

主要功能包括：

1. **资料管理**
   - 创建新的 Express Entry 资料
   - 获取用户的所有 Express Entry 资料
   - 获取特定资料的详细信息
   - 更新资料信息
   - 删除资料

2. **CRS 分数计算**
   - 根据最新的 CRS 计算规则计算分数
   - 提供详细的分数明细
   - 模拟不同情况下的分数变化

3. **资格检查**
   - 检查用户是否满足 Express Entry 的基本资格要求
   - 确定用户符合哪个项目（FSW、CEC、FST）
   - 提供详细的资格分析和建议

4. **抽签信息**
   - 获取最新的抽签信息
   - 历史抽签数据分析
   - 预测未来抽签趋势

5. **申请跟踪**
   - 记录申请进度
   - 更新申请状态
   - 管理文档清单

## 控制器层

### expressEntryController

`expressEntryController` 处理与 Express Entry 相关的 HTTP 请求，并调用相应的服务层方法。

主要端点包括：

1. **资料管理**
   - `POST /api/express-entry/profiles`: 创建新资料
   - `GET /api/express-entry/profiles`: 获取用户的所有资料
   - `GET /api/express-entry/profiles/:id`: 获取特定资料
   - `PUT /api/express-entry/profiles/:id`: 更新资料
   - `DELETE /api/express-entry/profiles/:id`: 删除资料

2. **CRS 分数**
   - `GET /api/express-entry/profiles/:id/score`: 获取资料的 CRS 分数
   - `POST /api/express-entry/calculate-score`: 计算临时资料的分数
   - `POST /api/express-entry/simulate-score`: 模拟分数变化

3. **资格检查**
   - `GET /api/express-entry/profiles/:id/eligibility`: 检查资料的资格
   - `POST /api/express-entry/check-eligibility`: 检查临时资料的资格

4. **抽签信息**
   - `GET /api/express-entry/draws`: 获取抽签历史
   - `GET /api/express-entry/draws/latest`: 获取最新抽签
   - `GET /api/express-entry/draws/analysis`: 获取抽签分析

5. **申请跟踪**
   - `GET /api/express-entry/profiles/:id/application`: 获取申请状态
   - `PUT /api/express-entry/profiles/:id/application`: 更新申请状态
   - `GET /api/express-entry/profiles/:id/documents`: 获取文档清单
   - `POST /api/express-entry/profiles/:id/documents`: 添加文档
   - `PUT /api/express-entry/profiles/:id/documents/:docId`: 更新文档
   - `DELETE /api/express-entry/profiles/:id/documents/:docId`: 删除文档

## 路由配置

### expressEntryRoutes

`expressEntryRoutes` 定义了 Express Entry 模块的 API 路由。

```javascript
const express = require('express');
const { verifyToken } = require('../../middleware/authMiddleware');
const expressEntryController = require('../../controllers/canada/expressEntryController');

const router = express.Router();

// 应用认证中间件
router.use(verifyToken);

// 资料管理路由
router.post('/profiles', expressEntryController.createProfile);
router.get('/profiles', expressEntryController.getUserProfiles);
router.get('/profiles/:id', expressEntryController.getProfileById);
router.put('/profiles/:id', expressEntryController.updateProfile);
router.delete('/profiles/:id', expressEntryController.deleteProfile);

// CRS 分数路由
router.get('/profiles/:id/score', expressEntryController.getProfileScore);
router.post('/calculate-score', expressEntryController.calculateScore);
router.post('/simulate-score', expressEntryController.simulateScore);

// 资格检查路由
router.get('/profiles/:id/eligibility', expressEntryController.checkProfileEligibility);
router.post('/check-eligibility', expressEntryController.checkEligibility);

// 抽签信息路由
router.get('/draws', expressEntryController.getDrawHistory);
router.get('/draws/latest', expressEntryController.getLatestDraw);
router.get('/draws/analysis', expressEntryController.getDrawAnalysis);

// 申请跟踪路由
router.get('/profiles/:id/application', expressEntryController.getApplicationStatus);
router.put('/profiles/:id/application', expressEntryController.updateApplicationStatus);
router.get('/profiles/:id/documents', expressEntryController.getDocuments);
router.post('/profiles/:id/documents', expressEntryController.addDocument);
router.put('/profiles/:id/documents/:docId', expressEntryController.updateDocument);
router.delete('/profiles/:id/documents/:docId', expressEntryController.deleteDocument);

module.exports = router;
```

## 工具函数

### pointsCalculator

`pointsCalculator` 提供了计算 CRS 分数的函数。

主要功能包括：

- 计算核心人力资本因素分数
- 计算配偶因素分数
- 计算技能可转移性分数
- 计算额外分数
- 生成详细的分数明细

### canadaApiClient

`canadaApiClient` 提供了与加拿大政府 API 交互的功能。

主要功能包括：

- 获取最新的 NOC 代码信息
- 获取最新的抽签信息
- 获取 ECA 评估机构信息
- 获取语言测试信息

## 前端集成

Express Entry 模块与前端紧密集成，提供了用户友好的界面来管理 Express Entry 资料。

主要前端功能包括：

1. **资料表单**
   - 分步骤引导用户填写完整的 Express Entry 资料
   - 实时验证输入数据
   - 自动保存功能

2. **分数计算器**
   - 实时计算 CRS 分数
   - 显示详细的分数明细
   - 提供分数优化建议

3. **资格检查器**
   - 检查用户是否满足 Express Entry 的基本资格要求
   - 提供详细的资格分析和建议

4. **抽签信息**
   - 显示最新的抽签信息
   - 提供历史抽签数据分析
   - 显示用户在历史抽签中的位置

5. **申请跟踪**
   - 显示申请进度
   - 管理文档清单
   - 提供申请指导

## 安全考虑

Express Entry 模块处理敏感的个人信息，因此实施了多层安全措施：

1. **认证和授权**
   - 所有 API 端点都需要有效的认证令牌
   - 用户只能访问自己的资料

2. **数据验证**
   - 所有输入数据都经过严格验证
   - 防止 SQL 注入和 XSS 攻击

3. **数据加密**
   - 敏感数据在传输和存储时进行加密
   - 使用 HTTPS 进行所有通信

4. **审计日志**
   - 记录所有对资料的访问和修改
   - 定期审查日志以检测异常活动

## 未来改进

计划中的改进包括：

1. **机器学习集成**
   - 使用机器学习算法预测抽签趋势
   - 提供个性化的分数优化建议

2. **自动文档验证**
   - 使用 OCR 技术自动提取文档信息
   - 验证文档的真实性和有效性

3. **多语言支持**
   - 提供多种语言的界面和内容
   - 支持多语言的文档生成

4. **移动应用集成**
   - 开发移动应用以提供更便捷的访问
   - 支持离线模式和推送通知

5. **高级分析**
   - 提供更详细的数据分析和可视化
   - 支持自定义报告生成
