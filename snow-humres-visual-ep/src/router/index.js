import Vue from 'vue';
import Router from 'vue-router';
import store from 'store/store';
import * as types from 'store/types';
import salaryRouter from 'router/salaryRouter.js'
import login from 'router/login.js';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/details',
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/doc',
            meta: {
                requireAuth: true
            },
            component: resolve => require(['../components/page/Doc.vue'], resolve)
        },
        {
            path: '/readme',
            meta: {
                requireAuth: true,
            },
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/details',
                    meta: {
                        requireAuth: true,
                        authority:1
                    },
                    component: resolve => require(['../components/page/Details.vue'], resolve)    // 详情
                },{
                    path: '/self_service',
                    meta: {
                        requireAuth: true,
                        authority:1
                    },
                    component: resolve => require(['../components/page/SelfService.vue'], resolve)    // 详情
                },{
                    path: '/apply_manage',
                    meta: {
                        requireAuth: true,
                        authority:2
                    },
                    component: resolve => require(['../components/page/ApplyManage.vue'], resolve)    // 详情
                },
                {
                    path: '/emp_import',
                    meta: {
                        requireAuth: true,
                        authority:3
                    },
                    component: resolve => require(['../components/page/EmpImport.vue'], resolve)
                },
                {
                    path: '/emp_manage',
                    meta: {
                        requireAuth: true,
                        authority:3
                    },
                    component: resolve => require(['../components/page/EmpManage.vue'], resolve)
                },
                {
                    path: '/dept',
                    meta: {
                        requireAuth: true,
                        authority:3
                    },
                    component: resolve => require(['../components/page/Dept.vue'], resolve)
                },
                {
                    path: '/salary_import',
                    meta: {
                        requireAuth: true,
                        authority:3
                    },
                    component: resolve => require(['../components/page/salaryImport.vue'], resolve)
                },
                {
                    path: '/my_agent',
                    meta: {
                        requireAuth: true,
                        authority:3
                    },
                    component: resolve => require(['../components/page/MyAgent.vue'], resolve)
                },
                {
                    path: '/',
                    meta: {
                        requireAuth: true,
                        authority:1
                    },
                    component: resolve => require(['../components/page/Readme.vue'], resolve)
                },
                {
                    path: '/asset_import',
                    meta: {
                        requireAuth: true,
                        authority:3
                    },
                    component: resolve => require(['../components/page/AssetImport.vue'], resolve)
                },
                {
                    path: '/asset_manage',
                    meta: {
                        requireAuth: true,
                        authority:3
                    },
                    component: resolve => require(['../components/page/AssetManage.vue'], resolve)
                },
                {
                    path: '/photos',
                    meta: {
                        requireAuth: true,
                        authority:3
                    },
                    component: resolve => require(['../components/page/Photo.vue'], resolve)
                },
                {
                    path: '/maindata',
                    meta: {
                        requireAuth: true,
                        authority:3
                    },
                    component: resolve => require(['../components/page/MainDataManage.vue'], resolve)
                },
                {
                    path: '/recruit',
                    meta: {
                        requireAuth: true,
                        authority:3
                    },
                    component: resolve => require(['../components/page/RecruitManage.vue'], resolve)
                },
                {
                  path: '/salary_draw',// 销售提存
                  meta: {
                      requireAuth: true,
                      authority:3
                  },
                  component: resolve => require(['../components/page/SalaryDraw.vue'], resolve)
              },
              {
                path: '/salary_descript',// 销售提存详情页
                meta: {
                    requireAuth: true,
                    authority:3
                },
                component: resolve => require(['../components/page/SalaryDescript.vue'], resolve)
            },
            {
                path: '/candidate',// 候选人
                meta: {
                    requireAuth: true,
                    authority:3
                },
                component: resolve => require(['../components/page/Candidate.vue'], resolve)
            },
            {
                path: '/job_vacancy',// 招聘职位
                meta: {
                    requireAuth: true,
                    authority:3
                },
                component: resolve => require(['../components/page/JobVacancy.vue'], resolve)
            },
            {
                path: '/interview_schedule',// 面试日程
                meta: {
                    requireAuth: true,
                    authority:3
                },
                component: resolve => require(['../components/page/Interview/InterviewSchedule.vue'], resolve)
            },
            {
                path: '/talents_database',// 人才库
                meta: {
                    requireAuth: true,
                    authority:3
                },
                component: resolve => require(['../components/page/Interview/TalentsDatabase.vue'], resolve)
            },
            {
              path: '/employee_trail',// 员工轨迹
              meta: {
                  requireAuth: true,
                  authority:3
              },
              component: resolve => require(['../components/page/EmployeeTrail.vue'], resolve)
            },
            ...salaryRouter
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    login();
    next();
});

export default router;
