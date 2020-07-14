/**
 * api接口归类
 * 
 */

var EnvEnum = {
  dev: 0,
  test: 1,
  release: 2
};


// 👇 这里修改环境
var env = EnvEnum.release


// 开发
var auth = 'http://ep.wangxiaobao.com/auth/sso/login';
var baseUrl = 'https://develop.source3g.com/rnmanage';
let prefix = '/api/';
var wsUrl = 'ws://172.17.17.53:15005/intranet/api/web-socket/';
var snowGetway = 'http://172.17.17.53:15000/';
var erpBaseUrl = 'http://test.source3g.com:8889/erp-api';
var snowWebPage = 'http://ep-web.intra.wangxiaobao.com/h5/';

//变量值
var systemCode = '11b7ad7d4b554046a3579d99a98cd728'

switch (env) {
  case EnvEnum.dev:
    auth = '';
    baseUrl = 'https://develop.source3g.com/rnmanage';
    wsUrl = 'ws://172.17.17.53:15005/intranet/api/web-socket/';
    // wsUrl = 'ws://192.168.100.135:9100/intranet/api/web-socket/';
    erpBaseUrl = 'http://test.source3g.com:8889/erp-api';
    snowWebPage = 'http://ep-web.intra.wangxiaobao.com/h5/';
    snowGetway = 'http://172.17.17.53:15000/';

    systemCode = '11b7ad7d4b554046a3579d99a98cd728';
    break;

  case EnvEnum.test:
    auth = '';
    baseUrl = 'https://crmrn-test-c.wangxiaobao.co/rnmanage';
    // wsUrl = 'ws://dev.source3g.com:15009/intranet/api/web-socket/';
    erpBaseUrl = 'http://test.source3g.com:8889/erp-api';
    snowWebPage = 'http://ep-web.intra.wangxiaobao.com/h5/';
    snowGetway = 'http://dev.source3g.com:15000/';

    systemCode = '9df0cea54cf440b2a33e477ab4fbe528';
    break;

  case EnvEnum.release:
    auth = 'http://ep.wangxiaobao.com'
    baseUrl = 'https://ep.wangxiaobao.com/intranet';
    // wsUrl = 'ws://snow.source3g.com:15011/intranet/api/web-socket/';
    erpBaseUrl = 'http://erp-api.wangxiaobao.com/erp-api';
    snowWebPage = 'http://snowwebpage.source3g.com/';
    snowGetway = 'https://ep.wangxiaobao.com/';
    //snowGetway = 'http://172.16.0.104:8082/';
    testUrl = "https://ep.wangxiaobao.com/intranet/api/"
    //"http://172.16.0.69:9100/intranet/api/"
    
    

    systemCode = 'e8392b82be2d4500ab6bd5a20a98f320';
    break;

  default:
    break;
}


export default {


  // 环境变量
  'systemCode': systemCode,



  /** 
   *  通用接口
   */
  //获取 组织 && 部门 列表
  'dept&org': `${baseUrl}${prefix}erp/base/dept-or-org`,
  //基础枚举
  'comboList': `${baseUrl}${prefix}erp/base/assistant/combo`,
  //基础数据
  'baseData': `${baseUrl}${prefix}erp/base/data`,



  /** 
   * WebSocket
   * */
  'ws': wsUrl,


  /** 
   *  首页
   */
  // 全局搜索
  'search': `${baseUrl}${prefix}search`,
  // 新闻
  'news': `${baseUrl}${prefix}news`,
  // banner
  'banner': `${baseUrl}${prefix}banner`,
  // 搜索详情
  'consult': `${baseUrl}${prefix}consult`,
  // 首页
  'consult-list': `${baseUrl}${prefix}consult-list`,
  // 未读消息
  'unread-message-count': `${baseUrl}${prefix}unread-message-count`,
  // 操作已读
  'read-msg': `${baseUrl}${prefix}read-msg`,
  //用户资料
  'user': `${baseUrl}${prefix}user`,
  // 点赞
  'favorite': `${baseUrl}${prefix}favorite`,
  // 登录
  'login': `${auth}/auth/sso/login`,
  // ranking 地产排行
  'ranking': `${baseUrl}${prefix}top-sales/real-estate`,// 地产排行榜前三
  // ranking 地产排行详情
  'ranking-details': `${baseUrl}${prefix}top-sales/real-estate/details`,// 地产排行榜详情
  // ranking 餐饮排行
  'catering-ranking': `${baseUrl}${prefix}top-sales/catering`,// 餐饮排行榜前三
  // ranking 餐饮排行详情
  'catering-ranking-details': `${baseUrl}${prefix}top-sales/catering/details`,// 餐饮排行榜详情
  // 消息列表
  'message': `${baseUrl}${prefix}/message`,

  // 消息列表
  'message': `${baseUrl}${prefix}message`,

  // 设备详情
  'equipment-info': `${baseUrl}${prefix}equipment-info`,

  // 发送验证码
  'user/msg-code': `${baseUrl}${prefix}user/msg-code`,
  // 验证验证码
  'user/verify-code': `${baseUrl}${prefix}user/verify-code`,
  // 查询薪资
  '/user/payroll': `${baseUrl}${prefix}user/payroll`,
  // 查询图书
  'book': `${baseUrl}${prefix}book`,

  //文件上传
  'fileUpload': `${erpBaseUrl}/erp/file/oss/upload`,


  /** 
   * 人脸识别
  */

  //人脸录入信息查询 GET
  'user/face': `${baseUrl}${prefix}user/face`,//`http://172.17.17.53:15005/intranet/api/user/face`,//
  //人脸录入 POST
  'user/face/add': `${baseUrl}${prefix}user/face/add`,//`http://172.17.17.53:15005/intranet/api/user/face/add`,//
  //人脸更新 POST 
  'user/face/update': `${baseUrl}${prefix}user/face/update`,//`http://172.17.17.53:15005/intranet/api/user/face/update`,//

  /** 
   * 黑马下注
  */
  // 获取黑马分组轮次列表
  'program/match-teams': `${baseUrl}${prefix}program/match-teams`,
  'program/bet-result': `${baseUrl}${prefix}program/bet-result`,

  /** 
   * 钱包
   */
  'wallet/open': `${baseUrl}${prefix}wallet/open`,
  'wallet': `${baseUrl}${prefix}wallet`,
  'wallet/details': `${baseUrl}${prefix}wallet/details`,
  //充值
  'wx/unified-order': `${baseUrl}${prefix}wx/unified-order`,
  //提现
  'wx/transfers': `${baseUrl}${prefix}wx/transfers`,
  'wallet/authorization-wechat': `${baseUrl}${prefix}wallet/authorization-wechat`,


  // --
  'program/bet-result': `${baseUrl}${prefix}program/bet-result`,
  // 投注
  'program/bet': `${baseUrl}${prefix}program/bet`,
  //投注结果查询
  'program/result': `${baseUrl}${prefix}program/result`,


  //我发起的--获取发起人为当前用户的单据列表
  'workRecord/list': `${baseUrl}${prefix}workRecord/list`,
  //待办--待办单据列表
  'process/list': `${baseUrl}${prefix}process/list`,
  //待办--待办单据意见详情
  'process/submit': `${baseUrl}${prefix}process/submit`,




  /** 
   *  费用报销单
   */
  'expensessList': `${baseUrl}${prefix}erp/cost`,
  'unitSearch': `${baseUrl}${prefix}erp/unit`,
  'expensesSubmit': `${baseUrl}${prefix}erp/cost`,
  'expensess': `${baseUrl}${prefix}erp/cost/detail`,

  // 未读消息
  'base/unread-notice-count': `${baseUrl}${prefix}base/unread-notice-count`,

  /**
   *  小宝社区
   */
  'problemList': `${baseUrl}${prefix}interlocution/problem`,

  // 年会抽奖
  'lottery': `${baseUrl}${prefix}lottery`,
  // 'lottery': `http://192.168.100.135:9100/intranet/api/lottery`
  'newProblem': `${baseUrl}${prefix}interlocution/problem`,
  'getAnswer': `${baseUrl}${prefix}interlocution/answer`,
  'newAnswer': `${baseUrl}${prefix}interlocution/answer`,
  'deleteProblem': `${baseUrl}${prefix}interlocution/problem`,



  //前端 H5 页面
  'EstatProjectInfo': `${snowWebPage}estate-project-visual/#/`,


  /**
   *  销量分析
   */

  'saleAnalyzeAuthority': `${snowGetway}sales/relation`, 

  'saleAnalyzePieIndex': `${snowGetway}k3interface/salesAnalysis/pieChart/data`,
  'saleAnalyzeIndexList': `${snowGetway}k3interface/salesAnalysis/index/list`,  
  'saleAnalyzeMainData': `${snowGetway}k3interface/salesAnalysis/data`, 
  'saleAnalyzeIndexDetailData': `${snowGetway}k3interface/salesAnalysis/project/data`,
  'saleAnalyzelineChart': `${snowGetway}k3interface/salesAnalysis/lineChart`,


  /**
  * 提成
  */
  'saleEstateCommissionRate': `${snowGetway}pay/commission/mobile/rate`,
  'saleEstateCommissionList': `${snowGetway}pay/commission/mobile/list`,
  'saleEstateCommissionDetail': `${snowGetway}pay/commission/mobile/detail`,
  'saleEstateCommissionDeductDetail': `${snowGetway}pay/commission/mobile/deduct/detail`,
  'saleEstateCommissionUNDetail': `${snowGetway}pay/commission/mobile/un/detail`,
  /**
  * 回款
  */
  'AafterSaleBackToArticleList': `${snowGetway}pay/commission/mobile/install`,


  /**
   *  薪酬
   */
  'salaryPerformance': `${snowGetway}salary/api/performance`,

  
  /**
   *  集五福
   */
  //首页
  'collectSharkItOff': `${testUrl}collect/shake`,
  'collectMergeRanking': `${testUrl}collect/merge/ranking`,
  //答题页
  'questionsAndAnswers': `${testUrl}questions`,
  'submitAnswers': `${testUrl}questions/save-card`,
  //排行榜
  'cardsRanking': `${testUrl}cards/ranking`,
  //消息列表
  'myMessageList': `${testUrl}cards/my-ask-list`,
  'giveCard': `${testUrl}cards/give`,
  //我的五观
  'getMyCardsData': `${testUrl}cards/my`,  
  'collectMergeMyCards': `${testUrl}/collect/merge`,  //合成
  // 摇一摇收下五观卡&现金
  'collectCard': `${testUrl}collect/card`,
  // 活动状态
  "collectActiveStatus": `${testUrl}collect/active-status`,
  // 答题收下五观卡&现金
  "questionsSaveCard": `${testUrl}questions/save-card`,
  // 请求赐卡
  "cardsAskFor": `${testUrl}cards/ask-for`,

  /**
   *  人员搜索
   */
  "humenSearch": `${testUrl}user/search`

};
