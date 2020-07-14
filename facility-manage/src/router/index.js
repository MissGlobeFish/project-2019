import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/facilityList',
    children: [
      {
        path: 'facilityList',
        name: 'facilityList',
        component: () => import('@/views/facilityList/index'),
        meta: { title: '设备列表', icon: 'EbookReader' }
      }
    ]
  },

  {
    path: '/facilityMessage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'facilityMessage',
        component: () => import('@/views/facilityMessage/index'),
        meta: { title: '系统信息', icon: 'EnvironmentalMonitoring' }
      }
    ]
  },

  {
    path: '/deployMessage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'deployMessage',
        component: () => import('@/views/deployMessage/index'),
        meta: { title: '配置信息', icon: 'Automation' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
