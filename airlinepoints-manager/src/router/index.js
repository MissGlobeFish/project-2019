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
    redirect: '/chargeOff',
    children: [
      {
        path: 'chargeOff',
        name: 'chargeOff',
        component: () => import('@/views/chargeOff/index'),
        meta: { title: '核销', icon: 'hexiao' }
      }
    ]
  },

  {
    path: '/chargeOffRecord',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'chargeOffRecord',
        component: () => import('@/views/chargeOffRecord/index'),
        meta: { title: '核销记录', icon: 'jilubiao' }
      }
    ]
  },

  {
    path: '/dataImport',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'dataImport',
        component: () => import('@/views/dataImport/index'),
        meta: { title: '数据导入', icon: 'daoru' }
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
