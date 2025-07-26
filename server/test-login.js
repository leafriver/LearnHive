const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('🔍 测试登录接口...');
    
    const loginData = {
      username: 'test200263',
      password: 'TestPass123'
    };
    
    console.log('📤 发送登录数据:', JSON.stringify(loginData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    
    console.log('📥 响应状态码:', response.status);
    
    const data = await response.json();
    console.log('📥 响应数据:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ 登录成功!');
      console.log('用户信息:', JSON.stringify(data.data, null, 2));
    } else {
      console.log('❌ 登录失败!');
    }
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
  }
}

testLogin(); 