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
    formatter (params) {
      return `${params[0].axisValue}:</br>${params[1].marker}${params[1].seriesName}: ${params[1].data}%</br>
      <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:rgba(12,212,248,1);"></span>
      ${params[2].seriesName}: ${params[2].data}万元`
    }
  },
  grid: {
    left: '0',
    right: '4%',
    bottom: '5%',
    top: '25%',
    containLabel: true
  },
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
      interval: 0,
      show: true,
      textStyle: {
        color: '#3671A7',
        fontSize: window.offsetWidth / 1082 * 14
      }
    }
  },
  yAxis: [
    {
      type: 'value',
      name: '单位: 万元',
      nameTextStyle: {
        color: '#A0ABB7'
      },
      offset: 0,
      axisLabel: {
        color: '#82BCF1',
        fontSize: window.offsetWidth / 1082 * 14
      },
      axisTick: {
        show: false
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
        show: true,
        lineStyle: {
          color: '#3671A7',
          width: 1,
          type: 'dashed'
        }
      }
    },
    {
      type: 'value',
      // name: '单位: %',
      nameTextStyle: {
        color: '#A0ABB7'
      },
      offset: 0,
      interval: 20,
      axisLabel: {
        color: '#82BCF1',
        fontSize: window.offsetWidth / 1082 * 14,
        formatter: `{value}%`
      },
      axisTick: {
        show: false
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
          type: 'dashed'
        }
      }
    }
  ],
  series: [
    {
      type: 'effectScatter',
      symbolSize: 10,
      yAxisIndex: 1,
      rippleEffect: {
        brushType: 'stroke'
      },
      itemStyle: {
        color: 'rgba(220,93,93,1)'
      }
    },
    { name: '增速',
      show: false,
      symbol: 'circle',
      symbolSize: 1,
      type: 'line',
      yAxisIndex: 1,
      lineStyle: {
        width: 1,
        color: 'rgba(220,93,93,1)'
      },
      itemStyle: {
        color: 'rgba(220,93,93,1)'
      }
    },
    {
      name: '网络零售额',
      type: 'bar',
      barWidth: 10,
      barGap: 0,
      yAxisIndex: 0,
      itemStyle: {
        barBorderRadius: [5, 5, 0, 0],
        color: new echarts.graphic.LinearGradient(
          0, 1, 0, 0,
          [
            {offset: 0, color: 'rgba(43,165,188,0)'},
            {offset: 0.5, color: 'rgba(43,165,188,0.5)'},
            {offset: 1, color: 'rgba(12,212,248,1)'}
          ]
        )
      }
    }
  ]
}
