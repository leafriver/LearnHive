# LearnHive 后端服务

这是 LearnHive 项目的后端 API 服务，使用 Node.js + Express + MySQL 构建。

## 功能特性

- ✅ 用户注册和登录
- ✅ 密码加密存储
- ✅ 数据验证和错误处理
- ✅ CORS 跨域支持
- ✅ 安全中间件
- ✅ 数据库连接池
- ✅ 日志记录

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置数据库

1. 确保 MySQL 服务已启动
2. 创建数据库：
   ```sql
   CREATE DATABASE learnhive CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. 执行 SQL 文件创建用户表：
   ```bash
   mysql -u root -p learnhive < SQL_Files/create-table-users.sql
   ```

### 3. 配置环境变量

编辑 `config.env` 文件，修改数据库连接信息：

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

# JWT密钥（用于后续登录功能）
JWT_SECRET=your_jwt_secret_key_here

# 密码加密轮数
BCRYPT_ROUNDS=12
```

### 4. 启动服务

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

服务启动后，访问 http://localhost:3000/health 检查服务状态。

## API 接口

### 认证接口

#### 用户注册
- **POST** `/api/auth/register`
- **请求体**：
  ```json
  {
    "username": "testuser",
    "password": "password123",
    "email": "test@example.com",
    "phone": "13800138000",
    "nickname": "测试用户"
  }
  ```

#### 用户登录
- **POST** `/api/auth/login`
- **请求体**：
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```

#### 检查用户名可用性
- **GET** `/api/auth/check-username/:username`

#### 检查邮箱可用性
- **GET** `/api/auth/check-email/:email`

#### 检查手机号可用性
- **GET** `/api/auth/check-phone/:phone`

### 健康检查

- **GET** `/health` - 服务状态检查

## 数据库表结构

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

## 项目结构

```
server/
├── config/
│   └── database.js          # 数据库配置
├── middleware/
│   └── validation.js        # 数据验证中间件
├── models/
│   └── User.js             # 用户模型
├── routes/
│   └── auth.js             # 认证路由
├── SQL_Files/
│   └── create-table-users.sql  # 数据库表结构
├── app.js                  # 主应用文件
├── package.json            # 项目配置
├── config.env             # 环境变量配置
└── README.md              # 说明文档
```

## 开发说明

### 添加新的 API 接口

1. 在 `routes/` 目录下创建新的路由文件
2. 在 `app.js` 中注册路由
3. 在 `models/` 目录下创建对应的数据模型

### 数据库操作

- 使用 `config/database.js` 中的 `query()` 方法执行 SQL
- 使用 `transaction()` 方法执行事务操作
- 所有数据库操作都在 `models/` 目录下封装

### 数据验证

- 使用 `express-validator` 进行请求数据验证
- 验证规则在 `middleware/validation.js` 中定义
- 使用 `handleValidationErrors` 中间件处理验证错误

## 安全特性

- 密码使用 bcrypt 加密存储
- 使用 helmet 中间件增强安全性
- CORS 配置限制跨域访问
- 输入数据验证和清理
- SQL 注入防护（使用参数化查询）

## 错误处理

- 统一的错误响应格式
- 详细的错误日志记录
- 数据库连接错误处理
- 验证错误处理

## 部署说明

1. 确保生产环境 MySQL 配置正确
2. 设置 `NODE_ENV=production`
3. 配置生产环境的 JWT 密钥
4. 使用 PM2 或类似工具管理进程

## 故障排除

### 数据库连接失败
- 检查 MySQL 服务是否启动
- 验证数据库连接配置
- 确认数据库和表是否创建

### API 请求失败
- 检查服务器是否启动
- 验证 CORS 配置
- 查看服务器日志

### 密码验证失败
- 确认 bcrypt 版本兼容性
- 检查密码加密轮数配置 