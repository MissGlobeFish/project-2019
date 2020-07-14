import https from '../../https.js'
const userDB = [
  { username: 'admin', password: 'admin', uuid: 'admin-uuid', name: '管理员' },
  { username: 'editor', password: 'editor', uuid: 'editor-uuid', name: '编辑' },
  { username: 'user1', password: 'user1', uuid: 'user1-uuid', name: '用户1' }
]

export default [
  {
    path: '/api/login',
    method: 'post',
    handle ({ body }) {
      /* console.log('body', body)
      var formData = new FormData();
      formData.append("username", body.username);
      formData.append("password", body.password);
      https.fetchPost('/pomegranate/web/baseInfo/login', formData)
      .then(function(res){
        console.log(1, res)
        if (res.data.code == -1) {
          return {
            code: 200,
            msg: res.data.msg,
            data: {}
          }
        }else{
          return {
            code: 0,
            msg: '登录成功！',
            data: {
              token: res.data
            }
          }
        }
      })
      .catch(function(err){
        return {
          code: 401,
          msg: '登录失败！',
          data: {}
        }
      }) */
      const user = userDB.find(e => e.username === body.username && e.password === body.password)
      if (user) {
        return {
          code: 0,
          msg: '登录成功',
          data: {
            ...user,
            token: '8dfhassad0asdjwoeiruty'
          }
        }
      } else {
        return {
          code: 401,
          msg: '用户名或密码错误',
          data: {}
        }
      }
    }
  }
]
