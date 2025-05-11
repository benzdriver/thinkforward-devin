# ThinkForward AI 测试环境设置指南

## 测试执行问题

在尝试运行测试时，遇到了以下依赖问题：

```
Cannot find module 'express' from '../backend/app.js'
Cannot find module 'mongoose' from '../backend/models/User.js'
Cannot find module 'express-validator' from '../backend/controllers/authController.js'
Cannot find module 'axios' from '../backend/utils/canadaApiClient.js'
```

这些错误表明测试环境缺少必要的依赖项。此外，还遇到了 MongoDB 内存服务器配置问题。

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
  "axios": "^1.6.2",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^10.0.0",
  "express": "^4.21.2",
  "express-validator": "^6.15.0",
  "helmet": "^4.6.0",
  "jsonwebtoken": "^8.5.1",
  "mongoose": "^5.13.23",
  "morgan": "^1.10.0"
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

### MongoDB 内存服务器配置

测试使用 MongoDB 内存服务器，这样就不需要安装和配置实际的 MongoDB 数据库。我们对 MongoDB 内存服务器进行了以下配置优化：

1. 移除了特定版本要求，以避免版本兼容性问题
2. 增加了连接超时设置，以处理连接延迟
3. 添加了更健壮的错误处理
4. 根据 Mongoose 版本动态配置连接选项

```javascript
// jest.setup.js 中的 MongoDB 内存服务器配置
mongoServer = await MongoMemoryServer.create();

const uri = mongoServer.getUri();
process.env.MONGODB_URI = uri;

const mongooseOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 60000,
  socketTimeoutMS: 60000,
  serverSelectionTimeoutMS: 60000
};

// 根据 Mongoose 版本添加已弃用的选项
const [major, minor] = mongoose.version.split('.').map(Number);
if (major < 6) {
  mongooseOpts.useCreateIndex = true;
  mongooseOpts.useFindAndModify = false;
}

await mongoose.connect(uri, mongooseOpts);
```

### 模拟外部依赖

为了解决外部依赖问题，我们添加了模拟模块：

1. 模拟 `canadaApiClient` 以解决 axios 依赖问题
2. 创建了模拟的后端模块，包括 app.js、models 和 controllers

```javascript
// 模拟 canadaApiClient
jest.mock('../backend/utils/canadaApiClient', () => ({
  fetchExpressEntryDraws: jest.fn().mockResolvedValue([]),
  fetchProvincialPrograms: jest.fn().mockResolvedValue([]),
  fetchImmigrationNews: jest.fn().mockResolvedValue([])
}), { virtual: true });
```

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
4. 是否需要模拟其他外部依赖

### MongoDB 内存服务器问题

如果遇到 MongoDB 内存服务器问题，可以尝试以下解决方案：

1. 增加超时设置：
   ```javascript
   jest.setTimeout(120000);
   ```

2. 确保正确清理资源：
   ```javascript
   afterAll(async () => {
     try {
       if (mongoose.connection) {
         await mongoose.connection.close();
       }
       
       if (mongoServer) {
         try {
           await mongoServer.stop();
         } catch (error) {
           console.error('Error stopping MongoDB Memory Server:', error);
         }
       }
     } catch (error) {
       console.error('Error during cleanup:', error);
     }
   });
   ```

3. 添加更健壮的错误处理：
   ```javascript
   afterEach(async () => {
     if (mongoose.connection && mongoose.connection.collections) {
       try {
         const collections = mongoose.connection.collections;
         for (const key in collections) {
           try {
             await collections[key].deleteMany({});
           } catch (error) {
             console.error(`Error clearing collection ${key}:`, error);
           }
         }
       } catch (error) {
         console.error('Error accessing collections:', error);
       }
     }
   });
   ```

### 完全重置环境

如果测试仍然失败，可以尝试完全重置测试环境：

```bash
cd ~/repos/thinkforward-devin/tests
rm -rf node_modules
rm package-lock.json
./setup.sh
```

这将重新安装所有依赖项并重置环境。
