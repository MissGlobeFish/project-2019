/**
 * 
 */
import { Platform, Dimensions, PixelRatio } from 'react-native'

//屏幕
global.gScreen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  navBarHeight: Platform.OS === "ios" ? 64 : 50,
  navBarPaddingTop: Platform.OS === "ios" ? 20 : 0,
  onePix: 1 / PixelRatio.get(),
}

//颜色
global.gColors = {
  theme: 'rgb(217, 51, 58)',
  background: '#f5f5f5',
  border: '#d5d5d5',
  healthGreen: 'rgb(142, 213, 7)',
  healthYellow: 'rgb(254, 210, 10)',
  healthRed: 'rgb(251, 25, 8)'
}

//单据状态对应
global.statusMenu = {
  A : '',
  B : '审核中',
  C : '已审核',
  D : '驳回'
}

global.statusColor = {
  A : '#fff',
  B : '#F56323',
  C : '#808080',
  D : '#FF0000'
}

//单据类型
global.formId = {
  expeness: 'ER_ExpReimbursement',//费用报销单
}

//根据单据类型返回相应的 表单 页面
global.getFormPageFromFormId = (formId) => {
  var page = null
  switch (formId) {
    case global.formId.expeness:
      page = 'ClaimingExpenses'
      break;
    default:
      break;
  }
  return page
} 

//根据单据类型返回相应的 审批 页面
global.getDealtPageFromFormId = (formId) => {
  var page = null
  switch (formId) {
    case global.formId.expeness:
      page = 'ClaimingExpensesDealt'
      break;
    default:
      break;
  }
  return page
} 

//消息名
global.NotificationIdentify = {
  loginNotice: "CBG_LOGINACTION",   //登陆标示
  userInfoUpdate: "CBG_USERINFO",   //用户信息更新
  userPortaitDidUpdate: "CBG_USERFACE_UPDATE",  //头像更新
  walletDataRefresh: "CBG_WALLET_REFRESH",      //钱包刷新
  claimingExpensesDetailDidChange: "CBG_EXPENSESDETAIL_CHANGE",    //报销单详情添加修改
  unitSearchDidSelect: "CBG_UNIT_SELECTED",     //往来单位搜索选择
  // dealtResult: "CBG_DEALT_RESULT",
  // claimingExpensessDidSubmit: "CBG_EXPENSES_SUBMIT",
  listPageNeedRefresh: "CBG_LISTPAGE_REFRESH", //列表页通用刷新 （注意： 两级列表页不用同时使用相同标示）

  consolePageNeedRefresh: "CBG_CONSOLEPAGE_REFRESH", //工作台需要刷新

  homePageNewDidFavorited: "CBG_HOMEPAGE_FAVORITE", //详情页点赞首页更新数字
  CommunityQuestionDidDelete: "CBG_COMMUNITY_DELETEQUESTION", //社区删除问题

  fiveViewpointIndexRefresh: "CBG_FIVEVIEWPOINT_REFRESH", //集五福首页状态更新
  fiveViewpointInfoList: "CBG_FIVEVIEWPOINT_INFTLIST", //集五福消息列表更新
}

//基础资料表名 主键
global.BaseDataPath = {
  expenseFeeItermTableName: "T_BD_EXPENSE",
  expenseFeeItermFPK: "FEXPID"
}


// 销量分析权限编码
global.saleAnalyzeAuthorityCode = {
    sale: {
      all: "allArea",//全国区域
      allDept: "allDept",//全国军团
      area: "areaDept",//区域军团
      dept: "deptSaler"//军团销售
    },
    group: {
      all: "allProjectGroup",
      dept: "deptProjectGroup"
    },
    project: {
      saler: "salerProject",
      grop: "ProjectGroupProject",
      deptGroup: "deptProjectGroupProject"
    }

    // allDept 全国军团
    // deptSaler 军团销售
    // salerProject 销售项目
    // allProjectGroup 全国项目组
    // deptProjectGroup 军团项目组
    // ProjectGroupProject 项目组项目
    // deptProjectGroupProject 军团项目组项目
}