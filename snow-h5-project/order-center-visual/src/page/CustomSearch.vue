<template>
  <div class="customSearch" style="padding: 120px 0 36px 0;">
   <navbar title="项目查询"  @leftBtnTapped= 'goBack' @rightBtnTapped= 'printParm' ></navbar>
   <div class="customSearchBox">
    <el-autocomplete
    class="inline-input"
    v-model="cutomSelect"
    :fetch-suggestions="querySearch"
    placeholder="公司名称/项目名称"
    :trigger-on-focus="false"
    @select="handleSelect"
    >
    <el-button slot="append" icon="el-icon-search" disabled></el-button>
  </el-autocomplete>
</div>

</div>

</template>

<script>

export default {
  component:{

  },
  name: 'HelloWorld',
  data () {
    return {
      cutomSelect: '',
      url: global.ERP_BASE_URL
    }
  },
  created(){

  },
  beforeDestroy() {
    //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
    // this.eventBus.$off('customSelect');
  },
  methods:{
    goBack(){
      this.$router.goBack();
    },
    printParm(){
      console.log(this.$route.query);
    },
    querySearch(queryString, cb) {

      let self = this;
      let url = global.ERP_BASE_URL + '/erp/project/list';
      let params = {"token": this.gsNative.gsNativeUserId(),
      "name": queryString}
      let option = {
        timeout: 30 * 1000, //30秒过期
        params: params
      };
      self.$http.get(url, option).then(
        function(data) {
          if (data.body.msg) {
            self.showError(data.body.msg);
          } else {
            let info = data.body.data;
            if (info == null) {
              self.showError("未能查到该项目！");
              cb([]);
              return;
            }
            info.forEach(function(p){  
              p.value = p.prjName; 
            });
            cb(info);
          }
        },
        function(error) {
          self.showError(error);
        }
        );

    },
    handleSelect(item) {
      console.log("选择:");
      console.log(item);
      this.eventBus.$emit('customSelect',item);
      this.$router.goBack();
    }
  }
}



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.customSearch{
  background:#F0F2F5;
  bottom: 0;
}

.customSearchBox{
  display: flex;
  margin-bottom: 0px;
  padding: 0px 10px;
  background-color: #FFF;
  border-bottom: 0.5px solid @borderColor;
  .el-autocomplete{
    width: 100%;
  }
  .el-input__inner{
    height: 44.5px;
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0px;
    border-bottom-width: 0.5px;
      // border-bottom-color: #fff;
        // border-color: @borderColor;
        .el-input.is-disabled .el-input__inner {
          background-color: #fff; 
        }
      }
      .el-input-group__append{
        background-color: #fff;
        border: none;
        color: #606266;
      }
    }

    </style>
