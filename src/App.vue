<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
const route = useRoute()
const hideHeader = route.path === '/login' || route.path === '/register'
</script>

<template>

  <RouterView />
</template>

<style scoped>

</style>
