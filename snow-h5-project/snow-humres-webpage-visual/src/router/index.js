import Vue from 'vue'
import Router from 'vue-router'
import Start from '../components/page/Start'
import Index from '../components/page/Index'
import Succeed from '../components/page/Succeed'
import Preview from '../components/page/Preview'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'start',
      component: Start
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    },
    {
      path: '/succeed',
      name: 'succeed',
      component: Succeed
    },
    {
      path: '/preview',
      name: 'preview',
      component: Preview
    }
  ]
})
