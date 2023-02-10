import echarts from 'echarts'
export default {
  grid: {
    left: '5%',
    right: '5%',
    bottom: '5%',
    top: '5%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'none'
    },
    formatter: function (params) {
      return params[0].name + '<br/>' +
          "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" +
          params[0].seriesName + ' : ' + params[0].value + ' 万元<br/>' //  Number((params[0].value.toFixed(4) / 10000).toFixed(2)).toLocaleString()
    }
  },
  xAxis: {
    show: false,
    type: 'value'
  },
  yAxis: [{
    type: 'category',
    inverse: true,
    axisLabel: {
      show: true,
      textStyle: {
        color: '#82BCF1'
      },
      interval: 0
    },
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    }
  },
  {
    type: 'category',
    inverse: true,
    axisTick: 'none',
    axisLine: 'none',
    show: true,
    axisLabel: {
      textStyle: {
        color: '#ffffff',
        fontSize: '12'
      },
      formatter: function (value) {
        // if (value >= 10000) {
        // return Number((Number(value).toFixed(4) / 10000).toFixed(2)).toLocaleString() + '万'
        return value + '万元'
        // }
        // else {
        //   return value.toLocaleString() + '万'
        // }
      }
    }
  } ],
  series: [{
    name: '金额',
    type: 'bar',
    zlevel: 1,
    itemStyle: {
      normal: {
        barBorderRadius: 30,
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
          offset: 0,
          color: 'rgba(12,115,248,0)'
        }, {
          offset: 1,
          color: 'rgba(28,216,252,1)'
        }])
      }
    },
    barWidth: 8,
    barCateGoryGap: 30
  }
  ]
}
