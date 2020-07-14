<!--
 * @Description: 
 * @Author: rcq
 * @Date: 2019-11-07 15:24:18
 * @LastEditTime: 2019-11-08 10:35:07
 -->
<template>
  <div>
    <p></p>
    <div class="content">



      <el-calendar v-model="value" :first-day-of-week=7>
        <template
          slot="dateCell"
          slot-scope="{date, data}">
          <div v-if="list.length > 0" @click="handleSee()">
            <!-- {{date.getDay()}} -->
            <div class="warn" v-if=" isException(list[(data.day.split('-').slice(2).join('')*1)-1], date)"></div>
            <p :class="data.isSelected ? 'is-selected' : ''">
              {{ data.day.split('-').slice(2).join('')}}
            </p>
            <p v-if="isShowAttendance(date)" class="work-time">上班时间：{{ showDateFilter(data, date) | parseTime('{h}:{i}:{s}')}}</p>
            <p v-if="isShowAttendance(date)" class="work-time">下班时间：{{ list[(data.day.split('-').slice(2).join('')*1)-1].punch[1]| parseTime('{h}:{i}:{s}')}}</p>
          </div>
        </template>
      </el-calendar>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import {fetchList} from "@/api/mySelfAttendance";
import { log } from 'util';
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
       value: new Date(),
       list: [],
       visible: false
    };
  },
  computed: {

  },
  mounted () {
     fetchList().then(response => {
        // console.log(response)
        this.list = response.data.items
      })
  },
  watch: {

  },
  methods: {

    // 是否显示考勤日期
    isShowAttendance(value) {
      let currentDay = value.getDay();
      if (currentDay == 0 || currentDay == 6) {
        return false
      }
      if (value > new Date()) {
        return false
      }

      return true
    },


    // 考勤是否异常
    isException(value,date) {
      if (value && value.status && this.isShowAttendance(date) ) {
        return true
      }
      return false
      console.log(value)
    },

    showDateFilter(data,date) {
      return this.list[(data.day.split('-').slice(2).join('')*1)-1].punch[0]
    },

    handleSee() {
      console.log("查看异常")
       this.visible = !this.visible
    }
  },
};
</script>

<style lang="scss">
.work-time {
  font-size: 12px;
}
.content p {
  margin: 0 0 10px 0;
}
.el-calendar-table .el-calendar-day {
  position: relative;
}
.warn {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #E6A23C;
  right: 10px;
}
</style>
