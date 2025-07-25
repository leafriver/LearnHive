<template>
  <div class="explore-bg">
    <header class="explore-header">
      <h1>课程与笔记广场</h1>
      <router-link to="/home/profile" class="to-personal">返回个人页面</router-link>
    </header>
    <main class="explore-main">
      <section class="courses">
        <h2>热门课程</h2>
        <div class="course-list">
          <div class="course-card" v-for="i in 4" :key="i">
            <h3>课程 {{ i }}</h3>
            <p>这里是课程简介内容...</p>
          </div>
        </div>
      </section>
      <section class="notes">
        <h2>精选笔记</h2>
        <div class="note-list">
          <div class="note-card" v-for="i in 3" :key="i">
            <h4>笔记标题 {{ i }}</h4>
            <p>这里是笔记摘要内容...</p>
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
  background: linear-gradient(120deg, #e6f2fb 60%, #f7fafd 100%);
  padding-bottom: 40px;
}
.explore-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 8vw 0 8vw;
}
.explore-header h1 {
  color: #2176c1;
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: 2px;
}
.to-personal {
  background: #2176c1;
  color: #fff;
  padding: 8px 22px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: background 0.2s;
}
.to-personal:hover {
  background: #145a96;
}
.explore-main {
  padding: 32px 8vw 0 8vw;
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
}
.courses, .notes {
  flex: 1 1 350px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 28px 24px 24px 24px;
  margin-bottom: 32px;
}
.course-list, .note-list {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}
.course-card, .note-card {
  background: #f7fafd;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  padding: 18px 16px;
  min-width: 140px;
  flex: 1 1 140px;
}
.course-card h3, .note-card h4 {
  color: #2176c1;
  margin-bottom: 8px;
}
</style> 