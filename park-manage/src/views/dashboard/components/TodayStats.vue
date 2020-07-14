<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { todayStats } from '@/api/dashboard'

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
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      chartData: {
        date: '',//日期
        clock: [],//横坐标
        inCount: [],//入场数
        outCount: [],//出场数
      }
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
      todayStats({parkId:2,queryCreateDateBegin:'2019-11-28'}).then(response => {
          this.chartData.date = response.data.date;
          this.chartData.clock = response.data.inCount.clock;
          this.chartData.outCount = response.data.outCount.data;
          this.chartData.inCount = response.data.inCount.data;

            this.chart = echarts.init(this.$el, 'macarons')
            this.chart.setOption({
              backgroundColor: '#394056',
              title: {
                top: 8,
                text: '趋势详情（' + this.chartData.date + '）',
                textStyle: {
                  fontWeight: 'normal',
                  fontSize: 16,
                  color: '#F1F1F3'
                },
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
                top: 8,
                textStyle: {
                  fontSize: 12,
                  color: '#F1F1F3'
                },
                  data:['停车数','入场','出场',]
              },
              xAxis: [
                  {
                      type: 'category',
                      axisLine: {
                        lineStyle: {
                          color: '#57617B'
                        }
                      },
                      data: this.chartData.clock,
                      axisPointer: {
                          type: 'shadow'
                      }
                  }
              ],
              yAxis: [
                  {
                      type: 'value',
                      name: '进出数( 辆 )',
                      axisTick: {
                        show: false
                      },
                      axisLine: {
                        lineStyle: {
                          color: '#57617B'
                        }
                      },
                      axisLabel: {
                        margin: 10,
                        textStyle: {
                          fontSize: 14
                        }
                      },
                      splitLine: {
                        lineStyle: {
                          color: '#57617B'
                        }
                      },
                      axisLabel: {
                          formatter: '{value} 辆'
                      }
                  },
                  {
                      type: 'value',
                      name: '停车数( 辆 )',
                      axisTick: {
                        show: false
                      },
                      axisLine: {
                        lineStyle: {
                          color: '#57617B'
                        }
                      },
                      axisLabel: {
                        margin: 10,
                        textStyle: {
                          fontSize: 14
                        }
                      },
                      splitLine: {
                        lineStyle: {
                          color: '#57617B'
                        }
                      },
                      axisLabel: {
                          formatter: '{value} 辆'
                      }
                  },
              ],
              series: [
                  /* {
                      name:'停车数',
                      type:'bar',
                      yAxisIndex: 1,
                      data:[2, 4, 7, 2, 5, 6, 1, 6, 3, 2, 6, 3]
                  }, */
                  {
                      name:'入场',
                      type:'line',
                      yAxisIndex: 0,
                      data:this.chartData.inCount
                  },
                  {
                      name:'出场',
                      type:'line',
                      yAxisIndex: 0,
                      data:this.chartData.outCount
                  },
              ]
            })
      })
    }
  }
}
</script>
