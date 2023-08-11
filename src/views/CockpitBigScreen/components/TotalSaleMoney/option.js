import echarts from 'echarts'
import { off } from 'node-notifier'
export default {
  series: {
    type: 'gauge',
    radius: '100%',
    axisLine: {
      lineStyle: {
        width: 20,
        color: [
          [0.3, '#67e0e3'],
          [0.7, '#37a2da'],
          [1, '#fd666d']
        ]
      }
    },
    pointer: {
      itemStyle: {
        color: 'auto'
      }
    },
    axisTick: {
      distance: -20,
      length: 8,
      lineStyle: {
        color: '#fff',
        width: 2
      }
    },
    splitLine: {
      distance: -20,
      length: 20,
      lineStyle: {
        color: '#fff',
        width: 2
      }
    },
    axisLabel: {
      color: 'auto',
      distance: 3,
      fontSize: window.innerWidth / 1082 * 8
    },
    detail: {
      valueAnimation: true,
      formatter: '{value}%',
      color: 'auto',
      fontSize: window.innerWidth / 1082 * 14,
      offsetCenter:["0%",'35%']

    },
    title: {
      valueAnimation: true,
      color: 'auto',
      fontSize: window.innerWidth / 1082 * 12,
      offsetCenter:["-0%",'70%']
    },
    data: [
      {
        value: 50
      }
    ]
  }

}
