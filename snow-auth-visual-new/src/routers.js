/*
 * @Description: 
 * @Author: rcq
 * @Date: 2019-09-04 15:02:33
 * @LastEditTime: 2019-09-09 09:57:30
 */
import Layout from './layout/index.vue'
let routers = [
  {
    path: '/',
    redirect: '/emp_manage',
    meta: {
      requireAuth: false
    },
    hidden: true
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('./pages/login.vue'),
    meta: { index: '/login'},
    hidden: true
  },
  {
    path: '/emp_manage',
    redirect: '/emp_manage/index',
    component: Layout,
    icon: 'el-icon-view',
    meta: { index: '/emp_manage',title: "角色与权限"},
    children: [
      {
        path: 'index',
        name: '创建角色',
        component: () => import('./pages/empManage.vue'),
        meta: { index: '/emp_manage/index'}
     },
     {
       path: 'emp_eploy',
       name: '角色管理',
       component: () => import('./pages/empDeploy.vue'),
       meta: { index: '/emp_manage/emp_eploy'}
     }
    ]
  },
  {
    path: '/system_manage',
    component: Layout,
    redirect: '/system_manage/index',
    icon: 'el-icon-bell',
    meta: { index: '/system_manage/index',title: "系统管理"},
    children: [
      {
        path: 'index',
        name: '系统管理',
        component: () => import('./pages/systemManage.vue'),
        meta: { index: '/system_manage/index'}
     }
    ]
  },
  {
    path: '/menu_setup',
    component: Layout,
    redirect: '/menu_setup/index',
    icon: 'el-icon-setting',
    meta: { index: '/menu_setup/index',title: "菜单功能设置"},
    children: [
      {
        path: 'index',
        name: '菜单功能设置',
        component: () => import('./pages/menuSetup.vue'),
        meta: { index: '/menu_setup/index'}
     }
    ]
  },
  {
    path: '/emp_setting',
    component: Layout,
    redirect: '/emp_setting/index',
    icon: 'el-icon-view',
    meta: { index: '/emp_setting/index',title: "账号管理"},
    children: [
      {
        path: 'index',
        name: '账号管理',
        component: () => import('./pages/empSetting.vue'),
        meta: { index: '/emp_setting/index'}
     }
    ]
  }
  
]
export default routers;