<template lang="html">
  <div v-loading="vLoading">
    <!-- 任务时间列表 -->
    <div class="cron-table">
      <el-table :data="taskTableData" style="width: 100%" size="mini">
        <el-table-column prop="taskName" label="任务名称" align="center"></el-table-column>
        <el-table-column prop="cronDate" label="任务配置时间" align="center"></el-table-column>
        <el-table-column fixed='right' label="操作" width="300" align="center">
          <template slot-scope="scope">
              <el-button type="primary" size="mini" plain class="el-icon-thumb" @click="handleManualTask">手动触发</el-button>
              <el-button type="danger" size="mini" plain class="el-icon-guide" @click="handleMissionLocus">历史轨迹</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 任务时间配置 -->
    <div class="cron" :val="value_">
      <el-tabs v-model="activeName">
        <el-tab-pane label="秒" name="s">
          <second-and-minute v-model="sVal" lable="秒"></second-and-minute >
        </el-tab-pane>
        <el-tab-pane label="分" name="m">
          <second-and-minute v-model="mVal" lable="分"></second-and-minute >
        </el-tab-pane>
        <el-tab-pane label="时" name="h">
          <hour v-model="hVal" lable="时"></hour>
        </el-tab-pane>
        <el-tab-pane label="日" name="d">
          <day v-model="dVal" lable="日"></day>
        </el-tab-pane>
        <el-tab-pane label="月" name="month">
          <month v-model="monthVal" lable="月"></month>
        </el-tab-pane>
        <el-tab-pane label="周" name="week">
          <week v-model="weekVal" lable="周"></week>
        </el-tab-pane>
      </el-tabs>
      <!-- table -->
      <el-table
        :data="tableData"
        size="mini"
        border
        style="width: 100%;">
        <el-table-column
          prop="sVal"
          label="秒"
          width="200">
        </el-table-column>
        <el-table-column
          prop="mVal"
          label="分"
          width="200">
        </el-table-column>
        <el-table-column
          prop="hVal"
          label="时"
          width="200">
        </el-table-column>
        <el-table-column
          prop="dVal"
          label="日"
          width="200">
        </el-table-column>
        <el-table-column
          prop="monthVal"
          label="月"
          width="200">
        </el-table-column>
        <el-table-column
          prop="weekVal"
          label="周">
        </el-table-column>
      </el-table>
      <div class="task-cron">
        <el-input v-model="taskCron" :readonly="true"></el-input>
        <el-button type="primary" plain @click="handleTaskCron">提 交</el-button>
      </div>
    </div>
    <div class="cron-drawer">
      <el-drawer class="drawer-box" title="历史轨迹" :visible.sync="drawer" size="50%">
        <div class="drawer-table">

          <el-table :data="drawerTableData" style="width: 100%" size="mini" max-height="800">
            <el-table-column prop="createTime" label="执行时间" align="center"></el-table-column>
            <el-table-column fixed='right' label="操作" align="center">
              <template slot-scope="scope">
                  <el-button type="primary" size="mini" plain class="el-icon-document" @click="handleDetails(scope.$index, drawerTableData)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-drawer class="innerDrawer-box" title="轨迹详情" :append-to-body="true" :before-close="handleClose" :visible.sync="innerDrawer">
            <el-timeline>
              <el-timeline-item v-for="(item, index) in timelines" :key="index" :timestamp="item.createTime" placement="top">
                <el-card>
                  <p>{{item.trace}}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-drawer>

        </div>
      </el-drawer>
    </div>
  </div>
  
</template>

<script>
import { getList, editTask, manualTask, missionLocusList, missionLocusDetails } from '@/api/taskAllocation'
import SecondAndMinute from './components/secondAndMinute'
import hour from './components/hour'
import day from './components/day'
import month from './components/month'
import week from './components/week'
export default {
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      vLoading: false,
      activeName: 's',
      sVal: '',
      mVal: '',
      hVal: '',
      dVal: '',
      monthVal: '',
      weekVal: '',
      taskCron: '',
      id: '',
      taskTableData: [{
        taskName: 'THEONE 机器人',
        cronDate: ''
      }],
      drawerTableData: [],
      timelines: [],
      drawer: false,
      innerDrawer: false,
    }
  },
  watch: {
    'value' (a, b) {
      this.updateVal()
    }
  },
  computed: {
    tableData () {
      return [{
        sVal: this.sVal,
        mVal: this.mVal,
        hVal: this.hVal,
        dVal: this.dVal,
        monthVal: this.monthVal,
        weekVal: this.weekVal,
      }]
    },
    value_ () {
      if (!this.dVal && !this.weekVal) {
        return ''
      }
      if (this.dVal === '?' && this.weekVal === '?') {
        this.$message.warning('日期与星期不可以同时为“不指定”')
      }
      if (this.dVal !== '?' && this.weekVal !== '?') {
        this.$message.warning('日期与星期必须有一个为“不指定”')
      }
      let v = `${this.sVal} ${this.mVal} ${this.hVal} ${this.dVal} ${this.monthVal} ${this.weekVal}`
      if (v !== this.value) {
        this.$emit('input', v)
      }
      this.taskCron = v;
      return v
    }
  },
  created () {  
    this.updateVal();
    this.fetchData();    
  },
  components: {
    SecondAndMinute, hour, day, month, week
  },
  methods: {
    updateVal () {
      if (!this.value) {
        return
      }
      let arrays = this.value.split(' ')
      this.sVal = arrays[0]
      this.mVal = arrays[1]
      this.hVal = arrays[2]
      this.dVal = arrays[3]
      this.monthVal = arrays[4]
      this.weekVal = arrays[5]
    },
    //加载任务时间
    fetchData(){
      this.vLoading = true;
      getList().then(response => {
        this.vLoading = false;
        this.value = response.cron;
        this.taskTableData[0].cronDate = response.cron;
        this.id = response.id;
      })
    },
    //修改任务时间
    handleTaskCron(){
      let datas = {
        cron: this.taskCron,
        id: this.id
      }
      editTask(datas).then(response => {
        this.fetchData();
        this.updateVal();
        this.$message({
          message: '修改成功！',
          type: 'success'
        });
      })
    },
    //手动启用
    handleManualTask(){
      manualTask().then(response => {
        this.$message({
          message: '手动启用成功！',
          type: 'success'
        });
      })
    },
    //任务轨迹
    handleMissionLocus(){
      this.drawer = true;
      missionLocusList().then(response => {
        this.drawerTableData = response
      })
    },
    //任务轨迹详情
    handleDetails(index, rows){
      this.innerDrawer = true;
      missionLocusDetails(rows[index].jobId).then(response => {
        console.log(response)
        this.timelines =  response
      })
    },
    handleClose(done) {
      done();
    }
  },
}
</script>

<style lang="scss">
.cron {
  width: 95%;
  margin: 10px auto;
  text-align: left;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  padding: 20px 30px;
}
.task-cron{
  margin-top: 20px;
  display: flex;
  .el-input{
    margin-right: 10px;
  }
}
.cron-table{
  width: 95%;
  margin: 10px auto;
}
.drawer-box,.innerDrawer-box{
  .el-drawer__header{
    position: fixed;
    top: 0;
    right: 0;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    padding: 20px;
  }
  .el-drawer__body{
    width: 100%;
    max-height: 800px;
    position: absolute;
    top: 80px;
    bottom: 30px;
    right: 0;
    overflow: auto;
    padding-top: 10px;
  }
  .el-card__body{
    padding: 0;
    padding-left: 20px;
  }
}
.drawer-box{
  .el-drawer__header{
    width: 50%;
  }
}
.innerDrawer-box{
  .el-drawer__header{
    width: 30%;
  }
}
.drawer-table{
  width: 95%;
  margin: 0 auto;
}
.el-timeline{
  padding-right: 20px;
}
</style>
