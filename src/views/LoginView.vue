<template>
  <div class="login-bg">
    <div class="login-view">
      <div class="brand">LearnHive</div>
      <h1>用户登录</h1>
      <p class="login-tip">欢迎回来，请输入账号和密码</p>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="username">账号</label>
          <input id="username" v-model="username" type="text" required placeholder="请输入账号"
            :class="{ focus: usernameFocus }"
            @focus="usernameFocus = true" @blur="usernameFocus = false" autocomplete="username" />
        </div>
        <div class="form-group password-group">
          <label for="password">密码</label>
          <div class="password-wrapper">
            <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" required minlength="6"
              placeholder="请输入密码" :class="{ focus: passwordFocus }"
              @focus="passwordFocus = true" @blur="passwordFocus = false" autocomplete="current-password" />
            <button type="button" class="toggle-pw" @click="showPassword = !showPassword" tabindex="-1" :aria-label="showPassword ? '隐藏密码' : '显示密码'">
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>
        <div class="form-row">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" /> 记住我
          </label>
          <a href="#" class="forgot" @click.prevent="onForgotPassword">忘记密码？</a>
        </div>
        <transition name="fade">
          <div v-if="error" class="error">{{ error }}</div>
        </transition>
        <button type="submit" :disabled="loading">
          <span v-if="loading" class="loading-spinner"></span>
          登录
        </button>
      </form>
      <div class="login-links">
        <router-link to="/register">没有账号？去注册</router-link>
      </div>
    </div>
    <footer class="login-footer">© 2024 LearnHive</footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const error = ref('')
const loading = ref(false)
const usernameFocus = ref(false)
const passwordFocus = ref(false)
const router = useRouter()

function mockLoginApi(username: string, password: string): Promise<boolean> {
  // 模拟异步登录接口，账号为"user"且密码为"123456"时登录成功
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'user' && password === '123456') {
        resolve(true)
      } else {
        reject(new Error('账号或密码错误'))
      }
    }, 800)
  })
}

async function loginUser(username: string, password: string): Promise<any> {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || '登录失败');
    }

    return result;
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('无法连接到服务器，请检查网络连接');
    }
    throw error;
  }
}

async function onSubmit() {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = '请填写账号和密码'
    return
  }
  if (password.value.length < 6) {
    error.value = '密码至少6位'
    return
  }
  loading.value = true
  try {
    const result = await loginUser(username.value, password.value)
    
    // 保存用户信息到本地存储（可选）
    if (result.data) {
      localStorage.setItem('userInfo', JSON.stringify(result.data))
      console.log('✅ 用户信息已保存到localStorage:', result.data)
    }
    
    // 登录成功，跳转首页
    router.push('/home')
  } catch (e: any) {
    error.value = e.message || '登录失败'
  } finally {
    loading.value = false
  }
}

function onForgotPassword() {
  window.alert('请联系管理员找回密码。')
}
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  background: #e6f2fb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100vw;
  box-sizing: border-box;
}
.login-view {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 36px 32px 32px 32px;
  border: 1px solid #e3eaf2;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.brand {
  font-size: 2.1rem;
  font-weight: 800;
  color: #2176c1;
  letter-spacing: 2px;
  margin-bottom: 8px;
  font-family: 'Segoe UI', 'Arial', sans-serif;
}
.login-view h1 {
  margin-bottom: 10px;
  font-size: 1.5rem;
  color: #2176c1;
  font-weight: 700;
  letter-spacing: 1px;
}
.login-tip {
  color: #6a8bad;
  font-size: 15px;
  margin-bottom: 24px;
}
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
input[type="text"], input[type="password"] {
  padding: 8px 38px 8px 8px;
  border: 1.5px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  width: 100%;
  box-sizing: border-box;
}
input[type="text"].focus, input[type="password"].focus {
  border: 1.5px solid #2176c1;
  box-shadow: 0 0 0 2px #e6f2fb;
}
.password-group {
  position: relative;
}
.password-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}
.toggle-pw {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0 4px;
  font-size: 1.1em;
  color: #6a8bad;
  cursor: pointer;
  user-select: none;
  outline: none;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toggle-pw:active {
  color: #2176c1;
}
.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: -8px;
}
.remember-me {
  font-size: 14px;
  color: #6a8bad;
  user-select: none;
}
.forgot {
  color: #2176c1;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}
.forgot:hover {
  text-decoration: underline;
  color: #145a96;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.error {
  color: #e74c3c;
  font-size: 14px;
  margin-bottom: 8px;
  text-align: center;
  min-height: 18px;
  animation: shake 0.3s;
}
@keyframes shake {
  10%, 90% { transform: translateX(-2px); }
  20%, 80% { transform: translateX(4px); }
  30%, 50%, 70% { transform: translateX(-8px); }
  40%, 60% { transform: translateX(8px); }
}
button {
  padding: 10px;
  background: #2176c1;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 600;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
button:disabled {
  background: #a3c2e2;
  cursor: not-allowed;
}
.loading-spinner {
  border: 2px solid #e6f2fb;
  border-top: 2px solid #2176c1;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.login-links {
  margin-top: 18px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  font-size: 15px;
}
.login-links a,
.login-links .router-link-active {
  color: #2176c1;
  text-decoration: none;
  transition: color 0.2s;
}
.login-links a:hover {
  text-decoration: underline;
  color: #145a96;
}
.login-footer {
  margin: 32px auto 0 auto;
  color: #6a8bad;
  font-size: 13px;
  text-align: center;
  width: auto;
  letter-spacing: 1px;
}
@media (max-width: 500px) {
  .login-view {
    max-width: 98vw;
    padding: 18px 4vw 18px 4vw;
  }
  .brand {
    font-size: 1.3rem;
  }
  .login-footer {
    font-size: 12px;
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
}
</style> 