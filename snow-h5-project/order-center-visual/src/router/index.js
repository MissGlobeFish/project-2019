import Vue from 'vue'
import Router from 'vue-router'
import TestHomePage from '@/page/TestHomePage'
import EstateOrder from '@/page/EstateOrder'
import SelectProducts from '@/page/ProductSelectPage'
import CustomSearch from '@/page/CustomSearch'
import SolutionList from '@/page/SolutionList'
import SolutionDetail from '@/page/SolutionDetail'
import CurrySolutionEdit from '@/page/CurrySolutionEdit'
import ProductPage from '@/page/ProductPage'

Vue.use(Router)



Router.prototype.goBack = function () {
  this.routerStats = "pop"
  window.history.go(-1)
}



Router.prototype.gspush = function (location) {
  this.routerStats = "push"
  this.push(location);
}


export default new Router({
  routes: [
    {
      path: '/TestHomePage',
      name: 'TestHomePage',
      component: TestHomePage
    },
    {
    	path:'/EstateOrder',
    	name:"EstateOrder",
    	component:EstateOrder
    },
    {
      path:'/selectProducts',
      name:'SelectProducts',
      component:SelectProducts
    },
    {
      path:'/customSearch',
      name:'CustomSearch',
      component:CustomSearch
    },
    {
      path:'/SolutionList',
      name:'SolutionList',
      component:SolutionList
    },
    {
      path:'/SolutionDetail',
      name:'SolutionDetail',
      component:SolutionDetail
    },
    {
      path:'/CurrySolutionEdit',
      name:'CurrySolutionEdit',
      component:CurrySolutionEdit
    },
    {
      path:'/ProductPage',
      name:'ProductPage',
      component:ProductPage
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }

})


