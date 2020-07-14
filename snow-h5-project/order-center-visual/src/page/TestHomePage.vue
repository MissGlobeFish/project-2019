<template>
  <div class="testBox">
    <el-form inline-message label-position="left">
      <inputIterm title="账号" v-model= "userName"> </inputIterm>
      <inputIterm title="密码" type="password" v-model= "psw"> </inputIterm>
      <inputIterm title="订单ID" v-model= "orderID"> </inputIterm>
    </el-form>
    <div class="btnbox">
      <el-button class="btn" @click="login(orderID)" >查询订单</el-button>
      <el-button class="btn" @click="login(null)" >新建订单</el-button>
    </div>
    
  </div>
</template>

<script>

export default {
  component:{
    
  },
  name: 'TestHomePage',
  data () {
    return {
      userName: "",
      psw:"",
      orderID:"",
    }
  },
  created(){
    
    
  },
  methods:{

    login(orderID){
      let loadingInstance = this.$loading({"text": "登录中..."});
      let self = this;
      let url  = global.ERP_BASE_URL + '/erp/user/login';
      let params = {"uid": this.userName,
      "pwd": this.psw}
      let options = {
        timeout: 30 * 1000
      };
      self.$http.post(url,params, options).then(
        function(data) {
          console.log(data)
          loadingInstance.close();
          if (data.body.msg) {
            self.showError(data.body.msg);
          } else {
            let info = data.body;
  
            //根据收到的数据赋值以及禁用
            console.log(info.userId);
            window.localStorage.setItem('userId',info.data.userId);
            window.localStorage.setItem('token',info.token);
            window.localStorage.setItem('usercode', info.data.empCode);
            window.localStorage.setItem('username', info.data.empName);

            if (orderID == null) {
              //新建
              self.newOrder()
            }else{
              //查询
              self.searchOrder(orderID)
            }
          }
        },
        function(error) {
          loadingInstance.close();
          self.showError("登录失败");
        }
        );
    },
    searchOrder(orderID){
      this.$router.gspush({ name: 'EstateOrder' ,  query: {id: orderID}});
    },
    newOrder(){
      this.$router.gspush({ name: 'EstateOrder'});
    }
  }
}



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.testBox{
  height: 100%;
  padding: 100px 0px 0px 0px; 
}

.btnbox{
  display: flex;
}
.btn{
  display: block;
  width: 50%;
  margin-top: 50px;
  margin-left: 0px;
  vertical-align: middle;
  }
</style>