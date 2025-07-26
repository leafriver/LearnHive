const fetch = require('node-fetch');

async function testRegister() {
  try {
    console.log('🔍 测试注册接口...');
    
    const timestamp = Date.now();
    const userData = {
      username: 'test' + timestamp.toString().slice(-6), // 确保用户名不超过20位
      password: 'TestPass123',
      email: `test${timestamp}@example.com`, // 使用动态邮箱
      phone: `138${timestamp.toString().slice(-8)}`, // 使用动态手机号
      nickname: '测试用户'
    };
    
    console.log('📤 发送数据:', JSON.stringify(userData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    console.log('📥 响应状态码:', response.status);
    console.log('📥 响应头:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('📥 响应数据:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ 注册成功!');
    } else {
      console.log('❌ 注册失败!');
      if (data.errors) {
        console.log('验证错误:');
        data.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error.field}: ${error.message}`);
        });
      }
    }
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
  }
}

testRegister(); 