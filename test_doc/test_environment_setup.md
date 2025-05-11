# ThinkForward AI 测试环境设置指南

## 测试执行问题

在尝试运行测试时，遇到了以下依赖问题：

```
Cannot find module 'express' from '../backend/app.js'
Cannot find module 'mongoose' from '../backend/models/User.js'
Cannot find module 'express-validator' from '../backend/controllers/authController.js'
```

这些错误表明测试环境缺少必要的依赖项。

## 解决方案

我们已经实现了一个自动化设置脚本，可以快速配置测试环境。该脚本会安装所有必要的依赖项并设置环境变量。

### 使用自动化设置脚本

```bash
cd ~/repos/thinkforward-devin/tests
chmod +x setup.sh
./setup.sh
```

这个脚本会：
1. 安装测试依赖项
2. 安装后端所需的依赖项
3. 创建 `.env.test` 文件（如果不存在）
4. 配置测试环境

### 手动设置（如果自动脚本失败）

如果自动脚本不起作用，可以按照以下步骤手动设置：

```bash
cd ~/repos/thinkforward-devin/tests
npm install
npm run install-backend-deps
```

## 测试环境配置

### 依赖项

测试环境需要以下依赖项：

```json
"dependencies": {
  "express": "^4.17.1",
  "mongoose": "^5.13.7",
  "jsonwebtoken": "^8.5.1",
  "bcryptjs": "^2.4.3",
  "dotenv": "^10.0.0",
  "cors": "^2.8.5",
  "helmet": "^4.6.0",
  "morgan": "^1.10.0",
  "express-validator": "^6.12.1"
},
"devDependencies": {
  "jest": "^27.0.6",
  "supertest": "^6.1.4",
  "mongodb-memory-server": "^7.3.6",
  "faker": "^5.5.3"
}
```

这些依赖项已经添加到 `package.json` 文件中，可以通过运行 `npm install` 安装。

### 环境变量

测试需要以下环境变量：

```
JWT_SECRET=thinkforward-test-secret-key
JWT_REFRESH_SECRET=thinkforward-test-refresh-secret-key
MONGODB_URI=mongodb://localhost:27017/thinkforward-test
NODE_ENV=test
PORT=5001
```

这些环境变量已经在 `.env.test` 文件中设置，并在 `jest.setup.js` 文件中加载。

### MongoDB 内存服务器

测试使用 MongoDB 内存服务器，这样就不需要安装和配置实际的 MongoDB 数据库。MongoDB 内存服务器会在测试开始前自动启动，并在测试结束后自动停止。

## 运行测试

安装依赖项并配置环境后，可以使用以下命令运行测试：

```bash
cd ~/repos/thinkforward-devin/tests
npm test
```

要生成测试覆盖率报告，可以使用：

```bash
npm run test:coverage
```

## 故障排除

如果遇到问题，请检查：

1. 所有依赖项是否已正确安装
2. 环境变量是否已正确设置
3. MongoDB 内存服务器是否正常工作

如果测试仍然失败，可以尝试：

```bash
cd ~/repos/thinkforward-devin/tests
rm -rf node_modules
rm package-lock.json
./setup.sh
```

这将重新安装所有依赖项并重置环境。
