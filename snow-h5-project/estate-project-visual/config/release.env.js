'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"release"',
  BASE_URL: '"https://ep.wangxiaobao.com/order/api"'
})
