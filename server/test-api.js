const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testHealth() {
  try {
    console.log('🔍 测试健康检查接口...');
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ 健康检查成功:', data);
    return true;
  } catch (error) {
    console.log('❌ 健康检查失败:', error.message);
    return false;
  }
}

async function testRegister() {
  try {
    console.log('\n🔍 测试用户注册接口...');
    const userData = {
      username: 'testuser_' + Date.now(),
      password: 'TestPass123', // 确保包含大写字母、小写字母和数字
      email: 'test@example.com',
      phone: '13800138000',
      nickname: '测试用户'
    };
    
    console.log('📤 发送数据:', JSON.stringify(userData, null, 2));
    
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ 注册成功:', data);
      return data.data;
    } else {
      console.log('❌ 注册失败 (状态码:', response.status, '):');
      console.log('响应数据:', JSON.stringify(data, null, 2));
      if (data.errors) {
        console.log('验证错误详情:');
        data.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. 字段: ${error.field}, 错误: ${error.message}`);
        });
      }
      return null;
    }
  } catch (error) {
    console.log('❌ 注册测试失败:', error.message);
    return null;
  }
}

async function testLogin(username, password) {
  try {
    console.log('\n🔍 测试用户登录接口...');
    const loginData = {
      username,
      password
    };
    
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ 登录成功:', data);
      return data.data;
    } else {
      console.log('❌ 登录失败:', data);
      return null;
    }
  } catch (error) {
    console.log('❌ 登录测试失败:', error.message);
    return null;
  }
}

async function testCheckUsername(username) {
  try {
    console.log('\n🔍 测试用户名检查接口...');
    const response = await fetch(`${BASE_URL}/api/auth/check-username/${username}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ 用户名检查成功:', data);
      return data.data;
    } else {
      console.log('❌ 用户名检查失败:', data);
      return null;
    }
  } catch (error) {
    console.log('❌ 用户名检查测试失败:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 开始 API 测试...\n');
  
  // 测试健康检查
  const healthOk = await testHealth();
  if (!healthOk) {
    console.log('\n❌ 服务器未启动，请先启动后端服务');
    return;
  }
  
  // 测试注册
  const userData = await testRegister();
  if (!userData) {
    console.log('\n❌ 注册测试失败');
    return;
  }
  
  // 测试登录
  await testLogin(userData.username, 'password123');
  
  // 测试用户名检查
  await testCheckUsername(userData.username);
  
  console.log('\n✅ 所有测试完成！');
}

// 运行测试
runTests().catch(console.error); 