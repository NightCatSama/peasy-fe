import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
} from 'vue-router'

import Configure from '@/pages/Configure.vue'
import Redirect from '@/pages/Redirect.vue'
import Me from '@/pages/Me.vue'
import Template from '@/pages/Template.vue'
import NotFound from '@/pages/NotFound.vue'
import Admin from '@/pages/Admin.vue'

const needReloadPage = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (from.name && !(from.name === 'create' && to.name === 'edit')) {
    location.href = import.meta.env.VITE_URL_BASE + to.fullPath.slice(1)
  } else {
    next()
  }
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_URL_BASE),
  routes: [
    { path: '', redirect: '/edit', name: 'home' },
    { path: '/edit', component: Configure, name: 'create', beforeEnter: needReloadPage },
    { path: '/edit/:id', component: Configure, name: 'edit', beforeEnter: needReloadPage },
    { path: '/me', component: Me, name: 'user' },
    { path: '/admin/fix/:code', component: Admin, name: 'admin-fix' },
    { path: '/template', component: Template, name: 'template' },
    { path: '/redirect', component: Redirect, name: 'redirect' },
    { path: '/:pathMatch(.*)', component: NotFound, name: 'not-found' },
  ],
})
