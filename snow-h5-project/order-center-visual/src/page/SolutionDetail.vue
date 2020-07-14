<template>
  <div class="SolutionDetail" style="padding: 66px 0 36px 0;">
   <navbar :title='pageTitle' :rightIterm='rightNavIterm' @leftBtnTapped= 'goBack' @rightBtnTapped='validateDataInfo(false)'></navbar>
   <div class="SolutionDetailBox">
    <el-form class="SolutionDetailForm" ref="SolutionDetailForm" :model="solutionInfo" inline-message label-position="left">
     <inputIterm title="方案名称" v-model= "solutionInfo.planName" prop="planName" :rules="{ required: true, message: '请输入方案名称', trigger: 'change' }"> </inputIterm>
     <selectIterm title="提成模板" v-model="solutionInfo.ruleName" :disabled="!isNewSolution" :options="ruleOptions"  valuekey="ruleName"  @valueChanged="ruleChanged($event)" prop="ara"></selectIterm>
     <div class="ruleItermsBox" v-loading="ruleLoading">
      <ul class="unitlist">
        <li class="unitIterm" v-for="(unit, unitIndex) in solutionInfo.unitList" >
          <!-- 标题 -->
          <div class="title">
            <label>{{unit.unitName}}</label>
          </div>
          <ul class="rulelist">
            <li class="ruleIterm" v-for="(rule, ruleiIndex) in unit.details" @click.self="selectSolution($event,ruleiIndex)" >
              <!-- 选取人物 -->
              <el-form-item :prop="'unitList.' + unitIndex + '.details.' + ruleiIndex + '.itemCode'" :rules="{required: true, message: '请输入后点击备选项', trigger: 'change'}">
                <el-autocomplete
                class="inline-input personInput"
                v-model="rule.itemDesc"
                :fetch-suggestions="querySearch"
                placeholder="输入人名"
                :trigger-on-focus="false"
                :disabled="!unit.isEdit"
                @select="handleSelect($event,unitIndex,ruleiIndex)"
                @focus="userNameInputFocus($event,unitIndex,ruleiIndex)"
                >
                <!-- 备选方案 -->
                <template slot-scope="props">
                  <div class="empName">{{ props.item.empName }}</div>
                  <span class="deptNamePath">{{ props.item.deptNamePath }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
            <!-- 填写比例 -->
            <inputIterm class="rateInput" title="比例" :value="rule.rate * 100" @valueChanged="changeRateNumber($event,rule)" :prop="'unitList.' + unitIndex + '.details.' + ruleiIndex + '.rate'" type="number" :rules="{validator: validateRate, trigger: 'change'}" :disabled="!unit.isEdit" :clearable="false">
              <template slot="append">%</template>
            </inputIterm>
            <!-- 删除该条 -->
            <el-button v-if="unit.isEdit" type="text" class="deletBtn" icon="el-icon-circle-close-outline" @click="deleteRule($event,unitIndex,ruleiIndex)">
            </el-button>
          </li>
        </ul>
        <!-- 添加条目 -->
        <el-button v-if="unit.isEdit" type="text" class="addBtn" icon="el-icon-circle-plus-outline" @click="addRule($event,unitIndex)">
        </el-button>
      </li>
    </ul>
  </div>
</el-form>
<div class="newSolutionSubmitBox" v-if="isNewSolution">
  <el-checkbox class="defaultBtn" v-model="isDefaultSolution" >设为常用方案</el-checkbox>
  <el-button class="creatBtn" @click="validateDataInfo(true)" type="primary">创建</el-button>
</el-button>
</div>
</div>

</div>

</template>

<script>

export default {
  component:{

  },
  name: 'SolutionDetail',
  data () {
    return {
      url: global.ERP_BASE_URL,
      //方案标题
      pageTitle: '',
      //方案ID
      solutionId: null,
      //新建方案、历史方案的判断
      isNewSolution: true,
      //导航栏右边保存按钮
      rightNavIterm: "", 
      //模板加载
      ruleLoading: false,
      //数据
      solutionInfo: {'planName':""},
      //是否设为常用方案
      isDefaultSolution: true,
      //提成模板数据:
      ruleOptions: [],
      /*验证比例*/
      validateRate : (rule, value, callback)=> {
        console.log("验证比例",value)
        if (value > 1) {
          callback(new Error('比例错误'));
        } else {
          callback();
        }
      },
    }
  },
  watch: {
      //新建的没有保存，历史方案编辑可以保存
      isNewSolution: function(val){
        this.rightNavIterm = this.isNewSolution ? '' : "保存"
        console.log(this.rightNavIterm);
      },
    },
    created(){
      console.log('收到参数')
      console.log(this.$route.query)
      if (this.$route.query.id == null) {
        this.isNewSolution = true;
        this.pageTitle = '新建方案';
        this.loadRuleList();
      }else{
        this.isNewSolution = false;
        this.pageTitle = this.$route.query.title;
        this.solutionId = this.$route.query.id;
        this.searchSolutionInfo();
      }
    },
    methods:{
      goBack(){
        this.$router.goBack();
      },
    //加载提成方案模板
    loadRuleList(){
      let loadingInstance = this.$loading({"text": "模板加载中..."});
      let self = this;
      // let url  = global.ERP_BASE_URL + '/erp/sale/order/get/project/msg';
      let url = global.OrderCenter_URL + "/rule";
      let params = {
        userId: this.gsNative.gsNativeUserCode()
      }
      let options = {
        timeout: 30 * 1000,
        params: params
      };
      self.$http.get(url, options).then(
        function(data) {
          //停止蒙版
          loadingInstance.close();
          console.log('模板列表接口 Response：')
          console.log(data)
          if (data.status != 200) {
            self.showError("加载失败请重试");
          } else {
            let info = data.body;
            if (info == null) {
              self.showError("数据为空，请重试");
              return;
            }
            info.forEach(function(p){  
              let id = p.id
              var option = {};
              option.key = p.id;
              option.label = p.ruleName;
              option.value = p;
              self.ruleOptions.push(option);
            },self);
          }
        },
        function(error) {
          loadingInstance.close();
          self.showError("获取方案失败!");
        }
        );
    },
    //加载方案详情
    searchSolutionInfo(){
      let loadingInstance = this.$loading({"text": "加载中..."});
      let self = this;
      // let url  = global.ERP_BASE_URL + '/erp/sale/order/get/project/msg';
      let url = global.OrderCenter_URL + "/plan/detail";
      let params = {"planId": this.solutionId}
      let options = {
        timeout: 30 * 1000,
        params: params
      };
      self.$http.get(url, options).then(
        function(data) {
          //停止蒙版
          loadingInstance.close();
          console.log('详情接口 Response：')
          console.log(data)
          if (data.status != 200) {
            self.showError("加载失败请重试");
          } else {
            let info = data.body;
            if (info == null) {
              self.showError("数据为空，请重试");
              return;
            }
            self.solutionInfo = info;
          }
        },
        function(error) {
          loadingInstance.close();
          self.showError("获取方案失败!");
        }
        );
    },

    //新建订单修改模板查询并展示
    ruleChanged(event){
      if(typeof(event) =='object'){
        this.$set(this.solutionInfo,"unitList",[]);
        console.log("选中方案：")
        console.log(event);
        this.solutionInfo.ruleName = event.ruleName
        this.solutionInfo.ruleId = event.id
        this.ruleLoading = true;
        let self = this;
        // let url  = global.ERP_BASE_URL + '/erp/sale/order/get/project/msg';
        let url = global.OrderCenter_URL + "/unit";
        let params = {"ruleId": event.id,"empCode": this.gsNative.gsNativeUserCode()}
        let options = {
          timeout: 30 * 1000,
          params: params
        };
        self.$http.get(url, options).then(
          function(data) {
          //停止蒙版
          self.ruleLoading = false;
          console.log('模板接口 Response：')
          console.log(data)
          if (data.status != 200) {
            self.showError("加载失败请重试");
          } else {
            let info = data.body;
            if (info == null) {
              self.showError("数据为空，请重试");
              return;
            }
            // console.log(self.solutionInfo);
            self.$set(self.solutionInfo,"unitList",info)
            // self.solutionInfo.unitList = info
          }
        },
        function(error) {
          self.ruleLoading = false;
          self.showError("获取模板失败!");
        }
        );
      }
    },
    //模糊搜索人员
    querySearch(queryString, cb){
      let self = this;
      // let url = global.ERP_BASE_URL + '/erp/project/list';
      let url = global.SNOW_TRANS_URL;
      let params = {
        type: "POST",
        path: global.EHR_URL + "/ext/emp/query",
        data: {
          "isPage":false,
          "empName" : queryString
        }
      }
      let jsonParams = JSON.stringify(params);
      self.$http.post(url,jsonParams,self.httpOptions).then(
        function(data) {
          console.log('人员查询接口 Response：')
          console.log(data)
          if (data.body.msg) {
            self.showError(data.body.msg);
          } else {
            let infos = data.body.datas.list;
            if (infos == null) {
              self.showError("未能查到该项目！");
              cb([]);
              return;
            }
            infos.forEach(function(p){  
              p.name = p.empName;
              p.dep = p.deptNamePath
            });
            cb(infos);
          }
        },
        function(error) {
          self.showError(error.data.msg);
        }
        );
    },
    //模糊搜索选中
    handleSelect(item,unitIndex,ruleiIndex){
      console.log(item);
      console.log(unitIndex);
      console.log(ruleiIndex);
      // this.solutionInfo.unitList[unitIndex].details[ruleiIndex].itemDesc = "11";
      this.solutionInfo.unitList[unitIndex].details[ruleiIndex].itemCode = item.empCode;
      this.solutionInfo.unitList[unitIndex].details[ruleiIndex].itemDesc = item.empName + " "; 
    },
    //处理人名输入获得焦点
    userNameInputFocus(item,unitIndex,ruleiIndex){
      console.log(item);
      console.log(unitIndex);
      console.log(ruleiIndex);
      this.solutionInfo.unitList[unitIndex].details[ruleiIndex].itemCode = null; 
      this.solutionInfo.unitList[unitIndex].details[ruleiIndex].itemDesc = null; 
    },
    //点击删除某一条rule
    deleteRule(event,unitIndex,ruleiIndex){
      console.log("删除" + "单元" + unitIndex.toString() + "项目" + ruleiIndex.toString());
      // if (this.solutionInfo.unitList[unitIndex].details.length <= 1) {
      //   this.showError("请至少保留一条规则！");
      // }else{
        this.solutionInfo.unitList[unitIndex].details.splice(ruleiIndex,1); 
      // }
    },
    //添加 rule
    addRule(event,unitIndex){
      console.log("添加" + unitIndex.toString());
      let newrule = {"unitId": this.solutionInfo.unitList[unitIndex].id};
      if (this.solutionInfo.unitList[unitIndex].details == null) {
        this.solutionInfo.unitList[unitIndex].details = [];
      }
      this.solutionInfo.unitList[unitIndex].details.push(newrule);
    },
    //表单验证 提交 保存
    validateDataInfo(isNew){
      console.log("开始表单验证")
      let self = this
      this.$refs['SolutionDetailForm'].validate((valid) => {
        console.log(this.solutionInfo)
        if (valid) {
            //成功回调
            console.log("表单验证成功")
            isNew ? self.submitSolution() : self.saveSolution()
            return true;
          } else {
            //失败
            console.log('error submit!!');
            return false;
          }
        });
    },
    //历史方案修改保存
    saveSolution(){
      let loadingInstance = this.$loading({"text": "保存中..."});
      let self = this;
      let url = global.OrderCenter_URL + "/plan/main";
      this.solutionInfo.empCode = this.gsNative.gsNativeUserCode()
      let params = this.solutionInfo
      console.log("修改提成方案:")
      let options = {
        timeout: 30 * 1000
      };
      let jsonParams = JSON.stringify(params);
      console.log(jsonParams)
      self.$http.put(url, jsonParams,options).then(
        function(data) {
          //停止蒙版
          loadingInstance.close();
          console.log('修改方案接口 Response：')
          console.log(data)
          if (data.status != 200) {
            self.showError("保存失败");
          }else{
            self.showSucceed("保存成功");
            setTimeout(function timer() {
              self.goBack()
            },500)
          }
        },
        function(error) {
          loadingInstance.close();
          self.showError("保存方案失败!");
        }
        );
    },
    //新建方案
    submitSolution(){
      let loadingInstance = this.$loading({"text": "提交中..."});
      let self = this;
      let url = global.OrderCenter_URL + "/plan/main";
      this.solutionInfo.empCode = this.gsNative.gsNativeUserCode()
      this.solutionInfo.busType = "DC"
      this.solutionInfo.planType = this.isDefaultSolution ? "1" : "0"
      let params = this.solutionInfo
      console.log("新建提交提成方案:")
      console.log(params)
      let options = {
        timeout: 30 * 1000,
      };
      let jsonParams = JSON.stringify(params);
      self.$http.post(url, jsonParams,options).then(
        function(data) {
          //停止蒙版
          loadingInstance.close();
          console.log('新建方案接口 Response：')
          console.log(data)
          if (data.status != 200) {
            self.showError("提交失败");
          }else{
            self.showSucceed("新建成功");
            setTimeout(function timer() {
              self.goBack()
            },500)
          }
        },
        function(error) {
          loadingInstance.close();
          self.showError("创建方案失败!");
        }
        );
    },
    //处理百分比数据
    changeRateNumber(rateNumber, rule){
      rule.rate = rateNumber/100
      console.log(rule)
    }
  }
}



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.SolutionDetail{
  background:#F0F2F5;
  bottom: 0;
}

.SolutionDetailBox{
  .SolutionDetailForm{
    width: 100%;
    background: #FFFFFF;
  }
}

.ruleItermsBox{
  min-height: calc(~ '100vh - 90px - 66px - 70px');
  padding: 2.5%;

  .unitIterm{
    display: block;
    .addBtn{
      font-size: 28px;
    }
  }

  .title{
    display: block;
    text-align:left;
    font-family: @textstyle;
    font-size: @textNavFont;
  }

  .ruleIterm{
    // height: 45px;
    min-height: 45px;
    display: flex;
    justify-content: space-between;
    .personInput{
      display: flex;
      margin-bottom: 0px;
      padding: 0px;
      background-color: #FFF;
      border-bottom: 0.5px solid @borderColor;
    }
    .rateInput{
      width: 40%;
      border: none;
      .el-form-item__label{
        width: 50px;
        padding: 0px;
      } 
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
      }
      .el-input.is-disabled .el-input__inner {
        background-color: #fff; 
      }
      .el-input-group__append{
        background-color: transparent;
        border: none;
        color: #606266;
        padding: 0px;
      }
      .el-form-item__content{
        width: 100%;
      }

      .el-input__inner{
        padding: 0px 10px;
        text-align: center;
      }

      .deletBtn{
        font-size: 20px;
      }

    }  
  }
//模糊搜索选项信息
.el-autocomplete-suggestion li{
  border-bottom: 0.5px solid @borderColor;
  padding: 2px 5px;
}
.deptNamePath{
  text-align: left;
  font-size: 11px;
  line-height: 10px;
}
.empName{
  line-height: 20px;
  text-align: left;
  font-size: 14px;
}



.newSolutionSubmitBox{
  border: 0.5px solid @borderColor;
  height: 50px;
  .defaultBtn{
    display: flex;
    justify-content:center;
    align-items: center;
    line-height: 100%;
    height: 100%;
    float: left;
    width: 60%;
    .el-checkbox.is-bordered.is-checked{
      border-color: transparent;
    }
  }
  .creatBtn{
    height: 100%;
    width: 40%;
    float: right;
  }
}
</style>
