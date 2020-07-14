'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    BASE_URL: '"https://ep.wangxiaobao.com/order/api"',
    K3_URL: '"https://ep.wangxiaobao.com/k3interface"', // k3销售信息
})