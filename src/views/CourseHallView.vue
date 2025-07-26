<template>
  <div class="course-hall-bg">
    <header class="course-hall-header">
      <div class="header-left">
        <h1>🎓 课程大厅</h1>
        <p class="header-subtitle">探索丰富的学习资源，找到适合你的课程</p>
      </div>
      <div class="header-right">
        <div class="search-box">
          <input v-model="searchQuery" type="text" placeholder="搜索课程..." />
          <button class="search-btn">🔍</button>
        </div>
        <router-link to="/explore" class="back-btn">← 返回广场</router-link>
      </div>
    </header>

    <main class="course-hall-main">
      <div class="filters">
        <div class="filter-group">
          <label>难度：</label>
          <select v-model="selectedLevel">
            <option value="">全部</option>
            <option value="初级">初级</option>
            <option value="中级">中级</option>
            <option value="高级">高级</option>
          </select>
        </div>
        <div class="filter-group">
          <label>分类：</label>
          <select v-model="selectedCategory">
            <option value="">全部</option>
            <option value="前端">前端</option>
            <option value="后端">后端</option>
            <option value="移动端">移动端</option>
            <option value="数据科学">数据科学</option>
          </select>
        </div>
        <div class="filter-group">
          <label>排序：</label>
          <select v-model="sortBy">
            <option value="popular">最受欢迎</option>
            <option value="newest">最新发布</option>
            <option value="rating">评分最高</option>
          </select>
        </div>
      </div>

      <div class="course-grid">
        <div class="course-item" v-for="course in paginatedCourses" :key="course.id">
          <div class="course-image">
            <div class="course-icon">{{ course.icon }}</div>
            <div class="course-level">{{ course.level }}</div>
          </div>
          <div class="course-content">
            <h3>{{ course.title }}</h3>
            <p class="course-desc">{{ course.description }}</p>
            <div class="course-meta">
              <span class="course-duration">⏱️ {{ course.duration }}</span>
              <span class="course-students">👥 {{ course.students }}</span>
              <span class="course-rating">⭐ {{ course.rating }}</span>
            </div>
            <div class="course-tags">
              <span v-for="tag in course.tags" :key="tag" class="tag">{{ tag }}</span>
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
const selectedLevel = ref('')
const selectedCategory = ref('')
const sortBy = ref('popular')
const currentPage = ref(1)
const itemsPerPage = 12

// 模拟课程数据
const allCourses = ref([
  { id: 1, title: 'Vue.js 实战开发', description: '从零开始学习 Vue.js，掌握现代前端开发技能', level: '初级', duration: '8小时', students: '2.5k', rating: '4.8', icon: '⚛️', tags: ['前端', 'Vue'] },
  { id: 2, title: 'React 高级教程', description: '深入学习 React Hooks 和状态管理', level: '中级', duration: '12小时', students: '1.8k', rating: '4.9', icon: '⚛️', tags: ['前端', 'React'] },
  { id: 3, title: 'Node.js 后端开发', description: '使用 Node.js 构建高性能后端服务', level: '中级', duration: '15小时', students: '3.2k', rating: '4.7', icon: '🟢', tags: ['后端', 'Node.js'] },
  { id: 4, title: 'Python 数据分析', description: '使用 Python 进行数据分析和可视化', level: '中级', duration: '10小时', students: '1.5k', rating: '4.6', icon: '🐍', tags: ['数据科学', 'Python'] },
  { id: 5, title: 'Flutter 移动开发', description: '跨平台移动应用开发实战', level: '高级', duration: '20小时', students: '900', rating: '4.8', icon: '📱', tags: ['移动端', 'Flutter'] },
  { id: 6, title: 'TypeScript 进阶', description: 'TypeScript 高级特性和最佳实践', level: '中级', duration: '6小时', students: '1.2k', rating: '4.9', icon: '📘', tags: ['前端', 'TypeScript'] },
  { id: 7, title: 'Docker 容器化', description: 'Docker 容器化部署和管理', level: '中级', duration: '8小时', students: '1.8k', rating: '4.7', icon: '🐳', tags: ['后端', 'Docker'] },
  { id: 8, title: '机器学习入门', description: '机器学习基础算法和实践应用', level: '高级', duration: '25小时', students: '700', rating: '4.8', icon: '🤖', tags: ['数据科学', 'AI'] },
  { id: 9, title: 'GraphQL API 设计', description: '现代 API 设计和 GraphQL 实践', level: '高级', duration: '10小时', students: '600', rating: '4.9', icon: '🔗', tags: ['后端', 'GraphQL'] },
  { id: 10, title: '微信小程序开发', description: '微信小程序从入门到精通', level: '初级', duration: '12小时', students: '2.1k', rating: '4.6', icon: '📱', tags: ['移动端', '微信'] },
  { id: 11, title: 'Vue 3 组合式 API', description: 'Vue 3 新特性深度解析', level: '中级', duration: '8小时', students: '1.5k', rating: '4.8', icon: '⚛️', tags: ['前端', 'Vue'] },
  { id: 12, title: 'Redis 缓存设计', description: 'Redis 缓存策略和性能优化', level: '高级', duration: '6小时', students: '800', rating: '4.7', icon: '🔴', tags: ['后端', 'Redis'] },
  { id: 13, title: '前端工程化', description: '现代前端工程化实践', level: '高级', duration: '15小时', students: '1.1k', rating: '4.9', icon: '⚙️', tags: ['前端', '工程化'] },
  { id: 14, title: '微服务架构', description: '微服务架构设计和实现', level: '高级', duration: '18小时', students: '500', rating: '4.8', icon: '🏗️', tags: ['后端', '架构'] },
  { id: 15, title: '数据可视化', description: '使用 D3.js 创建交互式图表', level: '中级', duration: '10小时', students: '900', rating: '4.7', icon: '📊', tags: ['前端', '可视化'] },
])

const filteredCourses = computed(() => {
  return allCourses.value.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesLevel = !selectedLevel.value || course.level === selectedLevel.value
    const matchesCategory = !selectedCategory.value || course.tags.includes(selectedCategory.value)
    
    return matchesSearch && matchesLevel && matchesCategory
  })
})

const sortedCourses = computed(() => {
  const courses = [...filteredCourses.value]
  switch (sortBy.value) {
    case 'newest':
      return courses.sort((a, b) => b.id - a.id)
    case 'rating':
      return courses.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    default: // popular
      return courses.sort((a, b) => parseInt(b.students.replace('k', '000')) - parseInt(a.students.replace('k', '000')))
  }
})

const totalPages = computed(() => Math.ceil(sortedCourses.value.length / itemsPerPage))

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedCourses.value.slice(start, end)
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
.course-hall-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 40px;
  width: 100vw;
  box-sizing: border-box;
}
.course-hall-header {
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
.course-hall-main {
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
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}
.course-item {
  background: rgba(255,255,255,0.95);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}
.course-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
.course-image {
  position: relative;
  height: 120px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.course-icon {
  font-size: 3rem;
  color: #fff;
}
.course-level {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255,255,255,0.9);
  color: #667eea;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}
.course-content {
  padding: 20px;
}
.course-content h3 {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.4;
}
.course-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.course-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.course-duration, .course-students, .course-rating {
  color: #666;
  font-size: 12px;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
}
.course-tags {
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
  .course-hall-header {
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
  .course-hall-main {
    padding: 40px 6vw 0 6vw;
  }
  .filters {
    flex-direction: column;
    gap: 12px;
  }
  .course-grid {
    grid-template-columns: 1fr;
  }
  .pagination {
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style> 