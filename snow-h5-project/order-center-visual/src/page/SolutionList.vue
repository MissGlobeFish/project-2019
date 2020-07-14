<template>
  <div class="SolutionList" style="padding: 66px 0 36px 0;">
   <navbar title="选择业绩方案" rightIterm='新建方案' @leftBtnTapped= 'goBack' @rightBtnTapped='newSolution'></navbar>
   <div class="SolutionListBox">
    <div class="contSingleList">
      <v-scroll :on-refresh="onRefresh" v-loading="loading">
        <ul class="list">
          <li class="listIterm" v-for="(item, index) in listdata" @click="selectSolution($event,index)" >
            <i v-if="item.planType == '1'" class='stick el-icon-star-on'></i>
            <div class="title" >
              <!-- 标题 -->
              <span>{{item.planName}}</span>
            </div>
            <!-- 下拉选择更多操作 -->
            <el-dropdown class="command" trigger="click"  @command="handleItermCommand">
              <el-button type="text" @click.stop="" class="el-dropdown-link" icon="el-icon-more">
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="itermCommed('edit',index)">查看/编辑</el-dropdown-item>
                <el-dropdown-item :command="itermCommed('delete',index)">删除</el-dropdown-item>
                <el-dropdown-item :command="itermCommed('setDefault',index)">设置为默认</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>
      </v-scroll>
    </div>  
  </div>

</div>

</template>

<script>

export default {
  component:{

  },
  name: 'SolutionList',
  data () {
    return {
      cutomSelect: '',
      url: global.ERP_BASE_URL,
      //加载 hub
      loading: false,
      //数据
      listdata: [],
      //提成方案数据
      freshDone: null,//下拉控件
      //返回下拉框需要的 command 的factory 方法
      itermCommed: function(com, index){
        return {'index': index,
        'command': com}
      },
    }
  },
  created(){
    // this.loadList(true);
  },
  activated(){
    console.log("Activated")
    this.loadList(false);
  },
  beforeDestroy() {
    //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
    // this.eventBus.$off('solutionSelect');
  },
  methods:{
    goBack(){
      this.$router.goBack();
    },
    //新建方案
    newSolution(){
      this.$router.gspush({ name: 'SolutionDetail'});
    },
    //选择某个方案
    selectSolution(event,index){
      console.log('选择方案：');
      let info = this.listdata[index];
      console.log(info.id);
      //查询详情
      let loadingInstance = this.$loading({"text": "加载中..."});
      let self = this;
      let url = global.OrderCenter_URL + "/plan/detail";
      let params = {"planId": info.id}
      let options = {
        timeout: 30 * 1000,
        params: params
      };
      self.$http.get(url, options).then(
        function(data) {
          //停止蒙版
          loadingInstance.close();
          if (data.status != 200) {
            self.showError("加载失败请重试");
          } else {
            let info = data.body;
            if (info == null) {
              self.showError("数据为空，请重试");
              return;
            }
            info.unitList.forEach(function(unit){
              unit.orderPlanDetails = unit.details
            },this);
            self.eventBus.$emit('solutionSelect',info);
            self.$router.goBack();
          }
        },
        function(error) {
          loadingInstance.close();
          self.showError("获取方案失败!");
        }
        );
    },
    //下拉刷新
    onRefresh(done) {//下拉刷新
      this.freshDone = done;
      this.loadList(false);
    },
    //加载列表
    loadList(isMask){
      // let loadingInstance = isMask ? this.$loading({"text": "列表加载中..."}) : null;
      this.loading = isMask ? true : false;
      let self = this;
      // let url  = global.ERP_BASE_URL + '/erp/sale/order/get/project/msg';
      let url = global.OrderCenter_URL + "/plan/main";
      let params = {"empCode": this.gsNative.gsNativeUserCode()}
      let options = {
        timeout: 30 * 1000,
        params: params
      };
      self.$http.get(url, options).then(
        function(data) {
          //停止蒙版
          self.loading = false;
          // if (loadingInstance != null) {
          //   loadingInstance.close();
          // }
          //下拉控件重置
          if (self.freshDone != null) {
            self.freshDone();
          }
          console.log('列表接口 Response：')
          console.log(data)
          if (data.status != 200) {
            self.showError("获取方案失败，请刷新重试");
          } else {
            let info = data.body;
            if (info == null) {
              self.showError("还没有方案，请选择新建！");
              return;
            }
            self.listdata = info;
          }
        },
        function(error) {
          //停止蒙版
          self.loading = false;
          // if (loadingInstance != null) {
          //   loadingInstance.close();
          // }
          //下拉控件重置
          if (self.freshDone != null) {
            self.freshDone();
          }
          // self.showError(error);
          self.showError("获取方案失败!");
        }
        );
    },
    //列表项目更多点击
    handleItermCommand(command) {
      // console.log(command);
      console.log(command);
      let com = command.command
      let index = command.index
      switch (com){
        case 'edit':
        this.handleDetail(index)
        break;
        case 'delete':
        this.deleteSolution(index)
        break;
        case 'setDefault':
        this.setDefault(index)
        break;
        default:
        return
      }

    },
    //查看历史方案
    handleDetail(index){
      console.log(index);
      let info = this.listdata[index];
      this.$router.gspush({ name: 'SolutionDetail', query: { 'id': info.id, 'title': info.planName} })
    },
    //设置常用方案
    setDefault(index){
      let info = this.listdata[index];
      let loadingInstance = this.$loading({"text": "提交..."});
      let self = this;
      let url = global.OrderCenter_URL + "/plan/set-common-use";
      let params = {"planId": info.id,
      "empCode": this.gsNative.gsNativeUserCode()}
      console.log("设置默认提成方案:")
      console.log(params)
      let options = {
        timeout: 30 * 1000
      };
      self.$http.put(url,params,options).then(
        function(data) {
          //停止蒙版
          loadingInstance.close();
          console.log('设置默认方案接口 Response：')
          console.log(data)
          if (data.status != 200) {
            self.showError("设置失败");
          }else{
            self.showSucceed("设置成功");
            self.loadList(false)
          }
        },
        function(error) {
          loadingInstance.close();
          self.showError("设置默认方案失败!");
        }
        );
    },
    //根据方案index删除某项并刷新
    deleteSolution(index){
      let info = this.listdata[index];
      let loadingInstance = this.$loading({"text": "删除中..."});
      let self = this;
      // let url  = global.ERP_BASE_URL + '/erp/sale/order/get/project/msg';
      let url = global.OrderCenter_URL + "/plan/main";
      let params = {"id": info.id}
      console.log("删除提成方案:")
      console.log(params)
      let options = {
        timeout: 30 * 1000,
        params: params,
      };
      self.$http.delete(url,options).then(
        function(data) {
          //停止蒙版
          loadingInstance.close();
          console.log('删除方案接口 Response：')
          console.log(data)
          if (data.status != 200) {
            self.showError("删除失败");
          }else{
            self.showSucceed("删除成功");
            self.listdata.splice(index,1);
          }
        },
        function(error) {
          loadingInstance.close();
          self.showError("保存方案失败!");
        }
        );
    }
  }
}



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.SolutionList{
  background:#F0F2F5;
  bottom: 0;
}

// .SolutionListBox{
//   display: flex;
//   margin-bottom: 0px;
//   padding: 0px 10px;
//   background-color: #FFF;
//   border-bottom: 0.5px solid @borderColor;
// }

.listIterm{
  position: relative;
  background:#fff;
  margin-bottom:8px;
  padding: 10px 30px;
  height: 60px;
  line-height: 60px;
  .stick{
    position: absolute;
    left: 5px;
    top: 5px;
  }
  .title{
    height: 100%;
    float: left;
  }

  .command{
    height: 100%;
    float: right;
  }
}

</style>
