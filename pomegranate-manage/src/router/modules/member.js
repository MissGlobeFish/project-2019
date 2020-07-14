import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }

export default {
  path: '/pages/member',
  name: 'pages-member',
  meta,
  redirect: { name: 'page-member-index' },
  component: layoutHeaderAside,
  children: (pre => [
    { path: '/index', name: `${pre}index`, component: _import('pages/member/memberManagement/index/index.vue'), meta: { ...meta, title: '会员管理' }},
    { path: 'cardVoucherIssued', name: `${pre}cardVoucherIssued`, component: _import('pages/member/cardVoucherIssued/index/index.vue'), meta: { ...meta, title: '卡券发放' }},
    { path: 'clubCard', name: `${pre}clubCard`, component: _import('pages/member/clubCard/index/index.vue'), meta: { ...meta, title: '会员卡明细' }},
    { path: 'courseDetails', name: `${pre}courseDetails`, component: _import('pages/member/courseDetails/index/index.vue'), meta: { ...meta, title: '课程活动明细' }},
    { path: 'courseRelease', name: `${pre}courseRelease`, component: _import('pages/member/courseRelease/index/index.vue'), meta: { ...meta, title: '课程发布' }},
    { path: 'keynoteSpeaker', name: `${pre}keynoteSpeaker`, component: _import('pages/member/keynoteSpeaker/index/index.vue'), meta: { ...meta, title: '主讲嘉宾' }},
    { path: 'courseSeries', name: `${pre}courseSeries`, component: _import('pages/member/courseSeries/index/index.vue'), meta: { ...meta, title: '课程活动系列' }},
    { path: 'mallManagement', name: `${pre}mallManagement`, component: _import('pages/member/mallManagement/index/index.vue'), meta: { ...meta, title: '商品管理' }},
    { path: 'memberManagement/memberDetails', name: `${pre}memberManagement-page-memberDetails`, component: _import('pages/member/memberManagement/page/memberDetails.vue'), meta: { ...meta, title: '会员详情' } },
    { path: 'transactionQuery', name: `${pre}transactionQuery`, component: _import('pages/member/transactionQuery/index/index.vue'), meta: { ...meta, title: '交易查询' } },
    { path: 'memberAnalysis', name: `${pre}memberAnalysis`, component: _import('pages/member/memberAnalysis/index/index.vue'), meta: { ...meta, title: '会员分析' } },
    { path: 'rebateConfiguration', name: `${pre}rebateConfiguration`, component: _import('pages/member/rebateConfiguration/index/index.vue'), meta: { ...meta, title: '返利配置' } },
    { path: 'memberBenefits', name: `${pre}memberBenefits`, component: _import('pages/member/memberBenefits/index/index.vue'), meta: { ...meta, title: '会员权益' } },
  ])('pages-member-')
}
