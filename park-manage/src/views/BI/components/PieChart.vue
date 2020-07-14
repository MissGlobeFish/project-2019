<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  data() {
    return {
      chart: null
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
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          top: 20,
          text: '今日统计',
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
            data:['停车数','出场','入场']
        },
        xAxis: [
            {
                type: 'category',
                axisLine: {
                  lineStyle: {
                    color: '#57617B'
                  }
                },
                data: ['00-02点','02-04点','04-06点','06-08点','08-10点','10-12点','12-14点','14-16点','16-18点','18-20点','20-22点','22-24点'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '停车数( 辆 )',
                axisLabel: {
                    formatter: '{value} 辆'
                }
            },
            {
                type: 'value',
                name: '进出数( 辆 )',
                axisLabel: {
                    formatter: '{value} 辆'
                }
            }
        ],
        series: [
            {
                name:'停车数',
                type:'bar',
                data:[2, 4, 7, 2, 5, 6, 1, 6, 3, 2, 6, 3]
            },
            {
                name:'出场',
                type:'line',
                yAxisIndex: 1,
                data:[2, 2, 3, 4, 6, 10, 2, 3, 3, 6, 1, 6]
            },
            {
                name:'入场',
                type:'line',
                yAxisIndex: 1,
                data:[4, 5, 3, 6, 7, 3, 6, 5, 3, 6, 2, 6]
            }
        ],
      })
    }
  }
}
</script>
