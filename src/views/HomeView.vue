<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
function onLogout() {
  // mock 退出登录，实际可清除token等
  router.push('/login')
}
</script>

<template>
  <div class="home-bg">
    <div class="home-layout">
      <Sidebar />
      <div class="main-area">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-bg {
  min-height: 100vh;
  background: #e6f2fb;
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 100vw;
  box-sizing: border-box;
}
.home-layout {
  display: flex;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  width: 90vw;
  max-width: 1600px;
  min-height: 500px;
  overflow: hidden;
}
.main-area {
  flex: 1 1 0%;
  min-width: 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
@media (max-width: 900px) {
  .home-layout {
    width: 100vw;
    min-width: 0;
    border-radius: 0;
  }
}
</style>
