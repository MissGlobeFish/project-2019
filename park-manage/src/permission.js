import router from './router'
import store from './store'
import { resetRouter, creatNewRouter } from '@/router'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 一个进度条的插件
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout' //Layout 是架构组件，不在后台返回，在文件里单独引入

NProgress.configure({ showSpinner: false }) // 是否有转圈效果

const whiteList = ['/login']  // 没有重定向白名单
var isRouter = false;

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  // 确定用户是否已登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next()
      NProgress.done()
    } else {
      const menuData = JSON.parse(sessionStorage.getItem("router"));
        if(!menuData){
          next('/login?redirect=index')
        }else{
          if(!isRouter){
            initMenu(router, menuData, to,  next);
          }else{
            next();
          }
        }
      NProgress.done()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单，直接去
      next()
    } else {
      // 没有访问权限的其他页面被重定向到登录页面。
      next('/login?redirect=index')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})

export const initMenu = (router, menu, to, next) => {
  if (menu.length === 0) {
    next();
  }
  resetRouter(); 

  const menus = formatRoutes(menu);
  // 最后添加
  const unfound = { path: '*', redirect: '/404', hidden: true }
  menus.push(unfound)
  const menuTree = creatNewRouter().options.routes.concat(menus)
  router.options.routes = menuTree
  router.addRoutes(menuTree)
  isRouter = true;
  next({...to, replace: true})
}

export const formatRoutes = (aMenu) => {
  const aRouter = []
  aMenu.forEach(oMenu => {
    const { url, perms, menuName, icon, children} = oMenu;
    const oRouter = {
      path: url,
      component: perms,
      name: menuName,
      meta: { title: menuName, icon: icon},
      icon: icon,
      children: children == null ? [] : formatRoutes(children)
    }
    if (oRouter.component === 'Layout') { //Layout组件特殊处理
      oRouter.component = Layout
    } else {
      oRouter.component = ()=> import(`@/views${oRouter.path}/index`)
    }
    aRouter.push(oRouter)
  })
  return aRouter
}

export const resetState = () => {
  isRouter = false
}
 