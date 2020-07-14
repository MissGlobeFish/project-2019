'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ERP_API_URL:'"http://test.source3g.com:8889/erp-api"'
})
