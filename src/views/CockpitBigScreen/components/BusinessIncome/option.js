import echarts from 'echarts'
export default {
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      },
      lineStyle: {
        color: '#6a7985'
      }
    },
      // trigger: "item",
      // formatter: "{b}<br/>{c} (条)",
   
  },
  grid: {
    left: '1%',
    right: '4%',
    bottom: '20%',
    top: '10%',
    containLabel: true
  },
  dataZoom: [
    {
      type: 'inside',
      start:0,
      end: 100,
      height: 20,
      bottom: 0,

 },
    {
      start: 0,
      end: 100,
      height: 20,
      bottom: 0,
      borderColor:"rgba(255,255,255,0.1)", 
      // backgroundColor: 'red',
      fillerColor: 'rgba(74, 240, 255, 0.3)', 
      handleStyle:{
        borderWidth:2,
      },
      dataBackground:{
        lineStyle:{
          color:'#00D4FF',
          width:4,
        },
        areaStyle:{
          color:'#a8e7f6',
          shadowBlur:12,
          opacity:0,
        },
       
      },
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
      name:'666',
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
      // markPoint: {
      //   data: [
      //     { type: 'max', name: 'Max' },
      //     { type: 'min', name: 'Min' }
      //   ]
      // },
      // markLine: {
      //   data: [{ type: 'average', name: 'Avg' }]
      // }
    }
  ]

}
