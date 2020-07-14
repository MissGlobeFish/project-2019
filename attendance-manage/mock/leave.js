/*
 * @Description: 请假管理
 * @Author: ep
 * @Date: 2019-10-29 15:56:54
 * @LastEditTime: 2019-11-14 10:37:25
 */
import Mock from 'mockjs'

import { leaveList } from './dataCenter.js'


const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    name: '@cname',
    leaveDate: [Mock.mock('@date("yyyy-MM-dd")'),Mock.mock('@date("yyyy-MM-dd")')],
    "leaveDay|0-100": 1,
    // startTime: Mock.mock('@date("yyyy-MM-dd")'),
    // endTime:  Mock.mock('@date("yyyy-MM-dd")'),
    "approver|1": 'leader',
    updateDate: new Date(+Mock.Random.date('T')).getTime(), // 修改日期
    reason: Mock.mock('@cword(5,20)')+'特此申请', //  请假事由
    approvalRemark: Mock.mock('@cword(5,20)'), // 审批意见
    "type|1": ["事假", "年假", "病假", "产假", "哺乳假"], // 请假类型
    "status|1": ["success","wait","reject"], // 审批结果
    "department|1": ["人力行政部","研发部","产品部","销售部"]
  }))
}

export default [
  {
    url: '/leave/list',
    // type: 'get',
    response: config => {
      const { name,type, status, page = 1, limit = 20, isApproval, currentUsr } = config.query
       // 处理搜索逻辑
      const mockList = List

      const realList = leaveList
      
      // 排序
      const sortList = realList.sort(function(a,b){return b.updateDate - a.updateDate}).concat(mockList)
      // 筛选
      const filterList = sortList.filter(item => {
        
        if (type && item.type !== type) return false
        
        if (name && item.name.indexOf(name) < 0) return false
        
        if (status && item.status !== status ) return false 
        
       
        // 我的请假列表 只返回自己的
        // console.log(currentUsr, item.name, item.name !== currentUsr, '比较：', isApproval, !isApproval)
        if (isApproval != "true" && item.name !== currentUsr) return false
       
        // 审批列表
        // leader 只能看到研发部的
        if (isApproval == "true" && currentUsr === 'leader' && item.department !== '研发部') return false
        

        return true
      })

      

      // 分页
      const pageList = filterList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      // console.log(pageList[0])

      return {
        code: 20000,
        data: {
          total: filterList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/leave/create',
    type: 'post',
    response: config => {
      // console.log('新增数据', config.body)
      leaveList.push(config.body)
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/leave/update',
    type: 'post',
    response: config => {
      // console.log('修改数据', config.body)
      var index = leaveList.findIndex( (item) =>{
        return item.id == config.body.id
      })
      if (index != null) {
        leaveList[index] =  config.body
      }
  
      console.log(index)
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
]

