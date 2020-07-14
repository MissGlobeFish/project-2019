<template>
  <div class="dashboard-editor-container">
    <!-- 实时在岗 -->
    <div class="online-work">
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <BarChart title="实时在岗" v-on:barChartEvent="onlineMember" :data="departmentData" :value="onlineValue"></BarChart>
      </el-row>
    </div>
    <!-- 排行 -->
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="6">
        <div class="rank-wrap">
          <p>部门人均工作时长排行</p>
          <ul>
            <li><img src="../../assets/rank-1.png" alt="" class="icon">人力行政部 15.7h</li>
            <li><img src="../../assets/rank-2.png" alt="" class="icon">研发部 14.8h</li>
            <li><img src="../../assets/rank-3.png" alt="" class="icon">销售部 9.5h</li>
          </ul>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="6">
        <div class="rank-wrap">
          <p>个人工作时长排行</p>
          <ul>
            <li><img src="../../assets/rank-1.png" alt="" class="icon">杨希 15h</li>
            <li><img src="../../assets/rank-2.png" alt="" class="icon">王工 13.2h</li>
            <li><img src="../../assets/rank-3.png" alt="" class="icon">张子豪 12.8h</li>
          </ul>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="6">
        <div class="rank-wrap">
          <p>部门工作时长排行</p>
          <ul>
            <li><img src="../../assets/rank-1.png" alt="" class="icon">研发部 260.5h</li>
            <li><img src="../../assets/rank-2.png" alt="" class="icon">产品部 230.2h</li>
            <li><img src="../../assets/rank-3.png" alt="" class="icon">销售部 90.5h</li>
          </ul>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="6">
        <div class="rank-wrap">
          <p>部门出勤人数排行</p>
          <ul>
            <li><img src="../../assets/rank-1.png" alt="" class="icon">人力行政部 120人</li>
            <li><img src="../../assets/rank-2.png" alt="" class="icon">餐饮团队 100人</li>
            <li><img src="../../assets/rank-3.png" alt="" class="icon">售后部 87人</li>
          </ul>
        </div>
      </el-col>
    </el-row>

    <!-- 月度BI -->
    <panel-group @handleSetLineChartData="handleSetOverTimeChartData" />
    <el-row :gutter="32">
      <!-- 出勤率占比 -->
      <el-col :xs="24" :sm="24" :lg="7">
        <div class="chart-wrapper">
          <pie-chart title="出勤人数占比" :data="attendanceMemberData"/>
        </div>
      </el-col>
      <!-- 异常考勤部门占比 -->
       <el-col :xs="24" :sm="24" :lg="7">
        <div class="chart-wrapper">
          <pie-chart title="异常考勤部门占比" :data="ExceptionMemberData"/>
        </div>
      </el-col>
      <!-- 人均加班时长 -->
      <el-col :xs="24" :sm="24" :lg="10">
        <div class="chart-wrapper">
          <line-chart :data="overTimeChartData" title="人均加班时长"/>
        </div>
      </el-col>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;" :gutter="32">
      <el-col :xs="32" :sm="32" :lg="32">
        <BarChart title="人均工作时长" v-on:barChartEvent="workTimeEvent" :data="departmentData" :value="workAvarageValue"></BarChart>
      </el-col>
    </el-row>
    
    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <pie-chart />
    </el-row> -->
    <el-dialog class="chartDialog" :title="chartTitle" :visible.sync="chartDialogVisible" width="50%" center>
      <bar-chart :data="onlineMemberData" :value="onlineMemberValue" v-on:barChartEvent="itemWorkTime"/>
    </el-dialog>

    <el-dialog class="chartDialog" :title="chartTitle" :visible.sync="addTimeDialogVisible" width="60%" center>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;" :gutter="24">
        <el-col :xs="18" :sm="18" :lg="18">
          <bar-chart :data="onlineMemberData" :value="onlineMemberValue" v-on:barChartEvent="itemWorkTime"/>
        </el-col>
        <el-col :xs="6" :sm="6" :lg="6">
          <p>考勤说明</p>
          <ul class="descript">
            <li>加班： 160h</li>
            <li>异常： 15次</li>
            <li>平均工时： 12h</li>
          </ul>
        </el-col>
      </el-row>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;" :gutter="24">
        <el-col :xs="1" :sm="18" :lg="18">
          <finish-rate :avarageTimeTitle ="avarageTimeTitle" :data="avarageTime" title="上班时长"></finish-rate>
        </el-col>
         <el-col :xs="6" :sm="6" :lg="6">
          <p>个人考勤说明</p>
          <ul class="descript">
            <li>加班： 12h</li>
            <li>异常： 2次</li>
            <li>平均工时： 10.2h</li>
          </ul>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import { getDeptTree } from '@/api/organization-tree'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import FinishRate from './components/FinishRate'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'

function randomTime(base) {
  var result = []
  var i = 0
  while(i < 31){
    result.push((Math.random() * 0.5 + base).toFixed(2))
    i ++
  } 
  return result
}
// 部门人均工时
function avarageTimeRandom() {
  var result = []
  var i = 0
  while(i < 31){
    result.push((Math.random() * 8).toFixed(2))
    i ++
  } 
  return result
}
const overTimeChartData = {
  newVisitis: {
    department1: randomTime(0.6),
    department2: randomTime(2),
    department3: randomTime(1)
  }
}
const onlineMemberData = ['杨希','张章','王工','王超','张喜','张杰','肖奈','杨爽','青天','代唐','张相']
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    FinishRate,
    PieChart,
    BarChart
  },
  data() {
    return {
      avarageTime: avarageTimeRandom(), // 人均工作时长标题
      avarageTimeTitle: onlineMemberData[0], // 人均工作时长
      overTimeChartData: overTimeChartData.newVisitis,
      chartDialogVisible: false,
      chartTitle: '',
      innerVisible: false,
      addTimeDialogVisible: false,
      departmentData: ['人力行政部','软件研发部','商务合作部','地产研发','餐饮研发','产品部','财务部','旺桌牌项目部','售后服务部','餐饮产品','地产产品'], // 实时岗位部门
      onlineValue:[4,2,4,5,45,4,2,6,5,10,10],
      onlineMemberData: onlineMemberData,
      onlineMemberValue: [1,5,15,2,9,4,5,4,12,54,1],
      workAvarageValue:[8,4,4,5,10,4,12,6,5,12,10],
      attendanceMemberData: [
       { value: 67, name: '人力行政部' },
       { value: 12, name: '软件研发部' },
       { value: 32, name: '商务合作部' },
       { value: 15, name: '地产研发' }
      ],
      ExceptionMemberData: [
        { value: 12, name: '人力行政部' },
        { value: 7, name: '软件研发部' },
        { value: 8, name: '商务合作部' },
        { value: 15, name: '地产研发' }
      ]
    }
  },
  methods: {
    handleSetOverTimeChartData(type) {
      this.overTimeChartData = overTimeChartData[type]
    },
    // 实时在岗
    onlineMember(){
      this.chartDialogVisible = true
      this.chartTitle = arguments[1].name
    },

    // 人均加班时长
    workTimeEvent() {
      this.addTimeDialogVisible = true;
      this.chartTitle = arguments[1].name
      this.avarageTimeTitle = onlineMemberData[0] // 默认展示第一个人均工作时长
    },

    // 个人每天工作时长
    itemWorkTime() {
      const avarageTime = avarageTimeRandom();
      this.avarageTime = avarageTime
      this.avarageTimeTitle = arguments[1].name
    }
  }
}
</script>

<style lang="scss">
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.rank-wrap {
  padding: 16px;
  background: #fff;
  line-height: 18px;
  color: rgba(0,0,0,0.45);
  font-size: 16px;
  margin-bottom: 12px;
  p {
    color: #0782bd;
  }
  ul {
    padding-left: 20px;
    li {
      list-style-type: none;
      line-height: 2.2;
      .icon {
        width: 20px;
        margin-right: 20px;
      }
    }
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

.chartDialog{
  .el-dialog{
    margin-top: 30px !important;
    .el-dialog__body{
      .top-box{
        display: -webkit-box;
        .progress-box{
          width: 28%;
          position: relative;
          padding-top: 7%;
          padding-left: 7%;
          p{
            font-size: 18px;
            font-weight: bold;
            width: 126px;
            text-align: center;
            margin: 0;
          }
          .el-progress__text{
            font-size: 18px;
            font-weight: bold;
          }
        }
      }
      .bottom-box{
        display: -webkit-box;
        .state-box{
          width: 28%;
          text-align: center;
          box-shadow: 0 1px 4px rgba(0,21,41,0.08);
          padding: 5px 20px;
          .state-text{
            text-indent: 2em;
            text-align: left;
            line-height: 26px;
            letter-spacing: 1px;
          }
        }
      }
    }
    .el-dialog__header{
      box-shadow: 0 1px 4px rgba(0,21,41,0.08);
    }
    .descript>li {
      margin-bottom: 10px;
    }
  }
}
</style>
