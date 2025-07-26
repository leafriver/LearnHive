<template>
  <div class="goals-page">
    <div class="page-header">
      <h2>🎯 学习目标</h2>
      <button class="add-btn">+ 添加目标</button>
    </div>
    
    <div class="goals-content">
      <!-- 目标概览 -->
      <div class="goals-overview">
        <div class="overview-card">
          <div class="overview-icon">🎯</div>
          <div class="overview-info">
            <h3>总目标</h3>
            <p class="overview-number">{{ totalGoals }}</p>
          </div>
        </div>
        <div class="overview-card">
          <div class="overview-icon">✅</div>
          <div class="overview-info">
            <h3>已完成</h3>
            <p class="overview-number">{{ completedGoals }}</p>
          </div>
        </div>
        <div class="overview-card">
          <div class="overview-icon">⏳</div>
          <div class="overview-info">
            <h3>进行中</h3>
            <p class="overview-number">{{ inProgressGoals }}</p>
          </div>
        </div>
        <div class="overview-card">
          <div class="overview-icon">📈</div>
          <div class="overview-info">
            <h3>完成率</h3>
            <p class="overview-number">{{ completionRate }}%</p>
          </div>
        </div>
      </div>
      
      <!-- 目标列表 -->
      <div class="goals-section">
        <div class="section-header">
          <h3>我的学习目标</h3>
          <div class="filter-tabs">
            <button class="tab-btn" :class="{ active: activeFilter === 'all' }" @click="activeFilter = 'all'">全部</button>
            <button class="tab-btn" :class="{ active: activeFilter === 'in-progress' }" @click="activeFilter = 'in-progress'">进行中</button>
            <button class="tab-btn" :class="{ active: activeFilter === 'completed' }" @click="activeFilter = 'completed'">已完成</button>
          </div>
        </div>
        
        <div class="goals-list">
          <div class="goal-card" v-for="goal in filteredGoals" :key="goal.id" :class="goal.status">
            <div class="goal-header">
              <div class="goal-icon">{{ goal.icon }}</div>
              <div class="goal-info">
                <h4>{{ goal.title }}</h4>
                <p>{{ goal.description }}</p>
              </div>
              <div class="goal-status">
                <span class="status-badge" :class="goal.status">{{ goal.statusText }}</span>
              </div>
            </div>
            
            <div class="goal-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: goal.progress + '%' }"></div>
              </div>
              <span class="progress-text">{{ goal.progress }}% 完成</span>
            </div>
            
            <div class="goal-meta">
              <div class="meta-item">
                <span class="meta-label">截止日期:</span>
                <span class="meta-value">{{ goal.deadline }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">优先级:</span>
                <span class="priority-badge" :class="goal.priority">{{ goal.priorityText }}</span>
              </div>
            </div>
            
            <div class="goal-actions">
              <button class="action-btn" v-if="goal.status === 'in-progress'" @click="updateProgress(goal.id)">
                更新进度
              </button>
              <button class="action-btn" v-if="goal.status === 'in-progress'" @click="completeGoal(goal.id)">
                标记完成
              </button>
              <button class="action-btn secondary" @click="editGoal(goal.id)">
                编辑
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 最近成就 -->
      <div class="achievements-section">
        <h3>🎉 最近成就</h3>
        <div class="achievements-list">
          <div class="achievement-item" v-for="achievement in recentAchievements" :key="achievement.id">
            <div class="achievement-icon">{{ achievement.icon }}</div>
            <div class="achievement-content">
              <h4>{{ achievement.title }}</h4>
              <p>{{ achievement.description }}</p>
              <span class="achievement-date">{{ achievement.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeFilter = ref('all')

const totalGoals = ref(8)
const completedGoals = ref(3)
const inProgressGoals = ref(4)
const completionRate = computed(() => Math.round((completedGoals.value / totalGoals.value) * 100))

const goals = ref([
  {
    id: 1,
    title: '掌握Vue.js 3.0',
    description: '深入学习Vue.js 3.0的组合式API和响应式系统',
    icon: '📚',
    status: 'in-progress',
    statusText: '进行中',
    progress: 75,
    deadline: '2024-02-15',
    priority: 'high',
    priorityText: '高'
  },
  {
    id: 2,
    title: 'TypeScript进阶',
    description: '学习TypeScript高级类型和设计模式',
    icon: '🔧',
    status: 'completed',
    statusText: '已完成',
    progress: 100,
    deadline: '2024-01-30',
    priority: 'medium',
    priorityText: '中'
  },
  {
    id: 3,
    title: 'CSS Grid精通',
    description: '掌握CSS Grid布局的复杂应用场景',
    icon: '🎨',
    status: 'in-progress',
    statusText: '进行中',
    progress: 45,
    deadline: '2024-03-01',
    priority: 'medium',
    priorityText: '中'
  },
  {
    id: 4,
    title: '前端工程化',
    description: '学习Webpack、Vite等构建工具的使用',
    icon: '⚙️',
    status: 'in-progress',
    statusText: '进行中',
    progress: 30,
    deadline: '2024-03-15',
    priority: 'high',
    priorityText: '高'
  }
])

const filteredGoals = computed(() => {
  if (activeFilter.value === 'all') return goals.value
  return goals.value.filter(goal => goal.status === activeFilter.value)
})

const recentAchievements = ref([
  {
    id: 1,
    title: '连续学习7天',
    description: '你已连续学习7天，继续保持！',
    icon: '🔥',
    date: '2024-01-15'
  },
  {
    id: 2,
    title: '完成第一个项目',
    description: '成功完成Vue.js实战项目',
    icon: '🏆',
    date: '2024-01-10'
  },
  {
    id: 3,
    title: '笔记达人',
    description: '创建了10篇优质学习笔记',
    icon: '📝',
    date: '2024-01-08'
  }
])

function updateProgress(goalId: number) {
  alert(`更新目标 ${goalId} 的进度`)
}

function completeGoal(goalId: number) {
  alert(`完成目标 ${goalId}`)
}

function editGoal(goalId: number) {
  alert(`编辑目标 ${goalId}`)
}
</script>

<style scoped>
.goals-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  color: #333;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.add-btn {
  background: #667eea;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.goals-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.goals-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.overview-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

.overview-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.overview-info h3 {
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.overview-number {
  color: #667eea;
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
}

.goals-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h3 {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.tab-btn {
  background: #f1f5f9;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #667eea;
  color: #fff;
}

.tab-btn:hover:not(.active) {
  background: #e2e8f0;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.goal-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s;
}

.goal-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.goal-card.completed {
  border-color: #dcfce7;
  background: #f0fdf4;
}

.goal-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.goal-icon {
  font-size: 1.5rem;
  width: 48px;
  height: 48px;
  background: #667eea;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.goal-info {
  flex: 1;
}

.goal-info h4 {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.goal-info p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
}

.goal-status {
  flex-shrink: 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.in-progress {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.completed {
  background: #dcfce7;
  color: #16a34a;
}

.goal-progress {
  margin-bottom: 16px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s;
}

.progress-text {
  color: #666;
  font-size: 0.85rem;
  font-weight: 500;
}

.goal-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-label {
  color: #666;
  font-size: 0.85rem;
}

.meta-value {
  color: #333;
  font-size: 0.85rem;
  font-weight: 500;
}

.priority-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.priority-badge.high {
  background: #fef2f2;
  color: #dc2626;
}

.priority-badge.medium {
  background: #fef3c7;
  color: #d97706;
}

.priority-badge.low {
  background: #f0fdf4;
  color: #16a34a;
}

.goal-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  background: #667eea;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: #f1f5f9;
  color: #333;
}

.action-btn.secondary:hover {
  background: #e2e8f0;
}

.achievements-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.achievements-section h3 {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.2s;
}

.achievement-item:hover {
  background: #f1f5f9;
}

.achievement-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  background: #667eea;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.achievement-content {
  flex: 1;
}

.achievement-content h4 {
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.achievement-content p {
  color: #666;
  font-size: 0.85rem;
  margin: 0 0 4px 0;
}

.achievement-date {
  color: #999;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .goals-overview {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .goal-meta {
    flex-direction: column;
    gap: 12px;
  }
  
  .goal-actions {
    flex-wrap: wrap;
  }
}
</style> 