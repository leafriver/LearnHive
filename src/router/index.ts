import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView
    },
    {
      path: '/explore',
      name: 'Explore',
      component: () => import('../views/ExploreView.vue')
    },
    {
      path: '/home',
      name: 'Home',
      component: HomeView,
      children: [
        { path: '', redirect: '/home/profile' },
        { path: 'profile', component: () => import('../views/MainContent1.vue') },
        { path: 'courses', component: () => import('../views/MainContent2.vue') },
        { path: 'messages', component: () => import('../views/MainContent3.vue') },
        { path: 'settings', component: () => import('../views/MainContent4.vue') },
      ]
    },
  ],
})

export default router
