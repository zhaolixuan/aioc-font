// GDP增速趋势
function monthTrendChart (value, node) {
  let myChart = echarts.init(document.getElementById('gdpTrend'))

  const months = node.monthTrend.map(item => item.month + '月')
  const deliveryData = node.monthTrend.map(item => item.tb)

  let option = {
    textStyle: {
      color: '#A5DCFF'
    },
    title: {
      text: 'GDP月趋势',
      show: false
    },
    tooltip: {
      show:false,
      trigger: 'axis',
      formatter: '{b}GDP{c}%'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '20%',
      containLabel: true
    },
    xAxis: [
      {
        show: false,
        type: 'category',
        boundaryGap: false,
        data: months,
        axisLine: {
          lineStyle: {
            color: 'rgba(127, 127,127, .2)'
          }
        },
        splitLine: { show: false }
      }
    ],
    yAxis: [
      {
        type: 'value',
        show: false,
        axisLine: { show: false},
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: 'GDP',
        type: 'line',
        symbol:"none",
        //areaStyle: {
        //  normal: {
        //    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //      offset: 0,
        //      color: 'rgba(45, 181, 217, 1)'
        //    }, {
        //      offset: 0.9,
        //      color: 'rgba(45, 181, 217, 0.05)'
        //    }], false),
        //    shadowColor: 'rgba(0, 0, 0, 0.1)',
        //    shadowBlur: 10
        //  }
        //},
        //itemStyle: {
        //  normal: {
        //    color: '#2db5d9'
        //  }
        //},
        lineStyle: {
          color: '#2599FF',
          shadowBlur: 12,
          shadowColor: '#2599FF',
          shadowOffsetX: 1,
          shadowOffsetY: 1
        },
        //itemStyle: {
        //  color: '#2599FF',
        //  borderWidth: 1,
        //  borderColor: '#2599FF'
        //},
        data: deliveryData
      }
    ]
  }

  if (option && typeof option === 'object') {
    myChart.setOption(option, true)
  }

  gdpTrendChart(value, node)
}

// 新动能趋势
function introductionArrayChart (value, node) {
  var dongneng = echarts.init(document.getElementById('middle_box1'))

  let xData = []
  let y1Data = []
  let y2Data = []

  node.introductionArray.map(el => {
    xData.push(el.name)
    y1Data.push(el.talentsNum)
    y2Data.push(el.tb)
  })

  var option = {
    title: {
      text: '新动能人才引进趋势',
      left: '0',
      top: '0',
      textStyle: {
        color: '#A5DCFF ',
        fontSize: 12,
        fontWeight: 100
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross' //
      }
    },
    legend: {
      show: true,
      itemWidth: 16,
      itemHeight: 8,
      itemGap: 12,
      top: 20,
      left: 0,
      textStyle: {
        color: '#A5DCFF '
      },
      data: ['核心技术人员数(人)', '同比(%)']
    },
    grid: {
      left: '5%',
      right: '0',
      bottom: '4%',
      top: '30%',
      containLabel: true,
      z: 1
    },
    xAxis: [{
      type: 'category',
      data: xData,
      axisTick: { show: false },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(127, 127,127, .2)'
        }
      },
      axisLabel: {
        show: true,
        color: '#A5DCFF',
        fontSize: 12
      }
    }],
    yAxis: [{
      nameTextStyle: {
        color: '#A5DCFF',
        align: 'left',
        padding: [0, 26, 0, 0]
      },
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(127, 127,127, .2)'
        }
      },
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { color: '#A5DCFF' }
    }, {
      type: 'value',
      position: 'right',
      splitLine: { show: false },
      axisTick: { show: false },
      axisLine: {
        show: false,
        lineStyle: {
          color: 'rgb(205,205,205)'
        }
      },
      max: 100
    }],
    series: [{
      name: '核心技术人员数',
      yAxisIndex: 0,
      type: 'bar',
      barWidth: '12',
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0, 0, 0, 1, [{
              offset: 0,
              color: 'rgb(72,206,235,.92)'

            },
            {
              offset: 1,
              color: 'rgb(11,113,168,.1)'
            }
            ]
          )
        }
      },
      data: y1Data,
      zlevel: 1
    }, {
      name: '同比',
      type: 'line',
      yAxisIndex: 1,
      data: y2Data,
      itemStyle: {
        normal: {
          color: '#43C5E4',
          lineStyle: {
            width: 2,
            type: 'solid'
          }
        }
      },
      label: {
        normal: {
          show: false, // 折线上方label控制显示隐藏
          position: 'top'
        }
      },
      symbol: 'circle',
      symbolSize: 6,
      zlevel: 1
    }

    ]
  }

  if (option && typeof option === 'object') {
    dongneng.setOption(option, true)
  }
}
// GDP趋势
function gdpTrendChart (value, node) {
  let myChart = echarts.init(document.getElementById('middle_box2'))

  const months = node.monthTrend.map(item => item.month + '月')
  const deliveryData = node.monthTrend.map(item => item.value)

  let option = {
    textStyle: {
      color: '#A5DCFF'
    },
    title: {
      text: 'GDP月趋势',
      left: '0',
      top: '0',
      textStyle: {
        color: '#92C6E9 ',
        fontSize: 12,
        fontWeight: 100
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}GDP{c}%'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '20%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: months,
        axisLine: {
          lineStyle: {
            color: 'rgba(127, 127,127, .2)'
          }
        },
        splitLine: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: 'rgba(127, 127,127, .2)'
          }
        },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: 'GDP',
        type: 'line',
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(45, 181, 217, 1)'
            }, {
              offset: 0.9,
              color: 'rgba(45, 181, 217, 0.05)'
            }], false),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10
          }
        },
        itemStyle: {
          normal: {
            color: '#2db5d9'
          }
        },
        data: deliveryData
      }
    ]
  }

  if (option && typeof option === 'object') {
    myChart.setOption(option, true)
  }
}

// 资源环境
function sewageChart (value, node) {
  let environment = echarts.init(document.getElementById('pollute_right'))
  let sewage = node.sewage === null ? 0 : node.sewage ;
  let drinking = node.drinking === null ? 0 : node.drinking ;
  option = {
    legend: {
      show: false,
      data: ['污水排减', '饮水达标率']
    },
    series: [
      {
        type: 'pie',
        hoverAnimation: false, // 鼠标经过的特效
        center: ['30%', '48%'],
        radius: ['75%','90%'],
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
              fontSize: 16
            }
          }
        },
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#EF7E96'
            }, {
              offset: 1,
              color: '#F18E6E'
            }]),
            labelLine: {
              show: false
            }
          }
        },
        data: [
          { name: 'other', value: 100 - sewage, itemStyle: { color: '#162942' } },
          { name: '污水排减', value: sewage }
        ]
      },
      {
        type: 'pie',
        hoverAnimation: false,
        center: ['75%', '48%'],
        radius: ['75%','90%'],
        x: '20%', // for funnel
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
              fontSize: 16
            }
          }
        },
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#24BDBA'
            }, {
              offset: 1,
              color: '#45E794'
            }]),
            labelLine: {
              show: false
            }
          }
        },
        data: [
          { name: 'other', value: 100 - drinking, itemStyle: { color: '#162942' } },
          { name: '饮水达标', value: drinking }
        ]
      }
    ]
  }

  if (option && typeof option === 'object') {
    environment.setOption(option, true)
  }
}

// 仪表盘
function speedUpChart (value) {
  var yibiao = echarts.init(document.getElementById('cyleft'))
  option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        radius: '100%',
        center: ['50%', '60%'],
        axisLine: {
          lineStyle: {
            width: 15,
            color: [
              [
                value, new echarts.graphic.LinearGradient(
                  0, 0, 0, 1, [{
                    offset: 0,
                    color: '#3BB5D9'
                  },
                  {
                    offset: 1,
                    color: '#1A78AD'
                  }
                  ]
                )
              ],
              [
                1, '#162841'
              ]
            ]
          }
        },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
        pointer: {
          show: true,
          width: '0.5%',
          length: '110%'
        },
        itemStyle: {
          color: '#3CB8DB'
        },
        detail: {
          show: false,
          color: '#fff'
        },
        data: [{
          value: value * 100,
          textStyle: {
            color: '#fff'
          }
        }]
      }
    ]
  }
  if (option && typeof option === 'object') {
    yibiao.setOption(option, true)
  }
}

// 企业发展柱状图1
function enterpriseNumProportionChart (value, node) {
  var development1 = echarts.init(document.getElementById('cy_main4_1'))

  var baifenbi = [value]
  var grayBar = [1]
  var zongjine = [node.enterpriseNum]
  //var xingm = ['企业户数']
  option = {
    grid: {
      left: '1%',
      top: 0,
      right: '17%',
      bottom: 0 // 如果离左边太远就用这个......
    },
    xAxis: [ { show: false }, { show: false } ],
    yAxis: {
      type: 'category',
      axisLabel: { show: false },
      axisTick: { show: false },
      axisLine: { show: false },
      //data: xingm
    },
    series: [
      // 背景色--------------------我是分割线君------------------------------//
      {
        show: true,
        type: 'bar',
        barGap: '-100%',
        barWidth: '25%', // 统计条宽度
        itemStyle: {
          normal: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: 'rgba(22, 113, 168, .4)'

              }, {
                offset: 1,
                // 100% 处的颜色
                color: 'rgba(72, 206, 235, .4)'
              }]
            }
          }
        },
        label: {
          normal: {
            show: true,
            color: '#92C6E9',
            position: 'right',
            fontSize: 12,
            formatter: function (data) {
              return zongjine[data.dataIndex] + '户'
            }
          }
        },
        z: 1,
        data: grayBar
      },
      // 蓝条--------------------我是分割线君------------------------------//
      {
        show: true,
        type: 'bar',
        barGap: '-100%',
        barWidth: '25%', // 统计条宽度
        itemStyle: {
          normal: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: '#1671A8' // 0% 处的颜色
              }, {
                offset: 1,
                color: '#48CEEB' // 100% 处的颜色
              }]
            }
          }
        },
        max: 1,
        label: {
          normal: {
            show: true,
            textStyle: {
              color: '#A5DCFF', // 百分比颜色
              fontSize: 12
            },
            position: 'left',
            formatter: '{b} '
            // 百分比格式
          }
        },
        labelLine: { show: false },
        z: 2,
        data: baifenbi
      },
      // 数据条--------------------我是分割线君------------------------------//
      {
        show: true,
        type: 'bar',
        xAxisIndex: 1, // 代表使用第二个X轴刻度!!!!!!!!!!!!!!!!!!!!!!!!
        barGap: '-100%',
        barWidth: '25%', // 统计条宽度
        itemStyle: {
          normal: {
            barBorderRadius: 200,
            color: 'transparent'
          }
        },
        label: {
          normal: {
            show: true,
            color: '#A5DCFF',
              formatter: function (data) {
              return (baifenbi[data.dataIndex] * 100).toFixed(1) + '%'
            }
          }
        },
        data: zongjine
      }

    ]
  }

  if (option && typeof option === 'object') {
    development1.setOption(option, true)
  }
}

// 企业发展柱状图2
function individualNumProportionChart (value, node) {
  var development2 = echarts.init(document.getElementById('cy_main4_2'))

  var gbaifenbi = [value]
  var ggrayBar = [1]
  var gzongjine = [node.individualNum]
  //var gxingm = ['个体户数']
  option = {
    grid: {
      left: '1%',
      top: 0,
      right: '17%',
      bottom: 0
      // 如果离左边太远就用这个......
    },
    xAxis: [{ show: false }, { show: false }],
    yAxis: {
      type: 'category',
      axisLabel: { show: false },
      axisTick: { show: false },
      axisLine: { show: false },
      //data: gxingm
    },
    series: [
      // 背景色--------------------我是分割线君------------------------------//
      {
        show: true,
        type: 'bar',
        barGap: '-100%',
        barWidth: '25%', // 统计条宽度
        itemStyle: {
          normal: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: 'rgba(69, 231, 148, .4)'

              }, {
                offset: 1,
                // 100% 处的颜色
                color: 'rgba(36, 189, 186, .4)'
              }]
            }
          }
        },
        label: {
          normal: {
            show: true,
            color: '#92C6E9',
            position: 'right',
            fontSize: 12,
            formatter: function (data) {
              return gzongjine[data.dataIndex] + '户'
            }
          }
        },
        z: 1,
        data: ggrayBar
      },
      // 蓝条--------------------我是分割线君------------------------------//
      {
        show: true,
        type: 'bar',
        barGap: '-100%',
        barWidth: '25%', // 统计条宽度
        itemStyle: {
          normal: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: '#45E794' // 0% 处的颜色
              }, {
                offset: 1,
                color: '#24BDBA' // 100% 处的颜色
              }]
            }
          }
        },
        max: 1,
        label: {
          normal: {
            show: true,
            textStyle: {
              color: '#A5DCFF', // 百分比颜色
              fontSize: 12
            },
            position: 'left',
            formatter: '{b} '
          }
        },
        z: 2,
        data: gbaifenbi
      },
      // 数据条--------------------我是分割线君------------------------------//
      {
        show: true,
        type: 'bar',
        xAxisIndex: 1, // 代表使用第二个X轴刻度!!!!!!!!!!!!!!!!!!!!!!!!
        barGap: '-100%',
        barWidth: '25%', // 统计条宽度
        itemStyle: {
          normal: {
            barBorderRadius: 200,
            color: 'transparent'
          }
        },
        label: {
          normal: {
            show: true,
            color: '#A5DCFF',
            // position:" [0, '-100%']",
            formatter: function (data) {
              return (gbaifenbi[data.dataIndex] * 100).toFixed(1) + '%'
            }
          }
        },
        data: gzongjine
      }

    ]
  }

  if (option && typeof option === 'object') {
    development2.setOption(option, true)
  }
}

// 签约项目开功率
function rateOfOperationChart (value) {
  let columnchart1 = echarts.init(document.getElementById('column_chart1'))

  var Percentage = [value]
  var munBar = [1]
  var num = [500]
  option = {
    grid: {
      left: '0', // 如果离左边太远就用这个......
      right: '20%',
      bottom: '0',
      top: '0',
      containLabel: true
    },
    xAxis: [{ show: false }, { show: false }],
    yAxis: {
      type: 'category',
      axisLabel: { show: false },
      axisTick: { show: false },
      axisLine: { show: false }
    },
    series: [
      // 背景色--------------------我是分割线君------------------------------//
      {
        show: true,
        type: 'bar',
        barGap: '-100%',
        barWidth: '25%', // 统计条宽度
        itemStyle: {
          normal: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: 'rgba(22, 113, 168, .4)'

              }, {
                offset: 1,
                // 100% 处的颜色
                color: 'rgba(72, 206, 235, .4)'
              }]
            }
          }
        },
        z: 1,
        data: munBar
      },
      // 蓝条--------------------我是分割线君------------------------------//
      {
        show: true,
        type: 'bar',
        barGap: '-100%',
        barWidth: '25%', // 统计条宽度
        itemStyle: {
          normal: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: '#1671A8' // 0% 处的颜色
              }, {
                offset: 1,
                color: '#48CEEB' // 100% 处的颜色
              }]
            }
          }
        },
        max: 1,
        label: {
          normal: {
            show: true,
            textStyle: { color: '#A5DCFF', fontSize: 12 },
            position: 'left',
            formatter: '{b} ' // 百分比格式
          }
        },
        labelLine: { show: false },
        z: 2,
        data: Percentage
      },
      // 数据条--------------------我是分割线君------------------------------//
      {
        show: true,
        type: 'bar',
        xAxisIndex: 1, // 代表使用第二个X轴刻度!!!!!!!!!!!!!!!!!!!!!!!!
        barGap: '-100%',
        barWidth: '25%', // 统计条宽度
        itemStyle: {
          normal: { color: 'transparent' }
        },
        label: {
          normal: {
            show: true,
            color: '#92C6E9',
            position: 'right',
            fontSize: 12,
            formatter: function (data) {
              return (Percentage[data.dataIndex] * 100).toFixed(1) + '%'
            }
          }
        },
        data: num
      }

    ]
  }

  if (option && typeof option === 'object') {
    columnchart1.setOption(option, true)
  }
}

// 签约项目资金到位率
function fundingAvailabilityChart (value) {
  var columnchart2 = echarts.init(document.getElementById('column_chart2'))

  var Percentage2 = [value]
  var munBar2 = [1]
  var num2 = [500]
  option = {
    grid: {
      left: '0', // 如果离左边太远就用这个......
      right: '20%',
      bottom: '0',
      top: '0',
      containLabel: true
    },
    xAxis: [{
      show: false
    },
    {
      show: false
    }
    ],
    yAxis: {
      type: 'category',
      axisLabel: {
        show: false // 让Y轴数据不显示
      },
      itemStyle: {

      },
      axisTick: {
        show: false // 隐藏Y轴刻度
      },
      axisLine: {
        show: false // 隐藏Y轴线段
      }
    },
    series: [
      // 背景色--------------------我是分割线君------------------------------//
      {
        show: true,
        type: 'bar',
        barGap: '-100%',
        barWidth: '25%', // 统计条宽度
        itemStyle: {
          normal: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: 'rgba(69, 231, 148, .4)'

              }, {
                offset: 1,
                // 100% 处的颜色
                color: 'rgba(36, 189, 186, .4)'
              }],
              globalCoord: false // 缺省为 false

            }
          }
        },
        z: 1,
        data: munBar2
      },
      // 蓝条--------------------我是分割线君------------------------------//
      {
        show: true,
        type: 'bar',
        barGap: '-100%',
        barWidth: '25%', // 统计条宽度
        itemStyle: {
          normal: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: '#45E794' // 0% 处的颜色
              }, {
                offset: 1,
                color: '#24BDBA' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false

            }
          }
        },
        max: 1,
        label: {
          normal: {
            show: true,
            textStyle: {
              color: '#A5DCFF',
              fontSize: 12
            },
            position: 'left',
            formatter: '{b} '
            // 百分比格式
          }
        },
        labelLine: {
          show: false
        },
        z: 2,
        data: Percentage2
      },
      // 数据条--------------------我是分割线君------------------------------//
      {
        show: true,
        type: 'bar',
        xAxisIndex: 1, // 代表使用第二个X轴刻度!!!!!!!!!!!!!!!!!!!!!!!!
        barGap: '-100%',
        barWidth: '25%', // 统计条宽度
        itemStyle: {
          normal: {
            color: 'transparent'
          }
        },
        label: {
          normal: {
            show: true,
            color: '#92C6E9',
            // label 的position位置可以是top bottom left,right,也可以是固定值
            // 在这里需要上下统一对齐,所以用固定值
            position: 'right',
            fontSize: 12,
            formatter: function (data) {
              return (Percentage2[data.dataIndex] * 100).toFixed(1) + '%'
            }
          }
        },
        data: num2
      }

    ]
  }

  if (option && typeof option === 'object') {
    columnchart2.setOption(option, true)
  }
}

// 加强管理监督信息归集
function informationCollectionChart (value) {
  var columnchart3 = echarts.init(document.getElementById('column_chart3'))

  var Percentage3 = [value]
  var munBar3 = [1]
  var num3 = [500]
  option = {
    grid: {
      left: '0', // 如果离左边太远就用这个......
      right: '0',
      bottom: '0',
      top: '0',
      containLabel: true
    },
    xAxis: [{
      show: false
    },
    {
      show: false
    }
    ],
    yAxis: {
      type: 'category',
      axisLabel: {
        show: false // 让Y轴数据不显示
      },
      itemStyle: {

      },
      axisTick: {
        show: false // 隐藏Y轴刻度
      },
      axisLine: {
        show: false // 隐藏Y轴线段
      }
    },
    series: [
      // 背景色--------------------我是分割线君------------------------------//
      {
        show: true,
        type: 'bar',
        barGap: '-100%',
        barWidth: '90%', // 统计条宽度
        itemStyle: {
          normal: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: 'rgba(22, 113, 168, .4)'

              }, {
                offset: 1,
                // 100% 处的颜色
                color: 'rgba(72, 206, 235, .4)'
              }]
            }
          }
        },
        z: 1,
        data: munBar3
      },
      // 蓝条--------------------我是分割线君------------------------------//
      {
        show: true,
        type: 'bar',
        barGap: '-100%',
        barWidth: '90%', // 统计条宽度
        itemStyle: {
          normal: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: '#1671A8' // 0% 处的颜色
              }, {
                offset: 1,
                color: '#48CEEB' // 100% 处的颜色
              }]
            }
          }
        },
        max: 1,
        label: {
          normal: {
            show: true,
            textStyle: {
              color: '#A5DCFF',
              fontSize: 12
            },
            position: 'left',
            formatter: '{b} '
            // 百分比格式
          }
        },
        labelLine: {
          show: false
        },
        z: 2,
        data: Percentage3
      },
      // 数据条--------------------我是分割线君------------------------------//
      {
        show: true,
        type: 'bar',
        xAxisIndex: 1, // 代表使用第二个X轴刻度!!!!!!!!!!!!!!!!!!!!!!!!
        barGap: '-100%',
        barWidth: '90%', // 统计条宽度
        itemStyle: {
          normal: {
            color: 'transparent'
          }
        },
        label: {
          // normal: {
          //    show: true,
          //    color:"#92C6E9",
          //    //label 的position位置可以是top bottom left,right,也可以是固定值
          //    //在这里需要上下统一对齐,所以用固定值
          //    position:["84%",'-80%'],
          //    fontSize:18,
          //    formatter: function(data) {
          //        return (Percentage3[data.dataIndex] * 100).toFixed(1) + '%';
          //    },
          // }
        },
        data: num3
      }

    ]
  }
  if (option && typeof option === 'object') {
    columnchart3.setOption(option, true)
  }
}

// 产业
function firstIndustryChart (value, node) {
  let arry = [{ name: '第一产业', percent: node.firstIndustry }, { name: '第二产业', percent: node.secondIndustry }, { name: '第三产业', percent: node.thirdlyIndustry }]
  pei3('cy_main2', '', arry)
}

// 服务提升
function ycslChart (value, node) {
  let arry = [{ name: '一窗受理', percent: node.ycsl }, { name: '一次办结', percent: node.finish }, { name: '群众满意度', percent: node.massSatisfaction }]
  pei3('serve_ts', '', arry)
}
function pei3 (id, url, mainData) {
  let pei3 = echarts.init(document.getElementById(id))
  let option = {
    toolbox: {
      show: false
    },
    series: pie3CreateSeries(pei3, mainData)
  }

  pei3.setOption(option, true)
}
function pie3CreateSeries (pei3, mainData) {
  var result = []

  for (var i = 0; i < mainData.length; i++) {
    result.push({
      type: 'pie',
      hoverAnimation: false, // 鼠标经过的特效
      center: [i * 33.333 + 10 + '%', '50%'],
      radius: ['70%', '56%'],
      label: {
        show: false
      },
      itemStyle: {
        normal: {
          color: {
            type: 'bar',
            colorStops: [{
              offset: 0,
              color: '#1B7BAF' // 0% 处的颜色
            }, {
              offset: 1,
              color: '#42C5E5' // 100% 处的颜色
            }]
          }
        }
      },
      data: [
        { value: mainData[i].percent },
        { name: 'other', value: 100 - mainData[i].percent, itemStyle: { color: '#162942' } }
      ],
      markPoint: {
        symbol: '',
        symbolSize: 0.001,
        data: [{
          value: mainData[i].percent + '%\n' + mainData[i].name,
          x: pei3.getWidth() * i * 33.333 / 100 + pei3.getWidth() * 0.33333 * 0.44,
          y: pei3.getHeight() * 0.55,
          label: {
            normal: {
              show: true,
              position: 'right',
              lineHeight: 16,
              color: '#A5DCFF'
            }
          }
        }
        ]
      }
    })
  }
  return result
}

/**
 * 异步URL请求（GET）
 * @param url
 * @returns {Promise}
 * @constructor
 */
function AsyncGetUrl (url) {
  var path = GLOBAL_INTERFACE + '/aioc-api'+ url
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', path, true)
    xhr.withCredentials = true; //支持跨域发送cookies

    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          resolve(this.responseText, this)
        } else {
          var resJson = { code: this.status, response: this.response }
          reject(resJson, this)
        }
      }
    }
    xhr.send()
  })
}

/** *********************************  页面初始化方法 *************************************/
(function () {
  gdpInfo() // GDPINFO
  cyfz() // 各项产业总产值
  cyzcz() // 各项产业总产值
  szsy() // 双招双引
  rcyj() // 人才引进
  gdpTrend() // gdp月趋势
  hjzy() // 环境资源
  tpgj() // 乡村振兴
  zwfw() // 政务服务
  gdpmap()// gdp地图
}())


// GDPINFO
function gdpInfo () {
   AsyncGetUrl( '/gdp/info')
  //AsyncGetUrl('http://mocker.jd.com/mocker/zh/4133213/')
    .catch(error => {}) // => 这里就是catch到了error，如果处理error以及返还合适的值
    .then(value => {
      let data = eval('(' + value + ')')
      console.log(data)
      let testData = {
        speedUp:5.2, //GDP增速
        sum: 132.9, //GDP总值
        order: '-', //省内排名
        fixedAssets: 59.3, //固定资产投资
        population: 23.64, //总人口
      }
      textAndSingleChart($('.gdpInfo'), testData)
    })
}
// 产业发展
function cyfz () {
   AsyncGetUrl('/industry/info')
  //AsyncGetUrl('http://mocker.jd.com/mocker/zh/3209425/')
    .catch(error => {}) // => 这里就是catch到了error，如果处理error以及返还合适的值
    .then(value => {
      let data = eval('(' + value + ')')
      console.log(data)
      let testData = {
        firstIndustry:(39.6/295.7*100).toFixed(1), //第一产业占比
        secondIndustry:(145.4/295.7*100).toFixed(1), //第二产业占比
        thirdlyIndustry:(110.7/295.7*100).toFixed(1), //第三产业占比
        marketEntity:(52585/10000).toFixed(2), //市场主体总量
        marketEntityProportion: 30, //市场主体占比
        registeredFundProportion: 43, //注册资金占比
        registeredFund:627.52, //注册资金
        enterpriseNum:3616, //企业户数
        enterpriseNumProportion: 19, //企业户数占比
        individualNum:11121, //个体户数
        individualNumProportion: 81, //个体户数占比
      }
      textAndSingleChart($('.cyfz'), testData)
    })
}

// 各项产业总产值
function cyzcz () {
   AsyncGetUrl('/gdp/type')
  //AsyncGetUrl('http://mocker.jd.com/mocker/zh/8915159/')
    .catch(error => {}) // => 这里就是catch到了error，如果处理error以及返还合适的值
    .then(value => {
      let arry = eval('(' + value + ')')
      console.log(arry.data)
      let testData = [{
        name:"总产值",
        value: 150.95
      },{
        name:"新材料产业总产值",
        value: 27.17
      },{
        name:"新能源产业总产值",
        value: 33.21
      },{
        name:"智能制造产业总产值",
        value: 51.32
      },{
        name:"新一代信息技术",
        value: 22.64
      },{
        name:"数字创意产业总产值",
        value: 16.6
      }]
      // arry.data.industryType.map(el => {
      testData.map(el => {
        $(".cyzcz i[title='" + el.name + "']").text(el.value)
      })
    })
}

// GDP地图
function gdpmap () {
  AsyncGetUrl( '/gdp/map')
  //AsyncGetUrl('http://mocker.jd.com/mocker/zh/6312609/')
      .catch(error => {}) // => 这里就是catch到了error，如果处理error以及返还合适的值
.then(value => {
    let arry = eval('(' + value + ')')
    let testData = [{
      gardenType: "太平街道",
      income:3000 ,
      population: 6.3,
      gdp: 27.9
    },{
      gardenType: "孙耿街道",
      income: 3000,
      population: 5.6,
      gdp: 37.3
    },{
      gardenType: "大桥街道",
      income: 3000,
      population: 6.4,
      gdp: 25.8
    },{
      gardenType: "崔寨街道",
      income: 3000,
      population: 5.2,
      gdp: 41.9
    }]
    // arry.data.industryType.map(el => {
    testData.map(el => {
    $(".gdpmap dt b[title='" + el.gardenType + "']").text(el.gdp)
    $(".gdpmap dd b[title='" + el.gardenType + "']").text(el.population)
    $(".gdpmap dd strong[title='" + el.gardenType + "']").text(el.income)
})
})

//    arry.data.gardenInfo.map(el => {
//    $(".gdpmap dt b[title='" + el.gardenType + "']").text(el.gdp)
//    $(".gdpmap dd b[title='" + el.gardenType + "']").text(el.population)
//    $(".gdpmap dd strong[title='" + el.gardenType + "']").text(el.income)
//})
//    //textAndSingleChart($('.gdpmap'), data.data.gardenInfo[0])
//})
}

// 人才引进
function rcyj () {
   AsyncGetUrl('/gdp/talents')
  //AsyncGetUrl('http://mocker.jd.com/mocker/zh/9828748/')
    .catch(error => {}) // => 这里就是catch到了error，如果处理error以及返还合适的值
    .then(value => {
      let data = eval('(' + value + ')')
      let testData = {
        introductionArray: [
          {
            name: "先进材料",
            hb: 8,
            talentsNum: 150
          },{
            name: "新能源",
            hb: 5,
            talentsNum: 280
          },{
            name: "信息技术",
            hb: 10,
            talentsNum: 300
          },{
            name: "制造与装备",
            hb: 9,
            talentsNum: 200
          },{
            name: "数字创意",
            hb: 9,
            talentsNum: 100
          }
        ]
      }
      //textAndSingleChart($('.rcyj'), data.data)
      textAndSingleChart($('.rcyj'), testData)
    })
}
// gdp月趋势
function gdpTrend () {
   AsyncGetUrl( '/gdp/trend')
  //AsyncGetUrl('http://mocker.jd.com/mocker/zh/6325873/')
    .catch(error => {}) // => 这里就是catch到了error，如果处理error以及返还合适的值
    .then(value => {
      let data = eval('(' + value + ')')
    let testData = {
      "monthTrend": [
        {
          "month": "1",
          "value": 6,
          "tb":.6
        },{
          "month": "2",
          "value": 5.5,
          "tb":.55
        },{
          "month": "3",
          "value": 3,
          "tb":.3
        },{
          "month": "4",
          "value": 2,
          "tb":.2
        },{
          "month": "5",
          "value": 1.8,
          "tb":.18
        },{
          "month": "6",
          "value": 1.7,
          "tb":.25
        },{
          "month": "7",
          "value": 1.6,
          "tb":.30
        },{
          "month": "8",
          "value": 1.5,
          "tb":.15
        },{
          "month": "9",
          "value": 1.4,
          "tb":.14
        },{
          "month": "10",
          "value": 1.1,
          "tb":.11
        },{
          "month": "11",
          "value": 1,
          "tb":.1
        },{
          "month": "12",
          "value": 0.5,
          "tb":.05
        }
      ]
    }
       textAndSingleChart($('.gdpTrend'), testData)
      //textAndSingleChart($('.gdpTrend'), data.data)
     var qushi = (testData.monthTrend[testData.monthTrend.length-1].tb > (testData.monthTrend[testData.monthTrend.length-2].tb))?"上升":"下降"
     $(".cy_right span").text(qushi)
    })
}

// 双招双引
function szsy () {
   AsyncGetUrl('/attractInvestment/info')
  //AsyncGetUrl('http://mocker.jd.com/mocker/zh/3875697/')
    .catch(error => {}) // => 这里就是catch到了error，如果处理error以及返还合适的值
    .then(value => {
      let data = eval('(' + value + ')')
      let testData = {
        fundingAvailability:0,
        yjgw: 32.58,
        qnyStage: "签约阶段",
        hrStage: "签约阶段",
        rateOfOperation: 0,
        yjsw: 323.8
     }
      textAndSingleChart($('.szsy'), testData)
      //textAndSingleChart($('.szsy'), data.data)
    })
}

// 环境资源
function hjzy () {
   AsyncGetUrl( '/environment/info')
  //AsyncGetUrl('http://mocker.jd.com/mocker/zh/2756846/')
    .catch(error => {}) // => 这里就是catch到了error，如果处理error以及返还合适的值
    .then(value => {
      let data = eval('(' + value + ')')
      textAndSingleChart($('.environment'), data.data)
      $(".environment .blueSky").text(eval($(".environment .blueSky").text())*100)
    })
}

// 脱贫攻坚
function tpgj () {
   AsyncGetUrl('/fpgj/info')
  //AsyncGetUrl('http://mocker.jd.com/mocker/zh/6754157/')
    .catch(error => {}) // => 这里就是catch到了error，如果处理error以及返还合适的值
    .then(value => {
      let data = eval('(' + value + ')')
      textAndSingleChart($('.fpgj'), data.data)
    })
}

// 政务服务
function zwfw () {
   AsyncGetUrl( '/governmentAffairs/info')
  //AsyncGetUrl('http://mocker.jd.com/mocker/zh/7412318/')
    .catch(error => {}) // => 这里就是catch到了error，如果处理error以及返还合适的值
    .then(value => {
      let data = eval('(' + value + ')')
     // let testData = {
     // informationCollection: 100,
     // finish: 80,
     // massSatisfaction: 90,
     // avgPeriod: 33,
     // powerList: 324,
     // ycsl: 70
     //}
     //textAndSingleChart($('.zwfw'), testData)
      textAndSingleChart($('.zwfw'), data.data)
    })
}


// 固定指标及单数据图表数据设置
function textAndSingleChart (ctn, data) {
  for (var el in data) {
    if ($('.' + el, ctn).size() > 0) { // 文本内容设置
      $('.' + el, ctn).text(data[el] === null ? '-' : data[el])
      if ($('.' + el + 'Trend', ctn).size() > 0) {
        $('.' + el + 'Trend', ctn)
          .removeClass('command_rate_up command_rate_down')
          .addClass(data[el] > 0 ? 'command_rate_up' : 'command_rate_down')
          .text(data[el] > 0 ? '↑' : '↓')
      }
    }
    if ($('.' + el + 'Chart', ctn).size() > 0) { // 图表方法调用
      let f = eval(el + 'Chart')
      let d = data[el] === null ? 0 : data[el] / 100 ;
      new f(d , data)
    }
  }
}
