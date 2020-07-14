import Vue from 'vue'
import Router from 'vue-router'
import UploadPortraitView from '@/components/UploadPortraitView'
import PCpage from '@/components/PCpage'
import SuccessPage from '@/components/SuccessPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'UploadPortraitView',
      component: UploadPortraitView
    },
    {
      path: '/PCpage',
      name: 'PCpage',
      component: PCpage
    },
    {
      path: '/SuccessPage',
      name: 'SuccessPage',
      component: SuccessPage
    }
  ]
})
