/*
 * @Description: 
 * @Author: rcq
 * @Date: 2019-11-04 14:14:20
 * @LastEditTime: 2019-11-13 19:09:50
 */
/*
 * @Description:
 * @Author: rcq
 * @Date: 2019-10-28 16:38:14
 * @LastEditTime: 2019-11-04 14:52:37
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '工作台', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: '权限',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin']
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/planManager',
    component: Layout,
    redirect: '/planManager/index',
    name: '考勤计划',
    alwaysShow: true,
    meta: {
      title: '考勤计划',
      icon: 'guide'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/planManager/index'),
        name: 'planManager',
        meta: { title: '考勤计划管理', icon: 'table', noCache: true, roles: ['admin', 'editor'] }
      },
      {
        path: '/myScheduling',
        component: () => import('@/views/planManager/myScheduling.vue'),
        name: 'myScheduling',
        meta: { title: '我的排班', icon: 'table', noCache: true, roles: ['admin', 'editor', 'employee', 'leader'] }
      },
      {
        path: '/holiday',
        component: () => import('@/views/planManager/holiday.vue'),
        name: 'holiday',
        meta: { title: '我的假期', icon: 'table', noCache: true, roles: ['admin', 'editor', 'employee', 'leader'] }
      }
    ]
  },
  {
    path: '/attendanceDetail',
    component: Layout,
    redirect: '/attendanceDetail/index',
    name: '考勤明细',
    alwaysShow: true,
    meta: {
      title: '考勤明细',
      icon: 'nested',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/attendanceDetail/index'),
        name: 'attendanceDetail',
        meta: { title: '考勤记录', icon: 'nested', noCache: true }
      },
      {
        path: 'mySelfAttendance',
        component: () => import('@/views/attendanceDetail/mySelfAttendance.vue'),
        name: 'mySelfAttendance',
        meta: { title: '个人记录', icon: 'nested', noCache: true }
      }
    ]
  },
  {
    path: '/leaveManager',
    component: Layout,
    redirect: '/leaveManager/index',
    name: '请假管理',
    alwaysShow: true,
    meta: {
      title: '请假管理',
      icon: 'documentation'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/leaveManager/index'),
        name: 'leaveManager',
        meta: { title: '请假管理', icon: 'form', noCache: true }
      },
      {
        path: '/approval',
        component: () => import('@/views/leaveManager/approval'),
        name: 'approval',
        meta: { title: '请假审批', icon: 'skill', noCache: true, roles: ['admin', 'editor','leader'] }
      }
    ]
  },
  {
    path: '/deviceManager',
    component: Layout,
    redirect: '/deviceManager/index',
    meta: {
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/deviceManager/index'),
        name: 'deviceManager',
        meta: { title: '设备管理', icon: 'tab', noCache: true }
      }
    ]
  },
  {
    path: '/BI',
    component: Layout,
    redirect: '/BI/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/BI/index'),
        name: 'BI',
        meta: { title: 'BI', icon: 'example', noCache: true }
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
