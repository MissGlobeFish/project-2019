/*
 * @Description: 
 * @Author: rcq
 * @Date: 2019-09-09 12:34:01
 * @LastEditTime: 2019-09-17 14:51:56
 */
const auth = {
  "login": "/auth/sso/login", // 登录
  "logout": "/auth/sso/logout", // 退出登录
  "userAccount": "/auth/userAccount/updateUserAccount", // 修改密码
  "findRoleInfos":"/auth/role/findRoleInfos", // 角色列表
  "findEmpMains": "/humres/empmanage/findEmpMains" // 用户人员信息
}
export default {auth}