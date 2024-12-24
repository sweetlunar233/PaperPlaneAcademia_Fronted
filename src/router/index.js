import { createRouter, createWebHistory } from 'vue-router'
import PlatformOverview from "@/views/admin/PlatformOverview.vue";
import PlatformScholars from "@/views/admin/PlatformScholars.vue";
import ReviewResearcher from "@/views/admin/ReviewResearcher.vue";

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
      path:'/field',
      name:'field',
      component: () => import('../views/literature/Field.vue')
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
      component: () => import('../views/admin/Admin.vue'),
      redirect: '/admin/overview', // 确保默认重定向到 overview
      children: [
        { path: "overview", name: "overview", component: PlatformOverview },
        { path: "scholars", name: "scholars", component: PlatformScholars },
        { path: "reviewResearcher", name: "reviewResearcher", component: ReviewResearcher },
        {
          path: "*",
          redirect: "overview", // 默认重定向到平台概况
        },
      ],
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
    },
    {
      path:'/myGateway',
      name:'myGateway',
      component: () => import('../views/scholar/MyGateway.vue')
    },
    {
      path:'/error',
      name:'error',
      component: () => import('../views/user/Error.vue')
    }
  ]
})

// 添加全局导航守卫
router.beforeEach((to, from, next) => {
  // 如果访问的是 /admin 且没有指定子路径，默认跳转到 /admin/overview
  if (to.path === '/admin' || to.path === '/admin/') {
    next('/admin/overview');
  } else {
    next();
  }
});


export default router;
