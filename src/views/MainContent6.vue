<template>
  <div class="favorites-page">
    <div class="page-header">
      <h2>⭐ 我的收藏</h2>
      <div class="filter-tabs">
        <button class="tab-btn" :class="{ active: activeTab === 'courses' }" @click="activeTab = 'courses'">课程</button>
        <button class="tab-btn" :class="{ active: activeTab === 'notes' }" @click="activeTab = 'notes'">笔记</button>
      </div>
    </div>
    
    <div class="favorites-content">
      <div class="favorites-grid" v-if="activeTab === 'courses'">
        <div class="favorite-card" v-for="course in favoriteCourses" :key="course.id">
          <div class="card-image">
            <div class="image-placeholder">{{ course.icon }}</div>
          </div>
          <div class="card-content">
            <h3>{{ course.title }}</h3>
            <p>{{ course.description }}</p>
            <div class="card-meta">
              <span class="rating">⭐ {{ course.rating }}</span>
              <span class="students">{{ course.students }}人学习</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="favorites-grid" v-if="activeTab === 'notes'">
        <div class="favorite-card" v-for="note in favoriteNotes" :key="note.id">
          <div class="card-content">
            <h3>{{ note.title }}</h3>
            <p>{{ note.preview }}</p>
            <div class="card-meta">
              <span class="author">by {{ note.author }}</span>
              <span class="likes">❤️ {{ note.likes }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('courses')

const favoriteCourses = ref([
  {
    id: 1,
    title: 'Vue.js 完全指南',
    description: '从入门到精通的Vue.js学习课程',
    icon: '📚',
    rating: 4.8,
    students: 1250
  },
  {
    id: 2,
    title: 'TypeScript 实战',
    description: 'TypeScript在企业级项目中的应用',
    icon: '🔧',
    rating: 4.9,
    students: 890
  }
])

const favoriteNotes = ref([
  {
    id: 1,
    title: 'React vs Vue 深度对比',
    preview: '详细分析React和Vue在性能、生态、学习曲线等方面的差异...',
    author: '前端专家',
    likes: 156
  },
  {
    id: 2,
    title: '现代CSS布局技巧',
    preview: 'Flexbox和Grid布局的最佳实践和常见问题解决方案...',
    author: 'CSS大师',
    likes: 89
  }
])
</script>

<style scoped>
.favorites-page {
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

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.favorite-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: all 0.3s;
  display: flex;
  gap: 16px;
}

.favorite-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

.card-image {
  flex-shrink: 0;
}

.image-placeholder {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #fff;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.card-content p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0 0 12px 0;
}

.card-meta {
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
}

.rating, .students, .author, .likes {
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style> 