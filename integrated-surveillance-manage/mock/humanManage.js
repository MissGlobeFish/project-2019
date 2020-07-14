import Mock from 'mockjs'
var List = []
var humanList = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    'deviceName|1': ['1219考勤机', '官方考勤机', '销售考勤机', '餐饮团队考勤机', 'GS12WIFI考勤机', '外勤人员考勤机', '地产团队考勤机'],
    createDate: new Date(Mock.mock('@date("yyyy-MM-dd")')).getTime(),
    updateDate: new Date(Mock.mock('@date("yyyy-MM-dd")')).getTime(), // 修改日期
    'status|1': ['open', 'close'],
    'creator|1': ['HR赵露思', 'HR李嘉琪']
  }))
}

export default [
  {
    url: '/qyWechat/listQyChatUser',
    // type: 'get',
    response: config => {
      const { deviceName, page = 1, limit = 20 } = config.query
      // 处理搜索逻辑
      // mock数据
      const mockList = List.filter(item => {
        if (deviceName && item.deviceName.indexOf(deviceName) < 0) return false
        return true
      })

      // 真实创建数据
      const realList = humanList.filter(item => {
        if (deviceName && item.deviceName.indexOf(deviceName) < 0) return false
        return true
      })

      //  mock+真实数据
      const sortList = realList.sort(function(a, b) { return b.updateDate - a.updateDate }).concat(mockList)
      // 分页
      const pageList = sortList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      // console.log(pageList[0])

      return {
        code: 0,
        data: {
          total: sortList.length,
          items: pageList
        }
      }
    }
  }
]

