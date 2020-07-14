<template>
    <div class="start">
		<div class="bottom">
      <el-form v-if="showInput" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="phone">
          <el-input class="search" placeholder="请输入手机号" v-model.number="ruleForm.phone">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="searchNumber('ruleForm')"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <el-button v-if="showLink" class="begin" @click="handleLink">{{msg}}</el-button>
			<p>@旺小宝 2017</p>
		</div>
    </div>
</template>

<script>

export default {
  name: "Start",
  components: {},
  data() {
    return {
      showInput: true,
      showLink:false, 
      ruleForm: {
        phone: '',
      },
      msg: "立即登记入职信息",
      rules: {
        phone: [
          {required: true,trigger: 'blur',type:'number', message: '请输入正确的手机号'},
          { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }
        ]
      }
    };
  },
  methods: {
    searchNumber(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {

          let self = this;
          let url = global.ERPAPI_URL + "/erp-api/snow/trans";
          let datas  = {
            type: "POST",
            path: global.HUMRES_URL + "/humres/ext/emp/query",
            data: {
              "isPage": true,
              "phoneNum" : parseInt(self.ruleForm.phone),
              "curPage": 1,
              "pageSize": 1,
              "requestType": 'adduser'
            }
          };

          self.$http.post(url, datas, self.option).then(                       
              function(data) {
                  // 这里是处理正确的回调
                  if (data.body.flag) {
                    if (!data.body.datas.list.length == 0) {
                      self.msg = data.body.datas.list[0].empName;
                      window.localStorage.setItem('empCode', data.body.datas.list[0].empCode);
                      self.showInput = false;
                      self.showLink = true;
                    }else{
                      self.msg = "立即登记入职信息";
                      self.showInput = false;
                      self.showLink = true;
                    }
                    self.keyboardEvents();
                  } else {
                    self.$message({
                        message: data.body.msg,
                        type: "warning"
                    });
                  }
              },
              function(error) {
                  // 这里是处理错误的回调
                  self.$message({
                      message: "请求失败，请刷新重试！",
                      type: "error"
                  });
              }
          ); 
        } else {
          return false;
        }
      });
    },
    handleLink(){
      this.keyboardEvents();
      this.$router.push({path:'/index'});
    },
    keyboardEvents() {
      let myFunction;
      document.body.addEventListener('focusin', () => { // 软键盘弹起事件
        clearTimeout(myFunction)
      })
      document.body.addEventListener('focusout', () => { // 软键盘关闭事件
        clearTimeout(myFunction)
        myFunction = setTimeout(function () {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          }) // =======当键盘收起的时候让页面回到原始位置
        }, 200)
      })
    }
  }
};

</script>

<style lang="less">

@lineHeight: 49px;
.start {
  position: fixed;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  left: 0;
  top: 0;
  background: #fff url(../../assets/group.png) bottom center no-repeat;
  background-size: 100% auto;

  img {
    width: 100%;
    margin: 0 auto;
    margin-top: 126px;
  }
  .bottom {
    position: fixed;
    bottom: 15px;
    left: 0;
    width: 100%;
    margin: 0 auto;
    text-align: center;
    
    .el-form{
      .el-form-item__content{
        margin: 0 !important;
      }
      .el-form-item__error{
        width: 100%;
      }
    }
    .search{
      width: 60%;
    }
    .begin {
      width: 60%;
      height: @lineHeight;
      background: #fff;
      display: inline-block;
      font-size: 16px;
      color: rgb(255, 102, 0);
      text-decoration: none;
      border: 1px solid rgb(255, 102, 0);
      border-radius: 50px;
      margin: auto;
      cursor: pointer;
      z-index: 1;
    }
    .begin:focus{
        outline: none;
    }

    p {
      color: rgb(170, 170, 170);
      font-size: 12px;
      padding: 15px 0;
    }
  }
}
</style>