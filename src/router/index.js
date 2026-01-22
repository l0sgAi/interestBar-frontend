import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import { auth } from '@/utils/auth'

const router = createRouter({
  history: createWebHistory('/interestBar-frontend/'), // 使用 History 模式，base 与仓库名一致
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/success',
      name: 'success',
      component: () => import('../views/Success.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/create-post',
      name: 'create-post',
      component: () => import('../views/CreatePost.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/UserProfile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/Terms.vue')
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/Privacy.vue')
    }
  ]
})

// 全局路由守卫
router.beforeEach((to, _, next) => {
  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    if (auth.isAuthenticated()) {
      // 已登录，允许访问
      next()
    } else {
      // 未登录，重定向到登录页
      next('/')
    }
  } else {
    // 不需要认证的路由，直接放行
    next()
  }
})

export default router
