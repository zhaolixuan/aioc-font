import echarts from 'echarts'
export default {
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'none',
      lineStyle: {
        color: '#999'
      }
    },
  },
  grid: {
    left: '0',
    right: '4%',
    bottom: '20%',
    top: '5%',
    containLabel: true
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100
    },
    {
      start: 0,
      end: 100,
      height: 20,
      bottom: 0,
    }
  ],
  xAxis: {
    type: 'category',
    // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    axisLine: {
      show: true,
      lineStyle: {
        color: '#3671A7',
        width: 1,
        type: 'solid'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      // interval: 0,
      show: true,
      textStyle: {
        color: '#3671A7',
        fontSize: window.innerWidth / 1082 * 10
      }
    },
  },

  yAxis: {
    type: 'value',
       axisTick: {
      show: false
    },
      offset: 0,
    axisLabel: {
      color: '#82BCF1',
      fontSize: window.innerWidth / 1082 * 10,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#3671A7',
        width: 1,
        type: 'solid'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#3671A7',
        width: 1,
        type: 'solid'
      }
    }
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]

}
