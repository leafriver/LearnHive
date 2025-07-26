<template>
  <nav class="sidebar">
    <!-- 用户信息区域 -->
    <div class="user-section">
      <div class="user-avatar">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="用户头像" />
      </div>
      <div class="user-info">
        <h3 class="user-name">张三</h3>
        <p class="user-role">学习达人</p>
      </div>
    </div>

    <!-- 主导航 -->
    <div class="nav-section">
      <h4 class="nav-title">个人中心</h4>
      <ul class="nav-list">
        <li>
          <router-link to="/home/profile" class="nav-item" active-class="active">
            <span class="nav-icon">👤</span>
            <span class="nav-text">个人资料</span>
          </router-link>
        </li>
        <li>
          <router-link to="/home/courses" class="nav-item" active-class="active">
            <span class="nav-icon">📚</span>
            <span class="nav-text">我的课程</span>
          </router-link>
        </li>
        <li>
          <router-link to="/home/notes" class="nav-item" active-class="active">
            <span class="nav-icon">📝</span>
            <span class="nav-text">我的笔记</span>
          </router-link>
        </li>
        <li>
          <router-link to="/home/favorites" class="nav-item" active-class="active">
            <span class="nav-icon">⭐</span>
            <span class="nav-text">收藏夹</span>
          </router-link>
        </li>
        <li>
          <router-link to="/home/messages" class="nav-item" active-class="active">
            <span class="nav-icon">💬</span>
            <span class="nav-text">消息通知</span>
            <span class="badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- 学习工具 -->
    <div class="nav-section">
      <h4 class="nav-title">学习工具</h4>
      <ul class="nav-list">
        <li>
          <router-link to="/home/calendar" class="nav-item" active-class="active">
            <span class="nav-icon">📅</span>
            <span class="nav-text">学习计划</span>
          </router-link>
        </li>
        <li>
          <router-link to="/home/analytics" class="nav-item" active-class="active">
            <span class="nav-icon">📊</span>
            <span class="nav-text">学习统计</span>
          </router-link>
        </li>
        <li>
          <router-link to="/home/goals" class="nav-item" active-class="active">
            <span class="nav-icon">🎯</span>
            <span class="nav-text">学习目标</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- 系统设置 -->
    <div class="nav-section">
      <h4 class="nav-title">系统</h4>
      <ul class="nav-list">
        <li>
          <router-link to="/home/settings" class="nav-item" active-class="active">
            <span class="nav-icon">⚙️</span>
            <span class="nav-text">设置</span>
          </router-link>
        </li>
        <li>
          <a href="#" class="nav-item" @click="onHelp">
            <span class="nav-icon">❓</span>
            <span class="nav-text">帮助中心</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- 底部操作 -->
    <div class="bottom-section">
      <router-link to="/explore" class="explore-btn">
        <span class="explore-icon">🌍</span>
        <span>探索广场</span>
      </router-link>
      <button class="logout-btn" @click="onLogout">
        <span class="logout-icon">🚪</span>
        <span>退出登录</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const unreadCount = ref(3)

function onLogout() {
  router.push('/login')
}

function onHelp() {
  alert('帮助中心功能开发中...')
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow-y: auto;
}

.user-section {
  padding: 0 24px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 24px;
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 16px;
  border: 3px solid rgba(255,255,255,0.2);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  text-align: center;
}

.user-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #fff;
}

.user-role {
  font-size: 0.85rem;
  opacity: 0.8;
  margin: 0;
}

.nav-section {
  padding: 0 16px;
  margin-bottom: 24px;
}

.nav-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
  margin: 0 0 12px 8px;
  color: rgba(255,255,255,0.8);
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: rgba(255,255,255,0.9);
  text-decoration: none;
  border-radius: 12px;
  margin-bottom: 4px;
  transition: all 0.3s;
  position: relative;
  font-size: 0.9rem;
}

.nav-item:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
  transform: translateX(4px);
}

.nav-item.active {
  background: rgba(255,255,255,0.2);
  color: #fff;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.2rem;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.nav-text {
  flex: 1;
}

.badge {
  background: #ff4757;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  line-height: 1;
}

.bottom-section {
  margin-top: auto;
  padding: 24px 16px 0;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.explore-btn, .logout-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: rgba(255,255,255,0.9);
  font-size: 0.9rem;
  transition: all 0.3s;
  margin-bottom: 8px;
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
}

.explore-btn:hover, .logout-btn:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
  transform: translateX(4px);
}

.explore-icon, .logout-icon {
  font-size: 1.1rem;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.logout-btn {
  color: rgba(255,255,255,0.7);
}

.logout-btn:hover {
  color: #ff4757;
}

/* 滚动条样式 */
.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.1);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.3);
  border-radius: 2px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.5);
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
  
  .nav-item {
    padding: 10px 12px;
    font-size: 0.85rem;
  }
  
  .nav-icon {
    font-size: 1.1rem;
    margin-right: 10px;
  }
}
</style> 