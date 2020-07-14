import Vue from 'vue'
import Router from 'vue-router'
import ProjectSearchPage from '@/page/ProjectSearchPage'
import ProjectInfoPage from '@/page/ProjectInfoPage'

import InstallRecordPage from '@/page/InstallRecordPage'
import ServiceRecordPage from '@/page/ServiceRecordPage'
import ChangeRecordPage from '@/page/ChangeRecordPage'
import PointInfoPage from '@/page/PointInfoPage'


// 销售信息路由
import SalesInfoPage from '@/page/salesPage/SalesInfoPage'
Vue.use(Router)



Router.prototype.goBack = function() {
    this.routerStats = "pop"
    window.history.go(-1)
}



Router.prototype.gspush = function(location) {
    this.routerStats = "push"
    this.push(location);
}


export default new Router({
    routes: [{
            path: '/',
            name: 'ProjectSearchPage',
            component: ProjectSearchPage
        },
        // {
        //     path: '/',
        //     name: 'SalesInfoPage',
        //     component: SalesInfoPage
        // },
        {
            path: '/ProjectInfoPage',
            name: "ProjectInfoPage",
            component: ProjectInfoPage
        },
        {
            path: '/InstallRecordPage',
            name: "InstallRecordPage",
            component: InstallRecordPage
        },
        {
            path: '/ServiceRecordPage',
            name: "ServiceRecordPage",
            component: ServiceRecordPage
        },
        {
            path: '/ChangeRecordPage',
            name: "ChangeRecordPage",
            component: ChangeRecordPage
        },
        {
            path: '/PointInfoPage',
            name: "PointInfoPage",
            component: PointInfoPage
        },
        {
            path: '/SalesInfoPage',
            name: "SalesInfoPage",
            component: SalesInfoPage
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }

})