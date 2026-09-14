import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/lib/api'
import LoginView from '@/views/LoginView.vue'
import SessionsView from '@/views/SessionsView.vue'
import SessionOverviewView from '@/views/SessionOverviewView.vue'
import SessionThinkingView from '@/views/SessionThinkingView.vue'
import SessionTurnsView from '@/views/SessionTurnsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/sessions' },
    { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
    { path: '/sessions', name: 'sessions', component: SessionsView },
    { path: '/sessions/:uuid', name: 'session-overview', component: SessionOverviewView },
    { path: '/sessions/:uuid/thinking', name: 'session-thinking', component: SessionThinkingView },
    { path: '/sessions/:uuid/turns', name: 'session-turns', component: SessionTurnsView },
  ],
})

router.beforeEach((to) => {
  if (to.meta.public) return true
  if (!getToken()) return { name: 'login', query: { redirect: to.fullPath } }
  return true
})

export default router
