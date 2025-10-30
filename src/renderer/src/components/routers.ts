import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import matchs from '../pages/matchs.vue'
import players from '../pages/players.vue'
import settings from '../pages/settings.vue'
import teams from '../pages/teams.vue'
import menu from '../pages/menu.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/matchs',
    component: matchs
  },
  {
    path: '/players',
    component: players
  },
  {
    path: '/settings',
    component: settings
  },
  {
    path: '/teams',
    component: teams
  },
  {
    path: '/',
    component: menu
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
