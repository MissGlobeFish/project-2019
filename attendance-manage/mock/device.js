/*
 * @Description: 设备管理
 * @Author: ep
 * @Date: 2019-10-29 15:56:54
 * @LastEditTime: 2019-11-14 20:35:17
 */
import Mock from 'mockjs'


var List = []
var deviceList = []
const count = 6

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    "deviceName|1":["1219考勤机", "官方考勤机","销售考勤机","餐饮团队考勤机","GS12WIFI考勤机","外勤人员考勤机","地产团队考勤机"],
    createDate: new Date(Mock.mock('@date("yyyy-MM-dd")')).getTime(),
    updateDate: new Date(Mock.mock('@date("yyyy-MM-dd")')).getTime(), // 修改日期
    "status|1": ["open","close"], 
    "creator|1": ["HR赵露思","HR李嘉琪"]
  }))
}

export default [
  {
    url: '/device/list',
    // type: 'get',
    response: config => {
      const { deviceName,type, status, page = 1, limit = 20, isApproval, currentUsr } = config.query
       // 处理搜索逻辑
       // mock数据
       const mockList = List.filter(item => {
        if (deviceName && item.deviceName.indexOf(deviceName) < 0) return false
        return true
      })

      // 真实创建数据
      const realList = deviceList.filter(item => {
        if (deviceName && item.deviceName.indexOf(deviceName) < 0) return false
        return true
      })

      //  mock+真实数据
      const sortList = realList.sort(function(a,b){return b.updateDate - a.updateDate}).concat(mockList)
      // 分页
      const pageList = sortList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      // console.log(pageList[0])

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
    url: '/device/create',
    type: 'post',
    response: config => {
      // console.log('新增数据', config.body)
      deviceList.push(config.body)
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/device/update',
    type: 'post',
    response: config => {
      // console.log('修改数据', config.body)
      var index = deviceList.findIndex( (item) =>{
        return item.id == config.body.id
      })
      if (index != null) {
        deviceList[index] =  config.body
      }
  
      console.log(index)
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/device/delete',
    type: 'delete',
    response: config => {
      var deviceIndex = deviceList.findIndex( (item) =>{
        return item.id == config.body.id
      })
      if (deviceIndex != -1) {
        deviceList.splice( deviceIndex, 1)
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
  },
]

