import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import Setup from '@/pages/Setup'
import Indent from '@/pages/Indent'
import Amend from '@/pages/Amend'

Vue.use(Router)

export default new Router({
  routes: [
    {
		path: '/',
		name: 'Index',
		component: Index
    },
    {
		path: '/setup',
		name: 'Setup',
		component: Setup
    },
    {
		path: '/indent',
		name: 'Indent',
		component: Indent
    },
    {
		path: '/amend',
		name: 'Amend',
		component: Amend
    }
  ]
})
