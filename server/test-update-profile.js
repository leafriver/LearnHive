const fetch = require('node-fetch');

async function testUpdateProfile() {
  try {
    console.log('🔍 测试更新用户信息接口...');
    
    const updateData = {
      id: 4, // 使用之前注册的用户ID
      nickname: '测试昵称更新',
      email: 'updated@example.com',
      phone: '13900139000',
      gender: 1,
      birthday: '1990-01-01',
      location: '北京市',
      intro: '这是一个测试的个人简介更新'
    };
    
    console.log('📤 发送更新数据:', JSON.stringify(updateData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/auth/update-profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    console.log('📥 响应状态码:', response.status);
    
    const data = await response.json();
    console.log('📥 响应数据:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ 用户信息更新成功!');
      console.log('更新后的用户信息:', JSON.stringify(data.data, null, 2));
    } else {
      console.log('❌ 用户信息更新失败!');
    }
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
  }
}

testUpdateProfile(); 