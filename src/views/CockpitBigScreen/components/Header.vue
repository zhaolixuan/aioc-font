<template>
  <div class="header_wrap">
    <div class="address">
      <!-- <span class="imgBox">
        <img src="../assets/address.png" alt="">
      </span>
      <span class="name">九江</span> -->
    </div>
    <div class="infor" style="padding-left:5%;box-sizing:border-box;">
      <p class="item_infor">

      </p>
      <p class="item_infor">
      </p>
    </div>
    <p class="title">周界预警监测系统</p>
    <div class="infor right">
      <p  class="item_infor">{{ currentData +'  '+  currentTime }}</p>
    
      <p class="item_infor">
        admin
       <img src="../assets/quit.svg" alt="">
      </p>
    </div>
  </div>
</template>
<script>
// import chineseLunar from 'chinese-lunar'

export default {
  name: 'Header',
  props: {
    infor: {
      type: [Array, Object]
    },
    isInfor: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      dataObj: {},
      currentData:'',
      currentTime:'',
      time:null
    }
  },
  created () {},
  watch: {
    infor: {
      deep: true,
      handler () {
        this.dataObj = this.infor
      }
    }
  },
  mounted(){
    this.navDate()
    this.time = setInterval(() => {
        this.updateTime()
      }, 1000)
  },
  methods:{
    navDate () {
      let now = new Date()
      let month = now.getMonth() + 1
      let day = now.getDate()
      let weeks = ['日', '一', '二', '三', '四', '五', '六']
      let week = weeks[now.getDay()]
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      this.currentData =  month + '月' + day + '日' + ' 星期' + week 
      this.updateTime()
     
    },
    updateTime() {
      let date = new Date()
      let hours = date.getHours()
      let minutes = date.getMinutes()
      let seconds = date.getSeconds()
      this.currentTime =  `${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`
    },
    formatTime(time) {
      return time < 10 ? `0${time}` : time
    }
  },
  destroyed(){
    clearInterval(this.time)
  },
}
</script>
<style lang="less" scoped>
.header_wrap {
  width: 100%;
  height: 100%;
  background: url('../assets/head_bg.png') no-repeat;
  background-size: 100% 100%;
  padding: 0rem 0.15rem;
  box-sizing: border-box;
  display: flex;
  .address {
    color: #fff;
    font-size: 0.16rem;
    height: 1rem;
    position: fixed;
    .imgBox {
      display: inline-block;
      width: 0.25rem;
      height: 0.35rem;
      line-height: 1rem;
      img {
        width: 100%;
        vertical-align: middle;
      }
    }
    .name {
      margin-left: 0.1rem;
      line-height: 1rem;
    }
  }
  .title {
    display: inline-block;
    width:22%;
    height: 1rem;
    margin: 0 auto;
    font-size: 0.36rem;
    color: #ffffff;
    line-height: 1rem;
    text-align: center;
    text-shadow: 0px 0.04rem 0.4rem #003858;
    font-family: 'PingFangSC-Regular';
  }
  .infor {
    display: inline-block;
    width: 36%;
    height: 1rem;
    line-height: 0;
    font-size: 0rem;
    text-align: left;
    display: flex;
    &:first-child {
      text-align: right;
      padding-right: 0.3rem;
      box-sizing: border-box;
    }
    .item_infor {
      font-size: 0.14rem;
      height: 1rem;
      line-height: 1rem;
      color: #e2feff;
      margin-left: 0.3rem;
      display:inline-block;
      font-family: 'PingFangSC-Medium';
      flex: 1;
      align-items: center;
      display: flex;
      justify-content: center;
    }
    .value {
      font-size: 0.20rem;
      color: #fff;
      margin-left: 0.05rem;
    }
    .unit {
      font-size: 0.14rem;
      color: #fff;
    }
  }
  
}
</style>
