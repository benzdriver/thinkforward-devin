# 管理员系统设置模块实现文档

## 概述

管理员系统设置模块提供了一个集中管理平台的全局配置的系统。该模块允许管理员配置系统的各个方面，包括一般设置、安全设置、通知设置、集成设置、外观设置和高级设置。

## 数据模型

### SystemSettings 模型

系统设置模型存储所有全局系统配置，分为六个主要类别：

1. **一般设置 (general)**
   - 站点信息（名称、描述、联系邮箱）
   - 本地化设置（默认语言、支持的语言、时区）
   - 功能开关（启用/禁用特定功能）
   - 品牌设置（Logo、Favicon）

2. **安全设置 (security)**
   - 认证配置（社交登录、邮箱验证、注册设置）
   - 会话管理（超时、最大并发会话）
   - 密码策略（长度、复杂度、过期时间）
   - 速率限制和IP封禁设置

3. **通知设置 (notifications)**
   - 邮件配置（SMTP、SendGrid、Mailgun、SES）
   - 推送通知配置（Firebase、OneSignal）
   - 短信配置（Twilio、阿里云）
   - 通知模板（欢迎、密码重置、邮箱验证等）

4. **集成设置 (integrations)**
   - 支付集成（Stripe、PayPal、支付宝、微信支付）
   - 存储集成（本地、S3、OSS、COS）
   - 社交登录（Google、Facebook、微信）
   - 分析工具（Google Analytics、百度统计）
   - API设置（公共API、速率限制）

5. **外观设置 (appearance)**
   - 主题设置（亮色/暗色模式、主色调）
   - 布局设置（侧边栏位置、固定头部）
   - 自定义CSS
   - 着陆页配置（标题、副标题、特色服务）

6. **高级设置 (advanced)**
   - 系统设置（维护模式、调试模式、日志级别）
   - 缓存设置（启用/禁用、TTL、提供者）
   - 备份设置（自动备份、频率、最大备份数）
   - 性能设置（压缩、最小化、超时）

### SettingsHistory 模型

设置历史记录模型跟踪系统设置的所有变更：

- 用户ID和用户名（进行更改的管理员）
- 变更内容（旧值和新值）
- 设置类别（general、security等）
- 操作类型（更新、重置）
- IP地址和用户代理
- 时间戳

## 服务层

### adminSettingsService

管理员设置服务提供以下功能：

1. **getSystemSettings**: 获取当前系统设置
2. **updateSystemSettings**: 更新系统设置并记录变更历史
3. **resetSystemSettings**: 将系统设置重置为默认值
4. **getSettingsHistory**: 获取设置变更历史记录
5. **exportSettings**: 导出系统设置（移除敏感信息）
6. **importSettings**: 导入系统设置
7. **testEmailConfig**: 测试邮件配置
8. **clearSystemCache**: 清除系统缓存

## 控制器层

### adminSettingsController

管理员设置控制器处理以下HTTP请求：

1. **getSystemSettings**: GET /api/admin/settings
2. **updateSystemSettings**: PATCH /api/admin/settings
3. **resetSystemSettings**: POST /api/admin/settings/reset
4. **getSettingsHistory**: GET /api/admin/settings/history
5. **exportSettings**: GET /api/admin/settings/export
6. **importSettings**: POST /api/admin/settings/import
7. **testEmailConfig**: POST /api/admin/settings/test-email
8. **clearSystemCache**: POST /api/admin/settings/clear-cache

## 路由层

### adminSettingsRoutes

所有管理员设置路由都需要验证令牌和管理员权限：

```javascript
router.use(verifyToken, isAdmin);
```

路由定义：

```javascript
router.get('/settings', adminSettingsController.getSystemSettings);
router.patch('/settings', adminSettingsController.updateSystemSettings);
router.post('/settings/reset', adminSettingsController.resetSystemSettings);
router.get('/settings/history', adminSettingsController.getSettingsHistory);
router.get('/settings/export', adminSettingsController.exportSettings);
router.post('/settings/import', adminSettingsController.importSettings);
router.post('/settings/test-email', adminSettingsController.testEmailConfig);
router.post('/settings/clear-cache', adminSettingsController.clearSystemCache);
```

## 安全考虑

1. **敏感数据保护**：
   - 导出设置时移除敏感信息（API密钥、密码等）
   - 所有路由都需要管理员权限

2. **变更追踪**：
   - 记录所有设置变更，包括用户信息和IP地址
   - 提供变更历史查询功能

3. **输入验证**：
   - 验证所有输入数据
   - 防止恶意配置导入

## 前后端交互

前端通过以下API与后端交互：

1. **获取设置**：
   ```javascript
   const { fetchSystemSettings } = useSystemSettings();
   const settings = await fetchSystemSettings();
   ```

2. **更新设置**：
   ```javascript
   const { updateSystemSettings } = useUpdateSystemSettings();
   await updateSystemSettings(settings);
   ```

3. **重置设置**：
   ```javascript
   const { resetSystemSettings } = useResetSystemSettings();
   await resetSystemSettings();
   ```

## 实现注意事项

1. **默认值**：所有设置都有合理的默认值，确保系统在初始状态下可以正常运行。

2. **模块化设计**：设置被分为六个主要类别，每个类别可以独立更新。

3. **历史记录**：所有设置变更都会被记录，便于审计和回溯。

4. **性能考虑**：
   - 使用缓存减少数据库查询
   - 只记录实际发生变化的设置

5. **扩展性**：设计允许轻松添加新的设置类别或设置项。
