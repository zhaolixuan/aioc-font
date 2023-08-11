// import echarts from 'echarts'
export default {
  grid: {
    left: "5%",
    top: "5%",
    right: "8%",
    bottom: "18%"
  },
  tooltip: {
    show: true,
    trigger: "axis",
    axisPointer: {
      type: "none"
    },
    formatter(params) {
      return `${params[0].marker}${params[0].axisValue}:${params[0].data}`;
    }
  },
  xAxis: {
    axisTick: { show: false },
    axisLine: {
      show: true,
      lineStyle: {
        color: "#3671A7",
        width: 1,
        type: "solid"
      }
    },
    axisLabel: {
      color: "#8EE7FF",
      fontSize: (window.innerWidth / 1082) * 10
    }
  },
  yAxis: {
    splitLine: { show: false },
    axisTick: { show: false },
    axisLine: { show: false },
    axisLabel: { show: false }
  },
  series: [
    {
      name: "",
      type: "bar",
      barWidth: "25%",
      itemStyle: {
        normal: {
          color: function(params) {
            var colors = ["red", "orange", "yellow", "green"];
            return colors[params.dataIndex % colors.length];
          },
          // color: '#000',
          opacity: "0.9"
        },
        emphasis: {
          opacity: 1
        }
      },
      label: {
        show: true,
        position: "top"
      }
      // data: [123, 60, 25, 18, 12],
      // z: 10
    }
  ]
};
