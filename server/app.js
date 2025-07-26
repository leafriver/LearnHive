const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config({ path: './config.env' });

// 导入数据库配置
const { testConnection } = require('./config/database');

// 导入路由
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// 安全中间件
app.use(helmet());

// CORS配置
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // 允许前端域名
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 日志中间件
app.use(morgan('combined'));

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'LearnHive API 服务运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API路由
app.use('/api/auth', authRoutes);

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// 全局错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  
  // 数据库连接错误
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return res.status(503).json({
      success: false,
      message: '数据库连接失败，请稍后重试'
    });
  }
  
  // 默认错误响应
  res.status(500).json({
    success: false,
    message: '服务器内部错误，请稍后重试'
  });
});

// 启动服务器
async function startServer() {
  try {
    // 测试数据库连接
    await testConnection();
    
    // 启动HTTP服务器
    app.listen(PORT, () => {
      console.log(`🚀 LearnHive API 服务器启动成功`);
      console.log(`📍 服务地址: http://localhost:${PORT}`);
      console.log(`📊 健康检查: http://localhost:${PORT}/health`);
      console.log(`🔐 认证接口: http://localhost:${PORT}/api/auth`);
      console.log(`⏰ 启动时间: ${new Date().toLocaleString()}`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，正在关闭服务器...');
  process.exit(0);
});

// 启动服务器
startServer(); 