/*
 * @Description: 考勤计划
 * @Author: ep
 * @Date: 2019-10-29 15:56:54
 * @LastEditTime: 2019-11-15 10:12:03
 */
import Mock from 'mockjs'

import { planList, reviewList } from './dataCenter.js'


const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    title: '@cname @integer(1, 12) 月份排班计划',
    'type|1': ['month', 'week'], // 月排班计划，周排班计划 对应行政班与倒班机制
    'status|1': ['published', 'draft', 'invalid'], // 进行中，未开始 已过期
    creator: '管理员',
    planUsrs: ['GS0187', 'GS0187', 'GS0449', 'GS0647', 'GS0459', 'GS0382'],
    updateDate: new Date(+Mock.Random.date('T')).getTime(),
    dateForm: {
      dateRange: [+Mock.Random.date('T'), +Mock.Random.date('T')],
      month: {
        startTime: '09:00',
        endTime: '17:00',
      },
      week:[
        {title: "周一",startTime: Mock.Random.time('HH:mm'), endTime: Mock.Random.time('HH:mm')},
        {title: "周二",startTime: Mock.Random.time('HH:mm'), endTime: Mock.Random.time('HH:mm')},
        {title: "周三",startTime: Mock.Random.time('HH:mm'), endTime: Mock.Random.time('HH:mm')},
        {title: "周四",startTime: Mock.Random.time('HH:mm'), endTime: Mock.Random.time('HH:mm')},
        {title: "周五",startTime: Mock.Random.time('HH:mm'), endTime: Mock.Random.time('HH:mm')},
        {title: "周六",startTime: Mock.Random.time('HH:mm'), endTime: Mock.Random.time('HH:mm')},
        {title: "周日",startTime: Mock.Random.time('HH:mm'), endTime: Mock.Random.time('HH:mm')}
      ]
    },
    'planUsrs|1-10': ['GS0187', 'GS0187', 'GS0449', 'GS0647', 'GS0459', 'GS0382']
  }))
}

export default [
  {
    url: '/plan/list',
    type: 'get',
    response: config => {
      const { importance, type, title, status, page = 1, limit = 20 } = config.query

      // const mockList = []

      // 处理搜索逻辑
      const mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        if (status && item.status !== status ) return false 
        return true
      })

      const realList = planList.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false 
        if (status && item.status !== status ) return false 
        return true
      })
      
      const sortList = realList.sort(function(a,b){return b.updateDate - a.updateDate}).concat(mockList)
      const pageList = sortList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      console.log(pageList[0])

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
      // console.log('新增数据', config.body)
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
      // console.log('修改数据', config.body)
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
      // console.log('修改状态', config.body)
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
          updateDate: new Date().getTime(),
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
  },
  {
    url: '/plan/delete',
    type: 'delete',
    response: config => {
      var planIndex = planList.findIndex( (item) =>{
        return item.id == config.body.id
      })
      if (planIndex != -1) {
        planList.splice( planIndex, 1)
      } 

      var planListIndex = List.findIndex( (item) =>{
        return item.id == config.body.id
      })
      if (planListIndex != -1) {
        List.splice( planListIndex, 1)
      } 
      // deviceList.findIndex( (item, index) =>{
      //   console.log(item.id , config.body.id)
      //   if (item.id == config.body.id) {
      //     deviceList.splice(index, 1)
      //   }
      // })
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

