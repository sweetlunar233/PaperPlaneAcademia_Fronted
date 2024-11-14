import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/comment',
      name: 'comment',
      component: () => import('../views/community/Comment.vue')
    },
    {
      path:'/article',
      name:'article',
      component: () => import('../views/literature/Article.vue')
    },
    {
      path:'/authentication',
      name:'authentication',
      component: () => import('../views/scholar/Authentication.vue')
    },
    {
      path:'/gateway',
      name:'gateway',
      component: () => import('../views/scholar/Gateway.vue')
    },
    {
      path:'/scholarRes',
      name:'scholarRes',
      component: () => import('../views/scholar/ScholarRes.vue')
    },
    {
      path:'/searchScholar',
      name:'searchScholar',
      component: () => import('../views/scholar/SearchScholar.vue')
    },
    {
      path:'/advSearch',
      name:'advSearch',
      component: () => import('../views/search/AdvSearch.vue')
    },
    {
      path:'/home',
      name:'home',
      component: () => import('../views/search/Home.vue')
    },
    {
      path:'/searchRes',
      name:'searchRes',
      component: () => import('../views/search/SearchRes.vue')
    },
    {
      path:'/admin',
      name:'admin',
      component: () => import('../views/user/Admin.vue')
    },
    {
      path:'/login',
      name:'login',
      component: () => import('../views/user/Login.vue')
    },
    {
      path:'/register',
      name:'register',
      component: () => import('../views/user/Register.vue')
    }
  ]
})

export default router
