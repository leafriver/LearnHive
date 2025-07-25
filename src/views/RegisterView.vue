<template>
  <div class="register-bg">
    <div class="register-view">
      <div class="brand">LearnHive</div>
      <h1>用户注册</h1>
      <p class="register-tip">请填写信息完成注册</p>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="username">手机号或邮箱</label>
          <input id="username" v-model="username" type="text" required placeholder="请输入手机号或邮箱" :class="{ focus: usernameFocus, invalid: username && !isUsernameValid }" @focus="usernameFocus = true" @blur="usernameFocus = false" autocomplete="username" />
          <div v-if="username && !isUsernameValid" class="input-tip">请输入有效的手机号或邮箱</div>
        </div>
        <div class="form-group password-group">
          <label for="password">密码</label>
          <div class="password-wrapper">
            <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" required minlength="8" maxlength="20" placeholder="8-20位，字母和数字组合" :class="{ focus: passwordFocus, invalid: password && !isPasswordValid }" @focus="passwordFocus = true" @blur="passwordFocus = false" autocomplete="new-password" @input="onPasswordInput" />
            <button type="button" class="toggle-pw" @click="showPassword = !showPassword" tabindex="-1" :aria-label="showPassword ? '隐藏密码' : '显示密码'">
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
          <div class="password-strength">
            <div :class="['strength-bar', passwordStrength]" :style="{ width: strengthPercent + '%' }"></div>
          </div>
          <div v-if="password" class="input-tip">
            <span v-if="!isPasswordLengthValid">密码长度需8-20位；</span>
            <span v-if="!isPasswordComplex">需包含字母和数字；</span>
          </div>
        </div>
        <div class="form-group password-group">
          <!-- 移除label，仅保留输入框和切换按钮 -->
          <div class="password-wrapper">
            <input id="confirmPassword" v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" required minlength="8" maxlength="20" placeholder="请再次输入密码" :class="{ focus: confirmFocus, invalid: confirmPassword && !isConfirmValid }" @focus="confirmFocus = true" @blur="confirmFocus = false" autocomplete="new-password" />
            <button type="button" class="toggle-pw" @click="showPassword = !showPassword" tabindex="-1" :aria-label="showPassword ? '隐藏密码' : '显示密码'">
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
          <div v-if="confirmPassword && !isConfirmValid" class="input-tip">两次输入的密码不一致</div>
        </div>
        <transition name="fade">
          <div v-if="error" class="error">{{ error }}</div>
        </transition>
        <button type="submit" :disabled="!canSubmit || loading">
          <span v-if="loading" class="loading-spinner"></span>
          注册
        </button>
      </form>
      <div class="register-links">
        <router-link to="/login">已有账号？去登录</router-link>
      </div>
    </div>
    <footer class="register-footer">© 2024 LearnHive</footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)
const usernameFocus = ref(false)
const passwordFocus = ref(false)
const confirmFocus = ref(false)
const router = useRouter()

const phoneReg = /^1[3-9]\d{9}$/
const emailReg = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/
const isUsernameValid = computed(() => phoneReg.test(username.value) || emailReg.test(username.value))

const isPasswordLengthValid = computed(() => password.value.length >= 8 && password.value.length <= 20)
const isPasswordComplex = computed(() => /[A-Za-z]/.test(password.value) && /\d/.test(password.value))
const isPasswordValid = computed(() => isPasswordLengthValid.value && isPasswordComplex.value)

const isConfirmValid = computed(() => password.value && confirmPassword.value && password.value === confirmPassword.value)

const canSubmit = computed(() => isUsernameValid.value && isPasswordValid.value && isConfirmValid.value)

const passwordStrength = computed(() => {
  if (!password.value) return ''
  let score = 0
  if (/[A-Z]/.test(password.value)) score++
  if (/[a-z]/.test(password.value)) score++
  if (/\d/.test(password.value)) score++
  if (/[^A-Za-z0-9]/.test(password.value)) score++
  if (password.value.length >= 12) score++
  if (score <= 2) return 'weak'
  if (score === 3 || score === 4) return 'medium'
  return 'strong'
})
const strengthPercent = computed(() => {
  if (!password.value) return 0
  if (passwordStrength.value === 'weak') return 33
  if (passwordStrength.value === 'medium') return 66
  if (passwordStrength.value === 'strong') return 100
  return 0
})

function onPasswordInput() {
  // 触发密码强度计算
}

function mockRegisterApi(username: string, password: string): Promise<boolean> {
  // 模拟异步注册接口，假设用户名为"test"时注册失败
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'test') {
        reject(new Error('用户名已存在'))
      } else {
        resolve(true)
      }
    }, 800)
  })
}

async function onSubmit() {
  error.value = ''
  if (!canSubmit.value) return
  loading.value = true
  try {
    await mockRegisterApi(username.value, password.value)
    // 注册成功，跳转到登录页
    router.push('/login')
  } catch (e: any) {
    error.value = e.message || '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-bg {
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
.register-view {
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
.register-view h1 {
  margin-bottom: 10px;
  font-size: 1.5rem;
  color: #2176c1;
  font-weight: 700;
  letter-spacing: 1px;
}
.register-tip {
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
input.invalid {
  border: 1.5px solid #e74c3c;
}
.input-tip {
  color: #e74c3c;
  font-size: 13px;
  margin-top: 2px;
  min-height: 18px;
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
.password-strength {
  width: 100%;
  height: 6px;
  background: #f0f4fa;
  border-radius: 3px;
  margin: 6px 0 2px 0;
  overflow: hidden;
}
.strength-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}
.strength-bar.weak {
  background: #e74c3c;
}
.strength-bar.medium {
  background: #f7b731;
}
.strength-bar.strong {
  background: #27ae60;
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
.register-links {
  margin-top: 18px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  font-size: 15px;
}
.register-links a,
.register-links .router-link-active {
  color: #2176c1;
  text-decoration: none;
  transition: color 0.2s;
}
.register-links a:hover {
  text-decoration: underline;
  color: #145a96;
}
.register-footer {
  margin: 32px auto 0 auto;
  color: #6a8bad;
  font-size: 13px;
  text-align: center;
  width: auto;
  letter-spacing: 1px;
}
@media (max-width: 500px) {
  .register-view {
    max-width: 98vw;
    padding: 18px 4vw 18px 4vw;
  }
  .brand {
    font-size: 1.3rem;
  }
  .register-footer {
    font-size: 12px;
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
}
</style> 