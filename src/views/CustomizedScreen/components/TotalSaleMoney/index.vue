<template>
  <div class="TotalSaleMoney_wrap">
    <div class="card_wrap">
      <norm title="累计网络零售榜(万元)" :icon="4" />
    </div>
    <ul class="pmBox">
      <li v-for="(item, index) in list" :key="index" class="item">
        <div class="imgbox">
          <img :src="item.url" alt="">
        </div>
        <div class="databox">
          <p class="val">
            <span>{{item.num}}</span>
            <span>{{item.unit}}</span>
          </p>
          <p class="name">
            {{item.name}}
          </p>
        </div>
      </li>
    </ul>
    <div class="scroll">
      <div ref="canvasChart" style="height:2rem;width:100%"></div>
    </div>
  </div>
</template>
<script>
import norm from '../norm'
import initChart from '@/mixins/initChart.js'
import defaultOptions from './option.js'
// import echarts from 'echarts'
export default {
  mixins: [initChart],
  name: 'TotalSaleMoney',
  components: { norm },
  props: ['infor', 'flag'],
  data () {
    return {
      timer: null,
      defaultOptions,
      list: [
        {
          id: 0,
          name: '',
          num: 0,
          unit: '万元',
          url: require('../../assets/top1.png')
        },
        {
          id: 1,
          name: '',
          num: 0,
          unit: '万元',
          url: require('../../assets/top2.png')
        },
        {
          id: 2,
          name: '',
          num: 0,
          unit: '万元',
          url: require('../../assets/top3.png')
        }
      ],
      newName: [],
      newValue: []
    }
  },
  mounted () {
    this.list[0].name = this.infor.data[0].district
    this.list[0].num = this.infor.data[0].salesamountCount
    this.list[1].name = this.infor.data[1].district
    this.list[1].num = this.infor.data[1].salesamountCount
    this.list[2].name = this.infor.data[2].district
    this.list[2].num = this.infor.data[2].salesamountCount
    let option = this.defaultOptions
    // this.timer = setInterval(() => {
    //   // 轮播name
    //   let tmpList_name = this.infor.newName.map(item => item)
    //   const shiftItems_name = tmpList_name.splice(0, 5)
    //   tmpList_name = tmpList_name.concat(shiftItems_name)
    //   this.infor.newName = tmpList_name
    //   option.yAxis[0].data = this.infor.newName.slice(0, 5) || []
    //   // 轮播数值
    //   let tmpList = this.infor.newValue.map(item => item)
    //   const shiftItems = tmpList.splice(0, 5)
    //   tmpList = tmpList.concat(shiftItems)
    //   this.infor.newValue = tmpList
    //   option.yAxis[1].data = this.infor.newValue.slice(0, 5)
    //   option.series[0].data = this.infor.newValue.slice(0, 5)
    //   option.xAxis.max = Math.ceil(Math.max(...this.infor.newValue))
    //   // this.chart.setOption(this.computedOptions)
    // }, 5000)

    this.timer = setInterval(() => {
      // // 轮播name
      // let tmpList_name = this.infor.newName.map(item => item)
      // const shiftItems_name = tmpList_name.splice(0, 5)
      // tmpList_name = tmpList_name.concat(shiftItems_name)
      // this.infor.newName = tmpList_name
      // option.yAxis[0].data = this.infor.newName.slice(5, 11) || []
      // // 轮播数值
      // let tmpList = this.infor.newValue.map(item => item)
      // const shiftItems = tmpList.splice(0, 5)
      // tmpList = tmpList.concat(shiftItems)
      // this.infor.newValue = tmpList
      // option.yAxis[1].data = this.infor.newValue.slice(5, 11)
      // option.series[0].data = this.infor.newValue.slice(5, 11)
      // option.xAxis.max = Math.ceil(Math.max(...this.infor.newValue))
      if (this.flag) {
        // this.flag = false
        this.$emit('changeFlag', false)
        option.yAxis[0].data = this.infor.newName.slice(5, 11) || []
        option.yAxis[1].data = this.infor.newValue.slice(5, 11)
        option.series[0].data = this.infor.newValue.slice(5, 11)
      } else {
        // this.flag = true
        this.$emit('changeFlag', true)
        option.yAxis[0].data = this.infor.newName.slice(0, 5) || []
        option.yAxis[1].data = this.infor.newValue.slice(0, 5)
        option.series[0].data = this.infor.newValue.slice(0, 5)
      }
    }, 5000)
  },
  destroyed () {
    clearInterval(this.timer = null)
  },
  watch: {
    infor: {
      deep: true,
      handler () {
        this.chart.setOption(this.computedOptions)
        this.list[0].name = this.infor.data[0].district
        this.list[0].num = this.infor.data[0].salesamountCount
        this.list[1].name = this.infor.data[1].district
        this.list[1].num = this.infor.data[1].salesamountCount
        this.list[2].name = this.infor.data[2].district
        this.list[2].num = this.infor.data[2].salesamountCount
      }
    },
    flag: {
      handler () {
        this.chart.setOption(this.computedOptions)
      }
    }
  },
  methods: {},
  computed: {
    computedOptions () {
      let option = this.defaultOptions
      if (this.flag) {
        option.yAxis[0].data = this.infor.newName.slice(5, 11) || []
        option.yAxis[1].data = this.infor.newValue.slice(5, 11)
        option.series[0].data = this.infor.newValue.slice(5, 11)
        return option
      } else {
        option.yAxis[0].data = this.infor.newName.slice(0, 5) || []
        option.yAxis[1].data = this.infor.newValue.slice(0, 5) || []
        option.xAxis.max = Math.ceil(Math.max(...this.infor.newValue))
        option.series[0].data = this.infor.newValue.slice(0, 5) || []
        return option
      }
      // option.yAxis[0].data = this.infor.newName.slice(0, 5) || []
      // option.yAxis[1].data = this.infor.newValue.slice(0, 5) || []
      // option.xAxis.max = Math.ceil(Math.max(...this.infor.newValue))
      // option.series[0].data = this.infor.newValue.slice(0, 5) || []
      // return option
    }
  }
}
</script>
<style lang="less" scoped>
.TotalSaleMoney_wrap {
  height: 25%;
  .card_wrap {
    margin-bottom: 0.12rem;
  }
  .pmBox {
    margin-top: 0.12rem;
    display: flex;
    font-size: .17rem;
    .item {
      flex: 1.8;
      display: flex;
      color: #fff;
      margin-left: 0.15rem;
      .databox {
        margin-left: 0.08rem;
        font-size: .17rem;
        .name {
          color: #82bcf1;
          font-size: .17rem;
        }
      }
    }
    .item:first-child {
      flex: 2.2;
      margin-left: 3%;
    }
  }
  .scroll {
  }
}
</style>
