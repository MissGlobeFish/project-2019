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
    redirect: '/pageLayout',
    children: [
      {
        path: 'pageLayout',
        name: 'pageLayout',
        component: () => import('@/views/pageLayout/index'),
        meta: { title: '页面配置', icon: 'yemian' }
      }
    ]
  },

  {
    path: '/taskAllocation',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'taskAllocation',
        component: () => import('@/views/taskAllocation/index'),
        meta: { title: '任务配置', icon: 'renwu' }
      }
    ]
  },

  {
    path: '/projectSetting',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'projectSetting',
        component: () => import('@/views/projectSetting/index'),
        meta: { title: '项目配置', icon: 'xiangmu' }
      }
    ]
  },
  
  {
    path: '/messageInform',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'messageInform',
        component: () => import('@/views/messageInform/index'),
        meta: { title: '消息通知', icon: 'xiaoxitongzhi' }
      }
    ]
  },
  
  {
    path: '/portDeploy',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'portDeploy',
        component: () => import('@/views/portDeploy/index'),
        meta: { title: '接口配置', icon: 'jiekoupeizhi' }
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
