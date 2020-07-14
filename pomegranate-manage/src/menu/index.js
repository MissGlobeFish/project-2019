import memberManagement from './modules/member'

// 菜单 侧边栏
export const menuAside = [
  memberManagement
]

// 菜单 顶栏
export const menuHeader = [
  {
    path: '/index',
    title: '会员管理',
    icon: 'user',
    children: [
      { path: '/index', title: '会员管理' ,icon: 'user-o'},
      { path: `/pages/member/memberBenefits`, title: '会员权益' ,icon: 'th-large'}
    ]
  },{
    path: '/pages/member/mallManagement',
    title: '商城管理',
    icon: 'cube',
    children: [
      { path: `/pages/member/mallManagement`, title: '商品管理' ,icon: 'shopping-cart'},
      { path: `/pages/member/transactionQuery`, title: '交易管理' ,icon: 'money'}
    ]
  },{
    path: `/pages/member/courseRelease`,
    title: '课程活动管理',
    icon: 'users',
    children: [
      { path: `/pages/member/courseRelease`, title: '课程发布' ,icon: 'folder-open-o'},
      { path: `/pages/member/keynoteSpeaker`, title: '主讲嘉宾' ,icon: 'street-view'},
      { path: `/pages/member/courseSeries`, title: '课程活动系列' ,icon: 'newspaper-o'},
    ]
  },{
    path: `/pages/member/cardVoucherIssued`,
    title: '福利管理',
    icon: 'gift',
    children: [
      { path: `/pages/member/cardVoucherIssued`, title: '卡券发放' ,icon: 'send-o'}
    ]
  },{
    path: `/pages/member/rebateConfiguration`,
    title: '推荐返利',
    icon: 'truck',
    children: [
      { path: `/pages/member/rebateConfiguration`, title: '返利配置' ,icon: 'cny'}
    ]
  },/* {
    path: `/pages/member/memberAnalysis`,
    title: '数据分析',
    icon: 'line-chart',
    children: [
      { path: `/pages/member/memberAnalysis`, title: '会员分析' ,icon: 'area-chart'}
    ]
  } */
]
