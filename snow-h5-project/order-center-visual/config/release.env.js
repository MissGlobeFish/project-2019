'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"release"',
  ERP_API_URL:'"http://erp-api.wangxiaobao.com/erp-api"',
  SNOW_TRANS_URL:'"http://erp-api.wangxiaobao.com/erp-api/snow/trans"',
  OrderCenter_URL:'"https://ep.wangxiaobao.com/order-old"',
  EHR_URL: '"http://ep.intra.wangxiaobao.com/humres"',
  SALES_URL: '"http://ep.wangxiaobao.com/sales"'
})
