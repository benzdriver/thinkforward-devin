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

要成功运行测试，需要安装后端所需的所有依赖项。有两种方法可以解决这个问题：

### 方法 1：在测试目录中安装所有后端依赖项

```bash
cd ~/repos/thinkforward-devin/tests
npm install express mongoose express-validator bcryptjs jsonwebtoken cors helmet dotenv
```

这种方法的优点是不需要修改后端代码，但缺点是可能会导致依赖项版本不一致。

### 方法 2：将测试目录移动到后端目录中

```bash
# 备份当前测试
cp -r ~/repos/thinkforward-devin/tests ~/repos/thinkforward-devin/tests_backup

# 移动测试到后端目录
mkdir -p ~/repos/thinkforward-devin/backend/tests
cp -r ~/repos/thinkforward-devin/tests/* ~/repos/thinkforward-devin/backend/tests/

# 更新测试中的导入路径
# 将所有 '../backend/' 替换为 '../'
```

这种方法的优点是可以使用后端的依赖项，但缺点是需要修改测试代码中的导入路径。

## 推荐的测试执行步骤

1. 安装后端依赖项：
   ```bash
   cd ~/repos/thinkforward-devin/backend
   npm install
   ```

2. 安装测试依赖项：
   ```bash
   cd ~/repos/thinkforward-devin/tests
   npm install
   npm install express mongoose express-validator bcryptjs jsonwebtoken cors helmet dotenv
   ```

3. 运行测试：
   ```bash
   npm test
   ```

4. 生成测试覆盖率报告：
   ```bash
   npm run test:coverage
   ```

## 环境变量配置

测试需要以下环境变量：

```
JWT_SECRET=thinkforward-secret-key
JWT_REFRESH_SECRET=thinkforward-refresh-secret-key
MONGODB_URI=mongodb://localhost:27017/thinkforward-test
```

可以在运行测试前设置这些环境变量，或者在 `jest.setup.js` 文件中设置默认值。
