var merge = require('webpack-merge')
var prodEnv = require('./dev.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"http://172.17.17.53:15005/intranet/api/"',
  WS_BASE_URL: '"ws://172.17.17.53:15005/intranet/api/web-socket/"'
})
