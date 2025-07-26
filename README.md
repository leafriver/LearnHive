# LearnHive 学习平台

一个现代化的学习平台，采用前后端分离架构，提供用户注册、登录、个人中心等功能。

## 项目架构

- **前端**: Vue 3 + TypeScript + Vite
- **后端**: Node.js + Express + MySQL
- **数据库**: MySQL 8.0+

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd LearnHive
```

### 2. 启动前端

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端将在 http://localhost:5173 启动

### 3. 配置并启动后端

#### 3.1 安装后端依赖

```bash
cd server
npm install
```

#### 3.2 配置数据库

1. 确保 MySQL 服务已启动
2. 创建数据库：
   ```sql
   CREATE DATABASE learnhive CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. 执行 SQL 文件创建用户表：
   ```bash
   mysql -u root -p learnhive < SQL_Files/create-table-users.sql
   ```

#### 3.3 配置环境变量

编辑 `server/config.env` 文件：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=learnhive

# 服务器配置
PORT=3000
NODE_ENV=development

# JWT密钥
JWT_SECRET=your_jwt_secret_key_here

# 密码加密轮数
BCRYPT_ROUNDS=12
```

#### 3.4 启动后端服务

**Windows:**
```bash
cd server
start.bat
```

**Linux/Mac:**
```bash
cd server
./start.sh
```

**手动启动:**
```bash
cd server
npm run dev
```

后端将在 http://localhost:3000 启动

### 4. 测试API

```bash
cd server
npm test
```

## 功能特性

### 前端功能

- ✅ 用户注册界面（支持用户名、邮箱、手机号）
- ✅ 用户登录界面（支持多种登录方式）
- ✅ 个人中心页面（仪表板、侧边栏导航）
- ✅ 公共页面（课程广场、笔记广场）
- ✅ 响应式设计
- ✅ 表单验证
- ✅ 密码强度检测
- ✅ 加载状态和错误处理

### 后端功能

- ✅ 用户注册 API
- ✅ 用户登录 API
- ✅ 密码加密存储
- ✅ 数据验证
- ✅ 数据库连接池
- ✅ CORS 跨域支持
- ✅ 安全中间件
- ✅ 错误处理
- ✅ 日志记录

## 项目结构

```
LearnHive/
├── src/                    # 前端源码
│   ├── views/             # 页面组件
│   ├── components/        # 通用组件
│   ├── router/           # 路由配置
│   └── assets/           # 静态资源
├── server/                # 后端源码
│   ├── config/           # 配置文件
│   ├── models/           # 数据模型
│   ├── routes/           # API路由
│   ├── middleware/       # 中间件
│   └── SQL_Files/       # 数据库文件
├── public/               # 公共资源
└── README.md            # 项目说明
```

## API 接口

### 认证接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/check-username/:username` | GET | 检查用户名可用性 |
| `/api/auth/check-email/:email` | GET | 检查邮箱可用性 |
| `/api/auth/check-phone/:phone` | GET | 检查手机号可用性 |

### 健康检查

| 接口 | 方法 | 说明 |
|------|------|------|
| `/health` | GET | 服务状态检查 |

## 数据库设计

### users 表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | bigint | 用户唯一ID（自增） |
| username | varchar(64) | 用户名/登录名 |
| email | varchar(128) | 邮箱 |
| phone | varchar(20) | 手机号 |
| password_hash | varchar(128) | 密码哈希 |
| avatar_url | varchar(255) | 头像URL |
| nickname | varchar(64) | 昵称 |
| role | varchar(32) | 角色 |
| status | tinyint | 状态：0正常/1禁用/2注销 |
| register_time | datetime | 注册时间 |
| last_login_time | datetime | 上次登录时间 |
| intro | varchar(255) | 个人简介 |
| gender | tinyint | 性别：0未知/1男/2女 |
| birthday | date | 生日 |
| location | varchar(128) | 所在地 |
| achievement | int | 成就点数 |
| study_hours | int | 累计学习时长（分钟） |
| is_verified | tinyint | 是否已验证：0否/1是 |
| extra | json | 扩展信息 |

## 开发指南

### 前端开发

1. **添加新页面**：
   - 在 `src/views/` 创建 Vue 组件
   - 在 `src/router/index.ts` 添加路由

2. **添加新组件**：
   - 在 `src/components/` 创建组件
   - 使用 TypeScript 编写

3. **API 调用**：
   - 使用 `fetch` API 调用后端接口
   - 统一错误处理

### 后端开发

1. **添加新 API**：
   - 在 `server/routes/` 创建路由文件
   - 在 `server/models/` 创建数据模型
   - 在 `app.js` 注册路由

2. **数据库操作**：
   - 使用 `config/database.js` 中的方法
   - 在 `models/` 中封装业务逻辑

3. **数据验证**：
   - 使用 `express-validator`
   - 在 `middleware/validation.js` 定义规则

## 部署说明

### 前端部署

1. 构建生产版本：
   ```bash
   npm run build
   ```

2. 部署到静态服务器（Nginx、Apache等）

### 后端部署

1. 配置生产环境变量
2. 使用 PM2 管理进程：
   ```bash
   npm install -g pm2
   pm2 start app.js --name learnhive-api
   ```

3. 配置反向代理（Nginx）

## 故障排除

### 常见问题

1. **数据库连接失败**：
   - 检查 MySQL 服务状态
   - 验证数据库连接配置
   - 确认数据库和表是否创建

2. **前端无法连接后端**：
   - 检查后端服务是否启动
   - 验证 CORS 配置
   - 检查网络连接

3. **注册/登录失败**：
   - 查看浏览器控制台错误
   - 检查后端日志
   - 验证数据格式

### 日志查看

- **前端日志**：浏览器开发者工具
- **后端日志**：控制台输出
- **数据库日志**：MySQL 错误日志

## 技术栈

### 前端
- Vue 3 (Composition API)
- TypeScript
- Vue Router
- Vite
- CSS3

### 后端
- Node.js
- Express.js
- MySQL2
- bcryptjs
- express-validator
- helmet
- cors
- morgan

### 数据库
- MySQL 8.0+
- 连接池
- 事务支持

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题，请提交 Issue 或联系开发团队。
