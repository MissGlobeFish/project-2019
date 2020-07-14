import Mock from 'mockjs'

import { planList, reviewList } from './dataCenter.js'

const List = []
const count = 12

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    title: '@cname @integer(1, 12) 月份绩效计划',
    'type|1': ['KPI', 'OKR'],
    'status|1': [1, 2, 3, 4, 5, 6],
    creator: '管理员',
    updateDate: +Mock.Random.date('T'),
    okrInf: {
      okrIterms: [{
        des: '@csentence()',
        'selfRate|0-10.1-10': 1,
        'leaderRate|0-10.1-10': 1
      }]
    },
    kpiInfo: {
      kpiIterms: [{
        des: '@csentence()',
        'tag|1': ['工作', '公司'],
        'selfRate|0-10.1-10': 1,
        'leaderRate|0-10.1-10': 1
      }]
    }
  }))
}



function reviewCompleteHandel(planId) {
  var index = planList.findIndex( (item) =>{
    return item.id == planId
  })
  if (index != -1) {
    planList[index].completeNumber += 1
  }
}

export default [
  {
    url: '/review/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20 } = config.query
      console.log(reviewList)
      const mockList = reviewList.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/review/update',
    type: 'post',
    response: config => {
      console.log('修改数据', config.body)
      var index = reviewList.findIndex( (item) =>{
        return item.id == config.body.id
      })
      if (config.body.status == 3) {
        // 如果是进行中状态自动跳过
        config.body.status += 1
        config.body.currentRole = 'employee'
      }
      if (index != -1) {
        reviewList[index] =  config.body
      }

      // 同步完成状态
      if (config.body.status == 6) {
        var planId = config.body.planId
        reviewCompleteHandel(planId)
      }
      
      


      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

