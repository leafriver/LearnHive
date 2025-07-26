<template>
  <div class="notes-page">
    <div class="page-header">
      <h2>📝 我的笔记</h2>
      <button class="create-btn">+ 创建笔记</button>
    </div>
    
    <div class="notes-content">
      <div class="notes-grid">
        <div class="note-card" v-for="note in notes" :key="note.id">
          <div class="note-header">
            <h3>{{ note.title }}</h3>
            <span class="note-date">{{ note.date }}</span>
          </div>
          <p class="note-preview">{{ note.preview }}</p>
          <div class="note-tags">
            <span class="tag" v-for="tag in note.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const notes = ref([
  {
    id: 1,
    title: 'Vue.js 组件设计模式',
    preview: '深入探讨Vue.js中组件的最佳实践和设计模式，包括组合式API的使用技巧...',
    date: '2024-01-15',
    tags: ['Vue.js', '前端']
  },
  {
    id: 2,
    title: 'TypeScript 高级特性',
    preview: '学习TypeScript的高级类型系统，包括泛型、装饰器、命名空间等概念...',
    date: '2024-01-14',
    tags: ['TypeScript', '编程']
  },
  {
    id: 3,
    title: 'CSS Grid 布局详解',
    preview: '掌握CSS Grid布局系统，从基础概念到复杂布局的实现方法...',
    date: '2024-01-13',
    tags: ['CSS', '布局']
  }
])
</script>

<style scoped>
.notes-page {
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

.create-btn {
  background: #667eea;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.create-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.note-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: all 0.3s;
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.note-header h3 {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.note-date {
  color: #666;
  font-size: 0.85rem;
  margin-left: 12px;
}

.note-preview {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.note-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #f1f5f9;
  color: #667eea;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}
</style> 