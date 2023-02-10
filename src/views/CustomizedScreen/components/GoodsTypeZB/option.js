// import echarts from 'echarts'
export default {
  tooltip: {
    show: true,
    trigger: 'axis',
    formatter (params) {
      return `${params[0].marker}${params[0].axisValue}:${params[0].data}万元`
    }
  },
  grid: {
    bottom: 35,
    top: '25%',
    right: '8%',
    left: '15%'
  },
  xAxis: [
    {
      type: 'category',
      // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisTick: {
        show: false // 是否显示坐标轴轴线
      },
      axisLabel: {
        show: true,
        interval: 0,
        textStyle: {
          color: '#3671A7',
          fontSize: '16'
        }
      },
      splitLine: {
        show: false
      },
      boundaryGap: true,
      axisLine: { // 坐标轴轴线相关设置。
        show: true,
        lineStyle: {
          color: '#3671A7',
          width: 1,
          type: 'solid'
        }
      }
    }
  ],

  yAxis: [{
    type: 'value',
    name: '单位：万元',
    nameTextStyle: {
      color: '#A0ABB7',
      fontSize: '16'
      // bottom: '20'
    },
    splitNumber: 4,
    axisLabel: { // 坐标轴刻度标签的相关设置。
      show: true,
      textStyle: {
        color: '#82BCF1',
        fontSize: '14'
      }
    },
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
    splitLine: {
      lineStyle: {
        color: '#3671A7',
        width: 1,
        type: 'dashed'
      }
    },
    show: true
  }],
  series: [
    {
      type: 'bar',
      silent: true,
      barWidth: 10
      // barGap: '-100%'
      // data: [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120]
    }
  ]
}
