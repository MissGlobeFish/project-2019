var merge = require('webpack-merge')
var prodEnv = require('./test.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"testing"',
  K3INTERFACE_URL:'"http://dev.source3g.com:15001"',
  HUMRES_URL:'"http://dev.source3g.com:15003"',
  HUMRES_VISUAL_URL: '"http://ehrtest.source3g.com/humres"',
  AUTH_VISUAL_URL: '"http://ehrtest.source3g.com/auth"',
  AUTH_URL: '"http://ep-test.intra.wangxiaobao.com"',
  SYS_CODE: '"26f06007489445319dad4265836b66be"',
  BI_URL: '"http://ehrtest.source3g.com/bi/humres/employee.html"'
})
