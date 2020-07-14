var merge = require('webpack-merge')
var prodEnv = require('./develop.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  K3INTERFACE_URL:'"http://dev.source3g.com:15001"',
  HUMRES_URL:'"http://172.17.17.53:15003/humres"',
  HUMRES_VISUAL_URL: '"http://epdev.wangxiaobao.com/humres"',
  AUTH_VISUAL_URL:'"http://epdev.wangxiaobao.com/auth"',
  AUTH_URL: '"http://ep-test.intra.wangxiaobao.com"',
  SYS_CODE: '"22a7b099b4074860a41b2989cdc2113f"',
  BI_URL: '"http://ehrtest.source3g.com/bi/humres/employee.html"'
})
