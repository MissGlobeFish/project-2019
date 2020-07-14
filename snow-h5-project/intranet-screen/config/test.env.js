var merge = require('webpack-merge')
var prodEnv = require('./test.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"http://dev.source3g.com:15009/intranet/api/"',
  WS_BASE_URL: '"ws://dev.source3g.com:15009/intranet/api/web-socket/"'
})
