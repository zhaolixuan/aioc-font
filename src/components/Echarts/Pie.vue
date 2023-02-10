<template>
  <div :id="id" :class="option.class" :style="option.style"></div>
</template>

<script>
export default {
  name: 'Pie',
  props: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String ,
      default: ''
    },
    value: {
      type: Number,
      default: 0
    },
    option: {
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
        legend: {
          show: false,
          data: [this.name]
        },
        series: [
          {
            type: 'pie',
            grid: {
              left: 0, top: 0, right: 0, bottom: 0
            },
            hoverAnimation: false, // 鼠标经过的特效
            radius: ['75%', '90%'],
            x: '0%', // for funnel
            label: {
              normal: {
                position: 'center',
                lineHeight: 16,
                formatter: function (params) {
                  if (params.name === 'other') { return '' }
                  return params.name + '\n' + params.value + '%'
                },
                textStyle: {
                  color: '#A5DCFF',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontFamily : "#Arial",
                  fontSize: 12
                }
              }
            },
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                  offset: 0,
                  color: '#137AEF'
                }, {
                  offset: 1,
                  color: '#63BAFE'
                }]),
                labelLine: {
                  show: false
                }
              }
            },
            data: [
              { name: 'other', value: 100 - this.value, itemStyle: { color: 'rgba(14,119,244,0.1)' } },
              { name: this.name, value: this.value }

            ]
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
