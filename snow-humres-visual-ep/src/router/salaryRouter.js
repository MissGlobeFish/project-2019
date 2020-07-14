export default [
    {
        path: '/salaryTemplate',
        meta: {
            requireAuth: true,
            authority:1
        },
        component: resolve => require(['../components/page/SalaryPage/SalaryTemplate.vue'], resolve)    // 输入模板 
    },
    {
        path: '/calculationTemp',
        meta: {
            requireAuth: true,
            authority:1
        },
        component: resolve => require(['../components/page/SalaryPage/CalculationTemp/CalculationTemp.vue'], resolve)    // 计算模板维护 
    },
    {
        path: '/salaryTrial',
        meta: {
            requireAuth: true,
            authority:1
        },
        component: resolve => require(['../components/page/SalaryPage/SalaryTrial/SalaryTrial.vue'], resolve)    // 薪酬试算 
    },
    {
        path: '/salaryResult',
        meta: {
            requireAuth: true,
            authority:1
        },
        component: resolve => require(['../components/page/SalaryPage/SalaryResult/SalaryResult.vue'], resolve)    // 薪酬结果表 
    },
    {
      path: '/performance',
      meta: {
          requireAuth: true,
          authority:1
      },
      component: resolve => require(['../components/page/SalaryPage/Performance/Performance.vue'], resolve)    // 薪酬结果表 
  }
]