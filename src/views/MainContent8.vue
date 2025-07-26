<template>
  <div class="analytics-page">
    <div class="page-header">
      <h2>📊 学习统计</h2>
      <div class="time-filter">
        <button class="filter-btn" :class="{ active: activePeriod === 'week' }" @click="activePeriod = 'week'">本周</button>
        <button class="filter-btn" :class="{ active: activePeriod === 'month' }" @click="activePeriod = 'month'">本月</button>
        <button class="filter-btn" :class="{ active: activePeriod === 'year' }" @click="activePeriod = 'year'">本年</button>
      </div>
    </div>
    
    <div class="analytics-content">
      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-info">
            <h3>学习时长</h3>
            <p class="stat-value">{{ studyHours }}小时</p>
            <span class="stat-change positive">+12% 较上周</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <h3>完成课程</h3>
            <p class="stat-value">{{ completedCourses }}门</p>
            <span class="stat-change positive">+2门 较上周</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-info">
            <h3>创建笔记</h3>
            <p class="stat-value">{{ createdNotes }}篇</p>
            <span class="stat-change positive">+5篇 较上周</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <h3>达成目标</h3>
            <p class="stat-value">{{ achievedGoals }}个</p>
            <span class="stat-change neutral">持平</span>
          </div>
        </div>
      </div>
      
      <!-- 图表区域 -->
      <div class="charts-section">
        <div class="chart-container">
          <h3>学习时长趋势</h3>
          <div class="chart-placeholder">
            <div class="chart-bars">
              <div class="chart-bar" v-for="(day, index) in weeklyData" :key="index" :style="{ height: day.hours + '%' }">
                <span class="bar-value">{{ day.hours }}h</span>
              </div>
            </div>
            <div class="chart-labels">
              <span v-for="(day, index) in weeklyData" :key="index">{{ day.label }}</span>
            </div>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>学习分类分布</h3>
          <div class="pie-chart">
            <div class="pie-segment" style="--percentage: 40; --color: #667eea;">前端开发</div>
            <div class="pie-segment" style="--percentage: 30; --color: #764ba2;">后端技术</div>
            <div class="pie-segment" style="--percentage: 20; --color: #f093fb;">设计思维</div>
            <div class="pie-segment" style="--percentage: 10; --color: #f5576c;">其他</div>
          </div>
          <div class="pie-legend">
            <div class="legend-item" v-for="category in categories" :key="category.name">
              <span class="legend-color" :style="{ background: category.color }"></span>
              <span>{{ category.name }} {{ category.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 学习记录 -->
      <div class="learning-records">
        <h3>最近学习记录</h3>
        <div class="records-list">
          <div class="record-item" v-for="record in learningRecords" :key="record.id">
            <div class="record-icon">{{ record.icon }}</div>
            <div class="record-content">
              <h4>{{ record.title }}</h4>
              <p>{{ record.description }}</p>
              <span class="record-time">{{ record.time }}</span>
            </div>
            <div class="record-duration">{{ record.duration }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activePeriod = ref('week')

const studyHours = ref(24)
const completedCourses = ref(3)
const createdNotes = ref(8)
const achievedGoals = ref(2)

const weeklyData = ref([
  { label: '周一', hours: 60 },
  { label: '周二', hours: 80 },
  { label: '周三', hours: 45 },
  { label: '周四', hours: 90 },
  { label: '周五', hours: 70 },
  { label: '周六', hours: 50 },
  { label: '周日', hours: 30 }
])

const categories = ref([
  { name: '前端开发', percentage: 40, color: '#667eea' },
  { name: '后端技术', percentage: 30, color: '#764ba2' },
  { name: '设计思维', percentage: 20, color: '#f093fb' },
  { name: '其他', percentage: 10, color: '#f5576c' }
])

const learningRecords = ref([
  {
    id: 1,
    icon: '📚',
    title: 'Vue.js 组件学习',
    description: '学习了Vue.js组件化开发的最佳实践',
    time: '今天 14:00',
    duration: '2小时'
  },
  {
    id: 2,
    icon: '📝',
    title: 'TypeScript 练习',
    description: '完成了TypeScript基础语法练习',
    time: '昨天 10:00',
    duration: '1.5小时'
  },
  {
    id: 3,
    icon: '🎨',
    title: 'CSS Grid 实战',
    description: '使用CSS Grid制作响应式布局',
    time: '前天 16:00',
    duration: '1小时'
  }
])
</script>

<style scoped>
.analytics-page {
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

.time-filter {
  display: flex;
  gap: 8px;
}

.filter-btn {
  background: #f1f5f9;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: #667eea;
  color: #fff;
}

.filter-btn:hover:not(.active) {
  background: #e2e8f0;
}

.analytics-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
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

.stat-info h3 {
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.stat-value {
  color: #667eea;
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 4px 0;
}

.stat-change {
  font-size: 0.85rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #16a34a;
}

.stat-change.negative {
  color: #dc2626;
}

.stat-change.neutral {
  color: #666;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.chart-container {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.chart-container h3 {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.chart-bars {
  display: flex;
  align-items: end;
  gap: 8px;
  height: 120px;
  margin-bottom: 16px;
}

.chart-bar {
  width: 30px;
  background: linear-gradient(to top, #667eea, #764ba2);
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: all 0.3s;
}

.chart-bar:hover {
  transform: scale(1.05);
}

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: #667eea;
}

.chart-labels {
  display: flex;
  gap: 8px;
  font-size: 0.85rem;
  color: #666;
}

.chart-labels span {
  width: 30px;
  text-align: center;
}

.pie-chart {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: conic-gradient(
    #667eea 0deg 144deg,
    #764ba2 144deg 252deg,
    #f093fb 252deg 324deg,
    #f5576c 324deg 360deg
  );
  margin: 0 auto 20px;
  position: relative;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.learning-records {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.learning-records h3 {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.record-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.2s;
}

.record-item:hover {
  background: #f1f5f9;
}

.record-icon {
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

.record-content {
  flex: 1;
}

.record-content h4 {
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.record-content p {
  color: #666;
  font-size: 0.85rem;
  margin: 0 0 4px 0;
}

.record-time {
  color: #999;
  font-size: 0.75rem;
}

.record-duration {
  color: #667eea;
  font-size: 0.85rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style> 