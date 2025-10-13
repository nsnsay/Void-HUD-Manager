import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

// 定义路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/menu'
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('./content/menu/menu.vue')
  },
  {
    path: '/match',
    name: 'Match',
    component: () => import('./content/match/match.vue')
  },
  {
    path: '/players',
    name: 'Players',
    component: () => import('./content/players/players.vue')
  },
  {
    path: '/teams',
    name: 'Teams',
    component: () => import('./content/teams/teams.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('./content/settings/settings.vue')
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router