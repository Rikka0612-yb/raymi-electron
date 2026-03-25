import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/blank-layout/index.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index.vue')
      }
    ]
  },
  {
    path: '/chat',
    component: () => import('@/layouts/base-layout/index.vue'),
    children: [
      {
        path: '',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue')
      }
    ]
  }
]

export const router = createRouter({
  // Use Hash history for Electron
  history: createWebHashHistory(),
  routes
})

export function setupRouter(app: any) {
  app.use(router)
}
