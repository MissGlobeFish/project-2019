<template>
  <div class="SolutionDetail" style="padding: 66px 0 36px 0;">
   <navbar :title='solutionInfo.planName' rightIterm='保存' @leftBtnTapped= 'goBack' @rightBtnTapped='saveSolution' :rightEnable="editable"></navbar>
   <div class="SolutionDetailBox">
    <el-form class="SolutionDetailForm" ref="SolutionDetailForm" :model="solutionInfo" :rules="rules" inline-message label-position="left">
     <inputIterm title="方案名称" v-model= "solutionInfo.planName" :disabled= "!editable"> </inputIterm>
     <selectIterm title="提成模板" v-model="solutionInfo.ruleName" disabled  valuekey="ruleName"></selectIterm>
     <div class="ruleItermsBox">
      <ul class="unitlist">
        <li class="unitIterm" v-for="(unit, unitIndex) in solutionInfo.unitList" >
          <!-- 标题 -->
          <div class="title">
            <label>{{unit.unitName}}</label>
          </div>
          <ul class="rulelist">
            <li class="ruleIterm" v-for="(rule, ruleiIndex) in unit.orderPlanDetails" @click.self="selectSolution($event,ruleiIndex)" >
              <!-- 选取人物 -->
              <!-- <inputIterm class="personInput" title="" :clearable="false" v-model="rule.itemCode"></inputIterm> -->
              <el-autocomplete
              class="inline-input personInput"
              v-model="rule.itemDesc"
              :fetch-suggestions="querySearch"
              placeholder="输入人名"
              :trigger-on-focus="false"
              :disabled="!unit.isEdit && !editable"
              @select="handleSelect($event,unitIndex,ruleiIndex)"
              >
              <!-- 备选方案 -->
              <template slot-scope="props">
                <div class="empName">{{ props.item.empName }}</div>
                <span class="deptNamePath">{{ props.item.deptNamePath }}</span>
              </template>
            </el-autocomplete>
            <!-- 填写比例 -->
            <inputIterm class="rateInput" title="比例" :clearable="false"  :value="rule.rate * 100" @valueChanged="changeRateNumber($event,rule)" type="number" :disabled="!unit.isEdit && !editable">
              <template slot="append">%</template>
            </inputIterm>
            <!-- 删除该条 -->
            <el-button v-if="unit.isEdit &&!editable" type="text" class="deletBtn" icon="el-icon-circle-close-outline" @click="deleteRule($event,unitIndex,ruleiIndex)">
            </el-button>
          </li>
        </ul>
        <!-- 添加条目 -->
        <el-button v-if="unit.isEdit && !editable" type="text" class="addBtn" icon="el-icon-circle-plus-outline" @click="addRule($event,unitIndex)">
        </el-button>
      </li>
    </ul>
  </div>
</el-form>
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
      //可否编辑
      editable: true,
      //数据
      solutionInfo: {},
      //表单验证规则
      rules: {
        name: [
        { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
    }
  },
  watch: {

  },
  created(){
    console.log("收到方案信息：\n");
    this.editable = this.$route.query.editable
    let currySolution = JSON.parse(window.localStorage.getItem('currySolution'));
    console.log(currySolution);
    this.solutionInfo = currySolution 
  },
  beforeDestroy() {
    //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
    // this.eventBus.$off('solutionSelect');
  },
  methods:{
    goBack(){
      this.$router.goBack();
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
      this.solutionInfo.unitList[unitIndex].orderPlanDetails[ruleiIndex].itemCode = item.empCode; 
      this.solutionInfo.unitList[unitIndex].orderPlanDetails[ruleiIndex].itemDesc = item.empName; 
    },

    //点击删除某一条rule
    deleteRule(event,unitIndex,ruleiIndex){
      console.log("删除" + "单元" + unitIndex.toString() + "项目" + ruleiIndex.toString());
      if (this.solutionInfo.unitList[unitIndex].orderPlanDetails.length <= 1) {
        this.showError("请至少保留一条规则！");
      }else{
        this.solutionInfo.unitList[unitIndex].orderPlanDetails.splice(ruleiIndex,1); 
      }
    },
    //添加 rule
    addRule(event,unitIndex){
      console.log("添加" + unitIndex.toString());
      let newrule = {"unitId": this.solutionInfo.unitList[unitIndex].id};
      if (this.solutionInfo.unitList[unitIndex].orderPlanDetails == null) {
        this.solutionInfo.unitList[unitIndex].orderPlanDetails = [];
      }
      this.solutionInfo.unitList[unitIndex].orderPlanDetails.push(newrule);
    },
    //方案修改保存
    saveSolution(){
      this.eventBus.$emit('solutionSelect',this.solutionInfo);
      this.$router.goBack();
    },
    //处理百分比数据
    changeRateNumber(rateNumber, rule){
      console.log(rule)
      rule.rate = rateNumber/100
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
    height: 45px;
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
</style>
