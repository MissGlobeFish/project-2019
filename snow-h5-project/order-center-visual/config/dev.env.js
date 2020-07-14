'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"developing"',
  ERP_API_URL:'"http://erp-api-test.wangxiaobao.com/erp-api"',
  SNOW_TRANS_URL:'"http://erp-api-test.wangxiaobao.com/erp-api/snow/trans"',
  OrderCenter_URL: '"http://ep-test.intra.wangxiaobao.com/order"',
  EHR_URL: '"http://ep-test.intra.wangxiaobao.com/humres"',
  SALES_URL: '"http://ep.wangxiaobao.com/sales"'
})
