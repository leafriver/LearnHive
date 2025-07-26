<template>
  <div class="explore-bg">
    <header class="explore-header">
      <div class="header-left">
        <h1>📚 课程与笔记广场</h1>
        <p class="header-subtitle">发现优质学习资源，提升你的技能</p>
      </div>
      <div class="header-right">
        <div class="search-box">
          <input type="text" placeholder="搜索课程或笔记..." />
          <button class="search-btn">🔍</button>
        </div>
        <router-link to="/home/profile" class="to-personal">🏠 返回个人页面</router-link>
      </div>
    </header>
    <main class="explore-main">
      <section class="courses">
        <div class="section-header">
          <h2>🔥 热门课程</h2>
          <div class="section-actions">
            <span class="course-count">共 12 门课程</span>
            <router-link to="/course-hall" class="view-more-btn">查看更多课程 →</router-link>
          </div>
        </div>
        <div class="course-list">
          <div class="course-card" v-for="i in 6" :key="i">
            <div class="course-image">
              <div class="course-icon">📖</div>
            </div>
            <div class="course-content">
              <h3>Vue.js 实战课程 {{ i }}</h3>
              <p class="course-desc">从入门到精通的完整学习路径，包含实战项目...</p>
              <div class="course-meta">
                <span class="course-level">初级</span>
                <span class="course-duration">2.5 小时</span>
                <span class="course-students">1.2k 学员</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="notes">
        <div class="section-header">
          <h2>⭐ 精选笔记</h2>
          <div class="section-actions">
            <span class="note-count">共 8 篇笔记</span>
            <router-link to="/note-hall" class="view-more-btn">查看更多笔记 →</router-link>
          </div>
        </div>
        <div class="note-list">
          <div class="note-card" v-for="i in 4" :key="i">
            <div class="note-header">
              <h4>React Hooks 使用技巧 {{ i }}</h4>
              <span class="note-tag">React</span>
            </div>
            <p class="note-desc">深入理解 React Hooks 的使用方法和最佳实践...</p>
            <div class="note-footer">
              <span class="note-author">by 张三</span>
              <span class="note-date">2 天前</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.explore-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 40px;
  width: 100vw;
  box-sizing: border-box;
}
.explore-header {
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
.to-personal {
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
.to-personal:hover {
  background: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.explore-main {
  padding: 40px 4vw 0 4vw;
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
}
.courses, .notes {
  flex: 1 1 400px;
  background: rgba(255,255,255,0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  padding: 32px 28px 28px 28px;
  margin-bottom: 32px;
  backdrop-filter: blur(10px);
  min-width: 0;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.section-header h2 {
  color: #333;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}
.section-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.course-count, .note-count {
  color: #666;
  font-size: 14px;
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 12px;
}
.view-more-btn {
  background: #667eea;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.view-more-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.course-list, .note-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
}
.course-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  padding: 20px;
  transition: all 0.3s;
  border: 1px solid #f0f0f0;
  min-width: 0;
}
.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
.course-image {
  text-align: center;
  margin-bottom: 16px;
}
.course-icon {
  font-size: 3rem;
  margin-bottom: 8px;
}
.course-content h3 {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
}
.course-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
}
.course-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.course-level, .course-duration, .course-students {
  background: #f8f9fa;
  color: #666;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
}
.note-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  padding: 20px;
  transition: all 0.3s;
  border: 1px solid #f0f0f0;
  min-width: 0;
}
.note-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}
.note-header h4 {
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
}
.note-tag {
  background: #667eea;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}
.note-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
}
.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
}
@media (max-width: 768px) {
  .explore-header {
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
  .explore-main {
    padding: 40px 6vw 0 6vw;
  }
  .course-list, .note-list {
    grid-template-columns: 1fr;
  }
  .courses, .notes {
    flex: 1 1 100%;
  }
}
</style> 