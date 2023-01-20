import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/levels',
    name: 'Levels',
    component: () => import('@/views/Levels.vue')
  },
  {
    path: '/levels/:id',
    name: 'Level',
    component: () => import('@/views/Level.vue')
  },
  {
    path: '/finish',
    name: 'Finish',
    component: () => import('@/views/Finish.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
