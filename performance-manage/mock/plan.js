/*
 * @Description: 
 * @Author: rcq
 * @Date: 2019-10-29 15:56:54
 * @LastEditTime: 2019-10-29 18:32:47
 */
import Mock from 'mockjs'

import { planList, reviewList } from './dataCenter.js'

// var planList = []

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    title: '@cname @integer(1, 12) 月份绩效计划',
    'type|1': ['KPI', 'OKR'],
    'status|1': ['published', 'draft', 'deleted'],
    creator: '管理员',
    updateDate: +Mock.Random.date('T'),
    planUsrs: ['GS0187', 'GS0187', 'GS0449', 'GS0647', 'GS0459', 'GS0382'],
    userNumber: 6,
    completeNumber: 1,
    okrInf: {
      dateRange: [+Mock.Random.date('T'), +Mock.Random.date('T')],
      reviewDate: +Mock.Random.date('T'),
      submitDate: +Mock.Random.date('T')
    },
    kpiInfo: {
      kpiIterms: [{
        des: '@csentence()',
        'tag|1': ['工作', '公司']
      }]
    }
  }))
}

export default [
  {
    url: '/plan/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20 } = config.query

      const mockList = []
      // List.filter(item => {
      //   if (importance && item.importance !== +importance) return false
      //   if (type && item.type !== type) return false
      //   if (title && item.title.indexOf(title) < 0) return false
      //   return true
      // })

      const realList = planList.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })


      const sortList = mockList.concat(realList).reverse() //.sort(function(a,b){return b.updateDate - a.updateDate});
      const pageList = sortList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: sortList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/plan/create',
    type: 'post',
    response: config => {
      console.log('新增数据', config.body)
      planList.push(config.body)
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/plan/update',
    type: 'post',
    response: config => {
      console.log('修改数据', config.body)
      var index = planList.findIndex( (item) =>{
        return item.id == config.body.id
      })
      if (index != null) {
        planList[index] =  config.body
      }
  
      console.log(index)
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  //改变状态时 会下发审核任务
  {
    url:'/plan/changeStatus',
    type: 'post',
    response: config => {
      console.log('修改状态', config.body)
      var planId = config.body.id
      var status = config.body.status

      var index = planList.findIndex( (item) =>{
        return item.id == planId
      })
      if (index == -1) {
        return {
          code: 50000,
          data: '下发失败'
        }
      }
      //改变 plan 列表状态
      planList[index].status = status

      if (status === 'published') {
        //分配
        var reviewInfo = {
          id: parseInt(Math.random() * 100) + 1024,
          title: planList[index].title,
          type: planList[index].type,
          planId: planId,
          currentRole: 'employee',
          status: planList[index].type === 'KPI' ? 4 : 1,
          updateDate: new Date(),
          okrInf: {
            okrIterms: []
          },
          kpiInfo: {
            kpiIterms: planList[index].kpiInfo.kpiIterms
          }
        }
        reviewList.push(reviewInfo)
      } else if (status === 'draft') {
        //取消分配
        var reviewIndex = reviewList.findIndex( (item) =>{
          return item.planId == planId
        })
        if (reviewIndex != -1) {
          reviewList.splice( reviewIndex, 1)
        } 
      }


      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

