<!--
 * @Description:
 * @Author: ep
 * @Date: 2019-10-28 15:35:58
 * @LastEditTime: 2019-11-05 12:06:26
 -->
<template>
  <div class="add-box">
    <!-- 计划实施的时间 -->
    <div class="plan-date item">
      <span>计划起始时间：</span>
      <el-date-picker
        class="date-picker"
        size="small"
        v-model="dateForm.dateRange"
        value-format="timestamp"
        type="daterange"
        range-separator="至"
        start-placeholder="计划开始日期"
        end-placeholder="计划结束日期">
      </el-date-picker>
    </div>
    <!-- 类型为年的配置 -->
    <div class="year-add item" v-if="type == 'month'">
      <span>上下班时间：&emsp;</span> 
       <el-time-select placeholder="上班时间"  v-model="dateForm.month.startTime"  size="small"
        class="el-time-select"
        :picker-options="{
        start: '00:00',
        step: '00:15',
        end: '24:00'
      }">
      </el-time-select>
      <el-time-select placeholder="下班时间" v-model="dateForm.month.endTime" size="small"
        class="el-time-select"
        :picker-options="{
          start: '00:00',
          step: '00:15',
          end: '24:00',
          minTime: dateForm.month.startTime
        }">
      </el-time-select>
    </div>
    <div class="week-add item" v-if="type == 'week'">
      <div class="item" v-for="(item, index) in dateForm.week" :key="index">
        <span>{{item.title}}：</span>
        <el-time-select placeholder="上班时间"  v-model="item.startTime"  size="small"
          class="el-time-select"
          :picker-options="{
          start: '00:00',
          step: '00:15',
          end: '24:00'
        }">
        </el-time-select>
        <el-time-select placeholder="下班时间" v-model="item.endTime" size="small"
          class="el-time-select"
          :picker-options="{
            start: '00:00',
            step: '00:15',
            end: '24:00',
            minTime: item.startTime
          }">
      </el-time-select></div>
    </div>
      <!-- <div v-if="!(itemsArr.length <= 1 )" class="delete" @click="handleDelete(index)"><i class="el-icon-delete" /></div> -->
    <!-- <div class="add-btn" @click="addItem"><i class="el-icon-plus" /></div> -->
  </div>
</template>

<script>
export default {
  name: 'AddItems',
  props: {
   type: {
     type: String,
     default: ()=>{
       return 'month'
     }
   },
   dateProp: {
     type: String | Array | Object,
     default: ()=>{
       return {}
     }
   }
  },
  data() {
    return {
      dateForm: this.dateProp
      
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  .add-box {
    width: 100%;
    padding-right: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .date-picker {
      width: 60%;
    }
    .el-time-select {
      width: 30%
    }
    .item:not(:first-child) {
      margin-top: 20px;
    }
  }
</style>
