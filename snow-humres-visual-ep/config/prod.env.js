var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  K3INTERFACE_URL:'"http://ep.intra.wangxiaobao.com"',
  HUMRES_URL:'"http://ep.intra.wangxiaobao.com"',// http://10.171.37.223:15003
  HUMRES_VISUAL_URL: '"http://ehr.source3g.com"',
  AUTH_VISUAL_URL: '"http://auth.intra.source3g.com"',
  AUTH_URL: '"http://ep-test.intra.wangxiaobao.com"',// http://10.171.37.223:15007
  SALARY_URL: '"http://172.17.17.103:9310/salary/web"',
  SALARY_HUMRES_URL: '"http://10.171.37.223/humres"', // 薪酬人事系统
  SALARY_SOCKET_URL: '"ws://172.17.17.103:9310"',
  SYS_CODE: '"ehr"',
  BI_URL: '"http://snowwebpage.source3g.com/snow-bi/humres/employee.html"'
})
