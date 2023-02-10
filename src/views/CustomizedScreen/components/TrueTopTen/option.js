import echarts from 'echarts'
export default {
  color: [new echarts.graphic.LinearGradient(1, 1, 0, 0, [{ // 右下左上
    offset: 0,
    color: 'rgba(34,198,236,0.13)'
  },
  {
    offset: 1,
    color: 'rgba(35,199,237,1)'
  }]),
  new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
    offset: 0,
    color: 'rgba(214,92,84,0.13)'
  },
  {
    offset: 1,
    color: 'rgba(209,90,83,1)'
  }]),
  new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
    offset: 0,
    color: 'rgba(252,201,94,0.13)'
  },
  {
    offset: 1,
    color: 'rgba(255,207,97,1)'
  }]),
  new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
    offset: 0,
    color: 'rgba(91,224,217,0.13)'
  },
  {
    offset: 1,
    color: 'rgba(91,225,219,1)'
  }]),
  new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
    offset: 0,
    color: 'rgba(142,1,73,0)'
  },
  {
    offset: 1,
    color: 'rgba(143,1,73,1)'
  }]),
  new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
    offset: 0,
    color: 'rgba(83,34,236,0.13)'
  },
  {
    offset: 1,
    color: 'rgba(237,35,143,1)'
  }]),
  new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
    offset: 0,
    color: 'rgba(79,236,34,0.13)'
  },
  {
    offset: 1,
    color: 'rgba(124,237,35,1)'
  }]),
  new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
    offset: 0,
    color: 'rgba(34,107,236,0.13)'
  },
  {
    offset: 1,
    color: 'rgba(70,121,252,1)'
  }]),
  new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
    offset: 0,
    color: 'rgba(154,115,236,0.13)'
  },
  {
    offset: 1,
    color: 'rgba(148,130,255,1)'
  }]),
  new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
    offset: 0,
    color: 'rgba(0,254,175,0.13)'
  },
  {
    offset: 1,
    color: 'rgba(0,255,188,1)'
  }])
  ],
  // color: ['#44D7B6', '#D16823', '#32C5FF', '#6236FF', '#F7B500', '#EB9BC5', '#EA4646', '#0091FF', '#6DD400', '#B620E0'],
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}万元 ({d}%)'
  },
  // legend: {
  //   icon: 'circle',
  //   itemWidth: 5, // 设置宽度
  //   itemHeight: 5, // 设置高度
  //   orient: 'vertical',
  //   right: '0%',
  //   textStyle: {
  //     color: '#82BCF1',
  //     fontSize: 12
  //   }
  // },
  legend: [
    {
      icon: 'circle',
      itemWidth: 5, // 设置宽度
      itemHeight: 5, // 设置高度
      orient: 'vertical',
      right: '35%',
      top: '20%',
      textStyle: {
        color: '#82BCF1',
        fontSize: 12
      }}, {
      icon: 'circle',
      itemWidth: 5, // 设置宽度
      itemHeight: 5, // 设置高度
      orient: 'vertical',
      right: '9%',
      top: '20%',
      textStyle: {
        color: '#82BCF1',
        fontSize: 12
      }}
  ],
  series: [
    {
      name: '实物行业网络零售额分布',
      type: 'pie',
      radius: ['65%', '95%'],
      center: ['18%', '49.5%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '16',
          color: '#fff'
        }
      },
      labelLine: {
        show: false
      }
    }
  ]
}
