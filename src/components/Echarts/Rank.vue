<template>
  <div :id="id" :class="option.class" :style="option.style"></div>
</template>

<script>
export default {
  name: 'Rank',
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
          left: '0',
          top: '0',
          right: '16%',
          bottom: '2%',
          containLabel: true
        },
        tooltip: {
          show: true,
          formatter: "{b}:{c}"
        },
        xAxis: {
          type: 'value',
          show:false,
          position: 'top',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#fff',
            }
          },
          splitLine: {
            show: false
          },
        },
        yAxis: [{
          type: 'category',
          axisTick: {
            show: false,
            alignWithLabel: false,
            length: 5,

          },
          "splitLine": { //网格线
            "show": false
          },
          inverse: 'true', //排序
          axisLine: {
            show: false,
            lineStyle: {
              color: '#A5DCFF',
            }
          },
          data:this.dataObj.city
        }

        ],
        series: [{
          name: '排行',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'right',
              formatter: '{c}',
              textStyle: {
                color: '#A5DCFF' //color of value
              }
            }
          },
          itemStyle: {
            normal: {
              show: true,
              color: function(params) {
                var colorArray = [
              {
                top:'rgba(168,231,246,0.19)' , //黄
                bottom: '#CC4E32'
              }, {
                 top:'rgba(0,245,255,0.19)' , //绿
                 bottom:'#00C9FF' 
              },{
                 top: 'rgba(168,231,246,0.19)', //蓝
                 bottom: '#A8E7F6'
              }, {
                 top: 'rgba(0,211,255,0.19)', //深蓝
                 bottom: '#3FD9FE'
              },{
                 top: 'rgba(168,231,246,0.19)', //粉
                 bottom:'#A8E7F6' 
              }
            ];
                let num = colorArray.length;
                return {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }, {
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }, {
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }, {
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }, {
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }, {
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }],
                  //globalCoord: false
                }
              },
              borderWidth: 0,
              borderColor: '#333',
            }
          },
          barGap: '0%',
          barCategoryGap: '80%',
          data:this.dataObj.numList
        }

        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
