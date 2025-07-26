<template>
  <div class="note-hall-bg">
    <header class="note-hall-header">
      <div class="header-left">
        <h1>📝 笔记大厅</h1>
        <p class="header-subtitle">发现优质学习笔记，分享你的知识见解</p>
      </div>
      <div class="header-right">
        <div class="search-box">
          <input v-model="searchQuery" type="text" placeholder="搜索笔记..." />
          <button class="search-btn">🔍</button>
        </div>
        <router-link to="/explore" class="back-btn">← 返回广场</router-link>
      </div>
    </header>

    <main class="note-hall-main">
      <div class="filters">
        <div class="filter-group">
          <label>分类：</label>
          <select v-model="selectedCategory">
            <option value="">全部</option>
            <option value="前端">前端</option>
            <option value="后端">后端</option>
            <option value="移动端">移动端</option>
            <option value="数据科学">数据科学</option>
            <option value="工具">工具</option>
          </select>
        </div>
        <div class="filter-group">
          <label>排序：</label>
          <select v-model="sortBy">
            <option value="latest">最新发布</option>
            <option value="popular">最受欢迎</option>
            <option value="rating">评分最高</option>
          </select>
        </div>
        <div class="filter-group">
          <label>时间：</label>
          <select v-model="timeFilter">
            <option value="">全部时间</option>
            <option value="today">今天</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
          </select>
        </div>
      </div>

      <div class="note-grid">
        <div class="note-item" v-for="note in paginatedNotes" :key="note.id">
          <div class="note-header">
            <div class="note-title-section">
              <h3>{{ note.title }}</h3>
              <div class="note-tags">
                <span v-for="tag in note.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
            <div class="note-author">
              <div class="author-avatar">{{ note.author.charAt(0) }}</div>
              <span class="author-name">{{ note.author }}</span>
            </div>
          </div>
          <div class="note-content">
            <p class="note-desc">{{ note.description }}</p>
            <div class="note-meta">
              <span class="note-date">📅 {{ note.date }}</span>
              <span class="note-views">👁️ {{ note.views }}</span>
              <span class="note-likes">❤️ {{ note.likes }}</span>
              <span class="note-rating">⭐ {{ note.rating }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="page-btn"
        >
          ← 上一页
        </button>
        <div class="page-numbers">
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="goToPage(page)"
            :class="['page-number', { active: page === currentPage }]"
          >
            {{ page }}
          </button>
        </div>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          下一页 →
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('latest')
const timeFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 12

// 模拟笔记数据
const allNotes = ref([
  { id: 1, title: 'React Hooks 使用技巧', description: '深入理解 React Hooks 的使用方法和最佳实践，包含实际项目中的应用案例...', author: '张三', date: '2天前', views: '1.2k', likes: '89', rating: '4.8', tags: ['前端', 'React'] },
  { id: 2, title: 'Vue 3 组合式 API 详解', description: 'Vue 3 组合式 API 的完整指南，从基础概念到高级应用...', author: '李四', date: '3天前', views: '980', likes: '76', rating: '4.9', tags: ['前端', 'Vue'] },
  { id: 3, title: 'Node.js 性能优化实践', description: 'Node.js 应用性能优化的实用技巧和最佳实践总结...', author: '王五', date: '1周前', views: '2.1k', likes: '156', rating: '4.7', tags: ['后端', 'Node.js'] },
  { id: 4, title: 'TypeScript 高级类型', description: 'TypeScript 高级类型系统的深入解析和实际应用...', author: '赵六', date: '4天前', views: '750', likes: '45', rating: '4.8', tags: ['前端', 'TypeScript'] },
  { id: 5, title: 'Docker 容器化部署', description: '使用 Docker 进行应用容器化部署的完整流程和注意事项...', author: '钱七', date: '5天前', views: '1.8k', likes: '134', rating: '4.6', tags: ['后端', 'Docker'] },
  { id: 6, title: 'Flutter 状态管理', description: 'Flutter 应用状态管理的多种方案对比和实践经验...', author: '孙八', date: '1天前', views: '650', likes: '32', rating: '4.9', tags: ['移动端', 'Flutter'] },
  { id: 7, title: 'Python 数据分析入门', description: '使用 Python 进行数据分析的基础知识和常用库介绍...', author: '周九', date: '6天前', views: '1.5k', likes: '98', rating: '4.7', tags: ['数据科学', 'Python'] },
  { id: 8, title: 'Git 工作流最佳实践', description: '团队协作中的 Git 工作流程和版本管理策略...', author: '吴十', date: '2周前', views: '3.2k', likes: '245', rating: '4.8', tags: ['工具', 'Git'] },
  { id: 9, title: '微信小程序开发技巧', description: '微信小程序开发中的常见问题和解决方案总结...', author: '郑十一', date: '3天前', views: '890', likes: '67', rating: '4.6', tags: ['移动端', '微信'] },
  { id: 10, title: 'Redis 缓存策略', description: 'Redis 缓存设计模式和性能优化策略详解...', author: '王十二', date: '4天前', views: '1.1k', likes: '78', rating: '4.8', tags: ['后端', 'Redis'] },
  { id: 11, title: '前端工程化实践', description: '现代前端工程化的工具链搭建和最佳实践...', author: '李十三', date: '1周前', views: '2.3k', likes: '189', rating: '4.9', tags: ['前端', '工程化'] },
  { id: 12, title: '机器学习算法总结', description: '常用机器学习算法的原理和实现要点总结...', author: '张十四', date: '5天前', views: '720', likes: '56', rating: '4.7', tags: ['数据科学', 'AI'] },
  { id: 13, title: 'GraphQL API 设计', description: 'GraphQL API 的设计原则和最佳实践指南...', author: '刘十五', date: '2天前', views: '540', likes: '43', rating: '4.8', tags: ['后端', 'GraphQL'] },
  { id: 14, title: 'CSS Grid 布局详解', description: 'CSS Grid 布局系统的完整教程和实际应用...', author: '陈十六', date: '3天前', views: '680', likes: '52', rating: '4.6', tags: ['前端', 'CSS'] },
  { id: 15, title: '微服务架构设计', description: '微服务架构的设计原则和实现策略详解...', author: '杨十七', date: '1周前', views: '1.9k', likes: '167', rating: '4.8', tags: ['后端', '架构'] },
])

const filteredNotes = computed(() => {
  return allNotes.value.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || note.tags.includes(selectedCategory.value)
    
    return matchesSearch && matchesCategory
  })
})

const sortedNotes = computed(() => {
  const notes = [...filteredNotes.value]
  switch (sortBy.value) {
    case 'popular':
      return notes.sort((a, b) => parseInt(b.views.replace('k', '000')) - parseInt(a.views.replace('k', '000')))
    case 'rating':
      return notes.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    default: // latest
      return notes.sort((a, b) => b.id - a.id)
  }
})

const totalPages = computed(() => Math.ceil(sortedNotes.value.length / itemsPerPage))

const paginatedNotes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedNotes.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function goToPage(page: number) {
  currentPage.value = page
}
</script>

<style scoped>
.note-hall-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 40px;
  width: 100vw;
  box-sizing: border-box;
}
.note-hall-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 4vw 0 4vw;
  flex-wrap: wrap;
  gap: 24px;
  width: 100%;
  box-sizing: border-box;
}
.header-left h1 {
  color: #fff;
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.header-subtitle {
  color: rgba(255,255,255,0.9);
  font-size: 16px;
  margin: 0;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.search-box {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.95);
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.search-box input {
  border: none;
  outline: none;
  background: transparent;
  padding: 4px 8px;
  font-size: 14px;
  min-width: 200px;
}
.search-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
}
.back-btn {
  background: rgba(255,255,255,0.95);
  color: #667eea;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.back-btn:hover {
  background: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.note-hall-main {
  padding: 40px 4vw 0 4vw;
  width: 100%;
  box-sizing: border-box;
}
.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  background: rgba(255,255,255,0.95);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.filter-group label {
  color: #333;
  font-weight: 600;
  font-size: 14px;
}
.filter-group select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
  outline: none;
}
.note-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}
.note-item {
  background: rgba(255,255,255,0.95);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  padding: 24px;
}
.note-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}
.note-title-section {
  flex: 1;
}
.note-title-section h3 {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.4;
}
.note-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.tag {
  background: #667eea;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}
.note-author {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
}
.author-avatar {
  width: 32px;
  height: 32px;
  background: #667eea;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}
.author-name {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}
.note-content {
  flex: 1;
}
.note-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.note-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #666;
}
.note-date, .note-views, .note-likes, .note-rating {
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
}
.page-btn {
  background: rgba(255,255,255,0.95);
  color: #667eea;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.page-btn:not(:disabled):hover {
  background: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.page-numbers {
  display: flex;
  gap: 8px;
}
.page-number {
  background: rgba(255,255,255,0.95);
  color: #667eea;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  min-width: 40px;
}
.page-number.active {
  background: #667eea;
  color: #fff;
}
.page-number:hover:not(.active) {
  background: #fff;
  transform: translateY(-1px);
}
@media (max-width: 768px) {
  .note-hall-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 40px 6vw 0 6vw;
  }
  .header-right {
    width: 100%;
    justify-content: space-between;
  }
  .search-box input {
    min-width: 150px;
  }
  .note-hall-main {
    padding: 40px 6vw 0 6vw;
  }
  .filters {
    flex-direction: column;
    gap: 12px;
  }
  .note-grid {
    grid-template-columns: 1fr;
  }
  .pagination {
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style> 