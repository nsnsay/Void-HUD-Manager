import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import matchs from '../multi/matchs.vue'
import players from '../multi/players.vue'
import settings from '../multi/settings.vue'
import teams from '../multi/teams.vue'
import menu from '../multi/menu.vue'

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
