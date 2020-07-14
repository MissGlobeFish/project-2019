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
    data: {
      type: Array,
      default: []
    },
    value: {
      type: Array,
      default: []
    },
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
      default: '350px'
    },
    title: {
      type: String,
      default: ""
    }
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
            text: this.title,
            subtext: ''
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['员工']
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : this.data
            }
        ],
        yAxis : [
          
            {
              name: "人数",
              type : 'value'
            }
        ],
        series : [
            {
               
                type: 'bar',
                data: this.value,
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
            // min: 0,
            // max: 10,
            show: false,
            // dimension: 1,
            inRange: {
                color: ['#f56c6c', '#6f7ad3']
            }
        },
      })
      
      //点击事件
      this.chart.on('click', function(params) {
          self.$emit('barChartEvent', true, params)
      })
    },
  }
}
</script>
