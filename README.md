# thinkforward-devin

## 项目概述

ThinkForward-Devin是一个帮助用户处理加拿大移民程序的应用。

## 部署和监控

### CI/CD流程

本项目使用GitHub Actions实现CI/CD流程:

1. **CI工作流程**: 当代码推送到main分支或创建PR时，自动运行测试
2. **前端部署**: 当main分支的前端代码变更时，自动部署到Vercel
3. **后端部署**: 当main分支的后端代码变更时，自动部署到Railway

### 监控系统

- **应用状态**: 通过[Uptime Robot](https://uptimerobot.com/)监控应用可用性
- **错误跟踪**: 通过[Sentry](https://sentry.io/)跟踪前端和后端错误
- **性能监控**: 使用Vercel和Railway内置的分析工具

### 访问方式

- **前端应用**: https://thinkforward-devin.vercel.app
- **后端API**: https://thinkforward-backend.up.railway.app
- **监控面板**: https://stats.uptimerobot.com/your-dashboard-id

### 设置说明

1. **首次部署**:
   - 在Vercel和Railway创建账号并连接GitHub仓库
   - 根据`.env.example`设置环境变量
   - 在GitHub仓库设置必要的secrets (VERCEL_TOKEN, RAILWAY_TOKEN等)

2. **设置监控**:
   - 在Uptime Robot创建账号并添加监控URL
   - 在Sentry创建项目并获取DSN
   - 将监控URL和DSN添加到环境变量
