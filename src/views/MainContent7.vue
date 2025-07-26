<template>
  <div class="calendar-page">
    <div class="page-header">
      <h2>📅 学习计划</h2>
      <button class="add-btn">+ 添加计划</button>
    </div>
    
    <div class="calendar-content">
      <div class="calendar-view">
        <div class="calendar-header">
          <button class="nav-btn" @click="previousMonth">‹</button>
          <h3>{{ currentMonthYear }}</h3>
          <button class="nav-btn" @click="nextMonth">›</button>
        </div>
        
        <div class="calendar-grid">
          <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
          <div 
            class="calendar-day" 
            v-for="day in calendarDays" 
            :key="day.date"
            :class="{ 
              'other-month': !day.isCurrentMonth,
              'has-events': day.events.length > 0,
              'today': day.isToday
            }"
          >
            <span class="day-number">{{ day.dayNumber }}</span>
            <div class="event-indicators" v-if="day.events.length > 0">
              <div class="event-dot" v-for="event in day.events.slice(0, 3)" :key="event.id"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="upcoming-events">
        <h3>即将到来的学习计划</h3>
        <div class="events-list">
          <div class="event-item" v-for="event in upcomingEvents" :key="event.id">
            <div class="event-time">{{ event.time }}</div>
            <div class="event-content">
              <h4>{{ event.title }}</h4>
              <p>{{ event.description }}</p>
            </div>
            <div class="event-status" :class="event.status">{{ event.statusText }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const currentDate = ref(new Date())
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const currentMonthYear = computed(() => {
  return `${currentDate.value.getFullYear()}年${currentDate.value.getMonth() + 1}月`
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const today = new Date()
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    days.push({
      date: date.toISOString(),
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: date.toDateString() === today.toDateString(),
      events: getEventsForDate(date)
    })
  }
  
  return days
})

const upcomingEvents = ref([
  {
    id: 1,
    title: 'Vue.js 组件学习',
    description: '学习Vue.js组件化开发',
    time: '今天 14:00',
    status: 'pending',
    statusText: '待开始'
  },
  {
    id: 2,
    title: 'TypeScript 练习',
    description: '完成TypeScript基础练习',
    time: '明天 10:00',
    status: 'pending',
    statusText: '待开始'
  },
  {
    id: 3,
    title: 'CSS Grid 实战',
    description: '使用CSS Grid制作响应式布局',
    time: '后天 16:00',
    status: 'completed',
    statusText: '已完成'
  }
])

function getEventsForDate(date: Date) {
  // 模拟获取某天的学习计划
  const events = []
  if (date.getDate() === 15) {
    events.push({ id: 1, type: 'study' })
  }
  if (date.getDate() === 20) {
    events.push({ id: 2, type: 'practice' })
  }
  return events
}

function previousMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}
</script>

<style scoped>
.calendar-page {
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

.calendar-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.calendar-view {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-header h3 {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.nav-btn {
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #e2e8f0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.weekday {
  text-align: center;
  padding: 12px;
  font-weight: 600;
  color: #667eea;
  font-size: 0.9rem;
}

.calendar-day {
  aspect-ratio: 1;
  border-radius: 8px;
  padding: 8px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.calendar-day:hover {
  background: #f8fafc;
}

.calendar-day.other-month {
  color: #cbd5e1;
}

.calendar-day.today {
  background: #667eea;
  color: #fff;
}

.calendar-day.has-events {
  background: #fef3c7;
}

.day-number {
  font-weight: 500;
  font-size: 0.9rem;
}

.event-indicators {
  display: flex;
  gap: 2px;
  margin-top: 4px;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #667eea;
}

.upcoming-events {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.upcoming-events h3 {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.event-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.2s;
}

.event-item:hover {
  background: #f1f5f9;
}

.event-time {
  color: #667eea;
  font-size: 0.85rem;
  font-weight: 600;
  min-width: 60px;
}

.event-content {
  flex: 1;
}

.event-content h4 {
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.event-content p {
  color: #666;
  font-size: 0.85rem;
  margin: 0;
}

.event-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.event-status.pending {
  background: #fef3c7;
  color: #d97706;
}

.event-status.completed {
  background: #dcfce7;
  color: #16a34a;
}

@media (max-width: 768px) {
  .calendar-content {
    grid-template-columns: 1fr;
  }
}
</style> 