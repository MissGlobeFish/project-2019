var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

/* module.exports = merge(prodEnv, {//开发
  NODE_ENV: '"development"',
  HUMRES_URL:'"http://192.168.100.76:8080"',
  ERPAPI_URL:'"http://192.168.100.76:8083"'
}) */

/* module.exports = merge(prodEnv, {//测试
  NODE_ENV: '"development"',
  HUMRES_URL:'"http://ep-test.intra.wangxiaobao.com"',
  ERPAPI_URL:'"http://erp-api-test.wangxiaobao.com"'
}) */

module.exports = merge(prodEnv, {//正式
  NODE_ENV: '"development"',
  HUMRES_URL:'"http://ep.intra.wangxiaobao.com"',
  ERPAPI_URL:'"http://erp-api.wangxiaobao.com"'
})
