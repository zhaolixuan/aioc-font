<template>
  <div :id="id" :class="option.class" :style="option.style"></div>
</template>

<script>
export default {
  name: 'Industry',
  props: {
    id: {
      type: String,
      default: ''
    },
    option: {
      type: Object
    },
    dataObj: {
      type: Object
    }
  },
  mounted () {
    this.init()
  },
  destroyed () {
    window.removeEventListener('resize', this.resizeHandle)
  },
  watch: {
    value: {
      handler (newVal, oldVal) {
        if (this.chart) {
          this.chart.setOption(this.defaultOption())
        } else {
          this.init()
        }
      },
      deep: true // 对象内部属性的监听，关键。
    }
  },
  methods: {
    init () {
      this.chart = this.$echarts.init(document.getElementById(this.id))
      this.chart.setOption(this.defaultOption())
      window.addEventListener('resize', this.resizeHandle)
    },
    resizeHandle () {
      this.chart.resize()
    },
    defaultOption () {
      return {
        grid: {
          top: 'middle',
          left: '3%',
          right: '4%',
          bottom: '3%',
          height: '80%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
        icon: 'circle',
        itemWidth:8,
        itemHeight:8,
        color: ["#F46824", "#47FFF6", "#A8E7F6"],
        data: ['第一产业', '第二产业', '第三产业'],
        left: 'center',
        textStyle:{
            color:'#fff',
            fontSize:10
        },
        top: 'top'
        },
        xAxis: {
        type: 'category',
        // data: [100,105,120,130,160,189,100,137,128,130,140,189],
        axisLine: {
           show:false,
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        },
         yAxis: {
        type: 'value',
        splitLine: {
            show:false,
        },
        axisLine: {
            show: false,
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        nameTextStyle: {
            color: "#999"
        },
        splitArea: {
            show: false
        }
        },
         series: [{
            name: '第一产业',
            type: 'line',
            data: [6.9,21.6],
            color: "#F58080",
            lineStyle: {
                normal: {
                    width: 2,
                    color: {
                        type: 'linear',

                        colorStops: [{
                            offset: 0,
                            color: '#F46824' // 0% 处的颜色
                        }, {
                            offset: 0.4,
                            color: '#F46824' // 100% 处的颜色
                        }, {
                            offset: 1,
                            color: '#F46824' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    },
                }
            },
            symbol:'circle',
			symbolSize: 2,
            itemStyle: {
                normal: {
                    color: '#F46824',
                    borderWidth: 2,
                    borderColor: "#F46824"
                }
            },
            smooth: true
        },
        {
            name: '第二产业',
            type: 'line',
            data: [151.2,135.5],
            lineStyle: {
                normal: {
                    width: 2,
                    color: {
                        type: 'linear',

                        colorStops: [{
                                offset: 0,
                                color: '#47FFF6' // 0% 处的颜色
                            },
                            {
                                offset: 0.4,
                                color: '#47FFF6' // 100% 处的颜色
                            }, {
                                offset: 1,
                                color: '#47FFF6' // 100% 处的颜色
                            }
                        ],
                        globalCoord: false // 缺省为 false
                    },
                }
            },
            symbol:'circle',
			symbolSize: 2,
            itemStyle: {
                normal: {
                    color: '#47FFF6',
                    borderWidth: 2,
                    borderColor: "#47FFF6"
                }
            },
            smooth: true
        },
        {
            name: '第三产业',
            type: 'line',
             data: [112,104.2],
            lineStyle: {
                normal: {
                    width: 2,
                    color: {
                        type: 'linear',

                        colorStops: [{
                                offset: 0,
                                color: '#A8E7F6' // 0% 处的颜色
                            },
                            {
                                offset: 0.4,
                                color: '#A8E7F6' // 100% 处的颜色
                            }, {
                                offset: 1,
                                color: '#A8E7F6' // 100% 处的颜色
                            }
                        ],
                        globalCoord: false // 缺省为 false
                    },
                }
            },
            symbol:'circle',
			symbolSize: 2,
            itemStyle: {
                normal: {
                    color: '#A8E7F6',
                    borderWidth: 2,
                    borderColor: "#A8E7F6"
                }
            },
            smooth: true
        }
    ]


      }
    }
  }
}
</script>

<style scoped>

</style>
