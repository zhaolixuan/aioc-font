// import echarts from 'echarts'
export default {
  grid: {
    left: '23%',
    top: '-1%',
    right: '5%',
    bottom: '18%'
  },
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'none'
    },
    formatter (params) {
      console.log(params, 'hahah')
      return `${params[0].marker}${params[0].axisValue}:${params[0].data}万元`
    }
  },
  xAxis: {
    axisTick: {show: false},
    axisLine: {show: false},
    axisLabel: {
      color: '#8EE7FF',
      // fontSize: window.offsetWidth / 1082 * 18
      fontSize: '14'
    }
  },
  yAxis: {
    splitLine: {show: false},
    axisTick: {show: false},
    axisLine: {show: false},
    axisLabel: {show: false}
  },
  series: [{
    name: '非实物行业网络零售额分布',
    type: 'pictorialBar',
    barCategoryGap: '-30%',
    symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
    barGap: '-100%',
    itemStyle: {
      normal: {
        color: '#0466B3',
        opacity: '0.9'
      },
      emphasis: {
        opacity: 1
      }
    },
    // data: [123, 60, 25, 18, 12],
    z: 10
  }]
}
