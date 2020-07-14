var merge = require('webpack-merge')
var prodEnv = require('./release.env')

module.exports = merge(prodEnv, {//预发布环境
    NODE_ENV: '"release"',
  BASE_URL: '"http://snow.source3g.com:15011/intranet/api/"',
  WS_BASE_URL: '"ws://snow.source3g.com:15011/intranet/api/web-socket/"'
})
