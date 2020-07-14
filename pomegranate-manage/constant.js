
//石榴系统配置路径
global.POMEGRANATE_VISUAL_URL =process.env.POMEGRANATE_VISUAL_URL //前端

//图片上传配置路径
global.UPLOAD_VISUAL_URL = process.env.UPLOAD_VISUAL_URL //前端

var merge = require('webpack-merge')
var prodEnv = require('./dev.env')

module.exports = merge(prodEnv, {//本地开发环境
    NODE_ENV: '"development"',
    POMEGRANATE_VISUAL_URL:'"http://172.16.0.135:8090/pomegranate/web"',
    UPLOAD_VISUAL_URL:'"http://47.104.239.11"',
})

/**
 * 接口api
 */
/* let EnvEnum = {
    dev: 0,
    develop: 1,
    release: 2
  }
  
  //  这里修改环境
  let env = EnvEnum.dev;
  
  
  let host;
  switch (env) {
    case EnvEnum.dev:
      host = "https://ddu.source3g.com/pomegranate/api"
      break;
    case EnvEnum.develop:
      host = "http://172.16.0.135:8080"
      break;
    case EnvEnum.release:
      host = "http://172.16.0.135:8080"
      break;
  }
  
  
  export default {
    host,
    apiPath:{
      fileBaseUrl: 'https://ddu.source3g.com',
      courseSchedule: "/course/schedule",// 首页课时列表
      login: '/authorization/wx', //微信登陆
      checkPhoneNum: '/member/checkPhoneNum',//根据电话查询用户信息
      bindUser: '/member/add',//新用户创建 && 老用户绑定
      memberInfo: '/member/card/find', //会员信息
      teacher: '/teacher', //会员信息
      pointsAmount: '/score',//积分总额
      pointsHistory: '/score/trace',//积分轨迹
      productList: '/product',//商城列表
      memberFind: '/member/find',//个人信息
      memberAdd:'/member/add', //添加个人信息 
      memberUpdate:'/member/update', // 修改个人信息
      ticketUsed:'/ticket/used', // 课程可使用优惠券
      productPay: '/pay/product/order',//商城结算
      ticket: '/ticket', // 我的卡券--券
      cardList:'/member/card/list', // 我的卡券--卡
      order: '/order', // 已报名信息
      courseSign:'/course/sign/in',// 课程签到
      receiveTicket: '/ticket/receive',// 接受赠送的券
      courseFeedback:'/course/feedback', // 评价
      getMemberCard: '/pay/memberCard/order', // 卡密兑换会员
      payUnifiedOrder:'/pay/wx/unified-order', // 微信统一支付接口
    } 
  } */