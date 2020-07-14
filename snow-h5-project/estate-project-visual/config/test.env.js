'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"test"',
    BASE_URL: '"http://dev.source3g.com:15014/order/api"',
})