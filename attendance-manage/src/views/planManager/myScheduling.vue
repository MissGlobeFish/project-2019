<!--
 * @Description: 我的排班
 * @Author: ep
 * @Date: 2019-11-04 14:51:46
 * @LastEditTime: 2019-11-05 16:19:55
 -->

<template>
  <div class="app-container">
    <div class="employee">
      <div class="head">
        <div class="tip"><span>以下排班适用有效时间：2019-01-01至2020-12-31</span></div>
        <div class="tip question" @click="clickQuestion"><span>有疑问？</span></div>
      </div>
      <el-table
        :data="tableList"
        border
        fit
        highlight-current-row
        style="width: 100%;">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="title" label="工作日"></el-table-column>
        <el-table-column prop="startTime"label="上班时间"></el-table-column>
        <el-table-column prop="endTime" label="下班时间"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import addItems from './components/addItems'
// import { parseTime,formatTime } from '@/utils'
// import { fetchList, createPlan, updatePlan } from '@/api/myScheduling'
export default {
  components: { addItems },
  props: {

  },
  data() {
    return {
      listLoading: false,
      // dialogVisible: false,
      tableList: [
        {id: 1,title: "周一",startTime: '08:30', endTime: "18:30"},
        {id: 2,title: "周二",startTime: '18:30', endTime: "04:30"},
        {id: 3,title: "周三",startTime: '08:30', endTime: "18:30"},
        {id: 4,title: "周四",startTime: '18:30', endTime: "04:30"},
        {id: 5,title: "周五",startTime: '08:30', endTime: "18:30"},
        {id: 6,title: "周六",startTime: '18:30', endTime: "04:30"},
        {id: 7,title: "周日",startTime: '08:30', endTime: "18:30"}
      ]
    };
  },
  computed: {

  },
  mounted () {
  },
  watch: {

  },
  methods: {
  
    clickQuestion() {
      this.$alert('请联系人力行政部门或直接与部门主管协商', {
          confirmButtonText: '确定'
        });
    }
  },
};
</script>

<style scoped lang="scss">
.app-container {
  width: 80%;
  margin: auto;
}
.head {
  display: flex;
  justify-content: space-between;
  .tip {
    margin: 10px 0;
    font-size: 14px;
    color: #495060;
  }
  .question  {
    color: #1890ff;
    cursor: pointer;
  }
}

</style>
