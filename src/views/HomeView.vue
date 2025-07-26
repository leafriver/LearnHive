<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 用户信息
const userInfo = ref<any>(null)

// 最近活动
const recentActivities = ref([
  { id: 1, icon: '📚', text: '完成了 Vue.js 实战课程第3章', time: '2小时前' },
  { id: 2, icon: '📝', text: '创建了新的学习笔记', time: '4小时前' },
  { id: 3, icon: '🏆', text: '获得了"连续学习7天"成就', time: '1天前' },
  { id: 4, icon: '⭐', text: '给一篇笔记点了赞', time: '2天前' },
])

onMounted(() => {
  const stored = localStorage.getItem('userInfo')
  console.log('🔍 从localStorage读取的用户信息:', stored)
  if (stored) {
    try {
      userInfo.value = JSON.parse(stored)
      console.log('✅ 解析后的用户信息:', userInfo.value)
    } catch (error) {
      console.error('❌ 解析用户信息失败:', error)
      localStorage.removeItem('userInfo')
      router.push('/login')
    }
  } else {
    console.log('❌ 未找到用户信息，跳转到登录页')
    // 未登录，跳转到登录页
    router.push('/login')
  }
})

// 退出登录
function onLogout() {
  localStorage.removeItem('userInfo')
  router.push('/login')
}

function createNote() {
  alert('创建笔记功能开发中...')
}
</script>

<template>
  <div class="home-bg">
    <div class="home-layout">
      <Sidebar />
      <div class="main-area">
        <!-- 默认显示仪表板，当有子路由时显示子页面 -->
        <div v-if="$route.path === '/home'">
          <div class="dashboard">
            <div class="welcome-section">
              <div class="welcome-header">
                <div class="user-info">
                  <div class="user-avatar">{{ userInfo?.avatar_url ? '' : '👤' }}</div>
                  <div class="user-details">
                    <h2>欢迎回来，{{ userInfo?.nickname || userInfo?.username || '用户' }}</h2>
                    <p class="user-status">上次登录：{{ userInfo?.last_login_time ? (userInfo.last_login_time.replace('T', ' ').slice(0, 19)) : '无' }}</p>
                    <p class="user-status" v-if="userInfo?.email">邮箱：{{ userInfo.email }}</p>
                    <p class="user-status" v-if="userInfo?.phone">手机号：{{ userInfo.phone }}</p>
                  </div>
                </div>
                <div class="quick-actions">
                  <button class="action-btn" @click="onLogout">
                    <span class="action-icon">🚪</span>
                    退出登录
                  </button>
                </div>
              </div>
            </div>

            <!-- 统计卡片等内容可继续使用原有模拟数据或后续对接真实数据 -->
            <div class="stats-section">
              <div class="stat-card">
                <div class="stat-icon">📚</div>
                <div class="stat-content">
                  <h3>我的课程</h3>
                  <p class="stat-number">5</p>
                  <p class="stat-desc">正在学习的课程</p>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">📝</div>
                <div class="stat-content">
                  <h3>我的笔记</h3>
                  <p class="stat-number">12</p>
                  <p class="stat-desc">已创建的笔记</p>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">⏱️</div>
                <div class="stat-content">
                  <h3>学习时长</h3>
                  <p class="stat-number">24h</p>
                  <p class="stat-desc">本周学习时间</p>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">🏆</div>
                <div class="stat-content">
                  <h3>成就点数</h3>
                  <p class="stat-number">850</p>
                  <p class="stat-desc">累计获得成就</p>
                </div>
              </div>
            </div>

            <div class="content-section">
              <div class="recent-activity">
                <h3>📈 最近活动</h3>
                <div class="activity-list">
                  <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
                    <div class="activity-icon">{{ activity.icon }}</div>
                    <div class="activity-content">
                      <p class="activity-text">{{ activity.text }}</p>
                      <span class="activity-time">{{ activity.time }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="quick-links">
                <h3>🔗 快捷操作</h3>
                <div class="links-grid">
                  <router-link to="/course-hall" class="link-card">
                    <div class="link-icon">🎓</div>
                    <h4>浏览课程</h4>
                    <p>发现新的学习资源</p>
                  </router-link>
                  <router-link to="/note-hall" class="link-card">
                    <div class="link-icon">📝</div>
                    <h4>查看笔记</h4>
                    <p>阅读优质学习笔记</p>
                  </router-link>
                  <router-link to="/explore" class="link-card">
                    <div class="link-icon">🔍</div>
                    <h4>探索广场</h4>
                    <p>发现更多学习内容</p>
                  </router-link>
                  <div class="link-card" @click="createNote">
                    <div class="link-icon">✏️</div>
                    <h4>创建笔记</h4>
                    <p>记录你的学习心得</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 子页面内容 -->
        <router-view v-else />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 100vw;
  box-sizing: border-box;
}
.home-layout {
  display: flex;
  background: rgba(255,255,255,0.95);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  width: 90vw;
  max-width: 1200px;
  min-height: 700px;
  height: 80vh;
  overflow: hidden;
  backdrop-filter: blur(10px);
}
.main-area {
  flex: 1 1 0%;
  min-width: 0;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto;
}
.dashboard {
  padding: 32px;
}
.welcome-section {
  margin-bottom: 32px;
}
.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #fff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
.user-details h2 {
  color: #333;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 4px 0;
}
.user-status {
  color: #666;
  font-size: 14px;
  margin: 0;
}
.quick-actions {
  display: flex;
  gap: 12px;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #667eea;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.action-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}
.action-icon {
  font-size: 16px;
}
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}
.stat-card {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}
.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.stat-content h3 {
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}
.stat-number {
  color: #667eea;
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 4px 0;
}
.stat-desc {
  color: #666;
  font-size: 12px;
  margin: 0;
}
.content-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.recent-activity, .quick-links {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
.recent-activity h3, .quick-links h3 {
  color: #333;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 20px 0;
}
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.2s;
}
.activity-item:hover {
  background: #f1f5f9;
}
.activity-icon {
  font-size: 1.2rem;
  width: 32px;
  height: 32px;
  background: #667eea;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
}
.activity-content {
  flex: 1;
}
.activity-text {
  color: #333;
  font-size: 14px;
  margin: 0 0 4px 0;
  line-height: 1.4;
}
.activity-time {
  color: #666;
  font-size: 12px;
}
.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}
.link-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  cursor: pointer;
}
.link-card:hover {
  background: #667eea;
  color: #fff;
  transform: translateY(-2px);
}
.link-icon {
  font-size: 2rem;
  margin-bottom: 12px;
}
.link-card h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}
.link-card p {
  font-size: 12px;
  margin: 0;
  opacity: 0.8;
}
@media (max-width: 900px) {
  .home-layout {
    width: 100vw;
    min-width: 0;
    border-radius: 0;
    min-height: 500px;
    height: auto;
  }
  .dashboard {
    padding: 20px;
  }
  .welcome-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  .stats-section {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  .content-section {
    grid-template-columns: 1fr;
  }
  .links-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}
</style>
