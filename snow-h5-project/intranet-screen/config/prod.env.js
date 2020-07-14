var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {//生产环境
  NODE_ENV: '"production"',
  BASE_URL: '"http://snow.source3g.com:15011/intranet/api/"',
  WS_BASE_URL: '"ws://snow.source3g.com:15011/intranet/api/web-socket/"'
})
