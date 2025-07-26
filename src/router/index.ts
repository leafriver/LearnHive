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
      path: '/test-user-info',
      name: 'TestUserInfo',
      component: () => import('../views/TestUserInfo.vue')
    },
    {
      path: '/explore',
      name: 'Explore',
      component: () => import('../views/ExploreView.vue')
    },
    {
      path: '/course-hall',
      name: 'CourseHall',
      component: () => import('../views/CourseHallView.vue')
    },
    {
      path: '/note-hall',
      name: 'NoteHall',
      component: () => import('../views/NoteHallView.vue')
    },
    {
      path: '/home',
      name: 'Home',
      component: HomeView,
      children: [
        { path: 'profile', component: () => import('../views/MainContent1.vue') },
        { path: 'courses', component: () => import('../views/MainContent2.vue') },
        { path: 'notes', component: () => import('../views/MainContent5.vue') },
        { path: 'favorites', component: () => import('../views/MainContent6.vue') },
        { path: 'messages', component: () => import('../views/MainContent3.vue') },
        { path: 'calendar', component: () => import('../views/MainContent7.vue') },
        { path: 'analytics', component: () => import('../views/MainContent8.vue') },
        { path: 'goals', component: () => import('../views/MainContent9.vue') },
        { path: 'settings', component: () => import('../views/MainContent4.vue') },
      ]
    },
  ],
})

export default router
