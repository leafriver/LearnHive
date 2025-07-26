<template>
  <div style="padding: 20px; font-family: Arial, sans-serif;">
    <h1>用户信息测试页面</h1>
    
    <div style="margin: 20px 0;">
      <h3>localStorage 原始数据:</h3>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px;">{{ rawUserInfo }}</pre>
    </div>
    
    <div style="margin: 20px 0;">
      <h3>解析后的用户信息:</h3>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px;">{{ parsedUserInfo }}</pre>
    </div>
    
    <div style="margin: 20px 0;">
      <h3>用户信息展示:</h3>
      <div style="background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
        <p><strong>用户名:</strong> {{ userInfo?.username || '未设置' }}</p>
        <p><strong>昵称:</strong> {{ userInfo?.nickname || '未设置' }}</p>
        <p><strong>邮箱:</strong> {{ userInfo?.email || '未设置' }}</p>
        <p><strong>手机号:</strong> {{ userInfo?.phone || '未设置' }}</p>
        <p><strong>注册时间:</strong> {{ userInfo?.register_time || '未设置' }}</p>
        <p><strong>最后登录:</strong> {{ userInfo?.last_login_time || '未设置' }}</p>
      </div>
    </div>
    
    <div style="margin: 20px 0;">
      <button @click="clearUserInfo" style="background: #ff4757; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
        清除用户信息
      </button>
      <button @click="goToLogin" style="background: #2ed573; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">
        跳转登录页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userInfo = ref<any>(null)
const rawUserInfo = ref<string>('')
const parsedUserInfo = ref<string>('')

onMounted(() => {
  const stored = localStorage.getItem('userInfo')
  rawUserInfo.value = stored || 'null'
  
  if (stored) {
    try {
      userInfo.value = JSON.parse(stored)
      parsedUserInfo.value = JSON.stringify(userInfo.value, null, 2)
      console.log('✅ 用户信息加载成功:', userInfo.value)
    } catch (error) {
      console.error('❌ 解析用户信息失败:', error)
      parsedUserInfo.value = '解析失败: ' + error
    }
  } else {
    parsedUserInfo.value = '未找到用户信息'
  }
})

function clearUserInfo() {
  localStorage.removeItem('userInfo')
  userInfo.value = null
  rawUserInfo.value = 'null'
  parsedUserInfo.value = '已清除'
}

function goToLogin() {
  router.push('/login')
}
</script> 