/**
 * 接口api
 */
let EnvEnum = {
  dev: 0,
  develop: 1,
  release: 2
} 

// 👇 这里修改环境
let env = EnvEnum.release;


let host;
switch (env) {
  case EnvEnum.dev:
    host = "https://16ddu.com/pomegranate/api"
    //"http://192.168.144.126:8080/pomegranate/api"
    
   
    break;
  case EnvEnum.develop:
    host = "https://16ddu.com/pomegranate/api"
    break;
  case EnvEnum.release:
    host = "https://16ddu.com/pomegranate/api"
    break;
}


export default {
  host,
  apiPath:{
    fileBaseUrl: 'https://16ddu.com',
    courseSchedule: "/course/schedule",// 首页课时列表
    login: '/authorization/wx', //微信登陆
    checkPhoneNum: '/member/checkPhoneNum',//根据电话查询用户信息
    bindUser: '/member/add',//新用户创建 && 老用户绑定
    memberCardInfo: '/member/card', //会员卡信息
    memberInfo: '/member/card/find', //会员信息
    memberPrice: '/member/card/rebate', //获取会员结算优惠
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
    ticketCheck:'/ticket/check',//赠送卡券状态检查
    receiveTicket: '/ticket/receive',// 接受赠送的券
    courseFeedback:'/course/feedback', // 评价
    getMemberCard: '/pay/memberCard/order', // 卡密兑换会员
    payUnifiedOrder:'/pay/wx/unified-order', // 微信统一支付接口
    verifyCode: '/authorization/get-verify-code', // 获取验证码
    checkVerifyCode: '/authorization/verify-code', // 校验证码
    courseAuthority:'/course/authority', // 会员权益价格
  } 
}