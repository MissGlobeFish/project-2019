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
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
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
        title : {
            text: 'KPI 考核结果',
            subtext: ''
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['部门']
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : ['人力行政部','软件研发部','商务合作部','地产研发','餐饮研发','产品部','财务部','旺桌牌项目部','售后服务部','餐饮产品','地产产品']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name: '综合得分 ',
                type: 'bar',
                data: [1.8, 4.9, 9.567, 3.2, 5.6, 6.7, 5.6, 2.2, 3.6, 2.0, 6.4],
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            },
        ],
        visualMap: {
            orient: 'horizontal',
            left: 'center',
            min: 0,
            max: 10,
            show: false,
            dimension: 1,
            inRange: {
                color: ['#e7f9a8', '#59a0d5']
            }
        },
      })
      
      //点击事件
      this.chart.on('click', function(params) {
          console.log(params)
          self.$emit('chartKPIParams', true, params)
      })
    },
  }
}
</script>
