<template>
  <div :id="id" :class="option.class" :style="option.style"></div>
</template>

<script>
export default {
  name: 'Radar',
  props: {
    id: {
      type: String,
      default: ''
    },
    option: {
      type: Object
    },
    zwfwProportion: {
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
        title: {
          show: false
        },
        tooltip: {},
        legend: {
          show: false,
          data: ['预算分配']
        },
        radar: {
          name: {
            textStyle: {
              color: 'rgba(165,220,255,1)',
              padding: [6, 0, 0, 0]
            }
          },
          nameGap: 1,
          axisLine: {
            lineStyle: {
              type: 'dotted',
              color: 'rgba(55,159,235,0.31)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(55,159,235,0.31)'
            }
          },
          splitArea: {
            areaStyle: {
              color: ['rgba(127,181,255,0)', 'rgba(127,181,255,0.17)']
            }
          },
          indicator: this.zwfwProportion.indicator
        },
        series: [{
          name: '',
          type: 'radar',
          symbol: 'none',
          itemStyle: {
            color: 'rgba(6,245,255,1)'
          },
          areaStyle: {
            normal: {
              opacity: 0.05,
              color: 'rgba(2,255,241,0.29)'
            }
          },
          data: [
            {
              value: this.zwfwProportion.value,
              name: ''
            }
          ]
        }]
      }
    }
  }
}
</script>

<style scoped>

</style>
