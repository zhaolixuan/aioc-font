<template>
  <div :id="id" :class="option.class" :style="option.style"></div>
</template>

<script>
export default {
  name: 'Line',
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
          top: 20,
          bottom: 25,
          right: 15
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            var relVal = params[0].name
            for (var i = 0, l = params.length; i < l; i++) {
              relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + '%'
            }
            return relVal
          },
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          show: false
        },
        legend: {
          show: false,
          data: ['蒸发量', '总值']
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              textStyle: {
                color: 'rgba(165,220,255,.7)'
              },
              interval: '0'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(165,220,255,.29)'
              }
            },
            data: this.dataObj.timeList
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            max: this.dataObj.yMax,
            interval: this.dataObj.yInterval,
            axisLabel: {
              textStyle: {
                color: 'rgba(165,220,255,.7)'
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: 'dotted',
                color: 'rgba(165,220,255,.29)'
              }
            }

          }
        ],
        series: [
          {
            name: 'GDP',
            type: 'line',
            symbol: 'circle',
            smooth: true,
            data: this.dataObj.dataList,
            lineStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: 'rgba(97,252,255,1)'
              }, {
                offset: 1,
                color: 'rgba(37,153,255,1)'
              }])
            },
            itemStyle: {
              color: 'rgba(67,198,230,1)',
              shadowColor: 'rgba(0,0,0,0.5)',
              shadowBlur: 2
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(37,153,255,0.43)'
              }, {
                offset: 1,
                color: 'rgba(97,205,255,0)'
              }])
            }
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
