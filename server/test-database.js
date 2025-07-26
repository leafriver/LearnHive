const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config.env' });

async function testDatabaseConnection() {
  console.log('🔍 测试数据库连接...\n');
  
  // 显示配置信息
  console.log('📋 数据库配置信息：');
  console.log(`   主机: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   端口: ${process.env.DB_PORT || 3306}`);
  console.log(`   用户: ${process.env.DB_USER || 'root'}`);
  console.log(`   数据库: ${process.env.DB_NAME || 'learn_hive'}`);
  console.log(`   密码: ${process.env.DB_PASSWORD ? '***已设置***' : '未设置'}`);
  console.log('');

  // 测试连接配置
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '2021615',
    charset: 'utf8mb4',
    timezone: '+08:00'
  };

  try {
    // 1. 测试基本连接（不指定数据库）
    console.log('1️⃣ 测试基本连接...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ 基本连接成功');
    
    // 2. 检查数据库是否存在
    console.log('\n2️⃣ 检查数据库是否存在...');
    const [databases] = await connection.execute('SHOW DATABASES');
    const dbExists = databases.some(db => db.Database === (process.env.DB_NAME || 'learn_hive'));
    
    if (dbExists) {
      console.log('✅ 数据库存在');
    } else {
      console.log('❌ 数据库不存在，正在创建...');
      await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'learn_hive'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log('✅ 数据库创建成功');
    }
    
    // 3. 连接到指定数据库
    console.log('\n3️⃣ 连接到指定数据库...');
    await connection.execute(`USE \`${process.env.DB_NAME || 'learn_hive'}\``);
    console.log('✅ 数据库连接成功');
    
    // 4. 检查表是否存在
    console.log('\n4️⃣ 检查用户表是否存在...');
    const [tables] = await connection.execute('SHOW TABLES');
    const usersTableExists = tables.some(table => Object.values(table)[0] === 'users');
    
    if (usersTableExists) {
      console.log('✅ 用户表存在');
    } else {
      console.log('❌ 用户表不存在，正在创建...');
      
      // 创建用户表的SQL
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS \`users\` (
          \`id\` bigint NOT NULL AUTO_INCREMENT COMMENT '用户唯一ID',
          \`username\` varchar(64) NOT NULL COMMENT '用户名/登录名',
          \`email\` varchar(128) DEFAULT NULL COMMENT '邮箱',
          \`phone\` varchar(20) DEFAULT NULL COMMENT '手机号',
          \`password_hash\` varchar(128) NOT NULL COMMENT '密码哈希',
          \`avatar_url\` varchar(255) DEFAULT NULL COMMENT '头像URL',
          \`nickname\` varchar(64) DEFAULT NULL COMMENT '昵称',
          \`role\` varchar(32) NOT NULL DEFAULT 'user' COMMENT '角色',
          \`status\` tinyint NOT NULL DEFAULT 0 COMMENT '状态：0正常/1禁用/2注销',
          \`register_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
          \`last_login_time\` datetime DEFAULT NULL COMMENT '上次登录时间',
          \`intro\` varchar(255) DEFAULT NULL COMMENT '个人简介',
          \`gender\` tinyint DEFAULT 0 COMMENT '性别：0未知/1男/2女',
          \`birthday\` date DEFAULT NULL COMMENT '生日',
          \`location\` varchar(128) DEFAULT NULL COMMENT '所在地',
          \`achievement\` int DEFAULT 0 COMMENT '成就点数',
          \`study_hours\` int DEFAULT 0 COMMENT '累计学习时长（分钟）',
          \`is_verified\` tinyint NOT NULL DEFAULT 0 COMMENT '是否已验证：0否/1是',
          \`extra\` json DEFAULT NULL COMMENT '扩展信息',
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_username\` (\`username\`),
          UNIQUE KEY \`uk_email\` (\`email\`),
          UNIQUE KEY \`uk_phone\` (\`phone\`),
          KEY \`idx_register_time\` (\`register_time\`),
          KEY \`idx_last_login_time\` (\`last_login_time\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表'
      `;
      
      await connection.execute(createTableSQL);
      console.log('✅ 用户表创建成功');
    }
    
    // 5. 测试查询
    console.log('\n5️⃣ 测试查询...');
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log(`✅ 查询成功，当前用户数：${rows[0].count}`);
    
    await connection.end();
    
    console.log('\n🎉 数据库连接测试完成！所有检查都通过了。');
    console.log('\n📊 数据库状态：');
    console.log(`   数据库：${process.env.DB_NAME || 'learn_hive'}`);
    console.log(`   用户表：users`);
    console.log(`   用户数：${rows[0].count}`);
    
  } catch (error) {
    console.error('\n❌ 数据库连接测试失败：');
    console.error('错误信息：', error.message);
    console.error('\n🔧 可能的解决方案：');
    console.error('1. 检查 MySQL 服务是否启动');
    console.error('2. 验证用户名和密码是否正确');
    console.error('3. 确认用户是否有创建数据库的权限');
    console.error('4. 检查防火墙设置');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 提示：MySQL 服务可能未启动，请启动 MySQL 服务');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 提示：用户名或密码错误，请检查 config.env 文件');
    }
  }
}

// 运行测试
testDatabaseConnection(); 