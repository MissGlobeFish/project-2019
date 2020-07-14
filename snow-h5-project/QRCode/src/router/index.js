import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import PCpage from '@/components/PCpage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/PCpage',
      name: 'PCpage',
      component: PCpage
    }
  ]
})
