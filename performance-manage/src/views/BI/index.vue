<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <okr-kpi />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <finish-rate />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <raddar-chart v-on:chartKPIParams="chartKPIParams"/>
    </el-row>
    
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <pie-chart />
    </el-row>

    <el-dialog class="chartDialog" :title="chartTitle" :visible.sync="chartDialogVisible" width="50%" center>

      <div class="top-box">
        <kpi-rate />
        <div class="progress-box">
          <el-progress type="dashboard" :percentage="percentage" :color="colors" :format="format"></el-progress>
          <p>综合得分</p>
        </div>
      </div>
      
      <div class="bottom-box">
        <bar-chart v-on:innerchartKPIParams="innerchartKPIParams" />
        <div class="state-box">
          <p>说明</p>
          <p class="state-text">1.对人力资源外在要素 -- 量的管理。对人力资源进行量的管理，就是根据人力和物力及其变化，使二者经常保持最佳比例和有机的结合，使人和物都充分发挥出最佳效应。</p>
          <p class="state-text">2.对人力资源内在要素 -- 质的管理。主要是指采用现代化的科学方法，对人的思想、心理和行为进行有效的管理，充分发挥人的主观能动性，以达到组织目标。</p>
        </div>
      </div>

      <el-dialog  class="innerChartDialog"width="60%" :title="innerChartTitle" :visible.sync="innerVisible" append-to-body center>

        <div class="top-box">
          <p class="score-text">得分统计</p>
          <div class="progress-box">
            <el-progress type="dashboard" :percentage="innerSelfPercentage" :color="colors" :format="format"></el-progress>
            <p>自评得分</p>
          </div>
          <div class="progress-box">
            <el-progress type="dashboard" :percentage="innerLeaderPercentage" :color="colors" :format="format"></el-progress>
            <p>他评得分</p>
          </div>
          <div class="progress-box">
            <el-progress type="dashboard" :percentage="totalPercentage" :color="colors" :format="format"></el-progress>
            <p>综合得分</p>
          </div>
        </div>
        
        <div class="bottom-box">
          <monthly-chart />
          <div class="state-box">
            <p>评语</p>
            <p class="state-text">1.工作认真，积极勤奋，进步很快，在短时间内掌握工作要点，完成了公司制定的任务。</p>
            <p class="state-text">2.工作上勤勤恳恳，任劳任怨，认真负责，悟性较强，能随时根据工作需要调整工作方法和端正心态。</p>
            <p class="state-text">3.对待工作严谨、处处为公司考虑，能够虚心接受同事给予的建议并改正；学习进步较快、受到大多数客户的好评。</p>
          </div>
        </div>

      </el-dialog>

    </el-dialog>

  </div>
</template>

<script>
import { getDeptTree } from '@/api/organization-tree'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import OkrKpi from './components/OkrKpi'
import FinishRate from './components/FinishRate'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import KpiRate from './components/KpiRate'
import MonthlyChart from './components/MonthlyChart'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    OkrKpi,
    FinishRate,
    RaddarChart,
    PieChart,
    BarChart,
    KpiRate,
    MonthlyChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      chartDialogVisible: false,
      chartTitle: '',
      innerVisible: false,
      innerChartTitle: '',
      percentage: 87,
      innerSelfPercentage: 86,
      innerLeaderPercentage: 52,
      totalPercentage: 69,
      colors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ]
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    format(percentage) {
      return percentage === 100 ? '满分' : `${percentage/10}`;
    },
    format(innerSelfPercentage) {
      return innerSelfPercentage === 100 ? '满分' : `${innerSelfPercentage/10}`;
    },
    format(innerLeaderPercentage) {
      return innerLeaderPercentage === 100 ? '满分' : `${innerLeaderPercentage/10}`;
    },
    format(totalPercentage) {
      return totalPercentage === 100 ? '满分' : `${totalPercentage/10}`;
    },
    chartKPIParams(){
      this.chartDialogVisible = arguments[0]
      this.chartTitle = arguments[1].name + ' KPI 考核结果'
    },
    innerchartKPIParams(){
      this.innerVisible = arguments[0]
      this.innerChartTitle = arguments[1].name + ' KPI 考核结果'
    },
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
  }
}
.innerChartDialog{
  .el-dialog{
    margin-top: 30px !important;
    .el-dialog__body{
      .top-box{
        height: 300px;
        display: -webkit-box;
        .score-text{
          color: #3BA5D9;
          font-size: 18px;
        }
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
  }
}
</style>
