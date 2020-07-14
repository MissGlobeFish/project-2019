<!--
 * @Description: 假期
 * @Author: ep
 * @Date: 2019-11-12 17:02:55
 * @LastEditTime: 2019-11-13 17:57:47
 -->
<template>
  <div>
    <el-calendar v-model="value"  :first-day-of-week=7>
      <template
          slot="dateCell"
          slot-scope="{date, data}">
       <div @click="handleSee()">
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-').slice(2).join('')}}
          </p>
          <p v-if="isShowHoliday(date,newData)" class="holiday">假</p>
       </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
import { fetchList } from '@/api/holiday.js'
import data from './json/date.json'
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      value: new Date(),
      newData: data
    };
  },
  computed: {

  },
  mounted () {
    // console.log(data)
    // this.getList()
  },
  watch: {

  },
  methods: {
    fetchAllDate() {
      let d = new Date();
      let fullYear = (new Date()).getFullYear();
      let allMonth = [];
      let days = [];
      let allDate = [];
      let test = []
      for (let i=0;i<12;i++) {
        d.setMonth(i);
        var m = d.getMonth()+1;
        m = m < 10 ? 0 + m : m;
        allMonth.push(m)
        let date=new Date(fullYear,m,0);
        days.push(date.getDate());
      }

      for (let j =1;j<=1;j++) {
        for (let z = 1;z<=31; z++) {
          var  formatj = j < 10 ? '0' + j : ''+j;
          var  formatz = z < 10 ? '0' + z : ''+z;
          console.log(fullYear+'09'+formatz)
          fetchList({date: fullYear+'09'+formatz}).then((res)=>{
            console.log(res)
          })
        }
      }
      // let days;
      // if (fullYear % 4 == 0 && (fullYear % 100 != 0 || fullYear % 400 == 0)) {
      //   days = 366;
      // } else {
      //   days = 365
      // } 

      // for (var i=0;i<days;i++) {
      //   fetchList({date: `${fullYear}`}).then(()=>{
      //     console.log(12313)
      //   })
      // }

    },
    getList() {
      this.fetchAllDate()
    },
    // 是否显示假期
    isShowHoliday(value,newData) {
      let currentDay = newData[value.getMonth()+1].data[value.getDate()-1];
      if (currentDay && (currentDay.data != 0)) {
        return true
      }
    },
    // 点击日期单元格
    handleSee() {
      console.log("假期") 
    }
  },
};
</script>

<style  lang="scss">
.el-calendar-table .el-calendar-day {
  position: relative;
}
.holiday {
  background-color: #FF7800;
  color: #FFFFFF;
  height: 16px;
  padding: 2px;
  position: absolute;
  right: 0;
  top: -12px;
  width: 16px;
  font-size: 12px;
}
</style>
