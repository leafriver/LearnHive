<template>
  <nav class="sidebar">
    <ul>
      <li>
        <router-link to="/home/profile" active-class="active">个人信息</router-link>
      </li>
      <li>
        <router-link to="/home/courses" active-class="active">我的课程</router-link>
      </li>
      <li>
        <router-link to="/home/messages" active-class="active">消息通知</router-link>
      </li>
      <li>
        <router-link to="/home/settings" active-class="active">设置</router-link>
      </li>
    </ul>
    <div class="to-explore-wrap">
      <router-link to="/explore" class="to-explore">前往公共页面</router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
</script>

<style scoped>
.sidebar {
  width: 160px;
  background: #f7fafd;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  padding: 32px 0 32px 0;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  margin-bottom: 18px;
  text-align: left;
}
li:last-child {
  margin-bottom: 0;
}
.router-link-active,
.active {
  color: #2176c1;
  font-weight: bold;
  background: #e6f2fb;
  border-radius: 6px;
}
a {
  display: block;
  padding: 10px 24px;
  color: #333;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
}
a:hover {
  background: #e6f2fb;
  color: #2176c1;
}
.to-explore-wrap {
  margin-top: 32px;
  padding: 0 24px;
}
.to-explore {
  display: block;
  background: #2176c1;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 10px 0;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}
.to-explore:hover {
  background: #145a96;
}
</style> 