import Vue from 'vue'
import Router from 'vue-router'
import ShareIndex from '@/components/ShareIndex'
import ShareMyCards from '@/components/ShareMyCards'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ShareIndex',
      component: ShareIndex
    },
    {
      path: '/ShareMyCards',
      name: 'ShareMyCards',
      component: ShareMyCards
    }
  ]
})
