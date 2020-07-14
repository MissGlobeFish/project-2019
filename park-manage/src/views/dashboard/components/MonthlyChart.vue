<template>

  <div :class="className" :style="{height:height,width:width}" />

</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 3000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '70%'
    },
    height: {
      type: String,
      default: '450px'
    },
  },
  data() {
    return {
      chart: null,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      let self = this;
      this.chart = echarts.init(this.$el, 'macarons')
      
      this.chart.setOption({
        title: {
            text: '员工 2019 年度得分统计'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['自评得分','他评得分','综合得分']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['一月','二月','三月','四月','五月','六月','七月', '八月','九月','十月','十一月','十二月']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name:'自评得分',
                type:'line',
                data:[2.3, 5.1, 6.2, 4.8, 7.4, 8.2, 9.0, 4.5, 3.3, 4.1, 5.1, 3.2, 7.4, 7.1]
            },
            {
                name:'他评得分',
                type:'line',
                data:[2.2, 6.1, 5.5, 6.0, 8.0, 3.3, 4.9, 6.4, 1.8, 9.1, 7.6, 5.9, 3.7, 4.9]
            },
            {
                name:'综合得分',
                type:'line',
                data:[5.1, 3.2, 2.1, 5.4, 9.1, 3.3, 4.1, 5.1,  5.5, 6.0, 8.0, 3.3, 4.9, 5.9]
            },
        ]
      })
    },
  }
}
</script>
