const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config.env' });

// 数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '2021615',
  database: process.env.DB_NAME || 'learn_hive',
  charset: 'utf8mb4',
  timezone: 'local', // 使用本地时区，避免时区转换问题
  // 连接池配置 - 只保留支持的选项
  connectionLimit: 10,
  // 移除不支持的选项：acquireTimeout, timeout, reconnect
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功');
    connection.release();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    console.error('请检查以下配置：');
    console.error('1. MySQL 服务是否启动');
    console.error('2. 数据库连接信息是否正确');
    console.error('3. 数据库是否存在');
    console.error('4. 用户权限是否正确');
    process.exit(1);
  }
}

// 执行SQL查询
async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('数据库查询错误:', error);
    throw error;
  }
}

// 执行事务
async function transaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  query,
  transaction,
  testConnection
}; 