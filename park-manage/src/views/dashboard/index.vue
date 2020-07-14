<template>
<div class="dashboard-container">
  <vue-particles class="backgroundBox" color="#304156"></vue-particles>
  <div class="dashboardBox">
    
    <!-- <el-form :inline="true" :model="historyForm" ref="historyForm" class="demo-ruleForm" size="small">
      <el-form-item label="开始日期" prop="startTime">
        <el-date-picker v-model="historyForm.startTime" @change="startTimeChange" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endTime">
        <el-date-picker v-model="historyForm.endTime" :picker-options="pickerOptions" @change="endTimeChange" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData('historyForm')">查询</el-button>
      </el-form-item>
    </el-form> -->
    <panel-group />
    
    <div class="dashboard-editor-container">

      <!-- <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <card-stats />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <card-renew />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <facility-fault />
          </div>
        </el-col>
      </el-row> -->

      <el-row style="margin-bottom:35px;">
        <el-form :inline="true" :model="todayForm" ref="todayForm" class="demo-ruleForm" size="small">
          <el-form-item label="查询日期" prop="startTime">
            <el-date-picker v-model="todayForm.startTime" @change="startTimeChange" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="fetchData('todayForm')">查询</el-button>
          </el-form-item>
        </el-form>

        <today-stats />

      </el-row>

      <el-row style="margin-bottom:35px;">
        <el-form :inline="true" :model="historyForm" ref="historyForm" class="demo-ruleForm" size="small">
          <el-form-item label="开始日期" prop="startTime">
            <el-date-picker v-model="historyForm.startTime" @change="startTimeChange" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" prop="endTime">
            <el-date-picker v-model="historyForm.endTime" :picker-options="pickerOptions" @change="endTimeChange" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="fetchData('historyForm')">查询</el-button>
          </el-form-item>
        </el-form>

        <history-record />

      </el-row>
      
    </div>
  </div>
</div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import CardStats from './components/CardStats'
import CardRenew from './components/CardRenew'
import HistoryRecord from './components/HistoryRecord'
import TodayStats from './components/TodayStats'
import FacilityFault from './components/FacilityFault'

import BarChart from './components/BarChart'
import KpiRate from './components/KpiRate'
import MonthlyChart from './components/MonthlyChart'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    CardStats,
    CardRenew,
    HistoryRecord,
    TodayStats,
    FacilityFault,

    BarChart,
    KpiRate,
    MonthlyChart
  },
  data() {
    return {
      chart: null,
      todayForm: {//停车统计BI查询初始数据
        startTime: (new Date()).getTime(),
      },
      historyForm: {//停车统计BI查询初始数据
        startTime: this.getBeforeDate(8),
        endTime: this.getBeforeDate(1),
      },
      pickerOptions: {
        disabledDate:(time) => {
          if( this.historyForm.startTime != ""){
            return time.getTime() < this.historyForm.startTime;
          }else {
            return time.getTime() > Date.now();
          }
        }
      },
    }
  },
  methods: {
    //查询停车统计BI
    fetchData(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          /* statisticsBI(this.historyForm).then(response => {
              response.data.forEach(item => {
                this.weekChartData.crosswiseData.push(item.date);
                this.weekChartData.endlongData.push(item.num);
              });
          }) */
        } else {
          return false;
        }
      });
    },
    //开始时间 
    startTimeChange(val){
      this.historyForm.startTime = (new Date(val)).getTime();
    },
    //结束时间
    endTimeChange(val){
      this.historyForm.endTime = (new Date(val)).getTime();
    },
    //日期时间计算
    getBeforeDate(n) {
      var s;
      var n = n;
      var d = new Date();
      var year = d.getFullYear();
      var mon = d.getMonth() + 1;
      var day = d.getDate();
      if(day <= n) {
          if(mon > 1) {
              mon = mon - 1;
          } else {
              year = year - 1;
              mon = 12;
          }
      }
      d.setDate(d.getDate() - n);
      return d.getTime();
    },
  }
}
</script>

<style lang="scss">
.dashboard-container {
  .backgroundBox{
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index:-999;
  }
  .dashboardBox{
    padding: 0 2%;
    margin-top: 20px;
    .chart{
      width: 100% !important;
      height: 500px !important;
    }
  }
}
.dashboard-editor-container {
  padding: 0 32px 32px;
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    //background: rgb(240, 242, 245);
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
